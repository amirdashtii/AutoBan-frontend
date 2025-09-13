"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Badge,
  Button,
  useTheme,
  alpha,
  Slide,
  useScrollTrigger,
  IconButton,
} from "@mui/material";
import {
  ChevronRight as ChevronRightIcon,
  Search as SearchIcon,
  Person,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";

// Header Component
interface HeaderProps {
  title?: string | React.ReactNode;
  subtitle?: string;

  user?: {
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    status?: string;
  } | null;
  showBack?: boolean;
  leftActions?: React.ReactNode[];
  rightActions?: React.ReactNode[];

  onBackClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  user,
  leftActions = [],
  rightActions = [],
  showBack = false,
  onBackClick,
}) => {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      router.back();
    }
  };

  // Detect scroll for collapsible header with smooth transition
  useEffect(() => {
    if (!user) return;

    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      // Smooth transition threshold - starts transitioning at 80px
      setScrolled(scrollTop > 80);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [user]);

  // Common animation settings
  const slideProps = {
    appear: false,
    direction: "down" as const,
    timeout: 500,
    easing: {
      enter: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      exit: "cubic-bezier(0.55, 0.06, 0.68, 0.19)",
    },
  };

  // Common back button component
  const BackButton = () =>
    showBack ? (
      <Button
        onClick={handleBackClick}
        variant="text"
        color="primary"
        sx={{
          minWidth: "auto",
          px: 1,
          py: 0.5,
          fontSize: "0.875rem",
        }}
      >
        <ChevronRightIcon fontSize="large" />
        بازگشت
      </Button>
    ) : null;

  // Common right zone component
  const RightZone = () => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        flex: 1,
        justifyContent: "flex-start",
      }}
    >
      <BackButton />

      {/* Right Actions */}
      {rightActions.map((action, index) => (
        <React.Fragment key={index}>{action}</React.Fragment>
      ))}
    </Box>
  );

  // Common center zone component
  const CenterZone = () => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flex: 1,
        textAlign: "center",
        minWidth: 0,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          fontSize: "1.1rem",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          width: "100%",
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            lineHeight: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            width: "100%",
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );

  // Common left zone component
  const LeftZone = () => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        flex: 1,
        justifyContent: "flex-end",
      }}
    >
      {leftActions.map((action, index) => (
        <React.Fragment key={`right-${index}`}>{action}</React.Fragment>
      ))}
    </Box>
  );

  // If user is provided, render collapsible header
  if (user) {
    const displayName =
      user?.first_name && user?.last_name
        ? `${user.first_name} ${user.last_name}`
        : typeof title === "string"
        ? title
        : "صفحه";
    return (
      <>
        {/* Collapsible Header */}
        <Slide {...slideProps} in={!scrolled}>
          <AppBar
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 1100,
              backgroundColor: "background.default",
              borderColor: "divider",
              pt: 2,
              pb: 2,
              transition: "all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            }}
          >
            <Toolbar
              sx={{
                display: "flex",
                alignItems: "start",
                minHeight: 64,
              }}
            >
              <RightZone />

              {/* Profile Info */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                  px: 2,
                }}
              >
                {user ? (
                  <Badge
                    badgeContent={
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          bgcolor:
                            user?.status === "Active"
                              ? "success.main"
                              : "warning.main",
                          border: "2px solid white",
                        }}
                      />
                    }
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  >
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: "primary.main",
                        fontSize: 32,
                      }}
                    >
                      <Person sx={{ fontSize: 40 }} />
                    </Avatar>
                  </Badge>
                ) : (
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: "primary.main",
                      fontSize: 32,
                    }}
                  >
                    <Person sx={{ fontSize: 40 }} />
                  </Avatar>
                )}

                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h5" fontWeight="bold">
                    {displayName}
                  </Typography>
                  {user?.phone_number && (
                    <Typography variant="body2" color="text.secondary">
                      {user.phone_number}
                    </Typography>
                  )}
                </Box>
              </Box>
              <LeftZone />
            </Toolbar>
          </AppBar>
        </Slide>

        {/* Compact Header */}
        <Slide {...slideProps} in={scrolled}>
          <AppBar
            position="fixed"
            elevation={0}
            sx={{
              backgroundColor: "background.paper",
              borderColor: "divider",
              color: "text.primary",
              transition: "all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            }}
          >
            <Toolbar
              sx={{
                display: "flex",
                alignItems: "center",
                minHeight: 64,
              }}
            >
              <RightZone />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  flex: 1,
                  textAlign: "center",
                  minWidth: 0,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    fontSize: "1.1rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    width: "100%",
                  }}
                >
                  {displayName}
                </Typography>
                {subtitle && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      lineHeight: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      width: "100%",
                    }}
                  >
                    {user.phone_number}
                  </Typography>
                )}
              </Box>
              <LeftZone />
            </Toolbar>
          </AppBar>
        </Slide>

        {/* Spacer to prevent content overlap */}
        <Box sx={{ height: scrolled ? 64 : 200 }} />
      </>
    );
  }

  // Regular header (when no user provided)
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: "background.paper",
        borderColor: "divider",
        color: "text.primary",
      }}
    >
      <Toolbar sx={{ display: "flex", alignItems: "center", minHeight: 64 }}>
        <RightZone />

        <CenterZone />

        <LeftZone />
      </Toolbar>
    </AppBar>
  );
};
