"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AppContainer,
  Header,
  ResponsiveContainer,
  SlideIn,
  FormField,
  LicensePlateInput,
  PersianDatePicker,
} from "@/components/ui";
import { IranLicensePlate } from "@/components/ui";
import { vehicleService, UserVehicleRequest } from "@/services/vehicleService";
import { formatToPersianDate } from "@/utils/dateUtils";

interface VehicleFormData {
  name: string;
  productionYear: number | null;
  color: string;
  licensePlate: string;
  vin: string;
  currentMileage: number | null;
  purchaseDate: string;
}

export default function EditVehicle() {
  const router = useRouter();
  const params = useParams();
  const vehicleId = params?.id as string;
  const queryClient = useQueryClient();
  const [isEditingPurchaseDate, setIsEditingPurchaseDate] = useState(false);

  // Fetch vehicle details
  const {
    data: vehicle,
    isLoading: vehicleLoading,
    error: vehicleError,
  } = useQuery({
    queryKey: ["userVehicle", vehicleId],
    queryFn: () => vehicleService.getUserVehicle(Number(vehicleId)),
    enabled: !!vehicleId,
  });

  // Form state
  const [formData, setFormData] = useState<VehicleFormData>({
    name: "",
    productionYear: null,
    color: "",
    licensePlate: "",
    vin: "",
    currentMileage: null,
    purchaseDate: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: Partial<UserVehicleRequest>) =>
      vehicleService.updateUserVehicle(Number(vehicleId), data),
    onSuccess: () => {
      // Invalidate and refetch vehicle data
      queryClient.invalidateQueries({ queryKey: ["userVehicle", vehicleId] });
      queryClient.invalidateQueries({ queryKey: ["userVehicles"] });
      router.back();
    },
    onError: (error: any) => {
      console.error("Error updating vehicle:", error);
      setErrors({
        submit: "خطا در ویرایش خودرو. لطفاً دوباره تلاش کنید.",
      });
    },
  });

  // Initialize form data when vehicle loads
  useEffect(() => {
    if (vehicle) {
      setFormData({
        name: vehicle.name,
        productionYear: vehicle.production_year || null,
        color: vehicle.color || "",
        licensePlate: vehicle.license_plate || "",
        vin: vehicle.vin || "",
        currentMileage: vehicle.current_mileage || null,
        purchaseDate: vehicle.purchase_date
          ? new Date(vehicle.purchase_date).toISOString().split("T")[0]
          : "",
      });
    }
  }, [vehicle]);

  const handleInputChange = (field: string) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "نام خودرو الزامی است";
    }

    if (
      formData.productionYear &&
      (formData.productionYear < 1300 ||
        formData.productionYear > new Date().getFullYear())
    ) {
      newErrors.productionYear = "سال تولید معتبر نیست";
    }

    if (formData.currentMileage !== null && formData.currentMileage < 0) {
      newErrors.currentMileage = "کیلومتر فعلی معتبر نیست";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const updateData: Partial<UserVehicleRequest> = {
      name: formData.name,
      production_year: formData.productionYear
        ? parseInt(formData.productionYear.toString())
        : undefined,
      color: formData.color || undefined,
      license_plate: formData.licensePlate || undefined,
      vin: formData.vin || undefined,
      current_mileage: formData.currentMileage
        ? parseInt(formData.currentMileage.toString())
        : undefined,
      purchase_date: formData.purchaseDate || undefined,
    };

    updateMutation.mutate(updateData);
  };

  if (vehicleLoading) {
    return (
      <AppContainer>
        <Header
          title="ویرایش خودرو"
          showBack
          onBackClick={() => router.back()}
        />

        <ResponsiveContainer padding="medium" fullHeight={false}>
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        </ResponsiveContainer>
      </AppContainer>
    );
  }

  if (vehicleError || !vehicle) {
    return (
      <AppContainer>
        <Header
          title="ویرایش خودرو"
          showBack
          onBackClick={() => router.back()}
        />

        <ResponsiveContainer padding="medium" fullHeight={false}>
          <Alert severity="error">
            خطا در بارگذاری اطلاعات خودرو. لطفاً دوباره تلاش کنید.
          </Alert>
        </ResponsiveContainer>
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <Header
        title="ویرایش خودرو"
        showCancelButton
        onCancelClick={() => router.back()}
        showSaveButton
        onSaveClick={handleSubmit}
        isSaving={updateMutation.isPending}
        isSaveDisabled={updateMutation.isPending}
      />
      <ResponsiveContainer padding="medium" fullHeight={false}>
        {/* Error Alert */}
        {errors.submit && (
          <SlideIn direction="up" delay={50}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.submit}
            </Alert>
          </SlideIn>
        )}

        {/* Edit Form */}
        <SlideIn direction="up" delay={100}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  py: 8,
                }}
              >
                {/* Vehicle Info Display */}
                <Box sx={{ textAlign: "center", mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {vehicle.type?.name_fa} {vehicle.brand?.name_fa}{" "}
                    {vehicle.model?.name_fa}
                  </Typography>
                  {vehicle.generation && (
                    <Typography variant="body2" color="text.secondary">
                      {vehicle.generation.name_fa}
                    </Typography>
                  )}
                </Box>

                {/* License Plate Preview */}
                {formData.licensePlate && (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mb: 2 }}
                  >
                    <IranLicensePlate
                      value={formData.licensePlate}
                      vehicleType={
                        vehicle.type?.name_fa === "موتورسیکلت"
                          ? "motorcycle"
                          : "car"
                      }
                    />
                  </Box>
                )}

                {/* Form Fields */}
                <List
                  sx={{
                    backgroundColor: "background.paper",
                    borderRadius: 1,
                  }}
                >
                  <FormField
                    value={formData.name}
                    onChange={handleInputChange("name")}
                    placeholder={`نام ${vehicle.type?.name_fa}*`}
                    showCancelIcon
                    onCancel={() => handleInputChange("name")("")}
                    error={!!errors.name}
                    helperText={errors.name}
                  />
                  <FormField
                    value={formData.currentMileage}
                    onChange={handleInputChange("currentMileage")}
                    placeholder="کیلومتر فعلی"
                    showCancelIcon
                    onCancel={() => handleInputChange("currentMileage")("")}
                    error={!!errors.currentMileage}
                    helperText={errors.currentMileage}
                    endText="کیلومتر"
                    type="number"
                  />
                  <FormField
                    value={formData.productionYear}
                    onChange={handleInputChange("productionYear")}
                    placeholder="سال تولید"
                    showCancelIcon
                    onCancel={() => handleInputChange("productionYear")("")}
                    error={!!errors.productionYear}
                    helperText={errors.productionYear}
                    slotProps={{
                      htmlInput: {
                        min: 1000,
                        max: new Date().getFullYear(),
                      },
                    }}
                    type="number"
                  />
                  <FormField
                    value={formData.color}
                    onChange={handleInputChange("color")}
                    placeholder="رنگ خودرو"
                    showCancelIcon
                    onCancel={() => handleInputChange("color")("")}
                    error={!!errors.color}
                    helperText={errors.color}
                  />
                  <FormField
                    value={formData.vin}
                    onChange={handleInputChange("vin")}
                    placeholder="شماره شاسی (VIN)"
                    showCancelIcon
                    onCancel={() => handleInputChange("vin")("")}
                    showDivider={false}
                  />
                </List>
                <List
                  sx={{
                    backgroundColor: "background.paper",
                    borderRadius: 1,
                  }}
                >
                  <LicensePlateInput
                    value={formData.licensePlate}
                    onChange={handleInputChange("licensePlate")}
                    vehicleType={vehicle.type?.name_fa}
                    error={!!errors.licensePlate}
                    helperText={errors.licensePlate}
                  />
                </List>

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
                        primary="تاریخ خرید"
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
                          formatToPersianDate(formData.purchaseDate) ||
                          "تاریخ خرید مشخص نیست"
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
                      label="تاریخ خرید"
                      value={formData.purchaseDate}
                      onChange={(newDate) => {
                        handleInputChange("purchaseDate")(newDate);
                      }}
                      placeholder="تاریخ خرید خود را انتخاب کنید"
                      showAge={true}
                    />
                  )}
                </List>
              </Box>
            </CardContent>
          </Card>
        </SlideIn>
      </ResponsiveContainer>
    </AppContainer>
  );
}
