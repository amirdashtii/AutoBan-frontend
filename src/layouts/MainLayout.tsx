import React from "react";
import { Box, CssBaseline } from "@mui/material";
import BottomNavigationComponent, {
  NavigationTab,
} from "../components/layout/BottomNavigation";
import Home from "../pages/Home";
import Vehicles from "../pages/Vehicles";
import Services from "../pages/Services";
import History from "../pages/History";
import Profile from "../pages/Profile";
import AppTheme from "../theme/AppTheme";

export default function MainLayout() {
  const [currentTab, setCurrentTab] = React.useState<NavigationTab>("home");

  const handleTabChange = (tab: NavigationTab) => {
    setCurrentTab(tab);
  };

  const renderCurrentPage = () => {
    switch (currentTab) {
      case "home":
        return <Home />;
      case "vehicles":
        return <Vehicles />;
      case "services":
        return <Services />;
      case "history":
        return <History />;
      case "profile":
        return <Profile />;
      default:
        return <Home />;
    }
  };

  return (
    <AppTheme>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          width: "100vw",
          maxWidth: "100vw",
          overflow: "hidden",
          "& *": {
            boxSizing: "border-box",
          },
        }}
      >
        {/* Main Content */}
        <Box sx={{ flex: 1, width: "100%", maxWidth: "100%" }}>
          {renderCurrentPage()}
        </Box>

        {/* Bottom Navigation */}
        <BottomNavigationComponent
          currentTab={currentTab}
          onTabChange={handleTabChange}
        />
      </Box>
    </AppTheme>
  );
}
