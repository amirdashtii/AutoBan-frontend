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
  Dialog,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useUpdateProfileMutation } from "@/hooks/useAuthQuery";
import { UpdateProfileRequest } from "@/types/api";
import {
  AppContainer,
  Header,
  ResponsiveContainer,
  FormField,
  PersianDatePicker,
  ListItemInfo,
} from "@/components/ui";
import { ChevronLeft } from "@mui/icons-material";
import { formatToPersianDateWithAge } from "@/utils/dateUtils";

export default function ProfileEdit() {
  const { user } = useAuth();
  const router = useRouter();
  const updateProfileMutation = useUpdateProfileMutation();

  const [formData, setFormData] = useState({
    firstName: user?.first_name || "",
    lastName: user?.last_name || "",
    email: user?.email || "",
    phone: user?.phone_number || "",
    birthday: user?.birthday || "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isEditingBirthday, setIsEditingBirthday] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");

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

  // Email validation function
  const validateEmail = (email: string): string => {
    if (!email) return ""; // Empty email is allowed (optional field)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return "فرمت ایمیل نامعتبر است";
    }
    return "";
  };

  const handleInputChange = (field: string) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Validate email when it changes
    if (field === "email") {
      const error = validateEmail(value);
      setEmailError(error);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setErrorDialogOpen(false); // Close error dialog

    // Validate email before saving
    const emailValidationError = validateEmail(formData.email);
    if (emailValidationError) {
      setEmailError(emailValidationError);
      setIsLoading(false);
      return;
    }

    try {
      // Create payload with only changed fields
      const payload: UpdateProfileRequest = {};

      if (formData.firstName !== user?.first_name) {
        payload.first_name = formData.firstName;
      }

      if (formData.lastName !== user?.last_name) {
        payload.last_name = formData.lastName;
      }

      if (formData.email !== user?.email) {
        payload.email = formData.email;
      }

      if (formData.birthday !== user?.birthday) {
        payload.birthday = formData.birthday;
      }

      // Only proceed if there are changes
      if (Object.keys(payload).length === 0) {
        router.back();
        return;
      }

      // Use the existing mutation hook
      await updateProfileMutation.mutateAsync(payload);

      // Navigate back to profile page
      router.back();
    } catch (error) {
      // Set error message and open dialog
      const errorMsg =
        error instanceof Error ? error.message : "خطا در ذخیره اطلاعات پروفایل";
      setErrorMessage(errorMsg);
      setErrorDialogOpen(true);
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
            />
            <FormField
              value={formData.email}
              onChange={handleInputChange("email")}
              placeholder="ایمیل"
              showCancelIcon
              onCancel={() => handleInputChange("email")("")}
              showDivider={false}
              error={!!emailError}
              helperText={emailError}
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
            <ListItemInfo
              label="شماره موبایل"
              value={user?.phone_number || ""}
              icon={<ChevronLeft />}
            />
          </List>
        </Box>
      </ResponsiveContainer>

      {/* Error Dialog */}
      <Dialog
        open={errorDialogOpen}
        onClose={() => setErrorDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent sx={{ backgroundColor: "background.paper" }}>
          <Typography variant="body1" sx={{ textAlign: "center" }}>
            {errorMessage}
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "center",
            backgroundColor: "background.paper",
          }}
        >
          <Button
            onClick={() => setErrorDialogOpen(false)}
            fullWidth
            variant="contained"
            color="primary"
            sx={{ minWidth: 100 }}
          >
            تایید
          </Button>
        </DialogActions>
      </Dialog>
    </AppContainer>
  );
}
