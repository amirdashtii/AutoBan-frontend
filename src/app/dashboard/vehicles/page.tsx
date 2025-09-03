"use client";

import React, { useState, useMemo } from "react";
import {
  Box,
  Button,
  Tabs,
  Tab,
  Badge,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Divider,
  Typography,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
  Switch,
  FormControlLabel,
  Alert,
} from "@mui/material";
import {
  DirectionsCar,
  Add,
  Build,
  Schedule,
  Search,
  FilterList,
  Sort,
  MoreVert,
  Visibility,
  Edit,
  Delete,
  Share,
  PictureAsPdf,
  Refresh,
  Warning,
  CheckCircle,
  TrendingUp,
  Speed,
  LocalGasStation,
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
  StatusCard,
} from "@/components/ui";
import { useResponsive } from "@/components/ui/ResponsiveContainer";

// Mock data - در واقعیت از API می‌آید
const mockVehicles = [
  {
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
    // اطلاعات اضافی برای نمایش
    status: "active",
    lastService: "1403/09/15",
    nextService: 90000,
    services: [
      {
        id: 1,
        type: "تعویض روغن",
        date: "1403/09/15",
        mileage: 83000,
        status: "completed",
        nextDue: 90000,
        cost: 450000,
        urgent: false,
      },
      {
        id: 2,
        type: "تعویض فیلتر هوا",
        date: "1403/09/20",
        mileage: 84000,
        status: "pending",
        nextDue: 88000,
        cost: 200000,
        urgent: true,
      },
    ],
  },
  {
    id: 2,
    name: "پراید 131",
    user_id: "user123",
    license_plate: "56 د 789 98",
    current_mileage: 120000,
    color: "سفید",
    production_year: 1395,
    purchase_date: "1395/03/20",
    vin: "SAIPA131987654321",
    generation_id: 2,
    brand: {
      id: 2,
      name_fa: "پراید",
      name_en: "Pride",
      description_fa: "خودروسازی سایپا",
      description_en: "SAIPA Automotive",
      vehicle_type_id: 1,
    },
    model: {
      id: 2,
      brand_id: 2,
      name_fa: "131",
      name_en: "131",
      description_fa: "پراید 131",
      description_en: "Pride 131",
    },
    generation: {
      id: 2,
      model_id: 2,
      name_fa: "131 SE",
      name_en: "131 SE",
      description_fa: "پراید 131 نسل جدید",
      description_en: "Pride 131 SE",
      start_year: 1390,
      end_year: 1400,
      engine: "EF7",
      engine_volume: 1300,
      cylinders: 4,
      fuel_type: "بنزین",
      gearbox: "دستی",
      drivetrain_fa: "جلو",
      drivetrain_en: "FWD",
      body_style_fa: "هاچ‌بک",
      body_style_en: "Hatchback",
      assembler: "سایپا",
      assembly_type: "Local",
      seller: "سایپا",
      battery: "12V",
    },
    type: {
      id: 1,
      name_fa: "سواری",
      name_en: "Passenger",
      description_fa: "خودروی سواری",
      description_en: "Passenger Car",
    },
    // اطلاعات اضافی برای نمایش
    status: "active",
    lastService: "1403/08/10",
    nextService: 125000,
    services: [
      {
        id: 3,
        type: "تعویض روغن",
        date: "1403/08/10",
        mileage: 118000,
        status: "completed",
        nextDue: 125000,
        cost: 400000,
        urgent: false,
      },
    ],
  },
];

