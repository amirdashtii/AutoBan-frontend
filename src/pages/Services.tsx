import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Build,
  OilBarrel,
  FilterAlt,
  Schedule,
  Add,
  CheckCircle,
  Warning,
} from "@mui/icons-material";
import InactiveUserRestriction from "../components/InactiveUserRestriction";

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
      id={`service-tabpanel-${index}`}
      aria-labelledby={`service-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Services() {
  const [tabValue, setTabValue] = React.useState(0);
  const [openAddDialog, setOpenAddDialog] = React.useState(false);

  // Mock data
  const mockServices = {
    upcoming: [
      {
        id: 1,
        vehicle: "پژو 206",
        service: "تعویض روغن",
        date: "1403/01/15",
        status: "scheduled",
        type: "oil_change",
      },
      {
        id: 2,
        vehicle: "سمند",
        service: "تعویض فیلتر هوا",
        date: "1403/01/20",
        status: "scheduled",
        type: "air_filter",
      },
    ],
    completed: [
      {
        id: 3,
        vehicle: "پژو 206",
        service: "تعویض روغن",
        date: "1402/12/15",
        status: "completed",
        type: "oil_change",
      },
      {
        id: 4,
        vehicle: "سمند",
        service: "تعویض فیلتر روغن",
        date: "1402/11/20",
        status: "completed",
        type: "oil_filter",
      },
    ],
    overdue: [
      {
        id: 5,
        vehicle: "پژو 206",
        service: "تعویض تسمه تایم",
        date: "1402/10/15",
        status: "overdue",
        type: "timing_belt",
      },
    ],
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddService = () => {
    setOpenAddDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenAddDialog(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "scheduled":
        return "primary";
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
      case "scheduled":
        return "برنامه‌ریزی شده";
      case "overdue":
        return "تأخیر";
      default:
        return "نامشخص";
    }
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case "oil_change":
        return <OilBarrel />;
      case "oil_filter":
      case "air_filter":
        return <FilterAlt />;
      default:
        return <Build />;
    }
  };

  return (
    <InactiveUserRestriction>
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
            سرویس‌ها
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddService}
          >
            افزودن سرویس
          </Button>
        </Box>

        {/* Quick Stats */}
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Card>
              <CardContent sx={{ textAlign: "center", py: 2 }}>
                <Schedule color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" component="div">
                  {mockServices.upcoming.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  برنامه‌ریزی شده
                </Typography>
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Card>
              <CardContent sx={{ textAlign: "center", py: 2 }}>
                <CheckCircle color="success" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" component="div">
                  {mockServices.completed.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  تکمیل شده
                </Typography>
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Card>
              <CardContent sx={{ textAlign: "center", py: 2 }}>
                <Warning color="error" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" component="div">
                  {mockServices.overdue.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  تأخیر
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="service tabs"
          >
            <Tab label="برنامه‌ریزی شده" />
            <Tab label="تکمیل شده" />
            <Tab label="تأخیر" />
          </Tabs>
        </Box>

        {/* Tab Panels */}
        <TabPanel value={tabValue} index={0}>
          <List>
            {mockServices.upcoming.map((service, index) => (
              <React.Fragment key={service.id}>
                <ListItem>
                  <ListItemIcon>
                    <Avatar
                      sx={{ bgcolor: "primary.main", width: 32, height: 32 }}
                    >
                      {getServiceIcon(service.type)}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={service.service}
                    secondary={`${service.vehicle} - ${service.date}`}
                  />
                  <Chip
                    label={getStatusText(service.status)}
                    color={getStatusColor(service.status) as any}
                    size="small"
                  />
                </ListItem>
                {index < mockServices.upcoming.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <List>
            {mockServices.completed.map((service, index) => (
              <React.Fragment key={service.id}>
                <ListItem>
                  <ListItemIcon>
                    <Avatar
                      sx={{ bgcolor: "success.main", width: 32, height: 32 }}
                    >
                      {getServiceIcon(service.type)}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={service.service}
                    secondary={`${service.vehicle} - ${service.date}`}
                  />
                  <Chip
                    label={getStatusText(service.status)}
                    color={getStatusColor(service.status) as any}
                    size="small"
                  />
                </ListItem>
                {index < mockServices.completed.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <List>
            {mockServices.overdue.map((service, index) => (
              <React.Fragment key={service.id}>
                <ListItem>
                  <ListItemIcon>
                    <Avatar
                      sx={{ bgcolor: "error.main", width: 32, height: 32 }}
                    >
                      {getServiceIcon(service.type)}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={service.service}
                    secondary={`${service.vehicle} - ${service.date}`}
                  />
                  <Chip
                    label={getStatusText(service.status)}
                    color={getStatusColor(service.status) as any}
                    size="small"
                  />
                </ListItem>
                {index < mockServices.overdue.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </TabPanel>

        {/* Add Service Dialog */}
        <Dialog
          open={openAddDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>افزودن سرویس جدید</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 1 }}>
              <FormControl fullWidth>
                <InputLabel>خودرو</InputLabel>
                <Select label="خودرو">
                  <MenuItem value="peugeot-206">پژو 206</MenuItem>
                  <MenuItem value="samand">سمند</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ mt: 2 }}>
              <FormControl fullWidth>
                <InputLabel>نوع سرویس</InputLabel>
                <Select label="نوع سرویس">
                  <MenuItem value="oil_change">تعویض روغن</MenuItem>
                  <MenuItem value="oil_filter">تعویض فیلتر روغن</MenuItem>
                  <MenuItem value="air_filter">تعویض فیلتر هوا</MenuItem>
                  <MenuItem value="timing_belt">تعویض تسمه تایم</MenuItem>
                  <MenuItem value="brake_service">سرویس ترمز</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="تاریخ سرویس"
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="توضیحات"
                multiline
                rows={3}
                placeholder="توضیحات اضافی..."
              />
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
          aria-label="add service"
          sx={{ position: "fixed", bottom: 80, right: 16 }}
          onClick={handleAddService}
        >
          <Add />
        </Fab>
      </Box>
    </InactiveUserRestriction>
  );
}
