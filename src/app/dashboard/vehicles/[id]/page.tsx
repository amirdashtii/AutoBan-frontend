"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Snackbar,
  Alert as MuiAlert,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Chip,
  Divider,
  Stack,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useRouter, useParams } from "next/navigation";
import { VehicleService } from "@/services/vehicleService";
import {
  UserVehicle,
  CompleteVehicleHierarchy,
  UpdateUserVehicleRequest,
} from "@/types/api";
import { ConfirmDialog, IranLicensePlate } from "@/components/ui";
import { toPersianDigits, toEnglishDigits } from "@/utils/digits";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFnsJalali } from "@mui/x-date-pickers/AdapterDateFnsJalali";
// Removed vehicleHierarchy lookup; backend returns expanded fields now
import CloseIcon from "@mui/icons-material/Close";

export default function VehicleDetails() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const vehicleId = Number(id);

  // Plate segmented state
  const [plateLeft2, setPlateLeft2] = useState<string>("");
  const [plateLetter, setPlateLetter] = useState<string>("");
  const [plateMid3, setPlateMid3] = useState<string>("");
  const [plateCode2, setPlateCode2] = useState<string>("");
  // Motorcycle plate segmented state (top 3, bottom 5)
  const [mcTop3, setMcTop3] = useState<string>("");
  const [mcBottom5, setMcBottom5] = useState<string>("");

  const parsePlate = (
    value?: string | null,
    mode: "car" | "motorcycle" = "car"
  ) => {
    // reset both modes
    setPlateLeft2("");
    setPlateLetter("");
    setPlateMid3("");
    setPlateCode2("");
    setMcTop3("");
    setMcBottom5("");
    if (!value) return;
    const src = toEnglishDigits(String(value));
    if (mode === "motorcycle") {
      const digits = (src.match(/\d/g) || []).join("");
      if (digits.length > 0) {
        const top = digits.slice(0, Math.min(3, digits.length));
        const bottom = digits.slice(
          top.length,
          Math.min(top.length + 5, digits.length)
        );
        setMcTop3(top);
        setMcBottom5(bottom);
      }
      return;
    }
    const m = src.match(
      /(\d{1,2})\s*([\u0600-\u06FF])\s*(\d{3})\s*-?\s*(\d{2})/
    );
    if (m) {
      setPlateLeft2(m[1] || "");
      setPlateLetter(m[2] || "");
      setPlateMid3(m[3] || "");
      setPlateCode2(m[4] || "");
    }
  };

  const composePlate = () => {
    if (isMotorcycleEdit) {
      const top = toEnglishDigits(mcTop3).slice(0, 3);
      const bottom = toEnglishDigits(mcBottom5).slice(0, 5);
      return top && bottom ? `${top}-${bottom}` : formData.license_plate || "";
    }
    const l2 = toEnglishDigits(plateLeft2).slice(0, 2);
    const mid = toEnglishDigits(plateMid3).slice(0, 3);
    const c2 = toEnglishDigits(plateCode2).slice(0, 2);
    const letter = plateLetter ? plateLetter[0] : "";
    return l2 && mid && c2 && letter
      ? `${l2} ${letter} ${mid} - ${c2}`
      : formData.license_plate || "";
  };

  const [vehicle, setVehicle] = useState<UserVehicle | null>(null);
  const [hierarchy, setHierarchy] = useState<CompleteVehicleHierarchy | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit dialog state
  const [openEdit, setOpenEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["انتخاب خودرو از کاتالوگ", "اطلاعات تکمیلی"];

  const [selectedType, setSelectedType] = useState<number | "">("");
  const [selectedBrand, setSelectedBrand] = useState<number | "">("");
  const [selectedModel, setSelectedModel] = useState<number | "">("");

  const [formData, setFormData] = useState<UpdateUserVehicleRequest>({
    name: "",
    generation_id: 0,
    production_year: undefined,
    color: "",
    license_plate: "",
    vin: "",
    current_mileage: undefined,
    purchase_date: "",
  });

  // Delete dialog
  const [openDelete, setOpenDelete] = useState(false);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const vehicleData = await VehicleService.getUserVehicle(vehicleId);
        setVehicle(vehicleData.vehicle);
        // If expanded fields are missing, fetch hierarchy as fallback
        const hasExpanded = Boolean(
          vehicleData.vehicle?.type &&
            vehicleData.vehicle?.brand &&
            vehicleData.vehicle?.model &&
            vehicleData.vehicle?.generation
        );
        if (!hasExpanded) {
          const hierarchyData = await VehicleService.getVehicleHierarchy();
          setHierarchy(hierarchyData);
        } else {
          setHierarchy(null);
        }
      } catch (e) {
        setError("خطا در بارگذاری اطلاعات خودرو");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [vehicleId]);

  // Ensure hierarchy exists when opening edit dialog (lazy load)
  const ensureHierarchy = async () => {
    if (!hierarchy) {
      try {
        const data = await VehicleService.getVehicleHierarchy();
        setHierarchy(data);
      } catch (_e) {
        // ignore here; error will surface if user tries to use selectors
      }
    }
  };

  // Detect motorcycle type using vehicle.type or hierarchy path
  const isTypeMotorcycle = (typeNameFa?: string, typeNameEn?: string) => {
    const fa = typeNameFa || "";
    const en = typeNameEn || "";
    return (
      fa.includes("موتور") || fa.includes("موتورسیکلت") || /motor/i.test(en)
    );
  };

  const isMotorcycle = React.useMemo(() => {
    if (vehicle?.type)
      return isTypeMotorcycle(vehicle.type.name_fa, vehicle.type.name_en);
    return false;
  }, [vehicle]);

  // In edit flow, if user changes selectedType, adapt inputs accordingly
  const isMotorcycleEdit = React.useMemo(() => {
    if (selectedType && hierarchy) {
      const t = hierarchy.vehicle_types.find((vt) => vt.id === selectedType);
      if (t) return isTypeMotorcycle(t.name_fa, t.name_en);
    }
    return isMotorcycle;
  }, [selectedType, hierarchy, isMotorcycle]);

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

  const getVehicleDisplayName = (v?: UserVehicle | null) => {
    const veh = v ?? vehicle;
    if (!veh) return "خودرو";
    if (veh.generation?.name_fa)
      return `${veh.generation.name_fa} - ${veh.name}`;
    return veh.name;
  };

  const openEditDialog = async () => {
    if (!vehicle) return;
    await ensureHierarchy();
    setFormData({
      name: vehicle.name,
      generation_id: vehicle.generation_id,
      production_year: vehicle.production_year,
      color: vehicle.color,
      license_plate: vehicle.license_plate,
      vin: vehicle.vin,
      current_mileage: vehicle.current_mileage,
      purchase_date: vehicle.purchase_date,
    });
    parsePlate(vehicle.license_plate, isMotorcycle ? "motorcycle" : "car");
    if (hierarchy) {
      for (const type of hierarchy.vehicle_types) {
        for (const brand of type.brands) {
          for (const model of brand.models) {
            const generation = model.generations.find(
              (g) => g.id === vehicle.generation_id
            );
            if (generation) {
              setSelectedType(type.id);
              setSelectedBrand(brand.id);
              setSelectedModel(model.id);
              break;
            }
          }
        }
      }
    }
    setActiveStep(1);
    setOpenEdit(true);
  };

  const handleSave = async () => {
    if (!vehicle) return;
    if (!formData.generation_id) {
      setError("لطفاً نوع خودرو، برند، مدل و نسخه را انتخاب کنید");
      return;
    }
    if (!formData.name?.trim()) {
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
        submitData.license_plate = toEnglishDigits(
          composePlate() || formData.license_plate.trim()
        );
      if (formData.vin && formData.vin.trim() !== "")
        submitData.vin = toEnglishDigits(formData.vin.trim());
      if (typeof formData.current_mileage === "number")
        submitData.current_mileage = Number(
          toEnglishDigits(formData.current_mileage)
        );
      if (formData.purchase_date && formData.purchase_date.trim() !== "") {
        submitData.purchase_date = formData.purchase_date.slice(0, 10);
      }

      await VehicleService.updateUserVehicle(
        vehicle.id,
        submitData as UpdateUserVehicleRequest
      );
      const fresh = await VehicleService.getUserVehicle(vehicle.id);
      setVehicle(fresh.vehicle);
      setOpenEdit(false);
      setActiveStep(0);
      setError(null);
      setSnackbar({
        open: true,
        message: "خودرو با موفقیت ویرایش شد",
        severity: "success",
      });
    } catch (e) {
      setError("خطا در ذخیره خودرو");
      setSnackbar({
        open: true,
        message: "خطا در ذخیره خودرو",
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!vehicle) return;
    try {
      await VehicleService.deleteUserVehicle(vehicle.id);
      setOpenDelete(false);
      router.push("/dashboard/vehicles");
    } catch (e) {
      setSnackbar({
        open: true,
        message: "خطا در حذف خودرو",
        severity: "error",
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>در حال بارگذاری...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!vehicle) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="warning">خودرو یافت نشد</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, pb: 8 }}>
      {/* Title */}
      <Box
        sx={{
          position: "relative",
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button
          variant="text"
          onClick={openEditDialog}
          sx={{ position: "absolute", left: 0 }}
        >
          ویرایش
        </Button>
        <Typography variant="h5" fontWeight={700} textAlign="center">
          {getVehicleDisplayName(vehicle)}
        </Typography>
        <Button
          variant="text"
          onClick={() => router.back()}
          sx={{ position: "absolute", right: 0 }}
        >
          برگشت {">"}
        </Button>
      </Box>

      {/* License plate prominent */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mx: "auto",
          mb: 2,
          aspectRatio: isMotorcycle ? 24 / 15 : 52 / 11,
          maxWidth: isMotorcycle ? 144 : 312,
          width: "100%",
        }}
      >
        {vehicle.license_plate ? (
          <IranLicensePlate
            value={vehicle.license_plate}
            vehicleType={isMotorcycle ? "motorcycle" : "car"}
            sx={{ width: "100%" }}
          />
        ) : null}
      </Box>

      {/* Quick facts */}
      <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2 }}>
        <Chip
          label={`سال: ${
            vehicle.production_year != null
              ? toPersianDigits(vehicle.production_year)
              : "-"
          }`}
          size="medium"
          variant="outlined"
          sx={{ "& .MuiChip-label": { fontSize: "0.95rem", px: 1 } }}
        />
        <Chip
          label={`کیلومتر: ${
            vehicle.current_mileage != null
              ? toPersianDigits(vehicle.current_mileage.toLocaleString())
              : "-"
          }`}
          size="medium"
          variant="outlined"
          sx={{ "& .MuiChip-label": { fontSize: "0.95rem", px: 1 } }}
        />
      </Stack>

      {/* Details Card */}
      <Card>
        <CardContent>
          <Box>
            <Box>
              {(() => {
                const parts: string[] = [];
                if (vehicle.type?.name_fa) parts.push(vehicle.type.name_fa);
                if (vehicle.brand?.name_fa) parts.push(vehicle.brand.name_fa);
                if (vehicle.model?.name_fa) parts.push(vehicle.model.name_fa);
                if (vehicle.generation?.name_fa)
                  parts.push(vehicle.generation.name_fa);
                return parts.length > 0 ? (
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {parts.join(" ")}
                  </Typography>
                ) : (
                  <Typography variant="body1">-</Typography>
                );
              })()}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Specs Card */}
      <Card sx={{ mt: 1.5 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            مشخصات
          </Typography>
          <Divider sx={{ mb: 1.5 }} />
          <Box sx={{ display: "grid", rowGap: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography color="text.secondary">رنگ</Typography>
              <Typography>{vehicle.color || "-"}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography color="text.secondary">VIN</Typography>
              <Typography>
                {vehicle.vin ? toPersianDigits(vehicle.vin) : "-"}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography color="text.secondary">تاریخ خرید</Typography>
              <Typography>
                {vehicle.purchase_date
                  ? toPersianDigits(
                      new Date(vehicle.purchase_date).toLocaleDateString(
                        "fa-IR"
                      )
                    )
                  : "-"}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Service actions/history */}
      <Card sx={{ mt: 1.5, mb: 1 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            سرویس و سوابق
          </Typography>
          <Divider sx={{ mb: 1.5 }} />
          {/* Next service reminder */}
          {(() => {
            const step = 5000; // کیلومتر سرویس دوره‌ای فرضی
            const cm = vehicle.current_mileage ?? null;
            const remain = cm != null ? step - (cm % step) : null;
            const label =
              remain != null && remain !== step
                ? `تا سرویس بعدی: ${toPersianDigits(
                    remain.toLocaleString()
                  )} کیلومتر`
                : "یادآور سرویس بعدی تنظیم نشده";
            return (
              <Box sx={{ display: "flex", justifyContent: "center", mb: 1.5 }}>
                <Chip
                  color={
                    remain != null && remain < 1000 ? "warning" : "default"
                  }
                  variant="outlined"
                  size="medium"
                  label={label}
                  sx={{ "& .MuiChip-label": { fontSize: "0.95rem", px: 1 } }}
                />
              </Box>
            );
          })()}
          <Stack direction="row" spacing={1} justifyContent="center">
            <Button
              variant="outlined"
              onClick={() => router.push("/dashboard/services")}
            >
              افزودن سرویس
            </Button>
            <Button
              variant="contained"
              onClick={() => router.push("/dashboard/history")}
            >
              مشاهده سوابق
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          ویرایش خودرو
          <IconButton
            aria-label="close"
            onClick={() => setOpenEdit(false)}
            sx={{ position: "absolute", left: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel
                    onClick={() => setActiveStep(index)}
                    sx={{ cursor: "pointer" }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {activeStep === 0 && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {getSelectedVehiclePath() && (
                  <Alert severity="info">
                    <strong>انتخاب شما:</strong> {getSelectedVehiclePath()}
                  </Alert>
                )}
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
            )}

            {activeStep === 1 && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  fullWidth
                  label="نام خودرو"
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />

                <TextField
                  fullWidth
                  label="سال تولید"
                  type="text"
                  value={toPersianDigits(formData.production_year ?? "")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      production_year: e.target.value
                        ? parseInt(toEnglishDigits(e.target.value))
                        : undefined,
                    })
                  }
                  helperText="مثال: ۱۴۰۱"
                />

                <TextField
                  fullWidth
                  label="رنگ"
                  value={formData.color || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                />

                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    پلاک
                  </Typography>
                  {isMotorcycleEdit ? (
                    <Stack direction="column" spacing={1} alignItems="stretch">
                      <TextField
                        label="سه رقم بالا"
                        value={toPersianDigits(mcTop3)}
                        onChange={(e) =>
                          setMcTop3(toEnglishDigits(e.target.value).slice(0, 3))
                        }
                        slotProps={{
                          input: {
                            inputMode: "numeric",
                            style: { direction: "ltr", textAlign: "center" },
                          },
                        }}
                      />
                      <TextField
                        label="پنج رقم پایین"
                        value={toPersianDigits(mcBottom5)}
                        onChange={(e) =>
                          setMcBottom5(
                            toEnglishDigits(e.target.value).slice(0, 5)
                          )
                        }
                        slotProps={{
                          input: {
                            inputMode: "numeric",
                            style: { direction: "ltr", textAlign: "center" },
                          },
                        }}
                      />
                    </Stack>
                  ) : (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <TextField
                        label="ایران"
                        value={toPersianDigits(plateCode2)}
                        onChange={(e) =>
                          setPlateCode2(
                            toEnglishDigits(e.target.value).slice(0, 2)
                          )
                        }
                        slotProps={{
                          input: {
                            inputMode: "numeric",
                            style: {
                              direction: "ltr",
                              textAlign: "center",
                              width: 80,
                            },
                          },
                        }}
                      />
                      <TextField
                        label="دو رقم"
                        value={toPersianDigits(plateLeft2)}
                        onChange={(e) =>
                          setPlateLeft2(
                            toEnglishDigits(e.target.value).slice(0, 2)
                          )
                        }
                        slotProps={{
                          input: {
                            inputMode: "numeric",
                            style: {
                              direction: "ltr",
                              textAlign: "center",
                              width: 64,
                            },
                          },
                        }}
                      />
                      <TextField
                        label="حرف"
                        value={plateLetter}
                        onChange={(e) =>
                          setPlateLetter(e.target.value.slice(0, 1))
                        }
                        slotProps={{
                          input: { style: { textAlign: "center", width: 56 } },
                        }}
                      />
                      <TextField
                        label="سه رقم"
                        value={toPersianDigits(plateMid3)}
                        onChange={(e) =>
                          setPlateMid3(
                            toEnglishDigits(e.target.value).slice(0, 3)
                          )
                        }
                        slotProps={{
                          input: {
                            inputMode: "numeric",
                            style: {
                              direction: "ltr",
                              textAlign: "center",
                              width: 72,
                            },
                          },
                        }}
                      />
                    </Stack>
                  )}
                </Box>
                {/* keep composed string in form for submit */}
                <input
                  type="hidden"
                  value={(formData.license_plate = composePlate())}
                  readOnly
                />

                <TextField
                  fullWidth
                  label="شماره شاسی (VIN)"
                  value={formData.vin || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, vin: e.target.value })
                  }
                  slotProps={{ input: { style: { direction: "ltr" } } }}
                />

                <TextField
                  fullWidth
                  label="کیلومتر فعلی"
                  type="text"
                  value={toPersianDigits(formData.current_mileage ?? "")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      current_mileage: e.target.value
                        ? parseInt(toEnglishDigits(e.target.value))
                        : undefined,
                    })
                  }
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">کیلومتر</InputAdornment>
                      ),
                    },
                  }}
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
            )}

            {/* Stacked actions inside content */}
            <Box
              sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 1.5 }}
            >
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={saving}
              >
                ذخیره
              </Button>
              <Divider sx={{ my: 1 }} />
              <Button
                color="error"
                onClick={() => setOpenDelete(true)}
                disabled={saving}
              >
                حذف
              </Button>
            </Box>
          </Box>
        </DialogContent>
        {/* Removed DialogActions: cancel/prev/next */}
      </Dialog>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
        title="حذف خودرو"
        content="آیا از حذف این خودرو اطمینان دارید؟"
        confirmLabel="حذف"
        confirmColor="error"
      />

      {/* Snackbar */}
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
