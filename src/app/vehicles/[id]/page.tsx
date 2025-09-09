"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Button,
  Tabs,
  Tab,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  DirectionsCar,
  Build,
  Edit,
  Timeline,
  ExpandMore,
} from "@mui/icons-material";
import { useRouter, useParams } from "next/navigation";
import {
  AppContainer,
  Header,
  ResponsiveContainer,
  EditButton,
} from "@/components/ui";
import { IranLicensePlate } from "@/components/ui";
import { vehicleService, UserVehicleResponse } from "@/services/vehicleService";

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
      id={`vehicle-tabpanel-${index}`}
      aria-labelledby={`vehicle-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

export default function VehicleDetails() {
  const router = useRouter();
  const params = useParams();
  const vehicleId = params?.id as string;

  // Fetch vehicle details from backend
  const {
    data: vehicle,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userVehicle", vehicleId],
    queryFn: () => vehicleService.getUserVehicle(Number(vehicleId)),
    enabled: !!vehicleId,
  });

  // State management
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <AppContainer
      header={
        <Header
          title={vehicle?.name || "جزئیات خودرو"}
          subtitle="مشاهده اطلاعات کامل خودرو"
          showBack
          onBackClick={() => router.back()}
          leftActions={[
            <EditButton
              key="edit"
              onClick={() =>
                router.push(`/vehicles/${vehicleId}/edit`)
              }
              variant="text"
              size="small"
              disabled={!vehicle}
            />,
          ]}
        />
      }
    >
      <ResponsiveContainer padding="medium" fullHeight={false}>
        {/* Loading State */}
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            خطا در بارگذاری اطلاعات خودرو. لطفاً دوباره تلاش کنید.
          </Alert>
        ) : !vehicle ? (
          <Alert severity="warning" sx={{ mb: 3 }}>
            خودروی مورد نظر یافت نشد.
          </Alert>
        ) : (
          <>
            {/* Vehicle Info Card */}

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {/* Vehicle Name and Type */}
              <Box sx={{ textAlign: "center", mb: 2 }}>
                <Typography variant="h5" color="text.secondary">
                  {vehicle.type?.name_fa} {vehicle.brand?.name_fa}{" "}
                  {vehicle.model?.name_fa} {vehicle.generation?.name_fa}
                </Typography>
              </Box>

              {/* License Plate */}
              {vehicle.license_plate && (
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                  <IranLicensePlate
                    value={vehicle.license_plate}
                    vehicleType={
                      vehicle.type?.name_fa === "موتورسیکلت"
                        ? "motorcycle"
                        : "car"
                    }
                  />
                </Box>
              )}

              {/* Technical Specs and Details Accordion */}
              {vehicle.generation && (
                <Box
                  sx={{
                    borderBottom: 1,
                    borderColor: "divider",
                    mt: 2,
                  }}
                >
                  <Accordion
                    elevation={0}
                    disableGutters
                    sx={{ bgcolor: "transparent" }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      sx={{
                        px: 0,
                        minHeight: "auto",
                        "& .MuiAccordionSummary-content": { my: 1 },
                        "&.Mui-expanded": { minHeight: "auto" },
                      }}
                    >
                      <Typography variant="subtitle1">مشخصات بیشتر</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: 0, pt: 0, pb: 1 }}>
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                          gap: 2,
                          mb: 3,
                        }}
                      >
                        {/* Basic Info */}
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            سال تولید
                          </Typography>
                          <Typography variant="body1">
                            {vehicle.production_year}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            کیلومتر فعلی
                          </Typography>
                          <Typography variant="body1">
                            {vehicle.current_mileage?.toLocaleString() || 0}{" "}
                            کیلومتر
                          </Typography>
                        </Box>

                        {vehicle.color && (
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              رنگ
                            </Typography>
                            <Typography variant="body1">
                              {vehicle.color}
                            </Typography>
                          </Box>
                        )}

                        {vehicle.vin && (
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              شماره شاسی
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{ wordBreak: "break-all" }}
                            >
                              {vehicle.vin}
                            </Typography>
                          </Box>
                        )}

                        {/* Technical Specs */}
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            موتور
                          </Typography>
                          <Typography variant="body1">
                            {vehicle.generation.engine}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            نوع سوخت
                          </Typography>
                          <Typography variant="body1">
                            {vehicle.generation.fuel_type}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            گیربکس
                          </Typography>
                          <Typography variant="body1">
                            {vehicle.generation.gearbox}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            بدنه
                          </Typography>
                          <Typography variant="body1">
                            {vehicle.generation.body_style_fa}
                          </Typography>
                        </Box>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              )}
            </Box>
          </>
        )}

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
            <Tab icon={<Timeline />} label="تاریخچه" />
            <Tab icon={<Build />} label="سرویس‌ها" />
          </Tabs>
        </Box>

        {/* History Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Timeline sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              تاریخچه خودرو
            </Typography>
            <Typography variant="body2" color="text.secondary">
              تاریخچه سرویس‌ها و تعمیرات پس از پیاده‌سازی API نمایش داده خواهد
              شد
            </Typography>
          </Box>
        </TabPanel>

        {/* Services Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Build sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              سرویس‌های خودرو
            </Typography>
            <Typography variant="body2" color="text.secondary">
              لیست سرویس‌ها و تعمیرات پس از پیاده‌سازی API نمایش داده خواهد شد
            </Typography>
          </Box>
        </TabPanel>
      </ResponsiveContainer>
    </AppContainer>
  );
}
