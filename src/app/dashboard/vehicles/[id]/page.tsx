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
  model: "پژو 206 صندوقدار",
  brand: "پژو",
  year: 1399,
  plate: "12 ج 345 98",
  mileage: 85000,
  color: "نقره‌ای",
  vin: "NAAPZ12345678900",
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
          subtitle={`${vehicle.brand} ${vehicle.model} - ${vehicle.year}`}
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
                    {vehicle.brand} {vehicle.model} - سال {vehicle.year}
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
                <Grid size={6}>
                  <Typography variant="body2" color="text.secondary">
                    پلاک خودرو
                  </Typography>
                  <IranLicensePlate value={vehicle.plate} />
                </Grid>
                <Grid size={6}>
                  <Typography variant="body2" color="text.secondary">
                    کیلومتر فعلی
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5 }}>
                    {vehicle.mileage.toLocaleString()} کیلومتر
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
