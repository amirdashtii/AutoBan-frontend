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

// Context برای مدیریت تم
const ThemeModeContext = React.createContext<{
  mode: "light" | "dark" | "system";
  setMode: (mode: "light" | "dark" | "system") => void;
  effectiveMode: "light" | "dark";
}>({
  mode: "system",
  setMode: () => {},
  effectiveMode: "light",
});

export const useColorScheme = () => React.useContext(ThemeModeContext);

export default function AppTheme(props: AppThemeProps) {
  const { children, disableCustomTheme, themeComponents } = props;

  // State برای مدیریت تم
  const [mode, setModeState] = React.useState<"light" | "dark" | "system">(
    "system"
  );
  const [systemMode, setSystemMode] = React.useState<"light" | "dark">("light");

  // بررسی تنظیمات سیستم
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      setSystemMode(mediaQuery.matches ? "dark" : "light");

      const handleChange = (e: MediaQueryListEvent) => {
        setSystemMode(e.matches ? "dark" : "light");
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  // بارگذاری تنظیمات ذخیره شده
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const savedMode = localStorage.getItem("theme-mode") as
        | "light"
        | "dark"
        | "system"
        | null;
      if (savedMode && ["light", "dark", "system"].includes(savedMode)) {
        setModeState(savedMode);
      }
    }
  }, []);

  // ذخیره تنظیمات
  const setMode = React.useCallback((newMode: "light" | "dark" | "system") => {
    setModeState(newMode);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme-mode", newMode);
    }
  }, []);

  // محاسبه تم موثر
  const effectiveMode = mode === "system" ? systemMode : mode;

  const theme = React.useMemo(() => {
    if (disableCustomTheme) return createTheme();

    const tokens = getDesignTokens(effectiveMode);
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
  }, [effectiveMode, disableCustomTheme, themeComponents]);

  if (disableCustomTheme) return <React.Fragment>{children}</React.Fragment>;

  return (
    <ThemeModeContext.Provider value={{ mode, setMode, effectiveMode }}>
      <CacheProvider value={cacheRtl}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </CacheProvider>
    </ThemeModeContext.Provider>
  );
}
