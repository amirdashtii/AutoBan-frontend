"use client";

import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import type { ThemeOptions } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";

interface AppThemeProps {
  children: React.ReactNode;
  disableCustomTheme?: boolean;
  themeComponents?: ThemeOptions["components"];
}

// Create RTL cache
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

// Simple theme without complex color schemes
const createAppTheme = () =>
  createTheme({
    direction: "rtl",
    palette: {
      mode: "light", // Default to light, will be overridden by system preference
    },
    typography: {
      fontFamily: "Inter, sans-serif",
    },
    shape: {
      borderRadius: 8,
    },
  });

export default function AppTheme(props: AppThemeProps) {
  const { children, disableCustomTheme, themeComponents } = props;
  const [mode, setMode] = React.useState<"light" | "dark">("light");

  // Detect system preference on mount
  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setMode(mediaQuery.matches ? "dark" : "light");

    const handleChange = (e: MediaQueryListEvent) => {
      setMode(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const theme = React.useMemo(() => {
    if (disableCustomTheme) return {};

    return createTheme({
      direction: "rtl",
      palette: {
        mode,
      },
      typography: {
        fontFamily: "Inter, sans-serif",
      },
      shape: {
        borderRadius: 8,
      },
      components: {
        ...themeComponents,
      },
    });
  }, [mode, disableCustomTheme, themeComponents]);

  if (disableCustomTheme) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
