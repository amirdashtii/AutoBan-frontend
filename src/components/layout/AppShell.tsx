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
          pt: 2,
          pb: { xs: 8, md: 2 },
          px: { xs: 1.5, md: 3 },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
