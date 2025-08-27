"use client";

import React from "react";
import {
  Box,
  Fade,
  Slide,
  Zoom,
  Collapse,
  useTheme,
  alpha,
  keyframes,
} from "@mui/material";
import { useSpring, animated, config } from "@react-spring/web";

// Slide in animation
interface SlideInProps {
  children: React.ReactNode;
  direction?: "left" | "right" | "up" | "down";
  delay?: number;
  duration?: number;
}

export const SlideIn: React.FC<SlideInProps> = ({
  children,
  direction = "right",
  delay = 0,
  duration = 300,
}) => {
  const springs = useSpring({
    from: {
      opacity: 0,
      transform:
        direction === "left"
          ? "translateX(-20px)"
          : direction === "right"
          ? "translateX(20px)"
          : direction === "up"
          ? "translateY(-20px)"
          : "translateY(20px)",
    },
    to: { opacity: 1, transform: "translate(0px)" },
    delay,
    config: { ...config.gentle, duration },
  });

  return <animated.div style={springs}>{children}</animated.div>;
};

// Fade in
interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 400,
}) => {
  const springs = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay,
    config: { ...config.gentle, duration },
  });

  return <animated.div style={springs}>{children}</animated.div>;
};

// Scale animation
interface ScaleInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}

export const ScaleIn: React.FC<ScaleInProps> = ({
  children,
  delay = 0,
  duration = 250,
}) => {
  const springs = useSpring({
    from: { opacity: 0, transform: "scale(0.9)" },
    to: { opacity: 1, transform: "scale(1)" },
    delay,
    config: { ...config.gentle, duration },
  });

  return <animated.div style={springs}>{children}</animated.div>;
};

// Staggered list animation (انیمیشن تدریجی لیست‌ها)
interface StaggeredListProps {
  children: React.ReactNode[];
  staggerDelay?: number;
  initialDelay?: number;
}

export const StaggeredList: React.FC<StaggeredListProps> = ({
  children,
  staggerDelay = 50,
  initialDelay = 0,
}) => {
  return (
    <>
      {children.map((child, index) => (
        <SlideIn
          key={index}
          direction="right"
          delay={initialDelay + index * staggerDelay}
        >
          {child}
        </SlideIn>
      ))}
    </>
  );
};

// Loading dots
export const LoadingDots: React.FC = () => {
  const theme = useTheme();

  const bounce = keyframes`
    0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
    40% { transform: scale(1.2); opacity: 1; }
  `;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 0.5,
        py: 2,
      }}
    >
      {[0, 1, 2].map((index) => (
        <Box
          key={index}
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: theme.palette.primary.main,
            animation: `${bounce} 1.4s infinite ease-in-out`,
            animationDelay: `${index * 0.16}s`,
          }}
        />
      ))}
    </Box>
  );
};

