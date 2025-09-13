"use client";

import React from "react";
import { Box, Button } from "@mui/material";
import { useAuth } from "@/hooks/useAuth";
import {
  AppContainer,
  Header,
  ResponsiveContainer,
  InfoItem,
} from "@/components/ui";

export default function Profile() {
  const { user } = useAuth();

  // Format date of birth (you can customize this based on your data structure)
  const formatDateOfBirth = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <AppContainer>
      <Header showBack user={user} leftActions={[<Button>ویرایش</Button>]} />
      <ResponsiveContainer padding="medium" fullHeight={false}>
        <Box sx={{ maxWidth: 600, mx: "auto" }}>
          <Box
            sx={{
              backgroundColor: "background.paper",
              borderRadius: 2,
              overflow: "hidden",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <InfoItem label="ایمیل" value={user?.email || ""} />

            <InfoItem
              label="تاریخ تولد"
              value={formatDateOfBirth(user?.birthday)}
            />

            <InfoItem
              label="تاریخ عضویت"
              value={formatDateOfBirth(user?.created_at)}
            />
          </Box>
        </Box>
      </ResponsiveContainer>
    </AppContainer>
  );
}
