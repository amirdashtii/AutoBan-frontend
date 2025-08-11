"use client";

import React from "react";
import { Box, Typography, IconButton, Stack, Paper } from "@mui/material";

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
    <Paper
      variant="outlined"
      sx={{
        p: 1.5,
        borderRadius: 2,
        cursor: onClick ? "pointer" : "default",
        "&:hover": { bgcolor: "action.hover" },
      }}
      onClick={onClick}
    >
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          {icon && <Box sx={{ color: "primary.main" }}>{icon}</Box>}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        </Stack>
        {actions && <Box>{actions}</Box>}
      </Stack>
    </Paper>
  );
}
