"use client";

import React from "react";
import { Toaster, toast } from "react-hot-toast";
import { useTheme } from "@mui/material/styles";
import {
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

// Toast Provider Component
export const ToastProvider: React.FC = () => {
  const theme = useTheme();

  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      containerStyle={{
        top: 20,
        left: 20,
        right: 20,
      }}
      toastOptions={{
        duration: 4000,
        style: {
          background: theme.palette.background.paper,
          color: theme.palette.text.primary,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: theme.shape.borderRadius,
          boxShadow: theme.shadows[4],
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.body2.fontSize,
          padding: "12px 16px",
          maxWidth: "400px",
          direction: "rtl",
        },
        success: {
          iconTheme: {
            primary: theme.palette.success.main,
            secondary: theme.palette.success.contrastText,
          },
        },
        error: {
          iconTheme: {
            primary: theme.palette.error.main,
            secondary: theme.palette.error.contrastText,
          },
          duration: 6000,
        },
      }}
    />
  );
};

// Custom Toast Components
const ToastContent: React.FC<{
  icon: React.ReactNode;
  title: string;
  message?: string;
  color: string;
}> = ({ icon, title, message, color }) => (
  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
    <Box sx={{ color, mt: 0.25 }}>{icon}</Box>
    <Box sx={{ flex: 1 }}>
      <Typography variant="body2" fontWeight="medium" gutterBottom={!!message}>
        {title}
      </Typography>
      {message && (
        <Typography variant="caption" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  </Box>
);

// Enhanced Toast Functions
export const showToast = {
  success: (title: string, message?: string) => {
    toast.success(
      (t) => (
        <ToastContent
          icon={<SuccessIcon sx={{ fontSize: 20 }} />}
          title={title}
          message={message}
          color="success.main"
        />
      ),
      { id: `success-${Date.now()}` }
    );
  },

  error: (title: string, message?: string) => {
    toast.error(
      (t) => (
        <ToastContent
          icon={<ErrorIcon sx={{ fontSize: 20 }} />}
          title={title}
          message={message}
          color="error.main"
        />
      ),
      { id: `error-${Date.now()}` }
    );
  },

  warning: (title: string, message?: string) => {
    toast(
      (t) => (
        <ToastContent
          icon={<WarningIcon sx={{ fontSize: 20 }} />}
          title={title}
          message={message}
          color="warning.main"
        />
      ),
      {
        id: `warning-${Date.now()}`,
        duration: 5000,
      }
    );
  },

  info: (title: string, message?: string) => {
    toast(
      (t) => (
        <ToastContent
          icon={<InfoIcon sx={{ fontSize: 20 }} />}
          title={title}
          message={message}
          color="info.main"
        />
      ),
      {
        id: `info-${Date.now()}`,
        duration: 4000,
      }
    );
  },

  // Loading toast with custom functionality
  loading: (title: string, promise?: Promise<any>) => {
    if (promise) {
      return toast.promise(
        promise,
        {
          loading: title,
          success: "عملیات با موفقیت انجام شد",
          error: "خطایی رخ داده است",
        },
        {
          style: {
            direction: "rtl",
          },
        }
      );
    } else {
      return toast.loading(title, {
        style: {
          direction: "rtl",
        },
      });
    }
  },

  // Custom toast with action button
  withAction: (
    title: string,
    actionText: string,
    onAction: () => void,
    type: "success" | "error" | "warning" | "info" = "info"
  ) => {
    const icons = {
      success: <SuccessIcon sx={{ fontSize: 20 }} />,
      error: <ErrorIcon sx={{ fontSize: 20 }} />,
      warning: <WarningIcon sx={{ fontSize: 20 }} />,
      info: <InfoIcon sx={{ fontSize: 20 }} />,
    };

    const colors = {
      success: "success.main",
      error: "error.main",
      warning: "warning.main",
      info: "info.main",
    };

    toast.custom(
      (t) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            background: "background.paper",
            color: "text.primary",
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
            boxShadow: 4,
            p: 2,
            maxWidth: 400,
            direction: "rtl",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={{ color: colors[type] }}>{icons[type]}</Box>
            <Typography variant="body2">{title}</Typography>
          </Box>
          <Box
            component="button"
            onClick={() => {
              onAction();
              toast.dismiss(t.id);
            }}
            sx={{
              background: "primary.main",
              color: "primary.contrastText",
              border: "none",
              borderRadius: 1,
              px: 2,
              py: 0.5,
              fontSize: "0.75rem",
              cursor: "pointer",
              "&:hover": {
                background: "primary.dark",
              },
            }}
          >
            {actionText}
          </Box>
        </Box>
      ),
      { duration: 8000 }
    );
  },

  // Dismiss specific toast
  dismiss: (toastId?: string) => {
    toast.dismiss(toastId);
  },

  // Dismiss all toasts
  dismissAll: () => {
    toast.dismiss();
  },
};

// Hook for using toast in components
export const useToast = () => {
  return showToast;
};
