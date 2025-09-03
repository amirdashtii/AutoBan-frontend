"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Tabs,
  Tab,
  Chip,
  Card,
  CardContent,
  Typography,
  Divider,
  Grid,
  IconButton,
} from "@mui/material";
import {
  DirectionsCar,
  Build,
  Edit,
  Add,
  Timeline,
  Speed,
  Palette,
} from "@mui/icons-material";
import { useRouter, useParams } from "next/navigation";
import {
  AppContainer,
  Header,
  ResponsiveContainer,
  ResponsiveGrid,
  ListItem,
  SectionHeader,
  StatusCard,
  FloatingButton,
  SlideIn,
  StaggeredList,
} from "@/components/ui";
import { IranLicensePlate } from "@/components/ui";

// Mock data
const mockVehicle = {
  id: 1,
  name: "پژو 206",
  user_id: "user123",
  license_plate: "12 ج 345 98",
  current_mileage: 85000,
  color: "نقره‌ای",
  production_year: 1399,
  purchase_date: "1399/05/12",
  vin: "NMT206123456789",
  generation_id: 1,
  brand: {
    id: 1,
    name_fa: "پژو",
    name_en: "Peugeot",
    description_fa: "خودروسازی پژو",
    description_en: "Peugeot Automotive",
    vehicle_type_id: 1,
  },
  model: {
    id: 1,
    brand_id: 1,
    name_fa: "206",
    name_en: "206",
    description_fa: "پژو 206 صندوقدار",
    description_en: "Peugeot 206 Sedan",
  },
  generation: {
    id: 1,
    model_id: 1,
    name_fa: "206 صندوقدار",
    name_en: "206 Sedan",
    description_fa: "نسل اول پژو 206 صندوقدار",
    description_en: "First generation Peugeot 206 Sedan",
    start_year: 1385,
    end_year: 1405,
    engine: "TU3JP",
    engine_volume: 1600,
    cylinders: 4,
    fuel_type: "بنزین",
    gearbox: "دستی",
    drivetrain_fa: "جلو",
    drivetrain_en: "FWD",
    body_style_fa: "صندوقدار",
    body_style_en: "Sedan",
    assembler: "ایران خودرو",
    assembly_type: "CKD",
    seller: "ایران خودرو",
    battery: "12V",
  },
  type: {
    id: 1,
    name_fa: "سواری",
    name_en: "Passenger",
    description_fa: "خودروی سواری",
    description_en: "Passenger Car",
  },
  services: [
    {
      id: 1,
      type: "تعویض روغن موتور",
      date: "1403/09/15",
      mileage: 83000,
      status: "completed",
      cost: 450000,
    },
    {
      id: 2,
      type: "تعویض فیلتر هوا",
      date: "1403/09/20",
      status: "pending",
      nextDue: 88000,
    },
  ],
};

export default function VehicleDetails() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [tabValue, setTabValue] = useState(0);

  const vehicle = mockVehicle;

  return (
    <AppContainer
      header={
        <Header
          title={vehicle.name}
          subtitle={`${vehicle.brand.name_fa} ${vehicle.model.name_fa} - ${vehicle.production_year}`}
          showBack
          onBackClick={() => router.back()}
          actions={[
            <IconButton key="edit">
              <Edit />
            </IconButton>,
          ]}
        />
      }
      fab={
        <FloatingButton
          icon={<Add />}
          onClick={() => router.push(`/dashboard/vehicles/${id}/services/add`)}
        />
      }
    >
      <ResponsiveContainer padding="medium" fullHeight={false}>
        {/* Vehicle Info Card */}
        <SlideIn direction="up">
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: 3,
                    bgcolor: "primary.light",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "primary.dark",
                  }}
                >
                  <DirectionsCar sx={{ fontSize: 30 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {vehicle.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {vehicle.brand.name_fa} {vehicle.model.name_fa} - سال{" "}
                    {vehicle.production_year}
                  </Typography>
                </Box>
                <Chip
                  label={vehicle.color}
                  icon={<Palette />}
                  variant="outlined"
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    پلاک خودرو
                  </Typography>
                  <IranLicensePlate value={vehicle.license_plate} />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    کیلومتر فعلی
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5 }}>
                    {vehicle.current_mileage.toLocaleString()} کم
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    سال تولید
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5 }}>
                    {vehicle.production_year}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    موتور
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5 }}>
                    {vehicle.generation.engine_volume}cc
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    سوخت
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5 }}>
                    {vehicle.generation.fuel_type}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    گیربکس
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5 }}>
                    {vehicle.generation.gearbox}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    سازنده
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5 }}>
                    {vehicle.generation.assembler}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </SlideIn>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={(_, v) => setTabValue(v)}
            variant="fullWidth"
          >
            <Tab label="سرویس‌ها" />
            <Tab label="یادآوری‌ها" />
          </Tabs>
        </Box>

        {/* Services Tab */}
        {tabValue === 0 && (
          <StaggeredList>
            {vehicle.services
              .filter((service) => service.status === "completed")
              .map((service) => (
                <ListItem
                  key={service.id}
                  title={service.type}
                  subtitle={`${
                    service.date
                  } - کیلومتر: ${service.mileage?.toLocaleString()}`}
                  avatar={
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        bgcolor: "success.light",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "success.dark",
                      }}
                    >
                      <Build />
                    </Box>
                  }
                  rightContent={
                    <Typography variant="body1">
                      {service.cost?.toLocaleString()} تومان
                    </Typography>
                  }
                />
              ))}
          </StaggeredList>
        )}

        {/* Reminders Tab */}
        {tabValue === 1 && (
          <StaggeredList>
            {vehicle.services
              .filter((service) => service.status === "pending")
              .map((service) => (
                <ListItem
                  key={service.id}
                  title={service.type}
                  subtitle={`سرویس بعدی: ${service.nextDue?.toLocaleString()} کیلومتر`}
                  avatar={
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        bgcolor: "warning.light",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "warning.dark",
                      }}
                    >
                      <Timeline />
                    </Box>
                  }
                  rightContent={
                    <Button size="small" variant="outlined" color="primary">
                      ثبت سرویس
                    </Button>
                  }
                />
              ))}
          </StaggeredList>
        )}
      </ResponsiveContainer>
    </AppContainer>
  );
}
