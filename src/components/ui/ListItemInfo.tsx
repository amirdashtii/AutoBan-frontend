"use client";

import React from "react";
import {
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
} from "@mui/material";

interface ListItemInfoProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export default function ListItemInfo({
  label,
  value,
  icon,
  onClick,
  disabled = false,
}: ListItemInfoProps) {
  return (
    <ListItem disablePadding>
      <ListItemButton onClick={onClick} disabled={disabled}>
        <ListItemText
          primary={label}
          slotProps={{
            primary: {
              fontSize: "1rem",
              color: "text.secondary",
              fontWeight: 500,
            },
          }}
        />
        <ListItemText
          primary={value}
          sx={{ textAlign: "right" }}
          slotProps={{
            primary: {
              fontSize: "1rem",
              color: "text.primary",
              fontWeight: 400,
            },
          }}
        />
        {icon && (
          <IconButton edge="end" aria-label="action">
            {icon}
          </IconButton>
        )}
      </ListItemButton>
    </ListItem>
  );
}
