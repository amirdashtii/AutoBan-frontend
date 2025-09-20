"use client";

import React from "react";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
} from "@mui/material";

interface ListItemCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  onClick?: () => void;
}

export default function ListItemCard({
  title,
  subtitle,
  icon,
  actions,
  onClick,
}: ListItemCardProps) {
  return (
    <ListItem disablePadding>
      <ListItemButton
        onClick={onClick}
      >
        {icon && (
          <ListItemIcon sx={{ minWidth: 40, color: "primary.main" }}>
            {icon}
          </ListItemIcon>
        )}
        <ListItemText
          primary={title}
          secondary={subtitle}
        />
        {actions && <Box sx={{ ml: 1 }}>{actions}</Box>}
      </ListItemButton>
    </ListItem>
  );
}
