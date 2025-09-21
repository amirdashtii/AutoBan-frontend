"use client";

import React from "react";
import {
  Box,
  Typography,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

interface LicensePlateInputProps {
  value: string;
  onChange: (value: string) => void;
  vehicleType?: string;
  label?: string;
  error?: boolean;
  helperText?: string;
}

export function LicensePlateInput({
  value,
  onChange,
  vehicleType,
  label,
  error = false,
  helperText,
}: LicensePlateInputProps) {
  const handlePlateChange = (partIndex: number, newValue: string) => {
    const parts = value.split("-");
    parts[partIndex] = newValue;
    const newPlate = parts.join("-");
    onChange(newPlate);
  };

  const persianLetters = [
    { display: "الف", value: "الف" },
    { display: "ب", value: "ب" },
    { display: "پ", value: "پ" },
    { display: "ت", value: "ت" },
    { display: "ث", value: "ث" },
    { display: "ج", value: "ج" },
    { display: "د", value: "د" },
    { display: "ز", value: "ز" },
    { display: "س", value: "س" },
    { display: "ش", value: "ش" },
    { display: "ص", value: "ص" },
    { display: "ط", value: "ط" },
    { display: "ع", value: "ع" },
    { display: "ف", value: "ف" },
    { display: "ق", value: "ق" },
    { display: "ک", value: "ک" },
    { display: "گ", value: "گ" },
    { display: "ل", value: "ل" },
    { display: "م", value: "م" },
    { display: "ن", value: "ن" },
    { display: "و", value: "و" },
    { display: "ه", value: "ه" },
    { display: "ی", value: "ی" },
    {
      display: <span style={{ fontSize: "2em" }}>♿︎</span>,
      value: "ژ",
    },
    { display: "D", value: "D" },
    { display: "S", value: "S" },
  ];

  const isMotorcycle = vehicleType === "موتورسیکلت";

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        {label || `پلاک ${vehicleType || "خودرو"}`}
      </Typography>

      {isMotorcycle ? (
        // Motorcycle license plate format (2 rows)
        <Box sx={{ mb: 2 }} dir="ltr">
          <Grid container spacing={1} sx={{ mb: 1 }}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="شماره بالا (۳ رقم)"
                value={value.split("-")[0] || ""}
                onChange={(e) => handlePlateChange(0, e.target.value)}
                slotProps={{ htmlInput: { maxLength: 3 } }}
                placeholder="123"
                error={error}
                helperText={helperText}
              />
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="شماره پایین"
                value={value.split("-")[1] || ""}
                onChange={(e) => handlePlateChange(1, e.target.value)}
                slotProps={{ htmlInput: { maxLength: 5 } }}
                placeholder="12345"
                error={error}
                helperText={helperText}
              />
            </Grid>
          </Grid>
        </Box>
      ) : (
        // Car license plate format (4 parts in one row)
        <Grid container spacing={1} dir="ltr">
          <Grid size={3}>
            <TextField
              fullWidth
              label="دو رقم"
              value={value.split("-")[0] || ""}
              onChange={(e) => handlePlateChange(0, e.target.value)}
              slotProps={{ htmlInput: { maxLength: 2 } }}
              placeholder="12"
              error={error}
              helperText={helperText}
            />
          </Grid>
          <Grid size={3}>
            <FormControl fullWidth error={error}>
              <InputLabel>حرف</InputLabel>
              <Select
                value={value.split("-")[1] || ""}
                onChange={(e) => handlePlateChange(1, e.target.value)}
                label="حرف"
              >
                {persianLetters.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.display}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={3}>
            <TextField
              fullWidth
              label="سه رقم"
              value={value.split("-")[2] || ""}
              onChange={(e) => handlePlateChange(2, e.target.value)}
              slotProps={{ htmlInput: { maxLength: 3 } }}
              placeholder="123"
              error={error}
              helperText={helperText}
            />
          </Grid>
          <Grid size={3}>
            <TextField
              fullWidth
              label="ایران"
              value={value.split("-")[3] || ""}
              onChange={(e) => handlePlateChange(3, e.target.value)}
              slotProps={{ htmlInput: { maxLength: 2 } }}
              placeholder="12"
              error={error}
              helperText={helperText}
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
