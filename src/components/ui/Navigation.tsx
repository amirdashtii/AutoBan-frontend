"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Badge,
  Button,
} from "@mui/material";
import {
  ChevronRight as ChevronRightIcon,
  Person,
  Add as AddIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";

// Header Component
interface HeaderProps {
  title?: string | React.ReactNode;
  subtitle?: string;

  user?: {
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    status?: string;
  } | null;
  showBack?: boolean;
  leftActions?: React.ReactNode[];
  rightActions?: React.ReactNode[];

  // New action buttons
  showAddButton?: boolean;
  showEditButton?: boolean;
  showSaveButton?: boolean;
  showCancelButton?: boolean;
  onAddClick?: () => void;
  onEditClick?: () => void;
  onSaveClick?: () => void;
  onCancelClick?: () => void;
  isAddDisabled?: boolean;
  isEditDisabled?: boolean;
  isSaveDisabled?: boolean;
  isCancelDisabled?: boolean;
  isSaving?: boolean;

  onBackClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  user,
  leftActions = [],
  rightActions = [],
  showBack = false,
  showAddButton = false,
  showEditButton = false,
  showSaveButton = false,
  showCancelButton = false,
  onAddClick,
  onEditClick,
  onSaveClick,
  onCancelClick,
  isAddDisabled = false,
  isEditDisabled = false,
  isSaveDisabled = false,
  isCancelDisabled = false,
  isSaving = false,
  onBackClick,
}) => {
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      router.back();
    }
  };

  // Detect scroll for collapsible header with smooth transition
  useEffect(() => {
    if (!user) return;

    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setScrollY(scrollTop);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [user]);

  // Calculate transition progress (0 to 1) - complete transition in 80px
  const transitionProgress = Math.min(scrollY / 20, 1);
  const isCompact = transitionProgress > 0.8;

  // Common back button component
  const BackButton = () =>
    showBack ? (
      <Button
        onClick={handleBackClick}
        variant="text"
        color="primary"
        sx={{
          minWidth: "auto",
          px: 1,
          py: 0.5,
          fontSize: "0.875rem",
        }}
      >
        <ChevronRightIcon fontSize="large" />
        بازگشت
      </Button>
    ) : null;

  // Action buttons components
  const AddButton = () =>
    showAddButton ? (
      <Button
        onClick={onAddClick}
        variant="text"
        disabled={isAddDisabled}
        sx={{
          minWidth: "auto",
          px: 2,
          py: 0.5,
          fontSize: "0.875rem",
        }}
      >
        <AddIcon />
      </Button>
    ) : null;

  const EditButton = () =>
    showEditButton ? (
      <Button
        onClick={onEditClick}
        variant="text"
        disabled={isEditDisabled}
        sx={{
          minWidth: "auto",
          px: 2,
          py: 0.5,
          fontSize: "0.875rem",
        }}
      >
        ویرایش
      </Button>
    ) : null;

  const SaveButton = () =>
    showSaveButton ? (
      <Button
        onClick={onSaveClick}
        variant="text"
        disabled={isSaveDisabled}
        sx={{
          minWidth: "auto",
          px: 2,
          py: 0.5,
          fontSize: "0.875rem",
        }}
      >
        {isSaving ? "در حال ذخیره..." : "ذخیره"}
      </Button>
    ) : null;

  const CancelButton = () =>
    showCancelButton ? (
      <Button
        onClick={onCancelClick}
        variant="text"
        disabled={isCancelDisabled}
        sx={{
          minWidth: "auto",
          px: 2,
          py: 0.5,
          fontSize: "0.875rem",
        }}
      >
        لغو
      </Button>
    ) : null;

  // Common right zone component
  const RightZone = () => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        flex: 1,
        justifyContent: "flex-start",
      }}
    >
      <BackButton />
      <CancelButton />

      {/* Custom Right Actions */}
      {rightActions.map((action, index) => (
        <React.Fragment key={index}>{action}</React.Fragment>
      ))}
    </Box>
  );

  // Common center zone component
  const CenterZone = () => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flex: 1,
        textAlign: "center",
        minWidth: 0,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          fontSize: "1.1rem",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          width: "100%",
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          variant="caption"
          color="text.primary"
          sx={{
            color: "text.secondary",
            lineHeight: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            width: "100%",
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );

  // Common left zone component
  const LeftZone = () => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        flex: 1,
        justifyContent: "flex-end",
      }}
    >
      <AddButton />
      <EditButton />
      <SaveButton />

      {/* Custom Left Actions */}
      {leftActions.map((action, index) => (
        <React.Fragment key={`right-${index}`}>{action}</React.Fragment>
      ))}
    </Box>
  );

  // If user is provided, render collapsible header
  if (user) {
    const displayName =
      user?.first_name && user?.last_name
        ? `${user.first_name} ${user.last_name}`
        : typeof title === "string"
        ? title
        : "";

    // Calculate dynamic values based on scroll
    const headerHeight = 180 - transitionProgress * 116; // 180 to 64px
    const avatarSize = 80 - transitionProgress * 40; // 80px to 40px
    const avatarOpacity = 1 - transitionProgress; // Fade out avatar
    const textScale = 1 - transitionProgress * 0.3; // Scale down text

    return (
      <>
        {/* Collapsible Header */}
        <AppBar
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1100,
            backgroundColor: "background.default",
            borderColor: "divider",
            borderRadius: 0,
            boxShadow: "none",
            height: headerHeight,
            transition: "height 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          <Toolbar
            sx={{
              display: "flex",
              alignItems: transitionProgress > 0.5 ? "center" : "flex-start",
              minHeight: headerHeight,
              pt: 2,
              pb: transitionProgress > 0.5 ? 1 : 2,
              transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            }}
          >
            <RightZone />

            {/* Profile Info */}
            <Box
              sx={{
                display: "flex",
                flexDirection: transitionProgress > 0.5 ? "row" : "column",
                alignItems: "center",
                gap: transitionProgress > 0.5 ? 1 : 2,
                px: 2,
                flex: 1,
                justifyContent: "center",
                transform: `scale(${textScale})`,
                transition:
                  "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              }}
            >
              {/* Avatar with fade out effect */}
              <Box
                sx={{
                  opacity: avatarOpacity,
                  display: transitionProgress > 0.5 ? "none" : "block",
                  transition:
                    "opacity 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                }}
              >
                {user ? (
                  <Badge
                    badgeContent={
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          bgcolor:
                            user?.status === "Active"
                              ? "success.main"
                              : "warning.main",
                          border: "2px solid white",
                        }}
                      />
                    }
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  >
                    <Avatar
                      sx={{
                        width: avatarSize,
                        height: avatarSize,
                        bgcolor: "primary.main",
                        fontSize: avatarSize * 0.4,
                        transition:
                          "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                      }}
                    >
                      <Person sx={{ fontSize: avatarSize * 0.5 }} />
                    </Avatar>
                  </Badge>
                ) : (
                  <Avatar
                    sx={{
                      width: avatarSize,
                      height: avatarSize,
                      bgcolor: "primary.main",
                      fontSize: avatarSize * 0.4,
                      transition:
                        "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                    }}
                  >
                    <Person sx={{ fontSize: avatarSize * 0.5 }} />
                  </Avatar>
                )}
              </Box>

              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  color="text.primary"
                  sx={{
                    fontSize: "1.5rem",
                    transition:
                      "font-size 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  }}
                >
                  {displayName}
                </Typography>
                {user?.phone_number && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontSize: "0.875rem",
                      opacity: 1 - transitionProgress * 0.1,
                      transition:
                        "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                    }}
                  >
                    {user.phone_number}
                  </Typography>
                )}
              </Box>
            </Box>
            <LeftZone />
          </Toolbar>
        </AppBar>

        {/* Spacer to prevent content overlap */}
        <Box sx={{ height: headerHeight }} />
      </>
    );
  }

  // Regular header (when no user provided)
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: "background.paper",
        borderColor: "divider",
        borderRadius: 0,
        boxShadow: "none",
        color: "text.primary",
      }}
    >
      <Toolbar sx={{ display: "flex", alignItems: "center", minHeight: 64 }}>
        <RightZone />

        <CenterZone />

        <LeftZone />
      </Toolbar>
    </AppBar>
  );
};
