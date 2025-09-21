"use client";

import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Fab,
  Badge,
  Chip,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Add as AddIcon,
  MoreVert as MoreIcon,
  Circle as StatusIcon,
  NavigateNext as ChevronIcon,
} from "@mui/icons-material";

// List Item برای نمایش آیتم‌ها
interface ListItemProps {
  title: string;
  subtitle: string;
  timestamp?: string;
  avatar?: React.ReactNode;
  badge?: number;
  status?: "online" | "offline" | "active";
  onClick?: () => void;
  rightContent?: React.ReactNode;
}

export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  timestamp,
  avatar,
  badge,
  status,
  onClick,
  rightContent,
}) => {
  const theme = useTheme();

  return (
    <Box
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        p: 2,
        cursor: onClick ? "pointer" : "default",
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        "&:hover": {
          backgroundColor: alpha(theme.palette.action.hover, 0.05),
        },
        "&:active": {
          backgroundColor: alpha(theme.palette.action.selected, 0.1),
        },
        transition: "background-color 0.15s ease",
      }}
    >
      {/* Avatar Section */}
      <Box sx={{ position: "relative", mr: 2 }}>
        {avatar || (
          <Avatar
            sx={{
              width: 50,
              height: 50,
              bgcolor: theme.palette.primary.main,
              fontSize: "1.25rem",
            }}
          >
            {title.charAt(0)}
          </Avatar>
        )}
        {status && (
          <StatusIcon
            sx={{
              position: "absolute",
              bottom: 2,
              right: 2,
              width: 12,
              height: 12,
              color:
                status === "online"
                  ? "#4CAF50"
                  : status === "active"
                  ? "#FF9800"
                  : "#757575",
              bgcolor: "background.paper",
              borderRadius: "50%",
            }}
          />
        )}
      </Box>

      {/* Content Section */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 500,
              color: "text.primary",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1,
            }}
          >
            {title}
          </Typography>
          {timestamp && (
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                ml: 1,
                fontSize: "0.75rem",
              }}
            >
              {timestamp}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1,
            }}
          >
            {subtitle}
          </Typography>
          {badge && badge > 0 && (
            <Badge
              badgeContent={badge}
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                  fontSize: "0.7rem",
                  minWidth: 18,
                  height: 18,
                },
              }}
            />
          )}
        </Box>
      </Box>

      {/* Right Section */}
      {rightContent ||
        (onClick && <ChevronIcon sx={{ color: "text.secondary", ml: 1 }} />)}
    </Box>
  );
};

// Section Header
interface SectionHeaderProps {
  title: string;
  action?: React.ReactNode;
  count?: number;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  action,
  count,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 2,
        py: 1.5,
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, color: "text.primary" }}
        >
          {title}
        </Typography>
        {count !== undefined && (
          <Chip
            label={count}
            size="small"
            sx={{
              height: 20,
              fontSize: "0.7rem",
              backgroundColor: "action.selected",
            }}
          />
        )}
      </Box>
      {action}
    </Box>
  );
};

// Status Card
interface StatusCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: "primary" | "success" | "warning" | "error" | "info";
  onClick?: () => void;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = "primary",
  onClick,
}) => {
  const theme = useTheme();

  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.2s ease",
        "&:hover": onClick
          ? {
              transform: "translateY(-2px)",
              boxShadow: theme.shadows[4],
            }
          : {},
        borderRadius: 3,
        background: `linear-gradient(135deg, ${
          theme.palette[color].main
        } 0%, ${alpha(theme.palette[color].main, 0.8)} 100%)`,
        color: theme.palette[color].contrastText,
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {icon && (
            <Box
              sx={{
                p: 1,
                borderRadius: 2,
                backgroundColor: alpha(theme.palette[color].contrastText, 0.15),
              }}
            >
              {icon}
            </Box>
          )}
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>
              {title}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// Floating Action Button
interface FABProps {
  onClick?: () => void;
  icon?: React.ReactNode;
  badge?: number;
}

export const FloatingButton: React.FC<FABProps> = ({
  onClick,
  icon = <AddIcon />,
  badge,
}) => {
  const theme = useTheme();

  return (
    <Badge
      badgeContent={badge}
      sx={{
        position: "fixed",
        bottom: 80, // بالای navigation
        left: 16,
        zIndex: 1000,
        "& .MuiBadge-badge": {
          backgroundColor: theme.palette.error.main,
          color: "white",
        },
      }}
    >
      <Fab
        color="primary"
        onClick={onClick}
        sx={{
          width: 56,
          height: 56,
          boxShadow: theme.shadows[8],
          "&:hover": {
            transform: "scale(1.1)",
            boxShadow: theme.shadows[12],
          },
          transition: "all 0.2s ease",
        }}
      >
        {icon}
      </Fab>
    </Badge>
  );
};

// App Container
interface AppContainerProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  fab?: React.ReactNode;
}

export const AppContainer: React.FC<AppContainerProps> = ({
  children,
  header,
  fab,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
        pb: 10,
        pt: header ? 8 : 0,
      }}
    >
      {header}
      <Box sx={{ flex: 1 }}>{children}</Box>
      {fab}
    </Box>
  );
};

// Service Status Chip (برای نمایش وضعیت سرویس)
interface ServiceStatusProps {
  status: "due" | "overdue" | "ok" | "unknown";
  daysLeft?: number;
  kmLeft?: number;
}

export const ServiceStatus: React.FC<ServiceStatusProps> = ({
  status,
  daysLeft,
  kmLeft,
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case "overdue":
        return {
          color: "error" as const,
          text: "سررسید گذشته",
          icon: "⚠️",
        };
      case "due":
        return {
          color: "warning" as const,
          text: daysLeft
            ? `${daysLeft} روز مانده`
            : kmLeft
            ? `${kmLeft} کیلومتر مانده`
            : "نزدیک سررسید",
          icon: "⏰",
        };
      case "ok":
        return {
          color: "success" as const,
          text: "وضعیت خوب",
          icon: "✅",
        };
      default:
        return {
          color: "default" as const,
          text: "نامشخص",
          icon: "❓",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Chip
      label={`${config.icon} ${config.text}`}
      color={config.color}
      size="small"
      sx={{
        fontWeight: 500,
        "& .MuiChip-label": {
          px: 1,
        },
      }}
    />
  );
};

// Export LicensePlateInput
export { LicensePlateInput } from "./LicensePlateInput";
