import React from "react";
import { Button, IconButton } from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";

// Add Button Props
interface AddButtonProps {
  onClick: () => void;
  variant?: "icon" | "text" | "contained";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
}

// Edit Button Props
interface EditButtonProps {
  onClick: () => void;
  variant?: "icon" | "text" | "contained";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
}

// Delete Button Props
interface DeleteButtonProps {
  onClick: () => void;
  variant?: "icon" | "text" | "contained";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  color?: "error" | "inherit";
}

// Save Button Props
interface SaveButtonProps {
  onClick: () => void;
  variant?: "text" | "contained";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
}

// Cancel Button Props
interface CancelButtonProps {
  onClick: () => void;
  variant?: "text" | "outlined";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
}

// Add Button Component
export const AddButton: React.FC<AddButtonProps> = ({
  onClick,
  variant = "icon",
  size = "small",
  disabled = false,
  loading = false,
}) => {
  if (variant === "icon") {
    return (
      <IconButton
        onClick={onClick}
        size={size}
        color="primary"
        disabled={disabled || loading}
      >
        <Add />
      </IconButton>
    );
  }

  return (
    <Button
      onClick={onClick}
      variant={variant === "contained" ? "contained" : "text"}
      startIcon={<Add />}
      size={size}
      color="primary"
      disabled={disabled || loading}
    >
      افزودن
    </Button>
  );
};

// Edit Button Component
export const EditButton: React.FC<EditButtonProps> = ({
  onClick,
  variant = "text",
  size = "small",
  disabled = false,
  loading = false,
}) => {
  if (variant === "icon") {
    return (
      <IconButton
        onClick={onClick}
        size={size}
        color="primary"
        disabled={disabled || loading}
      >
        <Edit />
      </IconButton>
    );
  }

  return (
    <Button
      onClick={onClick}
      variant={variant === "contained" ? "contained" : "text"}
      startIcon={variant !== "text" ? <Edit /> : undefined}
      size={size}
      color="primary"
      disabled={disabled || loading}
      sx={{
        minWidth: "auto",
        px: 1,
        py: 0.5,
        fontSize: "0.875rem",
      }}
    >
      ویرایش
    </Button>
  );
};

// Delete Button Component
export const DeleteButton: React.FC<DeleteButtonProps> = ({
  onClick,
  variant = "icon",
  size = "small",
  disabled = false,
  loading = false,
  color = "error",
}) => {
  if (variant === "icon") {
    return (
      <IconButton
        onClick={onClick}
        size={size}
        color={color}
        disabled={disabled || loading}
      >
        <Delete />
      </IconButton>
    );
  }

  return (
    <Button
      onClick={onClick}
      variant={variant === "contained" ? "contained" : "text"}
      startIcon={<Delete />}
      size={size}
      color={color}
      disabled={disabled || loading}
    >
      حذف
    </Button>
  );
};

// Save Button Component
export const SaveButton: React.FC<SaveButtonProps> = ({
  onClick,
  variant = "contained",
  size = "small",
  disabled = false,
  loading = false,
  loadingText = "در حال ذخیره...",
}) => {
  return (
    <Button
      onClick={onClick}
      variant={variant}
      size={size}
      color="primary"
      disabled={disabled || loading}
    >
      {loading ? loadingText : "ذخیره"}
    </Button>
  );
};

// Cancel Button Component
export const CancelButton: React.FC<CancelButtonProps> = ({
  onClick,
  variant = "text",
  size = "small",
  disabled = false,
}) => {
  return (
    <Button
      onClick={onClick}
      variant={variant}
      size={size}
      disabled={disabled}
    >
      انصراف
    </Button>
  );
};
