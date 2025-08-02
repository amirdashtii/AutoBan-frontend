import { useState } from "react";
import reactLogo from "./assets/react.svg";
import appLogo from "/favicon.svg";
import PWABadge from "./components/PWABadge";
import LoadingSpinner from "./components/LoadingSpinner";
import "./App.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./hooks/useAuth";
import React from "react";

// Protected Route Component
const ProtectedRoute = React.memo(({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner message="در حال بررسی احراز هویت..." />;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/signin" replace />;
});

// Public Route Component (redirects to dashboard if already authenticated)
const PublicRoute = React.memo(({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner message="در حال بررسی احراز هویت..." />;
  }

  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <>{children}</>
  );
});


function AppContent() {
  const [count, setCount] = useState(0);
  const theme = createTheme({
    direction: "rtl",
    palette: {
      mode: "dark",
      primary: {
        main: "#1976d2",
      },
      secondary: {
        main: "#ff4081",
      },
    },
    typography: {
      fontFamily: ["Vazirmatn", "Tahoma", "Arial", "sans-serif"].join(","),
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute>
                <>
                  <div>
                    <a href="https://vite.dev" target="_blank">
                      <img src={appLogo} className="logo" alt="AutoBan logo" />
                    </a>
                    <a href="https://react.dev" target="_blank">
                      <img
                        src={reactLogo}
                        className="logo react"
                        alt="React logo"
                      />
                    </a>
                  </div>
                  <h1>AutoBan</h1>
                  <div className="card">
                    <button onClick={() => setCount((count) => count + 1)}>
                      count is {count}
                    </button>
                    <p>
                      Edit <code>src/App.tsx</code> and save to test HMR
                    </p>
                  </div>
                  <p className="read-the-docs">
                    Click on the Vite and React logos to learn more
                  </p>
                  <PWABadge />
                </>
              </PublicRoute>
            }
          />
          <Route
            path="/signin"
            element={
              <PublicRoute>
                <Signin />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
