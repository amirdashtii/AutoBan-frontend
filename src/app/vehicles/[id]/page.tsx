"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
} from "@mui/material";
import { Build, ExpandMore } from "@mui/icons-material";
import { useRouter, useParams } from "next/navigation";
import {
  AppContainer,
  Header,
  ResponsiveContainer,
  ListItemInfo,
} from "@/components/ui";
import { IranLicensePlate } from "@/components/ui";
import { vehicleService, UserVehicleResponse } from "@/services/vehicleService";
import { formatToPersianDate } from "@/utils/dateUtils";

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

  return (
    <AppContainer>
      <Header
        title={vehicle?.name || "جزئیات خودرو"}
        subtitle={`مشاهده اطلاعات کامل ${vehicle?.type?.name_fa}`}
        showBack
        showEditButton
        onEditClick={() => router.push(`/vehicles/${vehicleId}/edit`)}
      />

      <ResponsiveContainer padding="medium" fullHeight={false}>
        {/* Loading State */}
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
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
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, py: 10 }}
            >
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
                      <List
                        sx={{
                          my: 2,
                          backgroundColor: "background.paper",
                          borderRadius: 1,
                        }}
                      >
                        {/* Basic Info */}
                        <ListItemInfo
                          label="سال تولید"
                          value={vehicle?.production_year || ""}
                        />
                        <ListItemInfo
                          label="تاریخ خرید"
                          value={
                            formatToPersianDate(vehicle?.purchase_date) ||
                            "تاریخ خرید مشخص نیست"
                          }
                        />
                        <ListItemInfo
                          label="کیلومتر فعلی"
                          value={
                            vehicle?.current_mileage?.toLocaleString() || ""
                          }
                        />
                        {vehicle.color && (
                          <ListItemInfo
                            label="رنگ"
                            value={vehicle?.color || ""}
                          />
                        )}
                        {vehicle.vin && (
                          <ListItemInfo
                            label="شماره شاسی"
                            value={vehicle?.vin || ""}
                          />
                        )}
                        {/* Technical Specs */}
                        <ListItemInfo
                          label="موتور"
                          value={vehicle?.generation?.engine || ""}
                        />
                        <ListItemInfo
                          label="نوع سوخت"
                          value={vehicle?.generation?.fuel_type || ""}
                        />
                        <ListItemInfo
                          label="گیربکس"
                          value={vehicle?.generation?.gearbox || ""}
                        />
                        <ListItemInfo
                          label="بدنه"
                          value={vehicle?.generation?.body_style_fa || ""}
                        />
                      </List>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              )}
            </Box>
          </>
        )}

        {/* Services */}
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Build sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            سرویس‌های خودرو
          </Typography>
          <Typography variant="body2" color="text.secondary">
            لیست سرویس‌ها و تعمیرات پس از پیاده‌سازی API نمایش داده خواهد شد
          </Typography>
        </Box>
      </ResponsiveContainer>
    </AppContainer>
  );
}
