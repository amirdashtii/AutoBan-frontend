"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
} from "@mui/material";
import {
  DirectionsCar,
  ArrowDownward,
  Delete,
  ChevronLeft as ChevronLeftIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  AppContainer,
  Header,
  ResponsiveContainer,
  StaggeredList,
  ListItemCard,
} from "@/components/ui";
import { useResponsive } from "@/components/ui/ResponsiveContainer";
import { useUserVehicles, useDeleteUserVehicle } from "@/hooks/useVehicles";
import { UserVehicle } from "@/types/api";

export default function Vehicles() {
  const { user } = useAuth();
  const router = useRouter();
  const { isMobile } = useResponsive();

  // Fetch user vehicles using hook (goes through internal API route)
  const {
    data: vehicles = [],
    isLoading: vehiclesLoading,
    error: vehiclesError,
    refetch: refetchVehicles,
  } = useUserVehicles();

  // State management
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullStartY, setPullStartY] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);

  // Delete functionality
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<UserVehicle | null>(
    null
  );

  const deleteVehicleMutation = useDeleteUserVehicle();

  // Swipe states
  const [swipeStates, setSwipeStates] = useState<
    Record<number, { x: number; showDelete: boolean }>
  >({});

  // Pull to refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetchVehicles();
    } catch (error) {
      console.error("Error refreshing vehicles:", error);
    } finally {
      setIsRefreshing(false);
      setIsPulling(false);
      setPullDistance(0);
    }
  };

  // Touch handlers for pull to refresh
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (window.scrollY === 0) {
      setPullStartY(e.touches[0].clientY);
      setIsPulling(true);
    }
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isPulling || window.scrollY > 0) return;

      const currentY = e.touches[0].clientY;
      const distance = Math.max(0, currentY - pullStartY);

      if (distance > 0) {
        e.preventDefault();
        setPullDistance(Math.min(distance, 100));
      }
    },
    [isPulling, pullStartY]
  );

  const handleTouchEnd = useCallback(() => {
    if (pullDistance > 60) {
      handleRefresh();
    } else {
      setIsPulling(false);
      setPullDistance(0);
      setPullStartY(0);
    }
  }, [pullDistance]);

  // Add touch event listeners
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.addEventListener("touchstart", handleTouchStart, {
        passive: false,
      });
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd);

      return () => {
        document.removeEventListener("touchstart", handleTouchStart);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Swipe handlers for delete
  const handleSwipeStart = useCallback((vehicleId: number, startX: number) => {
    setSwipeStates((prev) => ({
      ...prev,
      [vehicleId]: { x: 0, showDelete: false },
    }));
  }, []);

  const handleSwipeMove = useCallback((vehicleId: number, deltaX: number) => {
    if (deltaX < 0) {
      // Only allow left swipe
      const distance = Math.min(Math.abs(deltaX), 180);
      setSwipeStates((prev) => ({
        ...prev,
        [vehicleId]: {
          x: distance,
          showDelete: distance > 50,
        },
      }));
    }
  }, []);

  const handleSwipeEnd = useCallback(
    (vehicleId: number) => {
      // Get the current state directly from the latest swipeStates
      setSwipeStates((prev) => {
        const currentState = prev[vehicleId];

        // If swiped far enough (>150px), directly delete
        if (Math.abs(currentState?.x || 0) > 150) {
          const vehicle = vehicles.find((v) => v.id === vehicleId);
          if (vehicle) {
            // Reset state first, then trigger delete
            setTimeout(() => handleDeleteClick(vehicle), 0);
          }
          return {
            ...prev,
            [vehicleId]: { x: 0, showDelete: false },
          };
        }

        // If delete button should be shown, keep it visible
        if (currentState?.showDelete) {
          return {
            ...prev,
            [vehicleId]: { x: 80, showDelete: true },
          };
        } else {
          // Reset swipe if not enough distance
          return {
            ...prev,
            [vehicleId]: { x: 0, showDelete: false },
          };
        }
      });
    },
    [vehicles]
  );

  // Delete handlers
  const handleDeleteClick = (vehicle: UserVehicle) => {
    setVehicleToDelete(vehicle);
    setDeleteDialogOpen(true);
    // Reset swipe state
    setSwipeStates((prev) => ({
      ...prev,
      [vehicle.id]: { x: 0, showDelete: false },
    }));
  };

  const handleDeleteConfirm = async () => {
    if (!vehicleToDelete) return;

    try {
      await deleteVehicleMutation.mutateAsync(vehicleToDelete.id.toString());
      setDeleteDialogOpen(false);
      setVehicleToDelete(null);
    } catch (error: any) {
      console.error("Error deleting vehicle:", error);
      // Handle error - could show toast or alert
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setVehicleToDelete(null);
  };

  // Reset swipe state when clicking elsewhere
  const resetSwipeState = (vehicleId: number) => {
    setSwipeStates((prev) => ({
      ...prev,
      [vehicleId]: { x: 0, showDelete: false },
    }));
  };

  // Statistics based on API data
  const stats = {
    totalVehicles: vehicles.length,
    totalServices: 0, // Will be calculated when services API is integrated
    urgentReminders: 0, // Will be calculated when services API is integrated
  };

  return (
    <AppContainer
      header={
        <Header
          title="خودروها"
          subtitle={`${stats.totalVehicles} خودرو`}
          showAddButton
          onAddClick={() => router.push("/vehicles/add")}
        />
      }
    >
      <Box
        sx={{
          transform: `translateY(${pullDistance * 0.5}px)`,
          transition: isPulling ? "none" : "transform 0.3s ease-out",
        }}
      >
        {/* Pull to refresh indicator */}
        {(isPulling || isRefreshing) && (
          <Box
            sx={{
              position: "absolute",
              top: -60,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              zIndex: 1000,
              bgcolor: "background.paper",
              borderRadius: 2,
              p: 2,
              boxShadow: 2,
            }}
          >
            {isRefreshing ? (
              <CircularProgress size={24} />
            ) : (
              <ArrowDownward
                sx={{
                  color: pullDistance > 60 ? "primary.main" : "text.secondary",
                  transform: pullDistance > 60 ? "rotate(180deg)" : "none",
                  transition: "all 0.2s ease",
                }}
              />
            )}
            <Typography variant="caption" sx={{ mt: 1 }}>
              {isRefreshing
                ? "در حال بروزرسانی..."
                : pullDistance > 60
                ? "رها کنید تا بروزرسانی شود"
                : "برای بروزرسانی بکشید"}
            </Typography>
          </Box>
        )}
        <ResponsiveContainer
          padding="medium"
          fullHeight={false}
          onClick={() => {
            // Reset all swipe states when clicking on empty area
            setSwipeStates({});
          }}
        >
          {/* Vehicles List */}
          {vehiclesLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : vehiclesError ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              خطا در بارگذاری لیست خودروها. لطفاً دوباره تلاش کنید.
            </Alert>
          ) : vehicles.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <DirectionsCar
                sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                خودرویی یافت نشد
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                برای شروع، اولین خودروی خود را اضافه کنید
              </Typography>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="primary">
                    💡 با کلیک روی دکمه + در بالای صفحه، خودرو اضافه کنید
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ) : (
            <StaggeredList>
              {vehicles.map((vehicle: UserVehicle) => {
                const swipeState = swipeStates[vehicle.id] || {
                  x: 0,
                  showDelete: false,
                };

                return (
                  <List
                    key={vehicle.id}
                    sx={{
                      position: "relative",
                      overflow: "hidden",
                      backgroundColor: "background.paper",
                      borderRadius: 1,
                      mb: 1,
                    }}
                  >
                    {/* Delete button background */}
                    <Box
                      sx={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 80,
                        bgcolor: "error.main",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        opacity: swipeState.showDelete ? 1 : 0,
                        transition: "opacity 0.2s ease",
                        gap: 0.5,
                      }}
                      onClick={() => handleDeleteClick(vehicle)}
                    >
                      <Delete sx={{ color: "white", fontSize: 20 }} />
                      <Typography
                        variant="caption"
                        sx={{ color: "white", fontSize: "1rem" }}
                      >
                        حذف
                      </Typography>
                    </Box>

                    {/* Swipeable content */}
                    <Box
                      sx={{
                        transform: `translateX(${swipeState.x}px)`,
                        transition:
                          swipeState.x === 0 ? "transform 0.3s ease" : "none",
                      }}
                      onTouchStart={(e) => {
                        const touch = e.touches[0];
                        handleSwipeStart(vehicle.id, touch.clientX);

                        let startX = touch.clientX;

                        const handleTouchMove = (moveEvent: TouchEvent) => {
                          const currentX = moveEvent.touches[0].clientX;
                          const deltaX = currentX - startX;
                          handleSwipeMove(vehicle.id, deltaX);
                        };

                        const handleTouchEnd = () => {
                          handleSwipeEnd(vehicle.id);
                          document.removeEventListener(
                            "touchmove",
                            handleTouchMove
                          );
                          document.removeEventListener(
                            "touchend",
                            handleTouchEnd
                          );
                        };

                        document.addEventListener(
                          "touchmove",
                          handleTouchMove,
                          { passive: false }
                        );
                        document.addEventListener("touchend", handleTouchEnd);
                      }}
                    >
                      <ListItemCard
                        title={vehicle.name}
                        subtitle={
                          isMobile
                            ? `${vehicle.production_year} | ${
                                vehicle.current_mileage?.toLocaleString() || 0
                              } کم`
                            : `${
                                vehicle.model?.name_fa ||
                                vehicle.brand?.name_fa ||
                                "نامشخص"
                              } - ${vehicle.production_year} | ${
                                vehicle.current_mileage?.toLocaleString() || 0
                              } کیلومتر`
                        }
                        icon={<DirectionsCar />}
                        actions={<ChevronLeftIcon fontSize="large" />}
                        onClick={() => {
                          // Reset any open swipe states
                          Object.keys(swipeStates).forEach((id) => {
                            if (Number(id) !== vehicle.id) {
                              resetSwipeState(Number(id));
                            }
                          });
                          router.push(`/vehicles/${vehicle.id}`);
                        }}
                      />
                    </Box>
                  </List>
                );
              })}
            </StaggeredList>
          )}
        </ResponsiveContainer>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ color: "error.main" }}>حذف خودرو</DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              آیا مطمئن هستید که می‌خواهید خودرو "{vehicleToDelete?.name}" را
              حذف کنید؟
            </Typography>
            <Typography variant="body2" color="text.secondary">
              این عمل قابل برگشت نیست و تمام اطلاعات مربوط به این خودرو از جمله
              سرویس‌ها و یادآوری‌ها حذف خواهد شد.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleDeleteCancel}
              disabled={deleteVehicleMutation.isPending}
            >
              انصراف
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
              disabled={deleteVehicleMutation.isPending}
              startIcon={
                deleteVehicleMutation.isPending ? (
                  <CircularProgress size={16} />
                ) : (
                  <Delete />
                )
              }
            >
              {deleteVehicleMutation.isPending ? "در حال حذف..." : "حذف خودرو"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AppContainer>
  );
}
