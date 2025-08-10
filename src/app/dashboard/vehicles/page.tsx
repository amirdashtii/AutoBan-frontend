"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Fab,
  Chip,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  DirectionsCar,
  Add,
  Edit,
  Delete,
  Refresh,
  Info,
} from "@mui/icons-material";
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

export default function Vehicles() {
  const { user } = useAuth();
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

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

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
    setOpenDialog(true);
  };

  const handleEditVehicle = (vehicle: UserVehicle) => {
    setEditingVehicle(vehicle);
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
    // Set the cascading selections based on the vehicle's generation
    // This would need to be implemented based on the actual hierarchy structure
    setOpenDialog(true);
  };

  const handleDeleteVehicle = async (vehicleId: number) => {
    if (window.confirm("آیا از حذف این خودرو اطمینان دارید؟")) {
      try {
        await VehicleService.deleteUserVehicle(vehicleId);
        setVehicles(vehicles.filter((v) => v.id !== vehicleId));
      } catch (err) {
        setError("خطا در حذف خودرو");
        console.error("Error deleting vehicle:", err);
      }
    }
  };

  const handleSubmit = async () => {
    console.log("📝 فرم داده‌ها:", formData);

    if (!formData.name || !formData.generation_id) {
      setError("لطفاً نام خودرو و مدل را وارد کنید");
      return;
    }

    try {
      if (editingVehicle) {
        const updatedVehicle = await VehicleService.updateUserVehicle(
          editingVehicle.id,
          formData as UpdateUserVehicleRequest
        );
        setVehicles(
          vehicles.map((v) =>
            v.id === editingVehicle.id ? updatedVehicle.vehicle : v
          )
        );
      } else {
        const newVehicle = await VehicleService.addUserVehicle(formData);
        setVehicles([...vehicles, newVehicle.vehicle]);
      }
      setOpenDialog(false);
      setError(null);
    } catch (err) {
      setError("خطا در ذخیره خودرو");
      console.error("Error saving vehicle:", err);
    }
  };

  const getVehicleDisplayName = (vehicle: UserVehicle) => {
    if (vehicle.generation?.name_fa) {
      return `${vehicle.generation.name_fa} - ${vehicle.name}`;
    }
    return vehicle.name;
  };

  const getVehicleDetails = (vehicle: UserVehicle) => {
    const details = [];
    if (vehicle.production_year)
      details.push(`سال: ${vehicle.production_year}`);
    if (vehicle.color) details.push(`رنگ: ${vehicle.color}`);
    if (vehicle.license_plate) details.push(`پلاک: ${vehicle.license_plate}`);
    if (vehicle.current_mileage)
      details.push(`کیلومتر: ${vehicle.current_mileage.toLocaleString()}`);
    if (vehicle.purchase_date) {
      try {
        const persianDate = new Date(vehicle.purchase_date).toLocaleDateString(
          "fa-IR"
        );
        details.push(`تاریخ خرید: ${persianDate}`);
      } catch (error) {
        details.push(`تاریخ خرید: ${vehicle.purchase_date}`);
      }
    }
    return details.join(" | ");
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
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">خودروهای من</Typography>
        <Button startIcon={<Refresh />} onClick={loadData} variant="outlined">
          بروزرسانی
        </Button>
      </Box>

      {/* Account Activation Warning */}
      <InactiveUserRestriction />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {vehicles.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 4 }}>
            <DirectionsCar
              sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              هنوز خودرویی اضافه نکرده‌اید
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              برای شروع مدیریت خودروهای خود، اولین خودرو را اضافه کنید
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddVehicle}
            >
              افزودن اولین خودرو
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <List>
              {vehicles.map((vehicle) => (
                <ListItem
                  key={vehicle.id}
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <ListItemIcon>
                    <DirectionsCar color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={getVehicleDisplayName(vehicle)}
                    secondary={getVehicleDetails(vehicle)}
                  />
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Tooltip title="ویرایش">
                      <IconButton
                        size="small"
                        onClick={() => handleEditVehicle(vehicle)}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="حذف">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteVehicle(vehicle.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Vehicle Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingVehicle ? "ویرایش خودرو" : "افزودن خودرو جدید"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="نام خودرو"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />

            {/* Vehicle Selection - This would need to be implemented with cascading dropdowns */}
            <Typography variant="body2" color="text.secondary">
              انتخاب خودرو از کاتالوگ (در حال توسعه)
            </Typography>

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
                  setFormData({ ...formData, license_plate: e.target.value })
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
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
              </LocalizationProvider>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>انصراف</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editingVehicle ? "ویرایش" : "افزودن"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      {vehicles.length > 0 && (
        <Fab
          color="primary"
          aria-label="add vehicle"
          sx={{ position: "fixed", bottom: 80, right: 16 }}
          onClick={handleAddVehicle}
        >
          <Add />
        </Fab>
      )}
    </Box>
  );
}
