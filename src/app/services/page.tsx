"use client";

import React, { useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
  Stack,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import {
  AppContainer,
  Header,
  ResponsiveContainer,
  SectionHeader,
  PersianDatePicker,
} from "@/components/ui";
import {
  vehicleService,
  ServiceVisitResponse,
  UserVehicleResponse,
} from "@/services/vehicleService";

export default function ServicesHubPage() {
  const [vehicleFilter, setVehicleFilter] = useState<number | "all">("all");
  const [typeFilter, setTypeFilter] = useState<
    "all" | "oil_change" | "oil_filter"
  >("all");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [sortBy, setSortBy] = useState<
    "date_desc" | "date_asc" | "mileage_desc" | "mileage_asc"
  >("date_desc");
  const [visibleCount, setVisibleCount] = useState<number>(20);

  const { data: vehicles, isLoading: isLoadingVehicles } = useQuery({
    queryKey: ["userVehicles"],
    queryFn: vehicleService.getUserVehicles,
  });

  const { data: visitsByVehicle, isLoading: isLoadingVisits } = useQuery({
    queryKey: ["allServiceVisits"],
    queryFn: async () => {
      const result: Record<number, ServiceVisitResponse[]> = {};
      const list = await vehicleService.getUserVehicles();
      await Promise.all(
        list.map(async (v) => {
          const visits = await vehicleService.listServiceVisits(v.id);
          result[v.id] = visits;
        })
      );
      return result;
    },
  });

  const flatVisits = useMemo(() => {
    if (!visitsByVehicle)
      return [] as Array<
        ServiceVisitResponse & { vehicle: UserVehicleResponse }
      >;
    const arr: Array<ServiceVisitResponse & { vehicle: UserVehicleResponse }> =
      [];
    (vehicles || []).forEach((veh) => {
      const vs = visitsByVehicle[veh.id] || [];
      vs.forEach((v) => arr.push({ ...v, vehicle: veh }));
    });
    return arr;
  }, [visitsByVehicle, vehicles]);

  const filtered = useMemo(() => {
    let list = flatVisits.filter((v) => {
      if (vehicleFilter !== "all" && v.user_vehicle_id !== vehicleFilter)
        return false;
      if (typeFilter === "oil_change" && !v.oil_change) return false;
      if (typeFilter === "oil_filter" && !v.oil_filter) return false;
      return true;
    });

    // Date range filter (YYYY-MM-DD string compare works lexicographically)
    if (fromDate) list = list.filter((v) => v.service_date >= fromDate);
    if (toDate) list = list.filter((v) => v.service_date <= toDate);

    // Sort
    list = [...list].sort((a, b) => {
      switch (sortBy) {
        case "date_asc":
          return a.service_date.localeCompare(b.service_date);
        case "mileage_desc":
          return b.service_mileage - a.service_mileage;
        case "mileage_asc":
          return a.service_mileage - b.service_mileage;
        case "date_desc":
        default:
          return b.service_date.localeCompare(a.service_date);
      }
    });

    return list;
  }, [flatVisits, vehicleFilter, typeFilter, fromDate, toDate, sortBy]);

  const getStatus = (
    v: ServiceVisitResponse & { vehicle?: UserVehicleResponse }
  ) => {
    const today = new Date().toISOString().slice(0, 10);
    const currentMileage = v.vehicle?.current_mileage ?? undefined;

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
          reason = reason || `تا ${Math.ceil(days)} روز`;
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
          if (status !== "overdue") status = "dueSoon";
          if (!reason) reason = `حدود ${diff.toLocaleString()} کیلومتر`;
        }
      }
    }

    return { status, reason };
  };

  return (
    <AppContainer
      header={
        <Header title="سرویس‌ها" subtitle="مرکز مدیریت سرویس‌ها" showBack />
      }
    >
      <ResponsiveContainer padding="medium" fullHeight={false}>
        {isLoadingVehicles || isLoadingVisits ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <SectionHeader title="فیلترها" />
            <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel>خودرو</InputLabel>
                <Select
                  label="خودرو"
                  value={vehicleFilter}
                  onChange={(e) => setVehicleFilter(e.target.value as any)}
                >
                  <MenuItem value="all">همه</MenuItem>
                  {(vehicles || []).map((v) => (
                    <MenuItem key={v.id} value={v.id}>
                      {v.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel>نوع سرویس</InputLabel>
                <Select
                  label="نوع سرویس"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as any)}
                >
                  <MenuItem value="all">همه</MenuItem>
                  <MenuItem value="oil_change">تعویض روغن</MenuItem>
                  <MenuItem value="oil_filter">تعویض فیلتر روغن</MenuItem>
                </Select>
              </FormControl>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PersianDatePicker
                  label="از تاریخ"
                  value={fromDate}
                  onChange={setFromDate}
                />
                <PersianDatePicker
                  label="تا تاریخ"
                  value={toDate}
                  onChange={setToDate}
                />
              </Box>
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>مرتب‌سازی</InputLabel>
                <Select
                  label="مرتب‌سازی"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                >
                  <MenuItem value="date_desc">تاریخ (جدیدترین)</MenuItem>
                  <MenuItem value="date_asc">تاریخ (قدیمی‌ترین)</MenuItem>
                  <MenuItem value="mileage_desc">کیلومتر (بیشترین)</MenuItem>
                  <MenuItem value="mileage_asc">کیلومتر (کمترین)</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {filtered.length === 0 ? (
              <Alert severity="info">سرویسی مطابق فیلترها یافت نشد.</Alert>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {filtered.slice(0, visibleCount).map((v) => (
                  <Card key={`${v.user_vehicle_id}-${v.id}`} variant="outlined">
                    <CardContent>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        justifyContent="space-between"
                      >
                        <Typography variant="subtitle2">
                          {v.service_date} •{" "}
                          {v.service_mileage.toLocaleString()} کیلومتر
                        </Typography>
                        {(() => {
                          const { status, reason } = getStatus(v);
                          if (status === "overdue")
                            return (
                              <Chip
                                color="error"
                                size="small"
                                label={`سررسید (${reason})`}
                              />
                            );
                          if (status === "dueSoon")
                            return (
                              <Chip
                                color="warning"
                                size="small"
                                label={`نزدیک سررسید (${reason})`}
                              />
                            );
                          return null;
                        })()}
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {v.vehicle?.name}
                      </Typography>
                      {(v.oil_change || v.oil_filter) && (
                        <Typography variant="body2" color="text.secondary">
                          {v.oil_change ? "تعویض روغن" : ""}
                          {v.oil_change && v.oil_filter ? " • " : ""}
                          {v.oil_filter ? "تعویض فیلتر روغن" : ""}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                ))}
                {filtered.length > visibleCount && (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mt: 1 }}
                  >
                    <Button
                      variant="outlined"
                      onClick={() => setVisibleCount((c) => c + 20)}
                    >
                      نمایش موارد بیشتر
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          </>
        )}
      </ResponsiveContainer>
    </AppContainer>
  );
}
