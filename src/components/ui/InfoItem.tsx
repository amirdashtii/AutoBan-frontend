"use client";

import React from "react";
import { Box, Typography, Divider, IconButton, useTheme } from "@mui/material";
import {
  Edit as EditIcon,
  Share as ShareIcon,
  ContentCopy as CopyIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";

interface InfoItemProps {
  label: string;
  value: string;
  showEditIcon?: boolean;
  showShareIcon?: boolean;
  showCopyIcon?: boolean;
  showVisibilityIcon?: boolean;
  isVisible?: boolean;
  onEditClick?: () => void;
  onShareClick?: () => void;
  onCopyClick?: () => void;
  onVisibilityClick?: () => void;
  showDivider?: boolean;
  valueColor?:
    | "primary"
    | "secondary"
    | "text"
    | "success"
    | "warning"
    | "error";
  containerStyle?: React.CSSProperties;
}

export const InfoItem: React.FC<InfoItemProps> = ({
  label,
  value,
  showEditIcon = false,
  showShareIcon = false,
  showCopyIcon = false,
  showVisibilityIcon = false,
  isVisible = true,
  onEditClick,
  onShareClick,
  onCopyClick,
  onVisibilityClick,
  showDivider = true,
  valueColor = "text",
  containerStyle,
}) => {
  const theme = useTheme();

  const getValueColor = () => {
    switch (valueColor) {
      case "primary":
        return "primary.main";
      case "secondary":
        return "text.secondary";
      case "success":
        return "success.main";
      case "warning":
        return "warning.main";
      case "error":
        return "error.main";
      default:
        return "text.primary";
    }
  };

  const getIconColor = () => {
    if (showShareIcon) return "primary.main";
    return "text.secondary";
  };

  return (
    <Box sx={containerStyle}>
      <Box sx={{ p: 2 }}>
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            fontSize: "0.75rem",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          {label}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: 0.5,
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: getValueColor(),
              fontSize: "1rem",
              fontWeight: 400,
            }}
          >
            {value}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {showShareIcon && (
              <IconButton
                size="small"
                onClick={onShareClick}
                sx={{
                  color: getIconColor(),
                  p: 0.5,
                }}
              >
                <ShareIcon fontSize="small" />
              </IconButton>
            )}

            {showCopyIcon && (
              <IconButton
                size="small"
                onClick={onCopyClick}
                sx={{
                  color: getIconColor(),
                  p: 0.5,
                }}
              >
                <CopyIcon fontSize="small" />
              </IconButton>
            )}

            {showVisibilityIcon && (
              <IconButton
                size="small"
                onClick={onVisibilityClick}
                sx={{
                  color: getIconColor(),
                  p: 0.5,
                }}
              >
                {isVisible ? (
                  <VisibilityIcon fontSize="small" />
                ) : (
                  <VisibilityOffIcon fontSize="small" />
                )}
              </IconButton>
            )}

            {showEditIcon && (
              <IconButton
                size="small"
                onClick={onEditClick}
                sx={{
                  color: getIconColor(),
                  p: 0.5,
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Box>
      </Box>
      {showDivider && <Divider sx={{ borderColor: "divider" }} />}
    </Box>
  );
};