// Filter options
const brandOptions = ["همه", "پژو", "پراید", "سمند", "دنا", "سایپا"];
const yearOptions = ["همه", "1395-1399", "1400-1403", "1404+"];
const statusOptions = ["همه", "فعال", "نیاز به سرویس", "غیرفعال"];
const sortOptions = [
  { value: "name", label: "نام خودرو" },
  { value: "year", label: "سال تولید" },
  { value: "mileage", label: "کیلومتر" },
  { value: "lastService", label: "آخرین سرویس" },
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
  const { user } = useAuth();
  const router = useRouter();
  const { isMobile } = useResponsive();

  // State management
  const [tabValue, setTabValue] = useState(0);
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);

  // Filter states
  const [filters, setFilters] = useState({
    brand: "همه",
    year: "همه",
    status: "همه",
    sortBy: "name",
    sortOrder: "asc" as "asc" | "desc",
  });

  // View options
  const [viewOptions, setViewOptions] = useState({
    showImages: true,
    compactView: false,
    showCosts: true,
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    vehicle: any
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedVehicle(vehicle);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedVehicle(null);
  };

  const handleFilterChange = (filterName: string, value: any) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  // Filter and sort vehicles
  const filteredVehicles = useMemo(() => {
    let result = mockVehicles.filter((vehicle) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !vehicle.name.toLowerCase().includes(query) &&
          !vehicle.model.name_fa.toLowerCase().includes(query) &&
          !vehicle.license_plate.includes(query)
        ) {
          return false;
        }
      }

      // Brand filter
      if (filters.brand !== "همه" && vehicle.brand.name_fa !== filters.brand) {
        return false;
      }

      // Year filter
      if (filters.year !== "همه") {
        const yearRange = filters.year.split("-");
        if (yearRange.length === 2) {
          const minYear = parseInt(yearRange[0]);
          const maxYear = yearRange[1] === "+" ? 9999 : parseInt(yearRange[1]);
          if (
            vehicle.production_year < minYear ||
            vehicle.production_year > maxYear
          ) {
            return false;
          }
        }
      }

      // Status filter
      if (filters.status !== "همه") {
        const needsService = vehicle.services.some(
          (s) => vehicle.current_mileage >= s.nextDue - 2000
        );
        if (filters.status === "نیاز به سرویس" && !needsService) {
          return false;
        }
        if (filters.status === "فعال" && needsService) {
          return false;
        }
      }

      return true;
    });

    // Sort
    result.sort((a, b) => {
      let aValue, bValue;
      switch (filters.sortBy) {
        case "name":
          aValue = a.name;
          bValue = b.name;
          break;
        case "year":
          aValue = a.production_year;
          bValue = b.production_year;
          break;
        case "mileage":
          aValue = a.current_mileage;
          bValue = b.current_mileage;
          break;
        case "lastService":
          aValue = new Date(a.lastService).getTime();
          bValue = new Date(b.lastService).getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return filters.sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return filters.sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [searchQuery, filters]);

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

  const needsService = (vehicle: any) => {
    return vehicle.services.some(
      (service: any) => vehicle.current_mileage >= service.nextDue - 2000
    );
  };

  const getUrgentServices = () => {
    return mockVehicles.flatMap((vehicle) =>
      vehicle.services
        .filter(
          (service) =>
            service.urgent || vehicle.current_mileage >= service.nextDue - 1000
        )
        .map((service) => ({
          ...service,
          vehicleName: vehicle.name,
          vehicleId: vehicle.id,
        }))
    );
  };

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
      if (tabValue === 2) return service.status === "pending" || service.urgent;
      return true;
    });

  // Statistics
  const stats = {
    totalVehicles: mockVehicles.length,
    activeVehicles: mockVehicles.filter((v) => v.status === "active").length,
    needsServiceCount: mockVehicles.filter(needsService).length,
    totalServices: mockVehicles.reduce((sum, v) => sum + v.services.length, 0),
    urgentReminders: getUrgentServices().length,
  };

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
            subtitle={`${stats.totalVehicles} خودرو | ${stats.totalServices} سرویس`}
            actions={[
              <IconButton
                key="search"
                onClick={() => setSearchMode(true)}
                size="small"
              >
                <Search />
              </IconButton>,
              <IconButton
                key="filter"
                onClick={() => setShowFilters(true)}
                size="small"
                color={
                  Object.values(filters).some(
                    (v) => v !== "همه" && v !== "name" && v !== "asc"
                  )
                    ? "primary"
                    : "default"
                }
              >
                <FilterList />
              </IconButton>,
              <IconButton
                key="refresh"
                onClick={() => window.location.reload()}
                size="small"
              >
                <Refresh />
              </IconButton>,
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
        {/* Quick Stats */}
        <SlideIn direction="up">
          <ResponsiveGrid columns={{ xs: 2, sm: 4 }} gap={2} sx={{ mb: 3 }}>
            <StatusCard
              title="کل خودروها"
              value={stats.totalVehicles.toString()}
              subtitle="ثبت شده"
              icon={<DirectionsCar />}
              color="primary"
            />
            <StatusCard
              title="نیاز به سرویس"
              value={stats.needsServiceCount.toString()}
              subtitle="خودرو"
              icon={<Warning />}
              color="warning"
            />
            <StatusCard
              title="سرویس‌های امسال"
              value={stats.totalServices.toString()}
              subtitle="انجام شده"
              icon={<Build />}
              color="success"
            />
            <StatusCard
              title="یادآوری فوری"
              value={stats.urgentReminders.toString()}
              subtitle="مورد"
              icon={<Schedule />}
              color="error"
            />
          </ResponsiveGrid>
        </SlideIn>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
            <Tab
              label={
                <Badge badgeContent={stats.totalVehicles} color="primary">
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
                <Badge badgeContent={stats.urgentReminders} color="error">
                  یادآوری‌ها
                </Badge>
              }
            />
          </Tabs>
        </Box>

        {/* Vehicles Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <SectionHeader title={`خودروهای من (${filteredVehicles.length})`} />
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                size="small"
                variant={viewOptions.compactView ? "contained" : "outlined"}
                onClick={() =>
                  setViewOptions((prev) => ({
                    ...prev,
                    compactView: !prev.compactView,
                  }))
                }
              >
                {viewOptions.compactView ? "نمایش کامل" : "نمایش فشرده"}
              </Button>
            </Box>
          </Box>

          <StaggeredList>
            {filteredVehicles.map((vehicle) => (
              <ListItem
                key={vehicle.id}
                title={vehicle.name}
                subtitle={
                  viewOptions.compactView || isMobile
                    ? `${
                        vehicle.production_year
                      } | ${vehicle.current_mileage.toLocaleString()} کم`
                    : `${vehicle.model.name_fa} - ${
                        vehicle.production_year
                      } | ${vehicle.current_mileage.toLocaleString()} کیلومتر | آخرین سرویس: ${
                        vehicle.lastService
                      }`
                }
                avatar={
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
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
                        (s) => vehicle.current_mileage >= s.nextDue - 2000
                      ).length
                    : undefined
                }
                status={needsService(vehicle) ? "offline" : "online"}
                rightContent={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                        alignItems: "flex-end",
                        minWidth: 0, // اجازه shrink
                      }}
                    >
                      <Chip
                        label={vehicle.license_plate}
                        size="small"
                        variant="outlined"
                        sx={{
                          maxWidth: { xs: 80, sm: "none" },
                          "& .MuiChip-label": {
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          },
                        }}
                      />
                      {needsService(vehicle) && (
                        <Chip
                          label={isMobile ? "سرویس" : "نیاز به سرویس"}
                          size="small"
                          color="warning"
                          sx={{
                            maxWidth: { xs: 80, sm: "none" },
                            "& .MuiChip-label": {
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            },
                          }}
                        />
                      )}
                      {viewOptions.showCosts && !isMobile && (
                        <Typography variant="caption" color="text.secondary">
                          سرویس بعدی: {vehicle.nextService.toLocaleString()}
                        </Typography>
                      )}
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, vehicle)}
                    >
                      <MoreVert />
                    </IconButton>
                  </Box>
                }
                onClick={() => router.push(`/dashboard/vehicles/${vehicle.id}`)}
              />
            ))}
          </StaggeredList>

          {filteredVehicles.length === 0 && (
            <Card>
              <CardContent sx={{ textAlign: "center", py: 4 }}>
                <DirectionsCar
                  sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  خودرویی یافت نشد
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {searchQuery ||
                  Object.values(filters).some(
                    (v) => v !== "همه" && v !== "name" && v !== "asc"
                  )
                    ? "نتیجه‌ای برای فیلتر یا جستجوی شما یافت نشد"
                    : "هنوز خودرویی ثبت نکرده‌اید"}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => router.push("/dashboard/vehicles/add")}
                >
                  افزودن خودرو
                </Button>
              </CardContent>
            </Card>
          )}
        </TabPanel>

        {/* Services Tab */}
        <TabPanel value={tabValue} index={1}>
          <SectionHeader title="سرویس‌های تکمیل شده" />
          <StaggeredList>
            {filteredServices
              .filter((service) => service.status === "completed")
              .map((service) => (
                <ListItem
                  key={`${service.vehicleId}-${service.id}`}
                  title={service.type}
                  subtitle={
                    isMobile
                      ? `${service.vehicleName} - ${service.date}`
                      : `${service.vehicleName} - ${
                          service.date
                        } | کیلومتر: ${service.mileage?.toLocaleString()}`
                  }
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
                    <Box sx={{ textAlign: "right", minWidth: 0 }}>
                      <Chip
                        label={getStatusText(service.status)}
                        color={getStatusColor(service.status)}
                        size="small"
                        sx={{
                          maxWidth: { xs: 70, sm: "none" },
                          "& .MuiChip-label": {
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          },
                        }}
                      />
                      {viewOptions.showCosts && !isMobile && (
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {service.cost?.toLocaleString()} تومان
                        </Typography>
                      )}
                    </Box>
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

        {/* Reminders Tab */}
        <TabPanel value={tabValue} index={2}>
          <SectionHeader title="یادآوری‌های فوری" />
          <StaggeredList>
            {getUrgentServices().map((service) => (
              <ListItem
                key={`${service.vehicleId}-${service.id}`}
                title={service.type}
                subtitle={
                  isMobile
                    ? service.vehicleName
                    : `${
                        service.vehicleName
                      } - سرویس بعدی: ${service.nextDue?.toLocaleString()} کیلومتر`
                }
                avatar={
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      bgcolor: service.urgent ? "error.light" : "warning.light",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: service.urgent ? "error.dark" : "warning.dark",
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
                      gap: 1,
                      minWidth: 0,
                      alignItems: "flex-end",
                    }}
                  >
                    {service.urgent && (
                      <Chip
                        label="فوری"
                        color="error"
                        size="small"
                        sx={{
                          maxWidth: { xs: 60, sm: "none" },
                          "& .MuiChip-label": {
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          },
                        }}
                      />
                    )}
                    <Button
                      size="small"
                      variant="outlined"
                      color={service.urgent ? "error" : "warning"}
                      sx={{
                        minWidth: { xs: 70, sm: "auto" },
                        fontSize: { xs: "0.7rem", sm: "0.875rem" },
                      }}
                    >
                      {isMobile ? "سرویس" : "ثبت سرویس"}
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

      {/* Vehicle Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            router.push(`/dashboard/vehicles/${selectedVehicle?.id}`);
            handleMenuClose();
          }}
        >
          <Visibility sx={{ mr: 1 }} />
          مشاهده جزئیات
        </MenuItem>
        <MenuItem
          onClick={() => {
            router.push(`/dashboard/vehicles/${selectedVehicle?.id}/edit`);
            handleMenuClose();
          }}
        >
          <Edit sx={{ mr: 1 }} />
          ویرایش
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose}>
          <Share sx={{ mr: 1 }} />
          اشتراک‌گذاری
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <PictureAsPdf sx={{ mr: 1 }} />
          خروجی PDF
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose} sx={{ color: "error.main" }}>
          <Delete sx={{ mr: 1 }} />
          حذف
        </MenuItem>
      </Menu>

      {/* Filter Dialog */}
      <Dialog
        open={showFilters}
        onClose={() => setShowFilters(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>فیلتر و مرتب‌سازی</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
            {/* Brand Filter */}
            <FormControl fullWidth>
              <InputLabel>برند خودرو</InputLabel>
              <Select
                value={filters.brand}
                onChange={(e) => handleFilterChange("brand", e.target.value)}
                label="برند خودرو"
              >
                {brandOptions.map((brand) => (
                  <MenuItem key={brand} value={brand}>
                    {brand}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Year Filter */}
            <FormControl fullWidth>
              <InputLabel>سال تولید</InputLabel>
              <Select
                value={filters.year}
                onChange={(e) => handleFilterChange("year", e.target.value)}
                label="سال تولید"
              >
                {yearOptions.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Status Filter */}
            <FormControl fullWidth>
              <InputLabel>وضعیت</InputLabel>
              <Select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                label="وضعیت"
              >
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Sort Options */}
            <FormControl fullWidth>
              <InputLabel>مرتب‌سازی بر اساس</InputLabel>
              <Select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                label="مرتب‌سازی بر اساس"
              >
                {sortOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Sort Order */}
            <FormControlLabel
              control={
                <Switch
                  checked={filters.sortOrder === "desc"}
                  onChange={(e) =>
                    handleFilterChange(
                      "sortOrder",
                      e.target.checked ? "desc" : "asc"
                    )
                  }
                />
              }
              label="مرتب‌سازی نزولی"
            />

            <Divider />

            {/* View Options */}
            <Typography variant="subtitle2" color="text.secondary">
              گزینه‌های نمایش
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={viewOptions.showCosts}
                  onChange={(e) =>
                    setViewOptions((prev) => ({
                      ...prev,
                      showCosts: e.target.checked,
                    }))
                  }
                />
              }
              label="نمایش هزینه‌ها"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setFilters({
                brand: "همه",
                year: "همه",
                status: "همه",
                sortBy: "name",
                sortOrder: "asc",
              });
              setSearchQuery("");
            }}
          >
            ریست
          </Button>
          <Button onClick={() => setShowFilters(false)} variant="contained">
            اعمال
          </Button>
        </DialogActions>
      </Dialog>
    </AppContainer>
  );
}
