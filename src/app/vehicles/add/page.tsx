"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Alert,
  Grid,
  CircularProgress,
  FormHelperText,
  InputAdornment,
} from "@mui/material";
import {
  DirectionsCar,
  Save,
  Cancel,
  NavigateNext,
  NavigateBefore,
  CheckCircle,
  Label,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import {
  AppContainer,
  Header,
  ResponsiveContainer,
  SectionHeader,
  SlideIn,
} from "@/components/ui";
import { IranLicensePlate } from "@/components/ui";
import {
  vehicleService,
  VehicleType,
  VehicleBrand,
  VehicleModel,
  VehicleGeneration,
} from "@/services/vehicleService";

const steps = ["انتخاب وسیله نقلیه", "اطلاعات تکمیلی", "نهایی کردن"];

interface VehicleFormData {
  // Step 1: Vehicle Selection
  selectedType: VehicleType | null;
  selectedBrand: VehicleBrand | null;
  selectedModel: VehicleModel | null;
  selectedGeneration: VehicleGeneration | null;

  // Step 2: Additional Info
  name: string;
  productionYear: number | null;
  color: string;
  licensePlate: string;
  vin: string;
  currentMileage: number | null;
  purchaseDate: string;
}

export default function AddVehicle() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // API Data
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [brands, setBrands] = useState<VehicleBrand[]>([]);
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [generations, setGenerations] = useState<VehicleGeneration[]>([]);

  // Form Data
  const [formData, setFormData] = useState<VehicleFormData>({
    selectedType: null,
    selectedBrand: null,
    selectedModel: null,
    selectedGeneration: null,
    name: "",
    productionYear: null,
    color: "",
    licensePlate: "",
    vin: "",
    currentMileage: null,
    purchaseDate: "",
  });

  // Load vehicle types on component mount
  useEffect(() => {
    loadVehicleTypes();
  }, []);

  const loadVehicleTypes = async () => {
    try {
      setLoading(true);
      const type = await vehicleService.getVehicleTypes();
      setVehicleTypes(type);
    } catch (error) {
      console.error("Error loading vehicle type:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadBrands = async (typeId: number) => {
    try {
      const brandsData = await vehicleService.getBrandsByType(typeId);
      setBrands(brandsData);
      setModels([]);
      setGenerations([]);
      setFormData((prev) => ({
        ...prev,
        selectedBrand: null,
        selectedModel: null,
        selectedGeneration: null,
      }));
    } catch (error) {
      console.error("Error loading brands:", error);
    }
  };

  const loadModels = async (typeId: number, brandId: number) => {
    try {
      const modelsData = await vehicleService.getModelsByBrand(typeId, brandId);
      setModels(modelsData);
      setGenerations([]);
      setFormData((prev) => ({
        ...prev,
        selectedModel: null,
        selectedGeneration: null,
      }));
    } catch (error) {
      console.error("Error loading models:", error);
    }
  };

  const loadGenerations = async (
    typeId: number,
    brandId: number,
    modelId: number
  ) => {
    try {
      const generationsData = await vehicleService.getGenerationsByModel(
        typeId,
        brandId,
        modelId
      );
      setGenerations(generationsData);
      setFormData((prev) => ({
        ...prev,
        selectedGeneration: null,
      }));
    } catch (error) {
      console.error("Error loading generations:", error);
    }
  };

  const handleTypeChange = (type: VehicleType) => {
    setFormData((prev) => ({ ...prev, selectedType: type }));
    loadBrands(type.id);
  };

  const handleBrandChange = (brand: VehicleBrand) => {
    setFormData((prev) => ({ ...prev, selectedBrand: brand }));
    if (formData.selectedType) {
      loadModels(formData.selectedType.id, brand.id);
    }
  };

  const handleModelChange = (model: VehicleModel) => {
    setFormData((prev) => ({ ...prev, selectedModel: model }));
    if (formData.selectedType && formData.selectedBrand) {
      loadGenerations(
        formData.selectedType.id,
        formData.selectedBrand.id,
        model.id
      );
    }
  };

  const handleGenerationChange = (generation: VehicleGeneration) => {
    setFormData((prev) => ({ ...prev, selectedGeneration: generation }));
  };

  const handleInputChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0: // Vehicle Selection
        if (!formData.selectedType)
          newErrors.selectedType = "نوع وسیله نقلیه الزامی است";
        if (!formData.selectedBrand)
          newErrors.selectedBrand = "برند وسیله نقلیه الزامی است";
        if (!formData.selectedModel)
          newErrors.selectedModel = "مدل وسیله نقلیه الزامی است";
        if (!formData.selectedGeneration)
          newErrors.selectedGeneration = "نسل وسیله نقلیه الزامی است";
        break;

      case 1: // Additional Info
        if (!formData.name.trim())
          newErrors.name = "نام وسیله نقلیه الزامی است";
        if (
          formData.productionYear &&
          (formData.productionYear < 1000 ||
            formData.productionYear > new Date().getFullYear())
        ) {
          newErrors.productionYear = "سال تولید معتبر نیست";
        }
        if (!formData.currentMileage)
          newErrors.currentMileage = "کیلومتر فعلی الزامی است";
        if (formData.currentMileage !== null && formData.currentMileage < 0) {
          newErrors.currentMileage = "کیلومتر فعلی معتبر نیست";
        }
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(1)) return;

    setSaving(true);
    try {
      const requestData = {
        name: formData.name,
        generation_id: formData.selectedGeneration!.id,
        production_year: formData.productionYear || undefined,
        color: formData.color || undefined,
        license_plate: formData.licensePlate || undefined,
        vin: formData.vin || undefined,
        current_mileage: formData.currentMileage || undefined,
        purchase_date: formData.purchaseDate || undefined,
      };

      await vehicleService.createUserVehicle(requestData);

      // Success - redirect to vehicles list
      router.push("/vehicles");
    } catch (error: any) {
      console.error("Error saving vehicle:", error);

      // استخراج پیام خطای فارسی از بک‌اند
      let errorMessage = "خطا در ذخیره وسیله نقلیه. لطفاً دوباره تلاش کنید.";

      if (error.response?.data) {
        const backendError = error.response.data;
        // بررسی ساختارهای مختلف پیام خطا از بک‌اند
        if (backendError.error?.message?.persian) {
          errorMessage = backendError.error.message.persian;
        }
      }

      setErrors({
        submit: errorMessage,
      });
    } finally {
      setSaving(false);
    }
  };

  const getSelectedVehicleInfo = () => {
    if (
      !formData.selectedType ||
      !formData.selectedBrand ||
      !formData.selectedModel ||
      !formData.selectedGeneration
    ) {
      return null;
    }

    return {
      type: formData.selectedType.name_fa,
      brand: formData.selectedBrand.name_fa,
      model: formData.selectedModel.name_fa,
      generation: formData.selectedGeneration.name_fa,
      engine: formData.selectedGeneration.engine,
      fuelType: formData.selectedGeneration.fuel_type,
      bodyStyle: formData.selectedGeneration.body_style_fa,
    };
  };

  const vehicleInfo = getSelectedVehicleInfo();

  return (
    <AppContainer
      header={
        <Header
          title="افزودن وسیله نقلیه جدید"
          subtitle="انتخاب وسیله نقلیه و ثبت اطلاعات تکمیلی"
          showBack
          onBackClick={() => router.back()}
        />
      }
    >
      <ResponsiveContainer padding="medium" fullHeight={false}>
        {/* Progress Stepper */}
        <SlideIn direction="up">
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </CardContent>
          </Card>
        </SlideIn>

        {/* Error Alert */}
        {errors.submit && (
          <SlideIn direction="up" delay={50}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.submit}
            </Alert>
          </SlideIn>
        )}

        {/* Step Content */}
        <SlideIn direction="up" delay={100}>
          <Card>
            <CardContent>
              {/* Step 1: Vehicle Selection */}
              {activeStep === 0 && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <SectionHeader title="انتخاب وسیله نقلیه" />

                  {loading ? (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", py: 4 }}
                    >
                      <CircularProgress />
                    </Box>
                  ) : (
                    <>
                      {/* Vehicle Type Selection - Always Visible */}
                      <FormControl fullWidth error={!!errors.selectedType}>
                        <InputLabel>نوع وسیله نقلیه</InputLabel>
                        <Select
                          value={formData.selectedType?.id || ""}
                          onChange={(e) => {
                            const type = vehicleTypes.find(
                              (t) => t.id === e.target.value
                            );
                            if (type) handleTypeChange(type);
                          }}
                          label="نوع وسیله نقلیه"
                        >
                          {vehicleTypes.map((type) => (
                            <MenuItem key={type.id} value={type.id}>
                              {type.name_fa}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.selectedType && (
                          <FormHelperText>{errors.selectedType}</FormHelperText>
                        )}
                        <FormHelperText>{errors.selectedType}</FormHelperText>
                      </FormControl>

                      {/* Brand Selection - Only visible after type is selected */}
                      {formData.selectedType && (
                        <FormControl fullWidth error={!!errors.selectedBrand}>
                          <InputLabel>
                            برند {formData.selectedType.name_fa}
                          </InputLabel>
                          <Select
                            value={formData.selectedBrand?.id || ""}
                            onChange={(e) => {
                              const brand = brands.find(
                                (b) => b.id === e.target.value
                              );
                              if (brand) handleBrandChange(brand);
                            }}
                            label={`برند ${formData.selectedType.name_fa}`}
                          >
                            {brands.map((brand) => (
                              <MenuItem key={brand.id} value={brand.id}>
                                {brand.name_fa}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.selectedBrand && (
                            <FormHelperText>
                              {errors.selectedBrand}
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}

                      {/* Model Selection - Only visible after brand is selected */}
                      {formData.selectedBrand && (
                        <FormControl fullWidth error={!!errors.selectedModel}>
                          <InputLabel>
                            مدل {formData.selectedBrand.name_fa}
                          </InputLabel>
                          <Select
                            value={formData.selectedModel?.id || ""}
                            onChange={(e) => {
                              const model = models.find(
                                (m) => m.id === e.target.value
                              );
                              if (model) handleModelChange(model);
                            }}
                            label={`مدل ${formData.selectedBrand.name_fa}`}
                          >
                            {models.map((model) => (
                              <MenuItem key={model.id} value={model.id}>
                                {model.name_fa}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.selectedModel && (
                            <FormHelperText>
                              {errors.selectedModel}
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}

                      {/* Generation Selection - Only visible after model is selected */}
                      {formData.selectedModel && (
                        <FormControl
                          fullWidth
                          error={!!errors.selectedGeneration}
                        >
                          <InputLabel>
                            نسل {formData.selectedModel.name_fa}
                          </InputLabel>
                          <Select
                            value={formData.selectedGeneration?.id || ""}
                            onChange={(e) => {
                              const generation = generations.find(
                                (g) => g.id === e.target.value
                              );
                              if (generation)
                                handleGenerationChange(generation);
                            }}
                            label={`نسل ${formData.selectedModel.name_fa}`}
                          >
                            {generations.map((generation) => (
                              <MenuItem
                                key={generation.id}
                                value={generation.id}
                              >
                                {generation.name_fa} ({generation.start_year} -{" "}
                                {generation.end_year || "فعلی"})
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.selectedGeneration && (
                            <FormHelperText>
                              {errors.selectedGeneration}
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}

                      {/* Selected Vehicle Info */}
                      {vehicleInfo && (
                        <Card
                          variant="outlined"
                          sx={{ bgcolor: "background.default" }}
                        >
                          <CardContent>
                            <Typography
                              variant="h6"
                              gutterBottom
                              color="primary"
                            >
                              اطلاعات خودرو انتخاب شده
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid size={6}>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  نوع:
                                </Typography>
                                <Typography variant="body1">
                                  {vehicleInfo.type}
                                </Typography>
                              </Grid>
                              <Grid size={6}>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  برند:
                                </Typography>
                                <Typography variant="body1">
                                  {vehicleInfo.brand}
                                </Typography>
                              </Grid>
                              <Grid size={6}>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  مدل:
                                </Typography>
                                <Typography variant="body1">
                                  {vehicleInfo.model}
                                </Typography>
                              </Grid>
                              <Grid size={6}>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  نسل:
                                </Typography>
                                <Typography variant="body1">
                                  {vehicleInfo.generation}
                                </Typography>
                              </Grid>
                              <Grid size={6}>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  موتور:
                                </Typography>
                                <Typography variant="body1">
                                  {vehicleInfo.engine}
                                </Typography>
                              </Grid>
                              <Grid size={6}>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  سوخت:
                                </Typography>
                                <Typography variant="body1">
                                  {vehicleInfo.fuelType}
                                </Typography>
                              </Grid>
                              <Grid size={6}>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  بدنه:
                                </Typography>
                                <Typography variant="body1">
                                  {vehicleInfo.bodyStyle}
                                </Typography>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      )}
                    </>
                  )}
                </Box>
              )}

              {/* Step 2: Additional Info */}
              {activeStep === 1 && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <SectionHeader title="اطلاعات تکمیلی" />

                  <TextField
                    fullWidth
                    label="نام وسیله نقلیه *"
                    placeholder="مثال: پژو 206 من"
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
                            min: 1000,
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
                        placeholder="مثال: قرمز"
                      />
                    </Grid>
                  </Grid>

                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      پلاک {formData.selectedType?.name_fa || "خودرو"}
                    </Typography>
                    {formData.selectedType?.name_fa === "موتورسیکلت" ? (
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
                              label="شماره پایین"
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
                                {
                                  display: (
                                    <span style={{ fontSize: "2em" }}>♿︎</span>
                                  ),
                                  value: "ژ",
                                },
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
                            placeholder="123"
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
                            placeholder="12"
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
                    placeholder="اختیاری"
                  />

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="کیلومتر فعلی"
                        type="number"
                        value={formData.currentMileage || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "currentMileage",
                            parseInt(e.target.value) || null
                          )
                        }
                        error={!!errors.currentMileage}
                        helperText={errors.currentMileage}
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
                </Box>
              )}

              {/* Step 3: Final Review */}
              {activeStep === 2 && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <SectionHeader title="مرور نهایی" />

                  {/* Vehicle Summary */}
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary">
                        خلاصه اطلاعات خودرو
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid size={6}>
                          <Typography variant="body2" color="text.secondary">
                            نام خودرو:
                          </Typography>
                          <Typography variant="body1">
                            {formData.name}
                          </Typography>
                        </Grid>
                        <Grid size={6}>
                          <Typography variant="body2" color="text.secondary">
                            نوع خودرو:
                          </Typography>
                          <Typography variant="body1">
                            {vehicleInfo?.type} {vehicleInfo?.brand}{" "}
                            {vehicleInfo?.model} {vehicleInfo?.generation}
                          </Typography>
                        </Grid>
                        <Grid size={6}>
                          <Typography variant="body2" color="text.secondary">
                            سال تولید:
                          </Typography>
                          <Typography variant="body1">
                            {formData.productionYear || "تعیین نشده"}
                          </Typography>
                        </Grid>
                        <Grid size={6}>
                          <Typography variant="body2" color="text.secondary">
                            رنگ:
                          </Typography>
                          <Typography variant="body1">
                            {formData.color || "تعیین نشده"}
                          </Typography>
                        </Grid>
                        <Grid size={6}>
                          <Typography variant="body2" color="text.secondary">
                            کیلومتر:
                          </Typography>
                          <Typography variant="body1">
                            {formData.currentMileage?.toLocaleString() ||
                              "تعیین نشده"}{" "}
                            کیلومتر
                          </Typography>
                        </Grid>
                        <Grid size={6}>
                          <Typography variant="body2" color="text.secondary">
                            تاریخ خرید:
                          </Typography>
                          <Typography variant="body1">
                            {formData.purchaseDate || "تعیین نشده"}
                          </Typography>
                        </Grid>
                      </Grid>

                      {/* Technical Specs */}
                      <Box
                        sx={{
                          mt: 2,
                          pt: 2,
                          borderTop: 1,
                          borderColor: "divider",
                        }}
                      >
                        <Typography variant="subtitle1" gutterBottom>
                          مشخصات فنی
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid size={6}>
                            <Typography variant="body2" color="text.secondary">
                              موتور:
                            </Typography>
                            <Typography variant="body1">
                              {vehicleInfo?.engine || "تعیین نشده"}
                            </Typography>
                          </Grid>
                          <Grid size={6}>
                            <Typography variant="body2" color="text.secondary">
                              نوع سوخت:
                            </Typography>
                            <Typography variant="body1">
                              {vehicleInfo?.fuelType || "تعیین نشده"}
                            </Typography>
                          </Grid>
                          <Grid size={6}>
                            <Typography variant="body2" color="text.secondary">
                              بدنه:
                            </Typography>
                            <Typography variant="body1">
                              {vehicleInfo?.bodyStyle || "تعیین نشده"}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>

                      {/* License Plate */}
                      {formData.licensePlate && (
                        <Box
                          sx={{
                            mt: 2,
                            pt: 2,
                            borderTop: 1,
                            borderColor: "divider",
                          }}
                        >
                          <Typography variant="subtitle1" gutterBottom>
                            پلاک خودرو
                          </Typography>
                          <Box
                            sx={{ display: "flex", justifyContent: "center" }}
                          >
                            <IranLicensePlate value={formData.licensePlate} />
                          </Box>
                        </Box>
                      )}
                    </CardContent>
                  </Card>

                  {/* Confirmation Message */}
                  <Alert severity="info" icon={<CheckCircle />}>
                    لطفاً اطلاعات بالا را بررسی کرده و در صورت صحت، خودرو را
                    ذخیره کنید.
                  </Alert>
                </Box>
              )}

              {/* Action Buttons */}
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}
              >
                <Button
                  onClick={activeStep === 0 ? () => router.back() : handleBack}
                  startIcon={activeStep === 0 ? <Cancel /> : <NavigateNext />}
                >
                  {activeStep === 0 ? "انصراف" : "قبلی"}
                </Button>

                <Button
                  variant="contained"
                  onClick={
                    activeStep === steps.length - 1 ? handleSubmit : handleNext
                  }
                  endIcon={
                    activeStep === steps.length - 1 ? (
                      <Save />
                    ) : (
                      <NavigateBefore />
                    )
                  }
                  disabled={loading || saving}
                >
                  {activeStep === steps.length - 1
                    ? saving
                      ? "در حال ذخیره..."
                      : "ذخیره خودرو"
                    : "بعدی"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </SlideIn>
      </ResponsiveContainer>
    </AppContainer>
  );
}
