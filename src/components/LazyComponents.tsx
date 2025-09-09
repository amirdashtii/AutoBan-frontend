// Lazy loaded components for better performance
import { lazy, Suspense } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

// Loading component
const LoadingComponent = ({
  message = "در حال بارگذاری...",
}: {
  message?: string;
}) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "200px",
      gap: 2,
    }}
  >
    <CircularProgress size={40} />
    <Typography variant="body2" color="text.secondary">
      {message}
    </Typography>
  </Box>
);

// HOC for lazy loading with custom loading message
export const withLazyLoading = <P extends object>(
  Component: React.ComponentType<P>,
  loadingMessage?: string
) => {
  return (props: P) => (
    <Suspense fallback={<LoadingComponent message={loadingMessage} />}>
      <Component {...props} />
    </Suspense>
  );
};

// Lazy loaded pages
export const LazyDashboardHome = lazy(() => import("@/app/dashboard/page"));
export const LazyVehiclesPage = lazy(() => import("@/app/vehicles/page"));
export const LazyVehicleDetailPage = lazy(
  () => import("@/app/vehicles/[id]/page")
);
export const LazyProfilePage = lazy(() => import("@/app/profile/page"));
export const LazySigninPage = lazy(() => import("@/app/signin/page"));
export const LazySignupPage = lazy(() => import("@/app/signup/page"));

// Lazy loaded components
export const LazyForgotPassword = lazy(
  () => import("@/components/ForgotPassword")
);
export const LazyAccountActivation = lazy(
  () => import("@/components/AccountActivation")
);
export const LazyInactiveUserRestriction = lazy(
  () => import("@/components/InactiveUserRestriction")
);

// Vehicle related components
export const LazyIranLicensePlate = lazy(
  () => import("@/components/ui/IranLicensePlate")
);

// Wrapped components with loading states
export const DashboardHome = withLazyLoading(
  LazyDashboardHome,
  "بارگذاری داشبورد..."
);
export const VehiclesPage = withLazyLoading(
  LazyVehiclesPage,
  "بارگذاری خودروها..."
);
export const VehicleDetailPage = withLazyLoading(
  LazyVehicleDetailPage,
  "بارگذاری جزئیات خودرو..."
);
export const ProfilePage = withLazyLoading(
  LazyProfilePage,
  "بارگذاری پروفایل..."
);
export const SigninPage = withLazyLoading(
  LazySigninPage,
  "بارگذاری صفحه ورود..."
);
export const SignupPage = withLazyLoading(
  LazySignupPage,
  "بارگذاری صفحه ثبت نام..."
);

export const ForgotPassword = withLazyLoading(
  LazyForgotPassword,
  "بارگذاری فراموشی رمز عبور..."
);
export const AccountActivation = withLazyLoading(
  LazyAccountActivation,
  "بارگذاری فعال‌سازی حساب..."
);
export const InactiveUserRestriction = withLazyLoading(
  LazyInactiveUserRestriction
);

export const IranLicensePlate = withLazyLoading(LazyIranLicensePlate);
