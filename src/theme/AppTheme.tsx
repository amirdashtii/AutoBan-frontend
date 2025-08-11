"use client";

import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import type { ThemeOptions } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import { getDesignTokens } from "./themePrimitives";

interface AppThemeProps {
  children: React.ReactNode;
  disableCustomTheme?: boolean;
  themeComponents?: ThemeOptions["components"];
}

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

export default function AppTheme(props: AppThemeProps) {
  const { children, disableCustomTheme, themeComponents } = props;
  const [mode, setMode] = React.useState<"light" | "dark">("light");

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setMode(mediaQuery.matches ? "dark" : "light");
    const handleChange = (e: MediaQueryListEvent) =>
      setMode(e.matches ? "dark" : "light");
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const theme = React.useMemo(() => {
    if (disableCustomTheme) return createTheme();
    const tokens = getDesignTokens(mode);
    return createTheme({
      direction: "rtl",
      ...tokens,
      shape: { borderRadius: 10 },
      components: {
        MuiAppBar: {
          styleOverrides: {
            root: { backgroundImage: "none" },
          },
        },
        MuiButton: {
          defaultProps: { disableElevation: true },
          styleOverrides: {
            root: { borderRadius: 10 },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: { borderRadius: 12 },
          },
        },
        ...themeComponents,
      },
    });
  }, [mode, disableCustomTheme, themeComponents]);

  if (disableCustomTheme) return <React.Fragment>{children}</React.Fragment>;

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
