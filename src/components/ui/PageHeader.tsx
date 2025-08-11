"use client";

import React from "react";
import { Box, Typography, Stack, Button, IconButton } from "@mui/material";

export interface PageAction {
  key: string;
  label: string;
  onClick: () => void;
  color?:
    | "primary"
    | "secondary"
    | "success"
    | "info"
    | "warning"
    | "error"
    | "inherit";
  variant?: "text" | "outlined" | "contained";
  icon?: React.ReactNode;
  size?: "small" | "medium" | "large";
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: PageAction[];
  dense?: boolean;
}

export default function PageHeader({
  title,
  subtitle,
  actions = [],
  dense = false,
}: PageHeaderProps) {
  return (
    <Box sx={{ mb: dense ? 2 : 3 }}>
      <Stack
        direction="row"
        alignItems={{ xs: "stretch", sm: "center" }}
        justifyContent="space-between"
        gap={2}
        flexWrap="wrap"
      >
        <Box>
          <Typography
            variant={dense ? "h5" : "h4"}
            component="h1"
            sx={{ fontWeight: 700 }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {actions.length > 0 && (
          <Stack
            direction="row"
            gap={1}
            alignItems="center"
            justifyContent="flex-end"
            flexWrap="wrap"
          >
            {actions.map((a) =>
              a.variant === "text" ? (
                <IconButton
                  key={a.key}
                  onClick={a.onClick}
                  color={a.color ?? "primary"}
                  size={a.size ?? "medium"}
                >
                  {a.icon}
                </IconButton>
              ) : (
                <Button
                  key={a.key}
                  onClick={a.onClick}
                  startIcon={a.icon}
                  color={a.color ?? "primary"}
                  variant={a.variant ?? "contained"}
                  size={a.size ?? "medium"}
                >
                  {a.label}
                </Button>
              )
            )}
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
