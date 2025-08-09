import React from "react";
import {
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { useColorScheme } from "@mui/material/styles";
import {
  Brightness4,
  Brightness7,
  SettingsBrightness,
} from "@mui/icons-material";

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
        <MenuItem value="system">
          <SettingsBrightness sx={{ mr: 1, fontSize: 18 }} />
          سیستم
        </MenuItem>
        <MenuItem value="light">
          <Brightness7 sx={{ mr: 1, fontSize: 18 }} />
          روشن
        </MenuItem>
        <MenuItem value="dark">
          <Brightness4 sx={{ mr: 1, fontSize: 18 }} />
          تاریک
        </MenuItem>
      </Select>
    </FormControl>
  );
}
