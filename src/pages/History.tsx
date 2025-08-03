import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Build,
  OilBarrel,
  FilterAlt,
  CalendarToday,
  AttachMoney,
  LocationOn,
} from "@mui/icons-material";

export default function History() {
  const [selectedVehicle, setSelectedVehicle] = React.useState("all");

  // Mock data
  const mockHistory = [
    {
      id: 1,
      vehicle: "پژو 206",
      service: "تعویض روغن",
      date: "1402/12/15",
      cost: "150,000 تومان",
      location: "تعمیرگاه مرکزی",
      type: "oil_change",
      status: "completed",
      description: "تعویض روغن موتور و فیلتر روغن",
    },
    {
      id: 2,
      vehicle: "سمند",
      service: "تعویض فیلتر هوا",
      date: "1402/12/10",
      cost: "80,000 تومان",
      location: "تعمیرگاه مرکزی",
      type: "air_filter",
      status: "completed",
      description: "تعویض فیلتر هوای موتور",
    },
    {
      id: 3,
      vehicle: "پژو 206",
      service: "تعویض لنت ترمز",
      date: "1402/11/20",
      cost: "250,000 تومان",
      location: "تعمیرگاه مرکزی",
      type: "brake_service",
      status: "completed",
      description: "تعویض لنت ترمز جلو و عقب",
    },
    {
      id: 4,
      vehicle: "سمند",
      service: "تعویض روغن",
      date: "1402/11/15",
      cost: "150,000 تومان",
      location: "تعمیرگاه مرکزی",
      type: "oil_change",
      status: "completed",
      description: "تعویض روغن موتور و فیلتر روغن",
    },
    {
      id: 5,
      vehicle: "پژو 206",
      service: "تعویض تسمه تایم",
      date: "1402/10/25",
      cost: "500,000 تومان",
      location: "تعمیرگاه مرکزی",
      type: "timing_belt",
      status: "completed",
      description: "تعویض تسمه تایم و پولی",
    },
  ];

  const vehicles = [
    { value: "all", label: "همه خودروها" },
    { value: "peugeot-206", label: "پژو 206" },
    { value: "samand", label: "سمند" },
  ];

  const getServiceIcon = (type: string) => {
    switch (type) {
      case "oil_change":
        return <OilBarrel />;
      case "oil_filter":
      case "air_filter":
        return <FilterAlt />;
      case "brake_service":
        return <Build />;
      default:
        return <Build />;
    }
  };

  const getServiceColor = (type: string) => {
    switch (type) {
      case "oil_change":
        return "primary.main";
      case "oil_filter":
      case "air_filter":
        return "secondary.main";
      case "brake_service":
        return "warning.main";
      default:
        return "grey.500";
    }
  };

  const filteredHistory =
    selectedVehicle === "all"
      ? mockHistory
      : mockHistory.filter((item) => {
          if (selectedVehicle === "peugeot-206")
            return item.vehicle === "پژو 206";
          if (selectedVehicle === "samand") return item.vehicle === "سمند";
          return true;
        });

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
          تاریخچه سرویس‌ها
        </Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>فیلتر خودرو</InputLabel>
          <Select
            value={selectedVehicle}
            label="فیلتر خودرو"
            onChange={(e) => setSelectedVehicle(e.target.value)}
          >
            {vehicles.map((vehicle) => (
              <MenuItem key={vehicle.value} value={vehicle.value}>
                {vehicle.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent sx={{ textAlign: "center", py: 2 }}>
              <Build color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div">
                {filteredHistory.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                کل سرویس‌ها
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent sx={{ textAlign: "center", py: 2 }}>
              <AttachMoney color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div">
                {filteredHistory
                  .reduce((sum, item) => {
                    const cost = parseInt(item.cost.replace(/[^\d]/g, ""));
                    return sum + cost;
                  }, 0)
                  .toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                تومان هزینه
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent sx={{ textAlign: "center", py: 2 }}>
              <CalendarToday color="info" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div">
                {filteredHistory.length > 0
                  ? new Date().getFullYear() -
                    parseInt(
                      filteredHistory[filteredHistory.length - 1].date.split(
                        "/"
                      )[0]
                    ) +
                    1
                  : 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                سال فعالیت
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Timeline */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            تاریخچه کامل
          </Typography>
          <Box sx={{ mt: 2 }}>
            {filteredHistory.map((item, index) => (
              <Box key={item.id} sx={{ mb: 3 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 1,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          sx={{
                            bgcolor: getServiceColor(item.type),
                            width: 32,
                            height: 32,
                            mr: 2,
                          }}
                        >
                          {getServiceIcon(item.type)}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" component="span">
                            {item.service}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            display="block"
                          >
                            {item.vehicle} - {item.date}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        label={item.cost}
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {item.description}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                      <LocationOn
                        sx={{
                          fontSize: 16,
                          mr: 0.5,
                          color: "text.secondary",
                        }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {item.location}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* List View (Alternative) */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            لیست سرویس‌ها
          </Typography>
          <List>
            {filteredHistory.map((item, index) => (
              <React.Fragment key={item.id}>
                <ListItem>
                  <ListItemIcon>
                    <Avatar
                      sx={{
                        bgcolor: `${getServiceColor(item.type)}`,
                        width: 32,
                        height: 32,
                      }}
                    >
                      {getServiceIcon(item.type)}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="subtitle1">
                          {item.service}
                        </Typography>
                        <Chip
                          label={item.cost}
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        {item.vehicle} - {item.date}
                        <br />
                        {item.description}
                        <br />
                        📍 {item.location}
                      </>
                    }
                  />
                </ListItem>
                {index < filteredHistory.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}
