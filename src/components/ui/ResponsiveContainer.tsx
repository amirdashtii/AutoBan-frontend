"use client";

import React from "react";
import { Box, Container, useTheme, useMediaQuery } from "@mui/material";
import type { BoxProps, ContainerProps } from "@mui/material";

// Responsive Container با breakpoint های پیشرفته
interface ResponsiveContainerProps extends Omit<ContainerProps, "maxWidth"> {
  children: React.ReactNode;
  mobile?: boolean; // آیا برای موبایل بهینه شود
  padding?: "none" | "small" | "medium" | "large";
  fullHeight?: boolean;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  mobile = true,
  padding = "medium",
  fullHeight = false,
  maxWidth = "lg",
  sx,
  ...props
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const paddingValues = {
    none: 0,
    small: { xs: 1, sm: 2 },
    medium: { xs: 2, sm: 3, md: 4 },
    large: { xs: 3, sm: 4, md: 6 },
  };

  return (
    <Container
      maxWidth={maxWidth}
      sx={{
        px: mobile && isMobile ? paddingValues[padding] : undefined,
        py: paddingValues[padding],
        minHeight: fullHeight ? "100vh" : undefined,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Container>
  );
};

// Grid سیستم پیشرفته
interface ResponsiveGridProps extends BoxProps {
  children: React.ReactNode;
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: number | string;
  autoFit?: boolean; // Auto-fit برای کارت‌ها
  minItemWidth?: string; // حداقل عرض هر آیتم
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  columns = { xs: 1, sm: 2, md: 3, lg: 4 },
  gap = 2,
  autoFit = false,
  minItemWidth = "280px",
  sx,
  ...props
}) => {
  const gridTemplateColumns = autoFit
    ? `repeat(auto-fit, minmax(${minItemWidth}, 1fr))`
    : {
        xs: `repeat(${columns.xs || 1}, 1fr)`,
        sm: `repeat(${columns.sm || columns.xs || 1}, 1fr)`,
        md: `repeat(${columns.md || columns.sm || columns.xs || 1}, 1fr)`,
        lg: `repeat(${
          columns.lg || columns.md || columns.sm || columns.xs || 1
        }, 1fr)`,
        xl: `repeat(${
          columns.xl ||
          columns.lg ||
          columns.md ||
          columns.sm ||
          columns.xs ||
          1
        }, 1fr)`,
      };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns,
        gap,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

// Stack که responsive هست
interface ResponsiveStackProps extends BoxProps {
  children: React.ReactNode;
  direction?: {
    xs?: "row" | "column";
    sm?: "row" | "column";
    md?: "row" | "column";
    lg?: "row" | "column";
  };
  spacing?: number | string;
  align?: "center" | "flex-start" | "flex-end" | "stretch";
  justify?:
    | "center"
    | "flex-start"
    | "flex-end"
    | "space-between"
    | "space-around";
}

export const ResponsiveStack: React.FC<ResponsiveStackProps> = ({
  children,
  direction = { xs: "column", md: "row" },
  spacing = 2,
  align = "center",
  justify = "flex-start",
  sx,
  ...props
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: direction,
        gap: spacing,
        alignItems: align,
        justifyContent: justify,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

// Section Container برای صفحات
interface ResponsiveSectionProps extends Omit<BoxProps, "maxWidth"> {
  children: React.ReactNode;
  background?: "default" | "paper" | "transparent";
  padding?: "none" | "small" | "medium" | "large";
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
}

export const ResponsiveSection: React.FC<ResponsiveSectionProps> = ({
  children,
  background = "default",
  padding = "medium",
  maxWidth = "lg",
  sx,
  ...props
}) => {
  const theme = useTheme();

  const paddingValues = {
    none: 0,
    small: { xs: 2, sm: 3 },
    medium: { xs: 3, sm: 4, md: 6 },
    large: { xs: 4, sm: 6, md: 8 },
  };

  const backgroundColors = {
    default: "background.default",
    paper: "background.paper",
    transparent: "transparent",
  };

  return (
    <Box
      sx={{
        backgroundColor: backgroundColors[background],
        py: paddingValues[padding],
        ...sx,
      }}
      {...props}
    >
      <Container maxWidth={maxWidth}>{children}</Container>
    </Box>
  );
};

// Mobile-First Component Wrapper
interface MobileFirstProps {
  children: React.ReactNode;
  mobileComponent?: React.ReactNode;
  breakpoint?: "sm" | "md" | "lg";
}

export const MobileFirst: React.FC<MobileFirstProps> = ({
  children,
  mobileComponent,
  breakpoint = "md",
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(breakpoint));

  if (isMobile && mobileComponent) {
    return <>{mobileComponent}</>;
  }

  return <>{children}</>;
};

// Responsive Typography Helper
interface ResponsiveTextProps extends BoxProps {
  children: React.ReactNode;
  variant?: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
  };
  align?: {
    xs?: "left" | "center" | "right";
    sm?: "left" | "center" | "right";
    md?: "left" | "center" | "right";
  };
}

export const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  children,
  variant = { xs: "body1", md: "h6" },
  align = { xs: "center", md: "right" },
  sx,
  ...props
}) => {
  return (
    <Box
      component="div"
      sx={{
        typography: variant,
        textAlign: align,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

// Hook برای responsive values
export const useResponsive = () => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return {
    isMobile,
    isTablet,
    isDesktop,
    isSmallScreen,
    breakpoints: {
      xs: useMediaQuery(theme.breakpoints.only("xs")),
      sm: useMediaQuery(theme.breakpoints.only("sm")),
      md: useMediaQuery(theme.breakpoints.only("md")),
      lg: useMediaQuery(theme.breakpoints.only("lg")),
      xl: useMediaQuery(theme.breakpoints.only("xl")),
    },
  };
};
