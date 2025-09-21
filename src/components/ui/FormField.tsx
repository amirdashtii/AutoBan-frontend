"use client";

import React from "react";
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";
import {
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  CalendarToday as CalendarIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

interface FormFieldProps {
  label?: string;
  value: string | number | null;
  onChange: (value: string) => void;
  type?: "text" | "email" | "password" | "date" | "tel" | "number";
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  showCancelIcon?: boolean;
  onCancel?: () => void;
  showVisibilityToggle?: boolean;
  isPasswordVisible?: boolean;
  onTogglePasswordVisibility?: () => void;
  icon?: React.ReactNode;
  showDivider?: boolean;
  slotProps?: any;
  endText?: string;
}

export function FormField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  multiline = false,
  rows = 1,
  disabled = false,
  error = false,
  helperText,
  showCancelIcon = false,
  onCancel,
  showVisibilityToggle = false,
  isPasswordVisible = false,
  onTogglePasswordVisibility,
  icon,
  showDivider = true,
  slotProps,
  endText,
}: FormFieldProps) {
  const theme = useTheme();

  const getDefaultIcon = () => {
    switch (type) {
      case "email":
        return <EmailIcon sx={{ fontSize: 20, color: "text.secondary" }} />;
      case "tel":
        return <PhoneIcon sx={{ fontSize: 20, color: "text.secondary" }} />;
      case "date":
        return <CalendarIcon sx={{ fontSize: 20, color: "text.secondary" }} />;
      default:
        return <PersonIcon sx={{ fontSize: 20, color: "text.secondary" }} />;
    }
  };

  return (
    <Box>
      <TextField
        fullWidth
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type === "password" && isPasswordVisible ? "text" : type}
        placeholder={placeholder}
        multiline={multiline}
        rows={multiline ? rows : undefined}
        disabled={disabled}
        error={error}
        helperText={helperText}
        variant="outlined"
        sx={{
          backgroundColor: "background.paper",
          borderRadius: 0,
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              border: "none",
            },
            "&:hover fieldset": {
              border: "none",
            },
            "&.Mui-focused fieldset": {},
            border: "none",
          },
        }}
        slotProps={{
          input: {
            startAdornment: icon && (
              <InputAdornment position="start">{icon}</InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {endText && (
                  <span
                    style={{
                      marginRight: "8px",
                      color: theme.palette.text.secondary,
                    }}
                  >
                    {endText}
                  </span>
                )}
                {showVisibilityToggle && (
                  <IconButton
                    onClick={onTogglePasswordVisibility}
                    size="small"
                    sx={{ mr: 0.5 }}
                  >
                    {isPasswordVisible ? (
                      <VisibilityOffIcon sx={{ fontSize: 18 }} />
                    ) : (
                      <VisibilityIcon sx={{ fontSize: 18 }} />
                    )}
                  </IconButton>
                )}
                {showCancelIcon && value && (
                  <IconButton size="small" onClick={onCancel}>
                    <CancelIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                )}
              </InputAdornment>
            ),
            ...slotProps?.input,
          },
          ...slotProps,
        }}
      />
      {showDivider && (
        <Divider variant="middle" sx={{ borderColor: "divider" }} />
      )}
    </Box>
    // </Box>
  );
}
