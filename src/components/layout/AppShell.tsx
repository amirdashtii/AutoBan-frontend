"use client";

import React from "react";
import { Box } from "@mui/material";

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Box
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
