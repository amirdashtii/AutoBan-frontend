import React from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  styled,
} from "@mui/material";
import {
  Home as HomeIcon,
  DirectionsCar as VehicleIcon,
  Build as ServiceIcon,
  Person as ProfileIcon,
  History as HistoryIcon,
} from "@mui/icons-material";

const StyledBottomNavigation = styled(BottomNavigation)(({ theme }) => ({
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  borderTop: `1px solid ${theme.palette.divider}`,
  "& .MuiBottomNavigationAction-root": {
    minWidth: "auto",
    padding: theme.spacing(1, 0),
    "&.Mui-selected": {
      color: theme.palette.primary.main,
    },
  },
}));

export type NavigationTab =
  | "home"
  | "vehicles"
  | "services"
  | "history"
  | "profile";

interface BottomNavigationProps {
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

export default function BottomNavigationComponent({
  currentTab,
  onTabChange,
}: BottomNavigationProps) {
  return (
    <Paper
      elevation={3}
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderTop: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <StyledBottomNavigation
        value={currentTab}
        onChange={(_, newValue) => onTabChange(newValue)}
        showLabels
      >
        <BottomNavigationAction label="خانه" value="home" icon={<HomeIcon />} />
        <BottomNavigationAction
          label="خودروها"
          value="vehicles"
          icon={<VehicleIcon />}
        />
        <BottomNavigationAction
          label="سرویس"
          value="services"
          icon={<ServiceIcon />}
        />
        <BottomNavigationAction
          label="تاریخچه"
          value="history"
          icon={<HistoryIcon />}
        />
        <BottomNavigationAction
          label="پروفایل"
          value="profile"
          icon={<ProfileIcon />}
        />
      </StyledBottomNavigation>
    </Paper>
  );
}
