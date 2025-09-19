"use client";

import React from "react";
import { List, ListItem, ListItemText, Divider } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { AppContainer, Header, ResponsiveContainer } from "@/components/ui";
import {
  formatToPersianDateWithAge,
  formatToPersianDate,
} from "@/utils/dateUtils";

export default function Profile() {
  const { user } = useAuth();
  const router = useRouter();

  const handleEdit = () => {
    router.push("/settings/profile/edit");
  };

  return (
    <AppContainer>
      <Header showBack user={user} showEditButton onEditClick={handleEdit} />
      <ResponsiveContainer padding="medium" fullHeight={false}>
        <List
          sx={{
            my: 2,
            backgroundColor: "background.paper",
            borderRadius: 1,
          }}
        >
          <ListItem>
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
          </ListItem>
          <Divider variant="middle" sx={{ borderColor: "divider" }} />

          <ListItem>
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
                formatToPersianDateWithAge(user?.birthday) ||
                "تاریخ تولد وارد نشده"
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
          </ListItem>
          <Divider variant="middle" sx={{ borderColor: "divider" }} />

          <ListItem>
            <ListItemText
              primary="تاریخ عضویت"
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
                formatToPersianDate(user?.created_at) || "تاریخ عضویت مشخص نیست"
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
          </ListItem>
        </List>
      </ResponsiveContainer>
    </AppContainer>
  );
}
