"use client";

import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Fab,
} from "@mui/material";
import {
  Build,
  DirectionsCar,
  Add,
  CheckCircle,
  Schedule,
  Warning,
} from "@mui/icons-material";
import { useAuth } from "@/hooks/useAuth";
import InactiveUserRestriction from "@/components/InactiveUserRestriction";
import { ListItemCard } from "@/components/ui";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`service-tabpanel-${index}`}
      aria-labelledby={`service-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Services() {
  const { user } = useAuth();
  const [tabValue, setTabValue] = React.useState(0);
  const [openDialog, setOpenDialog] = React.useState(false);

  const [services, setServices] = React.useState([
    {
      id: 1,
      type: "oil_change",
      vehicle: "پژو 206",
      date: "1402/12/15",
      mileage: "85000",
      cost: "500000",
      status: "completed",
      description: "تعویض روغن موتور و فیلتر",
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
    },
    {
      id: 3,
      type: "inspection",
      vehicle: "پژو 206",
      date: "1403/01/10",
      mileage: "90000",
      cost: "200000",
      status: "scheduled",
      description: "بررسی فنی و تنظیم موتور",
    },
  ]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) =>
    setTabValue(newValue);

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

  type ChipColor =
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning";
  const getStatusColor = (status: string): ChipColor => {
    switch (status) {
      case "completed":
        return "success";
      case "scheduled":
        return "warning";
      case "pending":
        return "info";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "تکمیل شده";
      case "scheduled":
        return "برنامه‌ریزی شده";
      case "pending":
        return "در انتظار";
      default:
        return "نامشخص";
    }
  };

  const filteredServices = services.filter((service) => {
    if (tabValue === 0) return service.status === "completed";
    if (tabValue === 1) return service.status === "scheduled";
    if (tabValue === 2) return service.status === "pending";
    return true;
  });

  return (
    <Box sx={{ p: 2 }}>
      {/* Top header removed per design */}

      {/* Account Activation Warning */}
      <InactiveUserRestriction />

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="تکمیل شده" />
              <Tab label="برنامه‌ریزی شده" />
              <Tab label="در انتظار" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Box sx={{ display: "grid", gap: 1.25 }}>
              {filteredServices.map((service) => (
                <ListItemCard
                  key={service.id}
                  title={getServiceTypeText(service.type)}
                  subtitle={`${service.vehicle} - ${service.date} | کیلومتر: ${service.mileage} - هزینه: ${service.cost} تومان`}
                  icon={<Build color="primary" />}
                  actions={
                    <Chip
                      label={getStatusText(service.status)}
                      color={getStatusColor(service.status)}
                      size="small"
                    />
                  }
                />
              ))}
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ display: "grid", gap: 1.25 }}>
              {filteredServices.map((service) => (
                <ListItemCard
                  key={service.id}
                  title={getServiceTypeText(service.type)}
                  subtitle={`${service.vehicle} - ${service.date} | کیلومتر: ${service.mileage} - هزینه: ${service.cost} تومان`}
                  icon={<Schedule color="warning" />}
                  actions={
                    <Chip
                      label={getStatusText(service.status)}
                      color={getStatusColor(service.status)}
                      size="small"
                    />
                  }
                />
              ))}
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Box sx={{ display: "grid", gap: 1.25 }}>
              {filteredServices.map((service) => (
                <ListItemCard
                  key={service.id}
                  title={getServiceTypeText(service.type)}
                  subtitle={`${service.vehicle} - ${service.date} | کیلومتر: ${service.mileage} - هزینه: ${service.cost} تومان`}
                  icon={<Warning color="info" />}
                  actions={
                    <Chip
                      label={getStatusText(service.status)}
                      color={getStatusColor(service.status)}
                      size="small"
                    />
                  }
                />
              ))}
            </Box>
          </TabPanel>
        </CardContent>
      </Card>

      {/* Add Service Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>افزودن سرویس جدید</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel>نوع سرویس</InputLabel>
              <Select label="نوع سرویس">
                <MenuItem value="oil_change">تعویض روغن</MenuItem>
                <MenuItem value="filter_change">تعویض فیلتر</MenuItem>
                <MenuItem value="inspection">بررسی فنی</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>خودرو</InputLabel>
              <Select label="خودرو">
                <MenuItem value="peugeot_206">پژو 206</MenuItem>
                <MenuItem value="samand">سمند</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="تاریخ"
              type="date"
              InputLabelProps={{ shrink: true }}
            />
            <TextField fullWidth label="کیلومتر" />
          </Box>
          <TextField fullWidth label="توضیحات" multiline rows={3} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>انصراف</Button>
          <Button variant="contained" onClick={() => setOpenDialog(false)}>
            افزودن
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add service"
        sx={{ position: "fixed", bottom: 80, right: 16 }}
        onClick={() => setOpenDialog(true)}
      >
        <Add />
      </Fab>
    </Box>
  );
}
