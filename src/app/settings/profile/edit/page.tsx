"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  List,
  ListItemText,
  ListItem,
  Typography,
  IconButton,
  ListItemButton,
  Divider,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  AppContainer,
  Header,
  ResponsiveContainer,
  FormField,
  PersianDatePicker,
} from "@/components/ui";
import { ChevronLeft } from "@mui/icons-material";
import { formatToPersianDateWithAge } from "@/utils/dateUtils";

export default function ProfileEdit() {
  const { user } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: user?.first_name || "",
    lastName: user?.last_name || "",
    email: user?.email || "",
    phone: user?.phone_number || "",
    birthday: user?.birthday || "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isEditingBirthday, setIsEditingBirthday] = useState(false);

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        email: user.email || "",
        phone: user.phone_number || "",
        birthday: user.birthday || "",
      });
    }
  }, [user]);

  // Show loading if user data is not available yet
  if (!user) {
    return (
      <AppContainer>
        <Header showBack title="ویرایش پروفایل" />
        <ResponsiveContainer padding="medium" fullHeight={false}>
          <Box sx={{ maxWidth: 600, mx: "auto", textAlign: "center", mt: 4 }}>
            <Typography variant="h6" color="text.secondary">
              در حال بارگذاری اطلاعات کاربر...
            </Typography>
          </Box>
        </ResponsiveContainer>
      </AppContainer>
    );
  }

  const handleInputChange = (field: string) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to save profile
      console.log("Saving profile:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate back to profile page
      router.back();
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <AppContainer>
      <Header
        user={user}
        showSaveButton
        showCancelButton
        onSaveClick={handleSave}
        onCancelClick={handleCancel}
        isSaving={isLoading}
        isSaveDisabled={isLoading}
        isCancelDisabled={isLoading}
      />

      <ResponsiveContainer padding="medium" fullHeight={false}>
        <Box sx={{ maxWidth: 600, mx: "auto" }}>
          <List
            sx={{
              backgroundColor: "background.paper",
              borderRadius: 1,
            }}
          >
            <FormField
              value={formData.firstName}
              onChange={handleInputChange("firstName")}
              placeholder="نام"
              showCancelIcon
              onCancel={() => handleInputChange("firstName")("")}
            />

            <FormField
              value={formData.lastName}
              onChange={handleInputChange("lastName")}
              placeholder="نام خانوادگی"
              showCancelIcon
              onCancel={() => handleInputChange("lastName")("")}
              showDivider={false}
            />
          </List>

          <List
            sx={{
              backgroundColor: "background.paper",
              borderRadius: 1,
              mt: 2,
            }}
          >
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => setIsEditingBirthday(!isEditingBirthday)}
              >
                <ListItemText
                  primary="تاریخ تولد"
                  slotProps={{
                    primary: {
                      fontSize: "1rem",
                      color: "text.secondary",
                      fontWeight: 500,
                    },
                  }}
                />
                <ListItemText
                  primary={
                    formatToPersianDateWithAge(formData.birthday) ||
                    "تاریخ تولد مشخص نیست"
                  }
                  sx={{ textAlign: "right" }}
                  slotProps={{
                    primary: {
                      fontSize: "1rem",
                      color: "text.primary",
                      fontWeight: 400,
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
            {/* PersianDatePicker for birthday editing */}
            {isEditingBirthday && (
              <PersianDatePicker
                label="تاریخ تولد"
                value={formData.birthday}
                onChange={(newDate) => {
                  handleInputChange("birthday")(newDate);
                }}
                placeholder="تاریخ تولد خود را انتخاب کنید"
                showAge={true}
              />
            )}
          </List>
          <List
            sx={{
              backgroundColor: "background.paper",
              borderRadius: 1,
              mt: 2,
            }}
          >
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText
                  primary="ایمیل"
                  slotProps={{
                    primary: {
                      fontSize: "1rem",
                      color: "text.secondary",
                      fontWeight: 500,
                    },
                  }}
                />
                <ListItemText
                  primary={user?.email || ""}
                  sx={{ textAlign: "right" }}
                  slotProps={{
                    primary: {
                      fontSize: "1rem",
                      color: "text.primary",
                      fontWeight: 400,
                    },
                  }}
                />
                <IconButton edge="end" aria-label="delete">
                  <ChevronLeft />
                </IconButton>
              </ListItemButton>
            </ListItem>

            <Divider variant="middle" sx={{ borderColor: "divider" }} />

            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText
                  primary="شماره موبایل"
                  slotProps={{
                    primary: {
                      fontSize: "1rem",
                      color: "text.secondary",
                      fontWeight: 500,
                    },
                  }}
                />
                <ListItemText
                  primary={user?.phone_number || ""}
                  sx={{ textAlign: "right" }}
                  slotProps={{
                    primary: {
                      fontSize: "1rem",
                      color: "text.primary",
                      fontWeight: 400,
                    },
                  }}
                />
                <IconButton edge="end" aria-label="delete">
                  <ChevronLeft />
                </IconButton>
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </ResponsiveContainer>
    </AppContainer>
  );
}
