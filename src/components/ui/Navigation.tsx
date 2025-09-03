"use client";

import React from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Badge,
  Button,
  useTheme,
  alpha,
  Slide,
  useScrollTrigger,
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  ChevronRight as ChevronRightIcon,
  Search as SearchIcon,
  MoreVert as MoreIcon,
  Menu as MenuIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";

// Header Component
interface HeaderProps {
  title: string;
  subtitle?: string;
  avatar?: React.ReactNode;
  showBack?: boolean;
  actions?: React.ReactNode[];
  onBackClick?: () => void;
  onAvatarClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  avatar,
  showBack = false,
  actions = [],
  onBackClick,
  onAvatarClick,
}) => {
  const theme = useTheme();
  const router = useRouter();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      router.back();
    }
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
        color: "text.primary",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Back Button */}
        {showBack && (
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
        )}

        {/* Avatar */}
        {avatar && (
          <IconButton onClick={onAvatarClick} sx={{ mr: 2, p: 0 }}>
            {avatar}
          </IconButton>
        )}

        {/* Title Section */}
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
            minWidth: 0,
            maxWidth: "60%",
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
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                display: "block",
                lineHeight: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {/* Actions and Back Button */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {actions.map((action, index) => (
            <React.Fragment key={index}>{action}</React.Fragment>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

// Hide on scroll functionality
interface HideOnScrollProps {
  children: React.ReactElement;
  window?: () => Window;
}

function HideOnScroll(props: HideOnScrollProps) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

// Bottom Navigation
interface BottomNavProps {
  tabs: {
    key: string;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    active?: boolean;
  }[];
  activeTab: string;
  onTabChange: (key: string) => void;
  hideOnScroll?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  tabs,
  activeTab,
  onTabChange,
  hideOnScroll = false,
}) => {
  const theme = useTheme();

  const NavigationContent = (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: "background.paper",
        borderTop: 1,
        borderColor: "divider",
        backdropFilter: "blur(10px)",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: alpha(theme.palette.background.paper, 0.95),
          zIndex: -1,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          height: 64,
          alignItems: "center",
          justifyContent: "space-around",
          px: 1,
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <Box
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
                py: 1,
                cursor: "pointer",
                borderRadius: 2,
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.action.hover, 0.08),
                },
                "&:active": {
                  transform: "scale(0.95)",
                },
              }}
            >
              <Badge
                badgeContent={tab.badge}
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: theme.palette.primary.main,
                    color: "white",
                    fontSize: "0.6rem",
                    minWidth: 16,
                    height: 16,
                  },
                }}
              >
                <Box
                  sx={{
                    color: isActive ? "primary.main" : "text.secondary",
                    transition: "color 0.2s ease",
                    "& svg": {
                      fontSize: "1.4rem",
                    },
                  }}
                >
                  {tab.icon}
                </Box>
              </Badge>
              <Typography
                variant="caption"
                sx={{
                  mt: 0.5,
                  fontSize: "0.7rem",
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "primary.main" : "text.secondary",
                  transition: "all 0.2s ease",
                }}
              >
                {tab.label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );

  if (hideOnScroll) {
    return <HideOnScroll>{NavigationContent}</HideOnScroll>;
  }

  return NavigationContent;
};

// Search Header
interface SearchHeaderProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  autoFocus?: boolean;
  rightAction?: React.ReactNode;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({
  placeholder = "جستجو...",
  value,
  onChange,
  onFocus,
  onBlur,
  autoFocus = false,
  rightAction,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        p: 2,
        backgroundColor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          backgroundColor: alpha(theme.palette.action.selected, 0.5),
          borderRadius: 3,
          px: 2,
          py: 1,
        }}
      >
        <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          autoFocus={autoFocus}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            backgroundColor: "transparent",
            color: theme.palette.text.primary,
            fontSize: "1rem",
            fontFamily: theme.typography.fontFamily,
          }}
        />
      </Box>
      {rightAction}
    </Box>
  );
};

// Profile Header
interface ProfileHeaderProps {
  name: string;
  phone: string;
  avatar?: string;
  status?: "online" | "offline";
  onSettingsClick?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  phone,
  avatar,
  status = "offline",
  onSettingsClick,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${
          theme.palette.primary.main
        } 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`,
        color: theme.palette.primary.contrastText,
        p: 3,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          badgeContent={
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: status === "online" ? "#4CAF50" : "#757575",
                border: 2,
                borderColor: "primary.contrastText",
              }}
            />
          }
        >
          <Avatar
            src={avatar}
            sx={{
              width: 64,
              height: 64,
              fontSize: "1.5rem",
              backgroundColor: alpha(theme.palette.primary.contrastText, 0.2),
            }}
          >
            {name.charAt(0)}
          </Avatar>
        </Badge>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            {name}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {phone}
          </Typography>
        </Box>

        <IconButton
          onClick={onSettingsClick}
          sx={{
            color: "inherit",
            backgroundColor: alpha(theme.palette.primary.contrastText, 0.1),
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.contrastText, 0.2),
            },
          }}
        >
          <SettingsIcon />
        </IconButton>
      </Box>
    </Box>
  );
};
