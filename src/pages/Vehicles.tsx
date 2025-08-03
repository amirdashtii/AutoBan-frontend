import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Fab,
} from "@mui/material";
import { DirectionsCar, Build, Edit, Delete, Add } from "@mui/icons-material";

export default function Vehicles() {
  const [openAddDialog, setOpenAddDialog] = React.useState(false);

  // Mock data - در آینده از API دریافت می‌شود
  const mockVehicles = [
    {
      id: 1,
      name: "پژو 206",
      model: "206",
      brand: "پژو",
      year: "1395",
      plate: "12-345-67",
      lastService: "1402/11/15",
      nextService: "1403/02/15",
      status: "active",
    },
    {
      id: 2,
      name: "سمند",
      model: "سمند",
      brand: "ایران خودرو",
      year: "1398",
      plate: "98-123-45",
      lastService: "1402/10/20",
      nextService: "1403/01/20",
      status: "active",
    },
  ];

  const handleAddVehicle = () => {
    setOpenAddDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenAddDialog(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "maintenance":
        return "warning";
      case "inactive":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "فعال";
      case "maintenance":
        return "در سرویس";
      case "inactive":
        return "غیرفعال";
      default:
        return "نامشخص";
    }
  };

  return (
    <Box sx={{ p: 2, pb: 8 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          خودروهای من
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddVehicle}
        >
          افزودن خودرو
        </Button>
      </Box>

      {/* Vehicles List */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {mockVehicles.map((vehicle) => (
          <Box key={vehicle.id}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                    <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                      <DirectionsCar />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {vehicle.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        {vehicle.brand} {vehicle.model} - {vehicle.year}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        پلاک: {vehicle.plate}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={getStatusText(vehicle.status)}
                    color={getStatusColor(vehicle.status) as any}
                    size="small"
                  />
                </Box>

                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      آخرین سرویس: {vehicle.lastService}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      سرویس بعدی: {vehicle.nextService}
                    </Typography>
                  </Box>
                  <Box>
                    <Button size="small" startIcon={<Build />} sx={{ mr: 1 }}>
                      سرویس
                    </Button>
                    <Button size="small" startIcon={<Edit />} sx={{ mr: 1 }}>
                      ویرایش
                    </Button>
                    <Button size="small" color="error" startIcon={<Delete />}>
                      حذف
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {/* Add Vehicle Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>افزودن خودرو جدید</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="نام خودرو"
                placeholder="مثال: پژو 206"
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <FormControl fullWidth>
                <InputLabel>برند</InputLabel>
                <Select label="برند">
                  <MenuItem value="peugeot">پژو</MenuItem>
                  <MenuItem value="iran-khodro">ایران خودرو</MenuItem>
                  <MenuItem value="saipa">سایپا</MenuItem>
                  <MenuItem value="other">سایر</MenuItem>
                </Select>
              </FormControl>
              <TextField fullWidth label="مدل" placeholder="مثال: 206" />
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField fullWidth label="سال ساخت" placeholder="مثال: 1395" />
              <TextField fullWidth label="پلاک" placeholder="مثال: 12-345-67" />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>انصراف</Button>
          <Button variant="contained" onClick={handleCloseDialog}>
            افزودن
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add vehicle"
        sx={{ position: "fixed", bottom: 80, right: 16 }}
        onClick={handleAddVehicle}
      >
        <Add />
      </Fab>
    </Box>
  );
}
