"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  OutlinedInput,
} from "@mui/material";
import React from "react";

interface ForgotPasswordProps {
  open: boolean;
  handleClose: () => void;
}

export default function ForgotPassword({
  open,
  handleClose,
}: ForgotPasswordProps) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            handleClose();
          },
        },
      }}
    >
      <DialogTitle>ریست رمز عبور</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
      >
        <DialogContentText>شماره تلفن خود را وارد کنید</DialogContentText>
        <OutlinedInput
          autoFocus
          required
          margin="dense"
          id="phone"
          name="phone"
          placeholder="09XXXXXXXXX"
          type="tel"
          fullWidth
        />
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button variant="contained" type="submit">
          ارسال
        </Button>
        <Button onClick={handleClose}>انصراف</Button>
      </DialogActions>
    </Dialog>
  );
}
