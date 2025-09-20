"use client";

import React, { useState, useEffect } from "react";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import DateObject from "react-date-object";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  Divider,
} from "@mui/material";

interface PersianDatePickerProps {
  value?: string; // Gregorian date string (YYYY-MM-DD format)
  onChange?: (gregorianDate: string) => void; // Returns YYYY-MM-DD format
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  showAge?: boolean;
}

export function PersianDatePicker({
  value,
  onChange,
  label,
}: PersianDatePickerProps) {
  const [persianDate, setPersianDate] = useState<DateObject | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [selectedMonth, setSelectedMonth] = useState<number>(1);
  const [selectedYear, setSelectedYear] = useState<number>(1400);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isUserChange, setIsUserChange] = useState(false);

  // Convert Gregorian date to Persian date
  useEffect(() => {
    if (value) {
      try {
        const gregorianDate = new Date(value);
        if (!isNaN(gregorianDate.getTime())) {
          const persianDateObj = new DateObject(gregorianDate);
          persianDateObj.calendar = persian;
          persianDateObj.locale = persian_fa;
          setPersianDate(persianDateObj);
          setSelectedDay(persianDateObj.day);
          setSelectedMonth(Number(persianDateObj.month.number));
          setSelectedYear(persianDateObj.year);
          setIsInitialized(true);
        }
      } catch (error) {
        console.error("Error converting date:", error);
        setPersianDate(null);
        setIsInitialized(true);
      }
    } else {
      setPersianDate(null);
      setIsInitialized(true);
    }
  }, [value]);

  // Update date when selections change
  useEffect(() => {
    if (isInitialized && isUserChange) {
      handleDateChange();
    }
  }, [selectedDay, selectedMonth, selectedYear, isInitialized, isUserChange]);

  // Adjust day when month or year changes
  useEffect(() => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    if (selectedDay > daysInMonth) {
      setSelectedDay(daysInMonth);
    }
  }, [selectedMonth, selectedYear]);

  const handleDateChange = () => {
    try {
      const persianDateObj = new DateObject({
        year: selectedYear,
        month: selectedMonth,
        day: selectedDay,
        calendar: persian,
        locale: persian_fa,
      });

      setPersianDate(persianDateObj);

      // Convert Persian date to Gregorian
      const gregorianDate = persianDateObj.convert(gregorian);
      const date = gregorianDate.toDate();

      // Create date string without timezone issues
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const dateString = `${year}-${month}-${day}`;

      onChange?.(dateString);
    } catch (error) {
      console.error("Error converting date:", error);
    }
  };

  // Calculate days in selected month
  const getDaysInMonth = (year: number, month: number) => {
    // Persian calendar months and their days
    const monthDays = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29]; // Default days for each month

    // Check if it's a leap year for Esfand (month 12)
    if (month === 12) {
      // Persian leap year calculation
      const persianYear = year;
      const leapYear = (persianYear + 2346) % 128 === 0;
      return leapYear ? 30 : 29;
    }

    return monthDays[month - 1];
  };

  const daysInSelectedMonth = getDaysInMonth(selectedYear, selectedMonth);
  const days = Array.from({ length: daysInSelectedMonth }, (_, i) => i + 1);
  const months = [
    { value: 1, label: "فروردین" },
    { value: 2, label: "اردیبهشت" },
    { value: 3, label: "خرداد" },
    { value: 4, label: "تیر" },
    { value: 5, label: "مرداد" },
    { value: 6, label: "شهریور" },
    { value: 7, label: "مهر" },
    { value: 8, label: "آبان" },
    { value: 9, label: "آذر" },
    { value: 10, label: "دی" },
    { value: 11, label: "بهمن" },
    { value: 12, label: "اسفند" },
  ];
  // Generate years from 120 years ago to current year
  const currentYear = new DateObject().convert(persian).year;
  const startYear = currentYear - 120;
  const years = Array.from({ length: 121 }, (_, i) => startYear + i);

  return (
    <Box
      sx={{
        mx: "auto",
        p: 2,
        borderRadius: 1,
        backgroundColor: "background.paper",
      }}
    >
      <Divider variant="middle" sx={{ borderColor: "divider" }} />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 1,
          p: 2,
        }}
      >
        {/* Day Selector */}
        <FormControl sx={{ minWidth: 80 }}>
          <Select
            value={selectedDay}
            onChange={(e) => {
              setSelectedDay(Number(e.target.value));
              setIsUserChange(true);
            }}
            sx={{
              "& .MuiSelect-select": {
                textAlign: "center",
                fontSize: "1.1rem",
                fontWeight: 600,
                border: "none",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            }}
          >
            {days.map((day) => (
              <MenuItem key={day} value={day}>
                {day}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Month Selector */}
        <FormControl sx={{ minWidth: 120 }}>
          <Select
            value={selectedMonth}
            onChange={(e) => {
              setSelectedMonth(Number(e.target.value));
              setIsUserChange(true);
            }}
            sx={{
              "& .MuiSelect-select": {
                textAlign: "center",
                fontSize: "1.1rem",
                fontWeight: 600,
                border: "none",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            }}
          >
            {months.map((month) => (
              <MenuItem key={month.value} value={month.value}>
                {month.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Year Selector */}
        <FormControl sx={{ minWidth: 100 }}>
          <Select
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(Number(e.target.value));
              setIsUserChange(true);
            }}
            sx={{
              "& .MuiSelect-select": {
                textAlign: "center",
                fontSize: "1.1rem",
                fontWeight: 600,
                border: "none",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            }}
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Divider variant="middle" sx={{ borderColor: "divider" }} />

      <Box sx={{ pt: 2 }}>
        <Typography
          variant="body2"
          sx={{
            color: "primary.main",
            fontWeight: 500,
            cursor: "pointer",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
          onClick={() => {
            setPersianDate(null);
            onChange?.("");
          }}
        >
          {label ? `حذف ${label}` : "حذف تاریخ"}
        </Typography>
      </Box>
    </Box>
  );
}
