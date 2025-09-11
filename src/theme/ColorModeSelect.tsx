import React from "react";
import {
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { useColorScheme } from "./AppTheme";

interface ColorModeSelectProps {
  size?: "small" | "medium";
}

export default function ColorModeSelect({
  size = "medium",
}: ColorModeSelectProps) {
  const { mode, setMode } = useColorScheme();

  const handleChange = (event: SelectChangeEvent) => {
    const newMode = event.target.value as "light" | "dark" | "system";
    setMode(newMode);
  };

  // Use current mode or fallback to 'system'
  const currentMode = mode || "system";

  return (
    <FormControl size={size}>
      <Select value={currentMode} onChange={handleChange}>
        <MenuItem value="system">سیستم</MenuItem>
        <MenuItem value="light">روشن</MenuItem>
        <MenuItem value="dark">تاریک</MenuItem>
      </Select>
    </FormControl>
  );
}
