"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Alert,
  Grid,
  CircularProgress,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AppContainer,
  Header,
  ResponsiveContainer,
  SlideIn,
  SaveButton,
  CancelButton,
} from "@/components/ui";
import { IranLicensePlate } from "@/components/ui";
import {
  vehicleService,
  UserVehicleResponse,
  CreateUserVehicleRequest,
} from "@/services/vehicleService";

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
    mutationFn: (data: Partial<CreateUserVehicleRequest>) =>
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

  const handleInputChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
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

    const updateData: Partial<CreateUserVehicleRequest> = {
      name: formData.name,
      production_year: formData.productionYear || undefined,
      color: formData.color || undefined,
      license_plate: formData.licensePlate || undefined,
      vin: formData.vin || undefined,
      current_mileage: formData.currentMileage || undefined,
      purchase_date: formData.purchaseDate || undefined,
    };

    updateMutation.mutate(updateData);
  };

  if (vehicleLoading) {
    return (
      <AppContainer
        header={
          <Header
            title="ویرایش خودرو"
            showBack
            onBackClick={() => router.back()}
          />
        }
      >
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
      <AppContainer
        header={
          <Header
            title="ویرایش خودرو"
            showBack
            onBackClick={() => router.back()}
          />
        }
      >
        <ResponsiveContainer padding="medium" fullHeight={false}>
          <Alert severity="error">
            خطا در بارگذاری اطلاعات خودرو. لطفاً دوباره تلاش کنید.
          </Alert>
        </ResponsiveContainer>
      </AppContainer>
    );
  }

  return (
    <AppContainer
      header={
        <Header
          title="ویرایش خودرو"
          subtitle={vehicle.name}
          showBack
          onBackClick={() => router.back()}
        />
      }
    >
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
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
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
                <TextField
                  fullWidth
                  label="نام خودرو *"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  error={!!errors.name}
                  helperText={errors.name}
                />

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="سال تولید"
                      type="number"
                      slotProps={{
                        htmlInput: {
                          min: 1300,
                          max: new Date().getFullYear(),
                        },
                      }}
                      value={formData.productionYear || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "productionYear",
                          parseInt(e.target.value) || null
                        )
                      }
                      error={!!errors.productionYear}
                      helperText={errors.productionYear}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="رنگ خودرو"
                      value={formData.color}
                      onChange={(e) =>
                        handleInputChange("color", e.target.value)
                      }
                    />
                  </Grid>
                </Grid>

                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    پلاک {vehicle.type?.name_fa || "خودرو"}
                  </Typography>
                  {vehicle.type?.name_fa === "موتورسیکلت" ? (
                    // Motorcycle license plate format (2 rows)
                    <Box sx={{ mb: 2 }} dir="ltr">
                      <Grid container spacing={1} sx={{ mb: 1 }}>
                        <Grid size={12}>
                          <TextField
                            fullWidth
                            label="شماره بالا (۳ رقم)"
                            value={formData.licensePlate.split("-")[0] || ""}
                            onChange={(e) => {
                              const parts = formData.licensePlate.split("-");
                              parts[0] = e.target.value;
                              const newPlate = parts.join("-");
                              handleInputChange("licensePlate", newPlate);
                            }}
                            slotProps={{ htmlInput: { maxLength: 3 } }}
                            placeholder="123"
                          />
                        </Grid>
                      </Grid>
                      <Grid container spacing={1}>
                        <Grid size={12}>
                          <TextField
                            fullWidth
                            label="شماره پایین (۵ رقم)"
                            value={formData.licensePlate.split("-")[1] || ""}
                            onChange={(e) => {
                              const parts = formData.licensePlate.split("-");
                              parts[1] = e.target.value;
                              const newPlate = parts.join("-");
                              handleInputChange("licensePlate", newPlate);
                            }}
                            slotProps={{ htmlInput: { maxLength: 5 } }}
                            placeholder="12345"
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  ) : (
                    // Car license plate format (4 parts in one row)
                    <Grid container spacing={1} sx={{ mb: 2 }} dir="ltr">
                      <Grid size={3}>
                        <TextField
                          fullWidth
                          label="دو رقم"
                          value={formData.licensePlate.split("-")[0] || ""}
                          onChange={(e) => {
                            const parts = formData.licensePlate.split("-");
                            parts[0] = e.target.value;
                            const newPlate = parts.join("-");
                            handleInputChange("licensePlate", newPlate);
                          }}
                          slotProps={{ htmlInput: { maxLength: 2 } }}
                          placeholder="12"
                        />
                      </Grid>
                      <Grid size={3}>
                        <FormControl fullWidth>
                          <InputLabel>حرف</InputLabel>
                          <Select
                            value={formData.licensePlate.split("-")[1] || ""}
                            onChange={(e) => {
                              const parts = formData.licensePlate.split("-");
                              parts[1] = e.target.value;
                              const newPlate = parts.join("-");
                              handleInputChange("licensePlate", newPlate);
                            }}
                            label="حرف"
                          >
                            {[
                              { display: "الف", value: "الف" },
                              { display: "ب", value: "ب" },
                              { display: "پ", value: "پ" },
                              { display: "ت", value: "ت" },
                              { display: "ث", value: "ث" },
                              { display: "ج", value: "ج" },
                              { display: "د", value: "د" },
                              { display: "ز", value: "ز" },
                              {
                                display: (
                                  <span style={{ fontSize: "2em" }}>♿︎</span>
                                ),
                                value: "ژ",
                              },
                              { display: "س", value: "س" },
                              { display: "ش", value: "ش" },
                              { display: "ص", value: "ص" },
                              { display: "ط", value: "ط" },
                              { display: "ع", value: "ع" },
                              { display: "ف", value: "ف" },
                              { display: "ق", value: "ق" },
                              { display: "ک", value: "ک" },
                              { display: "گ", value: "گ" },
                              { display: "ل", value: "ل" },
                              { display: "م", value: "م" },
                              { display: "ن", value: "ن" },
                              { display: "و", value: "و" },
                              { display: "ه", value: "ه" },
                              { display: "ی", value: "ی" },
                              { display: "D", value: "D" },
                              { display: "S", value: "S" },
                            ].map((item) => (
                              <MenuItem key={item.value} value={item.value}>
                                {item.display}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid size={3}>
                        <TextField
                          fullWidth
                          label="سه رقم"
                          value={formData.licensePlate.split("-")[2] || ""}
                          onChange={(e) => {
                            const parts = formData.licensePlate.split("-");
                            parts[2] = e.target.value;
                            const newPlate = parts.join("-");
                            handleInputChange("licensePlate", newPlate);
                          }}
                          slotProps={{ htmlInput: { maxLength: 3 } }}
                          placeholder="345"
                        />
                      </Grid>
                      <Grid size={3}>
                        <TextField
                          fullWidth
                          label="ایران"
                          value={formData.licensePlate.split("-")[3] || ""}
                          onChange={(e) => {
                            const parts = formData.licensePlate.split("-");
                            parts[3] = e.target.value;
                            const newPlate = parts.join("-");
                            handleInputChange("licensePlate", newPlate);
                          }}
                          slotProps={{ htmlInput: { maxLength: 2 } }}
                          placeholder="98"
                        />
                      </Grid>
                    </Grid>
                  )}
                </Box>

                <TextField
                  fullWidth
                  label="شماره شاسی (VIN)"
                  value={formData.vin}
                  onChange={(e) => handleInputChange("vin", e.target.value)}
                />

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="کیلومتر فعلی"
                      type="number"
                      slotProps={{
                        htmlInput: { min: 0 },
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              کیلومتر
                            </InputAdornment>
                          ),
                        },
                      }}
                      value={formData.currentMileage || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "currentMileage",
                          parseInt(e.target.value) || null
                        )
                      }
                      error={!!errors.currentMileage}
                      helperText={errors.currentMileage}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="تاریخ خرید"
                      type="date"
                      slotProps={{ inputLabel: { shrink: true } }}
                      value={formData.purchaseDate}
                      onChange={(e) =>
                        handleInputChange("purchaseDate", e.target.value)
                      }
                    />
                  </Grid>
                </Grid>

                {/* Action Buttons */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 4,
                  }}
                >
                  <CancelButton onClick={() => router.back()} />

                  <SaveButton
                    onClick={handleSubmit}
                    loading={updateMutation.isPending}
                    loadingText="در حال ذخیره..."
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </SlideIn>
      </ResponsiveContainer>
    </AppContainer>
  );
}
