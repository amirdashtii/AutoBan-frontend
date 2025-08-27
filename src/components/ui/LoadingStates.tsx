"use client";

import React from "react";
import {
  Box,
  CircularProgress,
  Skeleton,
  Typography,
  LinearProgress,
  Card,
  CardContent,
  useTheme,
} from "@mui/material";

// Skeleton Loaders - فقط چیزهایی که قبلاً نداشتیم

// Loading کوچک برای دکمه‌ها (می‌تونه مفید باشه)
export const ButtonLoader = ({ size = 20 }: { size?: number }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    <CircularProgress size={size} thickness={6} />
  </Box>
);

// 3. Loading برای کارت‌ها
export const CardLoader = ({ count = 3 }: { count?: number }) => {
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} sx={{ p: 2 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Skeleton variant="circular" width={40} height={40} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" height={24} />
                <Skeleton variant="text" width="40%" height={20} />
              </Box>
            </Box>
            <Skeleton variant="rectangular" height={60} sx={{ mb: 1 }} />
            <Box sx={{ display: "flex", gap: 1 }}>
              <Skeleton variant="rounded" width={80} height={32} />
              <Skeleton variant="rounded" width={100} height={32} />
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

// 4. Loading برای لیست
export const ListLoader = ({ count = 5 }: { count?: number }) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
    {Array.from({ length: count }).map((_, index) => (
      <Box
        key={index}
        sx={{ display: "flex", alignItems: "center", gap: 2, p: 2 }}
      >
        <Skeleton variant="circular" width={32} height={32} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="70%" height={20} />
          <Skeleton variant="text" width="50%" height={16} />
        </Box>
        <Skeleton variant="rounded" width={60} height={24} />
      </Box>
    ))}
  </Box>
);

// 5. Loading برای فرم‌ها
export const FormLoader = () => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
    <Skeleton variant="rounded" height={56} />
    <Skeleton variant="rounded" height={56} />
    <Skeleton variant="rounded" height={100} />
    <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
      <Skeleton variant="rounded" width={100} height={40} />
      <Skeleton variant="rounded" width={120} height={40} />
    </Box>
  </Box>
);

// 6. Loading برای جدول
export const TableLoader = ({
  rows = 5,
  columns = 4,
}: {
  rows?: number;
  columns?: number;
}) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
    {/* Header */}
    <Box
      sx={{
        display: "flex",
        gap: 2,
        p: 1,
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      {Array.from({ length: columns }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          width={`${100 / columns}%`}
          height={24}
        />
      ))}
    </Box>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <Box key={rowIndex} sx={{ display: "flex", gap: 2, p: 1 }}>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton
            key={colIndex}
            variant="text"
            width={`${100 / columns}%`}
            height={20}
          />
        ))}
      </Box>
    ))}
  </Box>
);

// 7. Loading با Progress Bar
export const ProgressLoader = ({
  message = "در حال بارگذاری...",
  progress,
}: {
  message?: string;
  progress?: number;
}) => (
  <Box sx={{ width: "100%", maxWidth: 400, mx: "auto", p: 3 }}>
    <Typography
      variant="body2"
      color="text.secondary"
      textAlign="center"
      mb={2}
    >
      {message}
    </Typography>
    {progress !== undefined ? (
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{ height: 8, borderRadius: 4 }}
      />
    ) : (
      <LinearProgress sx={{ height: 8, borderRadius: 4 }} />
    )}
    {progress !== undefined && (
      <Typography
        variant="caption"
        color="text.secondary"
        textAlign="center"
        mt={1}
      >
        {Math.round(progress)}%
      </Typography>
    )}
  </Box>
);

// 8. Loading Overlay برای Modal یا Section
export const LoadingOverlay = ({
  message = "در حال پردازش...",
  backdrop = true,
}: {
  message?: string;
  backdrop?: boolean;
}) => (
  <Box
    sx={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: backdrop ? "rgba(255, 255, 255, 0.8)" : "transparent",
      backdropFilter: backdrop ? "blur(2px)" : "none",
      zIndex: 1000,
      gap: 2,
    }}
  >
    <CircularProgress size={40} />
    <Typography variant="body2" color="text.secondary">
      {message}
    </Typography>
  </Box>
);

// 9. Skeleton برای متن
export const TextSkeleton = ({
  lines = 3,
  width = ["100%", "80%", "60%"],
}: {
  lines?: number;
  width?: string | string[];
}) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton
        key={index}
        variant="text"
        width={Array.isArray(width) ? width[index % width.length] : width}
        height={20}
      />
    ))}
  </Box>
);

// 10. Loading برای چیپ‌ها و تگ‌ها
export const ChipLoader = ({ count = 3 }: { count?: number }) => (
  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
    {Array.from({ length: count }).map((_, index) => (
      <Skeleton
        key={index}
        variant="rounded"
        width={Math.random() * 50 + 60}
        height={32}
      />
    ))}
  </Box>
);
