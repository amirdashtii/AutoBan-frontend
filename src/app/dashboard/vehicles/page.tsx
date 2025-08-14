"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Snackbar,
  Alert as MuiAlert,
} from "@mui/material";
import { DirectionsCar, Add } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "@/hooks/useAuth";
import InactiveUserRestriction from "@/components/InactiveUserRestriction";
import { VehicleService } from "@/services/vehicleService";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFnsJalali } from "@mui/x-date-pickers/AdapterDateFnsJalali";
import {
  UserVehicle,
  CompleteVehicleHierarchy,
  CreateUserVehicleRequest,
  UpdateUserVehicleRequest,
} from "@/types/api";
import { SearchField, ListItemCard, EmptyState } from "@/components/ui";
import { useRouter } from "next/navigation";

export default function Vehicles() {
  const theme = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const [vehicles, setVehicles] = useState<UserVehicle[]>([]);
  const [hierarchy, setHierarchy] = useState<CompleteVehicleHierarchy | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<UserVehicle | null>(
    null
  );
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");

  // Pull-to-refresh state
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startYRef = useRef<number | null>(null);

  // Form states
  const [formData, setFormData] = useState<CreateUserVehicleRequest>({
    name: "",
    generation_id: 0,
    production_year: undefined,
    color: "",
    license_plate: "",
    vin: "",
    current_mileage: undefined,
    purchase_date: "",
  });

  // Selection states for cascading dropdowns
  const [selectedType, setSelectedType] = useState<number | "">("");
  const [selectedBrand, setSelectedBrand] = useState<number | "">("");
  const [selectedModel, setSelectedModel] = useState<number | "">("");

  // Stepper state
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["انتخاب خودرو از کاتالوگ", "اطلاعات تکمیلی"];

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const atTop = window.scrollY === 0;
    if (atTop) {
      startYRef.current = e.touches[0].clientY;
      setIsPulling(true);
      setPullDistance(0);
    } else {
      startYRef.current = null;
      setIsPulling(false);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isPulling || startYRef.current == null) return;
    const delta = e.touches[0].clientY - startYRef.current;
    if (delta > 0) {
      setPullDistance(Math.min(delta, 100));
    }
  };

  const handleTouchEnd = async () => {
    if (!isPulling) return;
    const threshold = 60;
    const shouldRefresh = pullDistance > threshold;
    setIsPulling(false);
    setPullDistance(0);
    if (shouldRefresh) {
      await loadData();
    }
  };

  // Auto-suggest vehicle name based on selected generation
  useEffect(() => {
    if (formData.generation_id && hierarchy) {
      for (const type of hierarchy.vehicle_types) {
        for (const brand of type.brands) {
          for (const model of brand.models) {
            const generation = model.generations.find(
              (g) => g.id === formData.generation_id
            );
            if (generation) {
              const suggestedName = `${brand.name_fa} ${model.name_fa} ${generation.name_fa}`;
              setFormData((prev) => ({ ...prev, name: suggestedName }));
              return;
            }
          }
        }
      }
    }
  }, [formData.generation_id, hierarchy]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [vehiclesData, hierarchyData] = await Promise.all([
        VehicleService.getUserVehicles(),
        VehicleService.getVehicleHierarchy(),
      ]);
      setVehicles(vehiclesData.vehicles);
      setHierarchy(hierarchyData);
    } catch (err) {
      setError("خطا در بارگذاری اطلاعات خودروها");
      console.error("Error loading vehicles:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = () => {
    setEditingVehicle(null);
    setFormData({
      name: "",
      generation_id: 0,
      production_year: undefined,
      color: "",
      license_plate: "",
      vin: "",
      current_mileage: undefined,
      purchase_date: "",
    });
    setSelectedType("");
    setSelectedBrand("");
    setSelectedModel("");
    setActiveStep(0);
    setError(null);
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    console.log("📝 فرم داده‌ها:", formData);

    if (!formData.generation_id) {
      setError("لطفاً نوع خودرو، برند، مدل و نسخه را انتخاب کنید");
      return;
    }

    if (!formData.name.trim()) {
      setError("لطفاً نام خودرو را وارد کنید");
      return;
    }

    try {
      setSaving(true);
      const submitData: Partial<UpdateUserVehicleRequest> = {};
      if (formData.name && formData.name.trim() !== "")
        submitData.name = formData.name.trim();
      if (formData.generation_id)
        submitData.generation_id = formData.generation_id;
      if (typeof formData.production_year === "number") {
        submitData.production_year = formData.production_year;
      }
      if (formData.color && formData.color.trim() !== "")
        submitData.color = formData.color.trim();
      if (formData.license_plate && formData.license_plate.trim() !== "")
        submitData.license_plate = formData.license_plate.trim();
      if (formData.vin && formData.vin.trim() !== "")
        submitData.vin = formData.vin.trim();
      if (typeof formData.current_mileage === "number")
        submitData.current_mileage = formData.current_mileage;
      if (formData.purchase_date && formData.purchase_date.trim() !== "") {
        submitData.purchase_date = formData.purchase_date.slice(0, 10);
      }

      if (editingVehicle) {
        await VehicleService.updateUserVehicle(
          editingVehicle.id,
          submitData as UpdateUserVehicleRequest
        );
        await loadData();
        setSnackbar({
          open: true,
          message: "خودرو با موفقیت ویرایش شد",
          severity: "success",
        });
      } else {
        const createPayload: CreateUserVehicleRequest = {
          name: submitData.name || formData.name,
          generation_id: submitData.generation_id || formData.generation_id,
          production_year: submitData.production_year as number,
          color: submitData.color || "",
          license_plate: submitData.license_plate || "",
          vin: submitData.vin || "",
          current_mileage: (submitData.current_mileage as number) || 0,
          purchase_date: submitData.purchase_date || "",
        };
        await VehicleService.addUserVehicle(createPayload);
        await loadData();
        setSnackbar({
          open: true,
          message: "خودرو با موفقیت افزوده شد",
          severity: "success",
        });
      }
      setOpenDialog(false);
      setActiveStep(0);
      setError(null);
    } catch (err) {
      setError("خطا در ذخیره خودرو");
      console.error("Error saving vehicle:", err);
      setSnackbar({
        open: true,
        message: "خطا در ذخیره خودرو",
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const getVehicleDisplayName = (vehicle: UserVehicle) => {
    if (!vehicle) {
      return "خودرو نامشخص";
    }
    if (vehicle.generation && vehicle.generation.name_fa) {
      return `${vehicle.generation.name_fa} - ${vehicle.name}`;
    }
    if (hierarchy && vehicle.generation_id) {
      for (const type of hierarchy.vehicle_types) {
        for (const brand of type.brands) {
          for (const model of brand.models) {
            const generation = model.generations.find(
              (g) => g.id === vehicle.generation_id
            );
            if (generation) {
              return `${generation.name_fa} - ${vehicle.name}`;
            }
          }
        }
      }
    }
    return vehicle.name;
  };

  const getVehicleDetails = (vehicle: UserVehicle) => {
    if (!vehicle) return "";
    const details = [] as string[];
    if (vehicle.production_year)
      details.push(`سال: ${vehicle.production_year}`);
    if (vehicle.color) details.push(`رنگ: ${vehicle.color}`);
    if (vehicle.license_plate) details.push(`پلاک: ${vehicle.license_plate}`);
    if (vehicle.current_mileage)
      details.push(`کیلومتر: ${vehicle.current_mileage.toLocaleString()}`);
    if (vehicle.purchase_date && vehicle.purchase_date.trim() !== "") {
      try {
        const persianDate = new Date(vehicle.purchase_date).toLocaleDateString(
          "fa-IR"
        );
        details.push(`تاریخ خرید: ${persianDate}`);
      } catch (_e) {
        details.push(`تاریخ خرید: ${vehicle.purchase_date}`);
      }
    }
    return details.join(" | ");
  };

  const getSelectedVehiclePath = () => {
    if (
      !hierarchy ||
      !selectedType ||
      !selectedBrand ||
      !selectedModel ||
      !formData.generation_id
    ) {
      return "";
    }
    const type = hierarchy.vehicle_types.find((t) => t.id === selectedType);
    const brand = type?.brands.find((b) => b.id === selectedBrand);
    const model = brand?.models.find((m) => m.id === selectedModel);
    const generation = model?.generations.find(
      (g) => g.id === formData.generation_id
    );
    if (!type || !brand || !model || !generation) return "";
    return `${type.name_fa} > ${brand.name_fa} > ${model.name_fa} > ${generation.name_fa}`;
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!formData.generation_id) {
        setError("لطفاً نوع خودرو، برند، مدل و نسخه را انتخاب کنید");
        return;
      }
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setError(null);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setError(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setActiveStep(0);
    setError(null);
  };

  if (loading) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>در حال بارگذاری...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{ p: 2, touchAction: "pan-y", WebkitOverflowScrolling: "touch" }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull to refresh indicator */}
      <Box
        sx={{
          height: isPulling ? pullDistance : 0,
          transition: "height 0.15s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "text.secondary",
        }}
      >
        {isPulling && (
          <Typography variant="body2">
            {pullDistance > 60
              ? "رها کنید برای بروزرسانی"
              : "برای بروزرسانی صفحه را به پایین بکشید"}
          </Typography>
        )}
      </Box>

      {/* Title centered with add button aligned to right */}
      <Box
        sx={{
          position: "relative",
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h5" fontWeight={700} textAlign="center">
          خودروها
        </Typography>
        <IconButton
          color="primary"
          aria-label="افزودن خودرو"
          onClick={handleAddVehicle}
          sx={(t) => ({
            position: "absolute",
            [t.direction === "rtl" ? "left" : "right"]: 0,
          })}
        >
          <Add />
        </IconButton>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 2 }}>
        <SearchField
          placeholder="جستجوی نام/پلاک/رنگ"
          value={query}
          onChange={setQuery}
        />
      </Box>

      {/* Account Activation Warning */}
      <InactiveUserRestriction />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {vehicles.filter(Boolean).length === 0 ? (
        <EmptyState
          icon={<DirectionsCar sx={{ fontSize: 64 }} />}
          title="هنوز خودرویی اضافه نکرده‌اید"
          description="برای شروع مدیریت خودروهای خود، اولین خودرو را اضافه کنید"
          actionLabel="افزودن خودرو"
          onAction={handleAddVehicle}
        />
      ) : (
        <Box sx={{ display: "grid", gap: 1 }}>
              {vehicles
            .filter((v) => v && v.id)
            .filter((v) => {
              const q = query.trim();
              if (!q) return true;
              const name = getVehicleDisplayName(v).toLowerCase();
              const details = getVehicleDetails(v).toLowerCase();
              return (
                name.includes(q.toLowerCase()) ||
                details.includes(q.toLowerCase())
              );
            })
                .map((vehicle) => (
              <ListItemCard
                    key={vehicle.id}
                title={getVehicleDisplayName(vehicle)}
                subtitle={getVehicleDetails(vehicle)}
                icon={<DirectionsCar color="primary" />}
                onClick={() => router.push(`/dashboard/vehicles/${vehicle.id}`)}
              />
            ))}
                    </Box>
      )}

      {/* Add/Edit Vehicle Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingVehicle ? "ویرایش خودرو" : "افزودن خودرو جدید"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* Step 1: Vehicle Selection */}
            {activeStep === 0 && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography variant="h6" gutterBottom>
                  خودرو مورد نظر خود را از کاتالوگ انتخاب کنید
                </Typography>

                {getSelectedVehiclePath() && (
                  <Alert severity="info">
                    <strong>انتخاب شما:</strong> {getSelectedVehiclePath()}
                  </Alert>
                )}

                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <FormControl fullWidth>
                    <InputLabel>نوع خودرو</InputLabel>
                    <Select
                      value={selectedType}
                      onChange={(e) => {
                        setSelectedType(e.target.value as number);
                        setSelectedBrand("");
                        setSelectedModel("");
                        setFormData({ ...formData, generation_id: 0 });
                      }}
                      label="نوع خودرو"
                    >
                      <MenuItem value="">
                        <em>انتخاب کنید</em>
                      </MenuItem>
                      {hierarchy?.vehicle_types.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                          {type.name_fa}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>برند</InputLabel>
                    <Select
                      value={selectedBrand}
                      onChange={(e) => {
                        setSelectedBrand(e.target.value as number);
                        setSelectedModel("");
                        setFormData({ ...formData, generation_id: 0 });
                      }}
                      label="برند"
                      disabled={!selectedType}
                    >
                      <MenuItem value="">
                        <em>انتخاب کنید</em>
                      </MenuItem>
                      {hierarchy?.vehicle_types
                        .find((t) => t.id === selectedType)
                        ?.brands.map((brand) => (
                          <MenuItem key={brand.id} value={brand.id}>
                            {brand.name_fa}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>مدل</InputLabel>
                    <Select
                      value={selectedModel}
                      onChange={(e) => {
                        setSelectedModel(e.target.value as number);
                        setFormData({ ...formData, generation_id: 0 });
                      }}
                      label="مدل"
                      disabled={!selectedBrand}
                    >
                      <MenuItem value="">
                        <em>انتخاب کنید</em>
                      </MenuItem>
                      {hierarchy?.vehicle_types
                        .find((t) => t.id === selectedType)
                        ?.brands.find((b) => b.id === selectedBrand)
                        ?.models.map((model) => (
                          <MenuItem key={model.id} value={model.id}>
                            {model.name_fa}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>نسخه</InputLabel>
                    <Select
                      value={formData.generation_id || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          generation_id: e.target.value as number,
                        })
                      }
                      label="نسخه"
                      disabled={!selectedModel}
                    >
                      <MenuItem value="">
                        <em>انتخاب کنید</em>
                      </MenuItem>
                      {hierarchy?.vehicle_types
                        .find((t) => t.id === selectedType)
                        ?.brands.find((b) => b.id === selectedBrand)
                        ?.models.find((m) => m.id === selectedModel)
                        ?.generations.map((generation) => (
                          <MenuItem key={generation.id} value={generation.id}>
                            {generation.name_fa}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            )}

            {/* Step 2: Additional Information */}
            {activeStep === 1 && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography variant="h6" gutterBottom>
                  اطلاعات تکمیلی خودرو
                </Typography>

                {getSelectedVehiclePath() && (
                  <Alert severity="info">
                    <strong>خودرو انتخاب شده:</strong>{" "}
                    {getSelectedVehiclePath()}
                  </Alert>
                )}

                <TextField
                  fullWidth
                  label="نام خودرو"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />

                <Box sx={{ display: "flex", gap: 2 }}>
                  <TextField
                    fullWidth
                    label="سال تولید"
                    type="number"
                    value={formData.production_year || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        production_year: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      })
                    }
                  />
                  <TextField
                    fullWidth
                    label="رنگ"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                  />
                </Box>

                <Box sx={{ display: "flex", gap: 2 }}>
                  <TextField
                    fullWidth
                    label="پلاک"
                    value={formData.license_plate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        license_plate: e.target.value,
                      })
                    }
                  />
                  <TextField
                    fullWidth
                    label="شماره شاسی (VIN)"
                    value={formData.vin}
                    onChange={(e) =>
                      setFormData({ ...formData, vin: e.target.value })
                    }
                  />
                </Box>

                <Box sx={{ display: "flex", gap: 2 }}>
                  <TextField
                    fullWidth
                    label="کیلومتر فعلی"
                    type="number"
                    value={formData.current_mileage || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        current_mileage: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      })
                    }
                  />
                  <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
                    <DatePicker
                      label="تاریخ خرید"
                      value={
                        formData.purchase_date
                          ? new Date(formData.purchase_date)
                          : null
                      }
                      onChange={(date) =>
                        setFormData({
                          ...formData,
                          purchase_date: date
                            ? date.toISOString().split("T")[0]
                            : "",
                        })
                      }
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </LocalizationProvider>
                </Box>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={saving}>
            انصراف
          </Button>
          {activeStep > 0 && (
            <Button onClick={handleBack} disabled={saving}>
              قبلی
            </Button>
          )}
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={saving}
            >
              {editingVehicle ? "ویرایش" : "افزودن"}
            </Button>
          ) : (
            <Button variant="contained" onClick={handleNext} disabled={saving}>
              بعدی
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}
