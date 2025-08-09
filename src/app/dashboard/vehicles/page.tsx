"use client";

import React from "react";
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
} from "@mui/material";
import { DirectionsCar, Add, Edit, Delete, Person } from "@mui/icons-material";
import { useAuth } from "@/hooks/useAuth";
import InactiveUserRestriction from "@/components/InactiveUserRestriction";

export default function Vehicles() {
  const { user } = useAuth();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [vehicles, setVehicles] = React.useState([
    {
      id: 1,
      name: "پژو 206",
      model: "206",
      year: "1395",
      plate: "12-345-67",
      color: "سفید",
      mileage: "85000",
    },
    {
      id: 2,
      name: "سمند",
      model: "LX",
      year: "1390",
      plate: "98-765-43",
      color: "مشکی",
      mileage: "120000",
    },
  ]);

  const [formData, setFormData] = React.useState({
    name: "",
    model: "",
    year: "",
    plate: "",
    color: "",
    mileage: "",
  });

  const handleAddVehicle = () => {
    if (formData.name && formData.model) {
      const newVehicle = {
        id: vehicles.length + 1,
        ...formData,
      };
      setVehicles([...vehicles, newVehicle]);
      setFormData({
        name: "",
        model: "",
        year: "",
        plate: "",
        color: "",
        mileage: "",
      });
      setOpenDialog(false);
    }
  };

  return (
    <InactiveUserRestriction>
      <Box sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom>
          خودروهای من
        </Typography>

        <Card sx={{ mb: 3 }}>
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
                    primary={vehicle.name}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          مدل: {vehicle.model} - سال: {vehicle.year}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          پلاک: {vehicle.plate} - رنگ: {vehicle.color}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          کیلومتر: {vehicle.mileage}
                        </Typography>
                      </Box>
                    }
                  />
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button size="small" startIcon={<Edit />}>
                      ویرایش
                    </Button>
                    <Button size="small" color="error" startIcon={<Delete />}>
                      حذف
                    </Button>
                  </Box>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>

        {/* Add Vehicle Dialog */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>افزودن خودرو جدید</DialogTitle>
          <DialogContent>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label="نام خودرو"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <TextField
                fullWidth
                label="مدل"
                value={formData.model}
                onChange={(e) =>
                  setFormData({ ...formData, model: e.target.value })
                }
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label="سال ساخت"
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: e.target.value })
                }
              />
              <TextField
                fullWidth
                label="پلاک"
                value={formData.plate}
                onChange={(e) =>
                  setFormData({ ...formData, plate: e.target.value })
                }
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label="رنگ"
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
              />
              <TextField
                fullWidth
                label="کیلومتر"
                value={formData.mileage}
                onChange={(e) =>
                  setFormData({ ...formData, mileage: e.target.value })
                }
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>انصراف</Button>
            <Button variant="contained" onClick={handleAddVehicle}>
              افزودن
            </Button>
          </DialogActions>
        </Dialog>

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: "fixed", bottom: 80, right: 16 }}
          onClick={() => setOpenDialog(true)}
        >
          <Add />
        </Fab>
      </Box>
    </InactiveUserRestriction>
  );
}