// Typing indicator
export const TypingIndicator: React.FC = () => {
  const theme = useTheme();

  const typing = keyframes`
    0%, 60%, 100% { transform: translateY(0); }
    30% { transform: translateY(-10px); }
  `;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        p: 2,
        backgroundColor: alpha(theme.palette.action.selected, 0.3),
        borderRadius: 3,
        maxWidth: "fit-content",
      }}
    >
      <Box sx={{ display: "flex", gap: 0.3 }}>
        {[0, 1, 2].map((index) => (
          <Box
            key={index}
            sx={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              backgroundColor: theme.palette.text.secondary,
              animation: `${typing} 1.4s infinite`,
              animationDelay: `${index * 0.2}s`,
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

// Floating animation برای FAB
export const FloatingAnimation: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const floating = keyframes`
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-4px); }
  `;

  return (
    <Box
      sx={{
        animation: `${floating} 3s ease-in-out infinite`,
      }}
    >
      {children}
    </Box>
  );
};

// Ripple effect
interface RippleProps {
  children: React.ReactNode;
  disabled?: boolean;
}

export const Ripple: React.FC<RippleProps> = ({
  children,
  disabled = false,
}) => {
  const [ripples, setRipples] = React.useState<
    Array<{ id: number; x: number; y: number }>
  >([]);

  const addRipple = (event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const newRipple = { id: Date.now(), x, y };

    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
    }, 600);
  };

  const rippleEffect = keyframes`
    0% {
      transform: scale(0);
      opacity: 0.6;
    }
    100% {
      transform: scale(4);
      opacity: 0;
    }
  `;

  return (
    <Box
      onClick={addRipple}
      sx={{
        position: "relative",
        overflow: "hidden",
        cursor: disabled ? "default" : "pointer",
      }}
    >
      {children}
      {ripples.map((ripple) => (
        <Box
          key={ripple.id}
          sx={{
            position: "absolute",
            left: ripple.x,
            top: ripple.y,
            width: 20,
            height: 20,
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            transform: "translate(-50%, -50%)",
            animation: `${rippleEffect} 0.6s linear`,
            pointerEvents: "none",
          }}
        />
      ))}
    </Box>
  );
};

// Page transition
interface PageTransitionProps {
  children: React.ReactNode;
  direction?: "left" | "right";
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  direction = "left",
}) => {
  const springs = useSpring({
    from: {
      opacity: 0,
      transform:
        direction === "left" ? "translateX(-100%)" : "translateX(100%)",
    },
    to: { opacity: 1, transform: "translateX(0%)" },
    config: config.gentle,
  });

  return (
    <animated.div
      style={{
        ...springs,
        width: "100%",
        height: "100%",
      }}
    >
      {children}
    </animated.div>
  );
};

// Modal animation
interface ModalAnimationProps {
  children: React.ReactNode;
  open: boolean;
}

export const ModalAnimation: React.FC<ModalAnimationProps> = ({
  children,
  open,
}) => {
  const springs = useSpring({
    opacity: open ? 1 : 0,
    transform: open ? "scale(1)" : "scale(0.9)",
    config: config.gentle,
  });

  if (!open) return null;

  return (
    <animated.div
      style={{
        ...springs,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </animated.div>
  );
};

// Shimmer effect برای loading
export const Shimmer: React.FC<{
  width?: string | number;
  height?: string | number;
  borderRadius?: number;
}> = ({ width = "100%", height = 20, borderRadius = 4 }) => {
  const theme = useTheme();

  const shimmer = keyframes`
    0% { background-position: -200px 0; }
    100% { background-position: calc(200px + 100%) 0; }
  `;

  return (
    <Box
      sx={{
        width,
        height,
        borderRadius,
        background: `linear-gradient(90deg, 
          ${alpha(theme.palette.action.hover, 0.2)} 25%, 
          ${alpha(theme.palette.action.hover, 0.4)} 50%, 
          ${alpha(theme.palette.action.hover, 0.2)} 75%)`,
        backgroundSize: "200px 100%",
        animation: `${shimmer} 1.5s infinite`,
      }}
    />
  );
};

// Pull to refresh animation
interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  refreshing?: boolean;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  children,
  onRefresh,
  refreshing = false,
}) => {
  const [pullDistance, setPullDistance] = React.useState(0);
  const [isPulling, setIsPulling] = React.useState(false);
  const startY = React.useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isPulling && window.scrollY === 0) {
      const distance = Math.max(0, e.touches[0].clientY - startY.current);
      setPullDistance(Math.min(distance, 100));
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance > 60) {
      onRefresh();
    }
    setIsPulling(false);
    setPullDistance(0);
  };

  return (
    <Box
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      sx={{ overflow: "hidden" }}
    >
      {/* Pull indicator */}
      <Box
        sx={{
          height: pullDistance,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "height 0.2s ease",
        }}
      >
        {pullDistance > 0 && <LoadingDots />}
      </Box>

      <Box
        sx={{
          transform: `translateY(${pullDistance}px)`,
          transition: isPulling ? "none" : "transform 0.2s ease",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
