"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  Alert,
  Grid,
  Button,
  List,
  Switch,
  FormControlLabel,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import {
  AppContainer,
  Header,
  ResponsiveContainer,
  SectionHeader,
  SlideIn,
  PersianDatePicker,
  FormField,
} from "@/components/ui";
import {
  vehicleService,
  CreateServiceVisitRequest,
} from "@/services/vehicleService";
import { formatToPersianDate } from "@/utils/dateUtils";

export default function AddServiceVisitPage() {
  const router = useRouter();
  const params = useParams();
  const vehicleId = Number(params?.id);

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isEditingPurchaseDate, setIsEditingPurchaseDate] = useState(false);

  // Base visit
  const [serviceMileage, setServiceMileage] = useState<string>("");
  const [serviceDate, setServiceDate] = useState<string>("");
  const [serviceCenter, setServiceCenter] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  // Toggles
  const [withOilChange, setWithOilChange] = useState<boolean>(false);
  const [withOilFilter, setWithOilFilter] = useState<boolean>(false);

  // Oil change
  const [oilName, setOilName] = useState<string>("");
  const [nextOilMileage, setNextOilMileage] = useState<string>("");

  // Oil filter
  const [filterName, setFilterName] = useState<string>("");
  const [nextFilterMileage, setNextFilterMileage] = useState<string>("");

  // Calculate next service date (6 months from service date)
  const calculateNextServiceDate = (serviceDate: string): string => {
    if (!serviceDate) return "";
    try {
      const date = new Date(serviceDate);
      date.setMonth(date.getMonth() + 6);
      return date.toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (
      !serviceMileage ||
      isNaN(Number(serviceMileage)) ||
      Number(serviceMileage) < 0
    )
      e.serviceMileage = "کیلومتر سرویس معتبر نیست";
    if (!serviceDate) e.serviceDate = "تاریخ سرویس الزامی است";
    if (!withOilChange && !withOilFilter)
      e.services = "حداقل یک سرویس را انتخاب کنید";
    if (withOilChange && !oilName.trim()) e.oilName = "نام روغن الزامی است";
    if (withOilFilter && !filterName.trim())
      e.filterName = "نام فیلتر الزامی است";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload: CreateServiceVisitRequest = {
        user_vehicle_id: vehicleId,
        service_mileage: Number(serviceMileage),
        service_date: serviceDate,
        service_center: serviceCenter || undefined,
        notes: notes || undefined,
        oil_change: withOilChange
          ? {
              oil_name: oilName,
              next_change_mileage: nextOilMileage
                ? Number(nextOilMileage)
                : undefined,
              next_change_date: calculateNextServiceDate(serviceDate),
            }
          : undefined,
        oil_filter: withOilFilter
          ? {
              filter_name: filterName,
              next_change_mileage: nextFilterMileage
                ? Number(nextFilterMileage)
                : undefined,
              next_change_date: calculateNextServiceDate(serviceDate),
            }
          : undefined,
      };

      await vehicleService.createServiceVisit(vehicleId, payload);
      router.push(`/vehicles/${vehicleId}`);
    } catch (err: any) {
      setErrors({ submit: err?.message || "خطا در ثبت سرویس" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppContainer
      header={
        <Header
          title="افزودن سرویس"
          subtitle="ثبت سرویس برای خودرو"
          showCancelButton
          onCancelClick={() => router.back()}
          showSaveButton
          onSaveClick={handleSubmit}
          isSaving={saving}
          isSaveDisabled={saving}
        />
      }
    >
      <ResponsiveContainer padding="medium" fullHeight={false}>
        {errors.submit && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.submit}
          </Alert>
        )}

        <SlideIn direction="up">
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <List
              sx={{
                backgroundColor: "background.paper",
                borderRadius: 1,
              }}
            >
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() =>
                    setIsEditingPurchaseDate(!isEditingPurchaseDate)
                  }
                >
                  <ListItemText
                    primary="تاریخ سرویس"
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
                      formatToPersianDate(serviceDate) ||
                      "تاریخ سرویس مشخص نیست"
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
              {/* PersianDatePicker for purchaseDate editing */}
              {isEditingPurchaseDate && (
                <PersianDatePicker
                  label="تاریخ سرویس"
                  value={serviceDate}
                  onChange={setServiceDate}
                  placeholder="تاریخ سرویس خود را انتخاب کنید"
                  showAge={true}
                />
              )}

              {errors.serviceDate && (
                <Alert severity="warning" sx={{ mt: 1 }}>
                  {errors.serviceDate}
                </Alert>
              )}
            </List>
            <List sx={{ backgroundColor: "background.paper", borderRadius: 1 }}>
              <FormField
                value={serviceMileage}
                onChange={setServiceMileage}
                placeholder="کیلومتر سرویس"
                error={!!errors.serviceMileage}
                helperText={errors.serviceMileage}
                endText="کیلومتر"
                type="number"
              />

              <FormField
                value={serviceCenter}
                onChange={setServiceCenter}
                placeholder="مرکز سرویس (اختیاری)"
              />
              <FormField
                value={notes}
                onChange={setNotes}
                placeholder="یادداشت (اختیاری)"
                multiline
                rows={3}
                showDivider={false}
              />
            </List>

            {errors.services && (
              <Alert severity="warning">{errors.services}</Alert>
            )}
            <FormControlLabel
              control={
                <Switch
                  checked={withOilChange}
                  onChange={(e) => setWithOilChange(e.target.checked)}
                />
              }
              label="تعویض روغن"
            />
            {withOilChange && (
              <List
                sx={{ backgroundColor: "background.paper", borderRadius: 1 }}
              >
                <FormField
                  value={oilName}
                  onChange={setOilName}
                  placeholder="نام روغن *"
                  error={!!errors.oilName}
                  helperText={errors.oilName}
                />
                <FormField
                  value={nextOilMileage}
                  onChange={setNextOilMileage}
                  placeholder="کیلومتر سرویس بعد (روغن)"
                  type="number"
                  showDivider={false}
                />
              </List>
            )}

            <FormControlLabel
              control={
                <Switch
                  checked={withOilFilter}
                  onChange={(e) => setWithOilFilter(e.target.checked)}
                />
              }
              label="تعویض فیلتر روغن"
            />
            {withOilFilter && (
              <List
                sx={{ backgroundColor: "background.paper", borderRadius: 1 }}
              >
                <FormField
                  value={filterName}
                  onChange={setFilterName}
                  placeholder="نام فیلتر *"
                  error={!!errors.filterName}
                  helperText={errors.filterName}
                />
                <FormField
                  value={nextFilterMileage}
                  onChange={setNextFilterMileage}
                  placeholder="کیلومتر سرویس بعد (فیلتر)"
                  type="number"
                  showDivider={false}
                />
              </List>
            )}
          </Box>

          {errors.submit && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errors.submit}
            </Alert>
          )}
        </SlideIn>
      </ResponsiveContainer>
    </AppContainer>
  );
}
