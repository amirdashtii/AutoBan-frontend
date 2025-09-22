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
  Chip,
  Stack,
  Button,
  Fab,
} from "@mui/material";
import { Build, ExpandMore, Add as AddIcon } from "@mui/icons-material";
import { useRouter, useParams } from "next/navigation";
import {
  AppContainer,
  Header,
  ResponsiveContainer,
  ListItemInfo,
} from "@/components/ui";
import { IranLicensePlate } from "@/components/ui";
import {
  vehicleService,
  UserVehicleResponse,
  ServiceVisitResponse,
} from "@/services/vehicleService";
import {
  formatToPersianDate,
  formatToPersianDateNumeric,
} from "@/utils/dateUtils";

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

  // Service visits for this vehicle
  const { data: visits, isLoading: isVisitsLoading } = useQuery({
    queryKey: ["serviceVisits", vehicleId],
    queryFn: () => vehicleService.listServiceVisits(Number(vehicleId)),
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
            <Box sx={{ display: "flex", flexDirection: "column", pt: 10 }}>
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
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              my: 2,
            }}
          >
            <Typography variant="h6" color="text.secondary">
              سرویس‌های خودرو
            </Typography>
            <Button
              size="small"
              onClick={() => router.push(`/services?vehicleId=${vehicle?.id}`)}
            >
              مشاهده همه سرویس‌ها
            </Button>
          </Box>
          {isVisitsLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress />
            </Box>
          ) : !visits || visits.length === 0 ? (
            <Alert severity="info">برای این خودرو سرویس ثبت نشده است.</Alert>
          ) : (
            <List sx={{ backgroundColor: "background.paper", borderRadius: 1 }}>
              {visits.map((v: ServiceVisitResponse) => {
                const today = new Date().toISOString().slice(0, 10);
                const currentMileage = vehicle?.current_mileage ?? undefined;
                const nextDates: string[] = [];
                const nextMileages: number[] = [];
                if (v.oil_change) {
                  if (v.oil_change.next_change_date)
                    nextDates.push(v.oil_change.next_change_date);
                  if (v.oil_change.next_change_mileage != null)
                    nextMileages.push(v.oil_change.next_change_mileage);
                }
                if (v.oil_filter) {
                  if (v.oil_filter.next_change_date)
                    nextDates.push(v.oil_filter.next_change_date);
                  if (v.oil_filter.next_change_mileage != null)
                    nextMileages.push(v.oil_filter.next_change_mileage);
                }
                let status: "ok" | "dueSoon" | "overdue" = "ok";
                let reason = "";
                if (nextDates.length > 0) {
                  const minDate = [...nextDates].sort()[0];
                  if (minDate < today) {
                    status = "overdue";
                    reason = `تاریخ ${minDate}`;
                  } else {
                    const dMin = new Date(minDate).getTime();
                    const dNow = new Date(today).getTime();
                    const days = (dMin - dNow) / (1000 * 60 * 60 * 24);
                    if (days <= 7) {
                      status = "dueSoon";
                      reason = `تا ${Math.ceil(days)} روز`;
                    }
                  }
                }
                if (currentMileage != null && nextMileages.length > 0) {
                  const minMil = Math.min(...nextMileages);
                  if (currentMileage > minMil) {
                    status = "overdue";
                    reason = `کیلومتر ${minMil.toLocaleString()}`;
                  } else {
                    const diff = minMil - currentMileage;
                    if (diff <= 500) {
                      status = status === "overdue" ? status : "dueSoon";
                      if (!reason)
                        reason = `حدود ${diff.toLocaleString()} کیلومتر`;
                    }
                  }
                }
                return (
                  <li
                    key={v.id}
                    style={{
                      listStyle: "none",
                      padding: "12px 16px",
                      borderBottom: "1px solid var(--mui-palette-divider)",
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography variant="subtitle2" color="text.primary">
                        {formatToPersianDateNumeric(v.service_date)} •{" "}
                        {v.service_mileage.toLocaleString()} کیلومتر
                      </Typography>
                      {status === "overdue" ? (
                        <Chip
                          color="error"
                          size="small"
                          label={`سررسید (${reason})`}
                        />
                      ) : status === "dueSoon" ? (
                        <Chip
                          color="warning"
                          size="small"
                          label={`نزدیک سررسید (${reason})`}
                        />
                      ) : null}
                    </Stack>
                    {(v.oil_change || v.oil_filter) && (
                      <Typography variant="body2" color="text.secondary">
                        {v.oil_change ? "تعویض روغن" : ""}
                        {v.oil_change && v.oil_filter ? " • " : ""}
                        {v.oil_filter ? "تعویض فیلتر روغن" : ""}
                      </Typography>
                    )}
                  </li>
                );
              })}
            </List>
          )}
        </Box>
      </ResponsiveContainer>
      {/* Floating add service button */}
      <Box
        sx={{
          position: "fixed",
          right: 16,
          bottom: 88,
          zIndex: 1200,
        }}
      >
        <Fab
          color="primary"
          variant="extended"
          onClick={() => router.push(`/vehicles/${vehicleId}/services/add`)}
        >
          <AddIcon sx={{ mr: 1 }} /> سرویس جدید
        </Fab>
      </Box>
    </AppContainer>
  );
}
