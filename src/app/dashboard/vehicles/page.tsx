"use client";

import React, { useState } from "react";
import { Box, Button, Tabs, Tab, Badge, Chip, useTheme } from "@mui/material";
import {
  DirectionsCar,
  Add,
  Build,
  Schedule,
  CheckCircle,
  Warning,
  Search,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import InactiveUserRestriction from "@/components/InactiveUserRestriction";
import {
  AppContainer,
  Header,
  SearchHeader,
  ResponsiveContainer,
  ResponsiveGrid,
  ListItem,
  SectionHeader,
  FloatingButton,
  SlideIn,
  StaggeredList,
} from "@/components/ui";
import { useResponsive } from "@/components/ui/ResponsiveContainer";

// Mock data - در واقعیت از API می‌آید
const mockVehicles = [
  {
    id: 1,
    name: "پژو 206",
    model: "پژو 206 صندوقدار",
    year: 1399,
    plate: "12 ج 345 98",
    mileage: 85000,
    color: "نقره‌ای",
    services: [
      {
        id: 1,
        type: "تعویض روغن",
        date: "1403/09/15",
        mileage: 83000,
        status: "completed",
        nextDue: 90000,
      },
      {
        id: 2,
        type: "تعویض فیلتر هوا",
        date: "1403/09/20",
        mileage: 84000,
        status: "pending",
        nextDue: 88000,
      },
    ],
  },
  {
    id: 2,
    name: "پراید 131",
    model: "پراید 131 SE",
    year: 1395,
    plate: "56 د 789 98",
    mileage: 120000,
    color: "سفید",
    services: [
      {
        id: 3,
        type: "تعویض روغن",
        date: "1403/08/10",
        mileage: 118000,
        status: "completed",
        nextDue: 125000,
      },
    ],
  },
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vehicles-tabpanel-${index}`}
      aria-labelledby={`vehicles-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

export default function Vehicles() {
  const theme = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const { isMobile } = useResponsive();

  const [tabValue, setTabValue] = useState(0);
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "overdue":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "تکمیل شده";
      case "pending":
        return "در انتظار";
      case "overdue":
        return "عقب افتاده";
      default:
        return "نامشخص";
    }
  };

  const getServiceIcon = (type: string) => {
    if (type.includes("روغن")) return <Build />;
    if (type.includes("فیلتر")) return <Build />;
    return <Build />;
  };

  const needsService = (vehicle: any) => {
    return vehicle.services.some(
      (service: any) => vehicle.mileage >= service.nextDue - 2000
    );
  };

  const filteredVehicles = mockVehicles.filter((vehicle) =>
    vehicle.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredServices = mockVehicles
    .flatMap((vehicle) =>
      vehicle.services.map((service) => ({
        ...service,
        vehicleName: vehicle.name,
        vehicleId: vehicle.id,
      }))
    )
    .filter((service) => {
      if (tabValue === 1) return service.status === "completed";
      if (tabValue === 2) return service.status === "pending";
      return true;
    });

  return (
    <AppContainer
      header={
        searchMode ? (
          <SearchHeader
            placeholder="جستجو در خودروها..."
            value={searchQuery}
            onChange={setSearchQuery}
            onBlur={() => setSearchMode(false)}
            autoFocus
          />
        ) : (
          <Header
            title="خودروها و سرویس‌ها"
            subtitle={`${mockVehicles.length} خودرو ثبت شده`}
            actions={[
              <Button
                key="search"
                variant="text"
                size="small"
                startIcon={<Search />}
                onClick={() => setSearchMode(true)}
              >
                جستجو
              </Button>,
            ]}
          />
        )
      }
      fab={
        <FloatingButton
          icon={<Add />}
          onClick={() => router.push("/dashboard/vehicles/add")}
        />
      }
    >
      <InactiveUserRestriction />

      <ResponsiveContainer padding="medium" fullHeight={false}>
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
            <Tab
              label={
                <Badge badgeContent={mockVehicles.length} color="primary">
                  خودروها
                </Badge>
              }
            />
            <Tab
              label={
                <Badge
                  badgeContent={
                    filteredServices.filter((s) => s.status === "completed")
                      .length
                  }
                  color="success"
                >
                  سرویس‌ها
                </Badge>
              }
            />
            <Tab
              label={
                <Badge
                  badgeContent={
                    filteredServices.filter((s) => s.status === "pending")
                      .length
                  }
                  color="warning"
                >
                  یادآوری‌ها
                </Badge>
              }
            />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <TabPanel value={tabValue} index={0}>
          <SectionHeader title="خودروهای من" />
          <StaggeredList>
            {filteredVehicles.map((vehicle) => (
              <ListItem
                key={vehicle.id}
                title={vehicle.name}
                subtitle={`${vehicle.model} - ${
                  vehicle.year
                } | ${vehicle.mileage.toLocaleString()} کیلومتر`}
                avatar={
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      bgcolor: needsService(vehicle)
                        ? "warning.light"
                        : "primary.light",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: needsService(vehicle)
                        ? "warning.dark"
                        : "primary.dark",
                    }}
                  >
                    <DirectionsCar />
                  </Box>
                }
                badge={
                  needsService(vehicle)
                    ? vehicle.services.filter(
                        (s) => vehicle.mileage >= s.nextDue - 2000
                      ).length
                    : undefined
                }
                status={needsService(vehicle) ? "active" : "offline"}
                rightContent={
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
                  >
                    <Chip
                      label={vehicle.plate}
                      size="small"
                      variant="outlined"
                    />
                    {needsService(vehicle) && (
                      <Chip
                        label="نیاز به سرویس"
                        size="small"
                        color="warning"
                      />
                    )}
                  </Box>
                }
                onClick={() => router.push(`/dashboard/vehicles/${vehicle.id}`)}
              />
            ))}
          </StaggeredList>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <SectionHeader title="سرویس‌های تکمیل شده" />
          <StaggeredList>
            {filteredServices
              .filter((service) => service.status === "completed")
              .map((service) => (
                <ListItem
                  key={`${service.vehicleId}-${service.id}`}
                  title={service.type}
                  subtitle={`${service.vehicleName} - ${
                    service.date
                  } | کیلومتر: ${service.mileage.toLocaleString()}`}
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
                      {getServiceIcon(service.type)}
                    </Box>
                  }
                  rightContent={
                    <Chip
                      label={getStatusText(service.status)}
                      color={getStatusColor(service.status)}
                      size="small"
                    />
                  }
                  onClick={() =>
                    router.push(
                      `/dashboard/vehicles/${service.vehicleId}/services/${service.id}`
                    )
                  }
                />
              ))}
          </StaggeredList>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <SectionHeader title="یادآوری‌های سرویس" />
          <StaggeredList>
            {filteredServices
              .filter((service) => service.status === "pending")
              .map((service) => (
                <ListItem
                  key={`${service.vehicleId}-${service.id}`}
                  title={service.type}
                  subtitle={`${
                    service.vehicleName
                  } - سرویس بعدی: ${service.nextDue.toLocaleString()} کیلومتر`}
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
                      <Schedule />
                    </Box>
                  }
                  rightContent={
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                      }}
                    >
                      <Chip
                        label={getStatusText(service.status)}
                        color={getStatusColor(service.status)}
                        size="small"
                      />
                      <Button size="small" variant="outlined" color="warning">
                        ثبت سرویس
                      </Button>
                    </Box>
                  }
                  onClick={() =>
                    router.push(`/dashboard/vehicles/${service.vehicleId}`)
                  }
                />
              ))}
          </StaggeredList>
        </TabPanel>
      </ResponsiveContainer>
    </AppContainer>
  );
}
