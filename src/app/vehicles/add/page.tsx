"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Alert,
  Grid,
  CircularProgress,
  Autocomplete,
  List,
  ListItemText,
  ListItem,
  ListItemButton,
} from "@mui/material";
import { NavigateNext, NavigateBefore, CheckCircle } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import {
  AppContainer,
  Header,
  PersianDatePicker,
  ResponsiveContainer,
  SectionHeader,
  SlideIn,
} from "@/components/ui";
import {
  FormField,
  IranLicensePlate,
  LicensePlateInput,
} from "@/components/ui";
import {
  vehicleService,
  VehicleType,
  VehicleBrand,
  VehicleModel,
  VehicleGeneration,
  UserVehicleRequest,
} from "@/services/vehicleService";
import { useVehicleHierarchy } from "@/hooks/useVehicles";
import {
  formatToPersianDate,
  formatToPersianDateWithAge,
} from "@/utils/dateUtils";

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
  const [isEditingPurchaseDate, setIsEditingPurchaseDate] = useState(false);

  // API Data
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [brands, setBrands] = useState<VehicleBrand[]>([]);
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [generations, setGenerations] = useState<VehicleGeneration[]>([]);
  const { data: hierarchy, isLoading: isHierarchyLoading } =
    useVehicleHierarchy();

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

  // Populate vehicle types from hierarchy once available
  useEffect(() => {
    if (!hierarchy) return;
    const types: VehicleType[] = hierarchy.vehicle_types.map((t) => ({
      id: t.id,
      name_fa: t.name_fa,
      name_en: t.name_en,
    }));
    setVehicleTypes(types);
  }, [hierarchy]);

  const loadBrands = async (typeId: number) => {
    try {
      if (!hierarchy) return;
      const typeNode = hierarchy.vehicle_types.find((t) => t.id === typeId);
      const brandsData: VehicleBrand[] = (typeNode?.brands || []).map((b) => ({
        id: b.id,
        vehicle_type_id: typeId,
        name_fa: b.name_fa,
        name_en: b.name_en,
      }));
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
      if (!hierarchy) return;
      const typeNode = hierarchy.vehicle_types.find((t) => t.id === typeId);
      const brandNode = typeNode?.brands.find((b) => b.id === brandId);
      const modelsData: VehicleModel[] = (brandNode?.models || []).map((m) => ({
        id: m.id,
        brand_id: brandId,
        name_fa: m.name_fa,
        name_en: m.name_en,
      }));
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
      if (!hierarchy) return;
      const typeNode = hierarchy.vehicle_types.find((t) => t.id === typeId);
      const brandNode = typeNode?.brands.find((b) => b.id === brandId);
      const modelNode = brandNode?.models.find((m) => m.id === modelId);
      const generationsData: VehicleGeneration[] = (
        modelNode?.generations || []
      ).map((g) => ({
        id: g.id,
        model_id: modelId,
        name_fa: g.name_fa,
        name_en: g.name_en,
        start_year: (g as any).start_year,
        end_year: (g as any).end_year,
        body_style_fa: (g as any).body_style_fa,
        body_style_en: (g as any).body_style_en,
        engine: (g as any).engine,
        engine_volume: (g as any).engine_volume,
        cylinders: (g as any).cylinders,
        drivetrain_fa: (g as any).drivetrain_fa,
        drivetrain_en: (g as any).drivetrain_en,
        gearbox: (g as any).gearbox,
        fuel_type: (g as any).fuel_type,
      }));
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

  const handleInputChange = (field: string) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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
      const requestData: UserVehicleRequest = {
        name: formData.name,
        generation_id: formData.selectedGeneration!.id,
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

      await vehicleService.createUserVehicle(requestData);

      // Success - redirect to vehicles list
      router.push("/vehicles");
    } catch (error: any) {
      console.error("Error saving vehicle:", error);

      // apiRequest throws Error(message) already parsed from backend
      const errorMessage =
        typeof error?.message === "string" && error.message.trim().length > 0
          ? error.message
          : "خطا در ذخیره وسیله نقلیه. لطفاً دوباره تلاش کنید.";

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
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <SectionHeader title="انتخاب وسیله نقلیه" />

                  {loading || isHierarchyLoading ? (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", py: 4 }}
                    >
                      <CircularProgress />
                    </Box>
                  ) : (
                    <>
                      {/* Vehicle Type Selection - Always Visible */}
                      <Autocomplete
                        value={formData.selectedType || null}
                        onChange={(event, newValue) => {
                          if (newValue) handleTypeChange(newValue);
                        }}
                        options={vehicleTypes}
                        getOptionLabel={(option) => option.name_fa}
                        isOptionEqualToValue={(option, value) =>
                          option.id === value.id
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="نوع وسیله نقلیه"
                            error={!!errors.selectedType}
                            helperText={errors.selectedType}
                          />
                        )}
                        fullWidth
                      />

                      {/* Brand Selection - Only visible after type is selected */}
                      {formData.selectedType && (
                        <Autocomplete
                          value={formData.selectedBrand || null}
                          onChange={(event, newValue) => {
                            if (newValue) handleBrandChange(newValue);
                          }}
                          options={brands}
                          getOptionLabel={(option) => option.name_fa}
                          isOptionEqualToValue={(option, value) =>
                            option.id === value.id
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={`برند ${formData.selectedType?.name_fa}`}
                              error={!!errors.selectedBrand}
                              helperText={errors.selectedBrand}
                            />
                          )}
                          fullWidth
                        />
                      )}

                      {/* Model Selection - Only visible after brand is selected */}
                      {formData.selectedBrand && (
                        <Autocomplete
                          value={formData.selectedModel || null}
                          onChange={(event, newValue) => {
                            if (newValue) handleModelChange(newValue);
                          }}
                          options={models}
                          getOptionLabel={(option) => option.name_fa}
                          isOptionEqualToValue={(option, value) =>
                            option.id === value.id
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={`مدل ${formData.selectedBrand?.name_fa}`}
                              error={!!errors.selectedModel}
                              helperText={errors.selectedModel}
                            />
                          )}
                          fullWidth
                        />
                      )}

                      {/* Generation Selection - Only visible after model is selected */}
                      {formData.selectedModel && (
                        <Autocomplete
                          value={formData.selectedGeneration || null}
                          onChange={(event, newValue) => {
                            if (newValue) handleGenerationChange(newValue);
                          }}
                          options={generations}
                          getOptionLabel={(option) => option.name_fa}
                          isOptionEqualToValue={(option, value) =>
                            option.id === value.id
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={`نسل ${formData.selectedModel?.name_fa}`}
                              error={!!errors.selectedGeneration}
                              helperText={errors.selectedGeneration}
                            />
                          )}
                          fullWidth
                        />
                      )}

                      {/* Selected Vehicle Info */}
                      {vehicleInfo && (
                        <Card sx={{ bgcolor: "background.paper" }}>
                          <CardContent>
                            <Typography
                              variant="h6"
                              gutterBottom
                              color="primary"
                            >
                              خودرو انتخاب شده
                            </Typography>
                            <Typography variant="h6" color="text.primary">
                              {vehicleInfo.type} {vehicleInfo.brand}{" "}
                              {vehicleInfo.model} {vehicleInfo.generation}
                            </Typography>
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

                  <List
                    sx={{
                      backgroundColor: "background.paper",
                      borderRadius: 1,
                    }}
                  >
                    <FormField
                      value={formData.name}
                      onChange={handleInputChange("name")}
                      placeholder={`نام ${vehicleInfo?.type}*`}
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
                      vehicleType={formData.selectedType?.name_fa}
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
                            formatToPersianDateWithAge(formData.purchaseDate) ||
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
                            {formatToPersianDate(formData.purchaseDate) ||
                              "تعیین نشده"}
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
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  direction: "rtl",
                  mt: 4,
                }}
              >
                <Button
                  variant="contained"
                  onClick={
                    activeStep === steps.length - 1 ? handleSubmit : handleNext
                  }
                  startIcon={
                    activeStep === steps.length - 1 ? undefined : (
                      <NavigateBefore sx={{ ml: 0.5 }} />
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
                {activeStep > 0 && (
                  <Button
                    onClick={handleBack}
                    endIcon={<NavigateNext sx={{ mr: 0.5 }} />}
                  >
                    قبلی
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </SlideIn>
      </ResponsiveContainer>
    </AppContainer>
  );
}
