import React, { useState } from "react";
import {
  Alert,
  AlertTitle,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
} from "@mui/material";
import { Warning, PhoneAndroid } from "@mui/icons-material";
import { useAuth } from "@/hooks/useAuth";
import AccountActivation from "./AccountActivation";

export default function InactiveUserRestriction() {
  const { user } = useAuth();
  const [showActivationDialog, setShowActivationDialog] = useState(false);

  // Don't show if user is active or doesn't exist
  if (!user || user.status === "Active") {
    return null;
  }

  const handleActivationSuccess = () => {
    setShowActivationDialog(false);
    // Refresh page to update user status
    window.location.reload();
  };

  return (
    <>
      <Alert
        severity="warning"
        sx={{ mb: 2 }}
        action={
          <Button
            color="inherit"
            size="small"
            startIcon={<PhoneAndroid />}
            onClick={() => setShowActivationDialog(true)}
          >
            فعال‌سازی حساب
          </Button>
        }
      >
        <AlertTitle>حساب کاربری شما فعال نیست</AlertTitle>
        برای استفاده از تمام امکانات، لطفاً حساب خود را با تایید شماره تلفن فعال
        کنید.
      </Alert>

      <Dialog
        open={showActivationDialog}
        onClose={() => setShowActivationDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PhoneAndroid color="primary" />
            <Typography variant="h6">فعال‌سازی حساب کاربری</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <AccountActivation
            phoneNumber={user.phone_number}
            onActivationSuccess={handleActivationSuccess}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowActivationDialog(false)}
            color="inherit"
          >
            بستن
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
