"use client";

import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
} from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from "@mui/lab";
import {
  Build,
  DirectionsCar,
  CheckCircle,
  Schedule,
} from "@mui/icons-material";
import { useAuth } from "@/hooks/useAuth";
import InactiveUserRestriction from "@/components/InactiveUserRestriction";

export default function History() {
  const { user } = useAuth();

  const historyData = [
    {
      id: 1,
      type: "oil_change",
      vehicle: "پژو 206",
      date: "1402/12/15",
      mileage: "85000",
      cost: "500000",
      status: "completed",
      description: "تعویض روغن موتور و فیلتر",
      location: "تعمیرگاه مرکزی",
    },
    {
      id: 2,
      type: "filter_change",
      vehicle: "سمند",
      date: "1402/11/20",
      mileage: "120000",
      cost: "300000",
      status: "completed",
      description: "تعویض فیلتر هوا و روغن",
      location: "تعمیرگاه مرکزی",
    },
    {
      id: 3,
      type: "inspection",
      vehicle: "پژو 206",
      date: "1402/10/10",
      mileage: "80000",
      cost: "200000",
      status: "completed",
      description: "بررسی فنی و تنظیم موتور",
      location: "تعمیرگاه مرکزی",
    },
    {
      id: 4,
      type: "oil_change",
      vehicle: "سمند",
      date: "1402/09/15",
      mileage: "115000",
      cost: "400000",
      status: "completed",
      description: "تعویض روغن و فیلترها",
      location: "تعمیرگاه مرکزی",
    },
  ];

  const getServiceTypeText = (type: string) => {
    switch (type) {
      case "oil_change":
        return "تعویض روغن";
      case "filter_change":
        return "تعویض فیلتر";
      case "inspection":
        return "بررسی فنی";
      default:
        return "سرویس";
    }
  };

  const getServiceColor = (type: string) => {
    switch (type) {
      case "oil_change":
        return "primary.main";
      case "filter_change":
        return "success.main";
      case "inspection":
        return "info.main";
      default:
        return "grey.500";
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        تاریخچه سرویس‌ها
      </Typography>

      {/* Account Activation Warning */}
      <InactiveUserRestriction />

      <Card>
        <CardContent>
          <Timeline>
            {historyData.map((item) => (
              <TimelineItem key={item.id}>
                <TimelineSeparator>
                  <TimelineDot sx={{ bgcolor: getServiceColor(item.type) }} />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Card sx={{ mb: 2 }}>
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 1,
                        }}
                      >
                        <Typography variant="h6">
                          {getServiceTypeText(item.type)}
                        </Typography>
                        <Chip label="تکمیل شده" color="success" size="small" />
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        {item.vehicle} - {item.date}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        کیلومتر: {item.mileage} - هزینه: {item.cost} تومان
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        {item.description}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        📍 {item.location}
                      </Typography>
                    </CardContent>
                  </Card>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </CardContent>
      </Card>
    </Box>
  );
}
