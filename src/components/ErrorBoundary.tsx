"use client";

import React, { Component, ReactNode } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  Collapse,
  IconButton,
} from "@mui/material";
import {
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  BugReport as BugReportIcon,
} from "@mui/icons-material";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to external service or console
    console.error("Error Boundary caught an error:", error, errorInfo);

    // Call optional error handler
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  toggleDetails = () => {
    this.setState((prev) => ({
      showDetails: !prev.showDetails,
    }));
  };

  render() {
    if (this.state.hasError) {
      // If custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "400px",
            p: 3,
          }}
        >
          <Card sx={{ maxWidth: 600, width: "100%" }}>
            <CardContent sx={{ textAlign: "center", p: 4 }}>
              <Box sx={{ mb: 3 }}>
                <ErrorIcon sx={{ fontSize: 60, color: "error.main", mb: 2 }} />
                <Typography variant="h5" component="h2" gutterBottom>
                  مشکلی پیش آمده!
                </Typography>
                <Typography variant="body1" color="text.secondary" mb={3}>
                  متأسفانه خطایی در برنامه رخ داده است. لطفاً دوباره تلاش کنید.
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "center",
                  mb: 3,
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<RefreshIcon />}
                  onClick={this.handleReset}
                  color="primary"
                >
                  تلاش مجدد
                </Button>
                <Button
                  variant="outlined"
                  onClick={this.handleReload}
                  color="secondary"
                >
                  بارگذاری مجدد صفحه
                </Button>
              </Box>

              {/* Error Details (for developers) */}
              {process.env.NODE_ENV === "development" && this.state.error && (
                <Box sx={{ textAlign: "left" }}>
                  <Button
                    startIcon={<BugReportIcon />}
                    endIcon={
                      this.state.showDetails ? (
                        <ExpandLessIcon />
                      ) : (
                        <ExpandMoreIcon />
                      )
                    }
                    onClick={this.toggleDetails}
                    size="small"
                    color="info"
                  >
                    جزئیات خطا (توسعه‌دهندگان)
                  </Button>

                  <Collapse in={this.state.showDetails}>
                    <Alert severity="error" sx={{ mt: 2, textAlign: "left" }}>
                      <Typography
                        variant="body2"
                        component="pre"
                        sx={{
                          whiteSpace: "pre-wrap",
                          fontSize: "0.75rem",
                          fontFamily: "monospace",
                        }}
                      >
                        <strong>Error:</strong> {this.state.error.message}
                        {"\n\n"}
                        <strong>Stack Trace:</strong>
                        {"\n"}
                        {this.state.error.stack}
                        {this.state.errorInfo && (
                          <>
                            {"\n\n"}
                            <strong>Component Stack:</strong>
                            {this.state.errorInfo.componentStack}
                          </>
                        )}
                      </Typography>
                    </Alert>
                  </Collapse>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      );
    }

    return this.props.children;
  }
}

// HOC wrapper for easier usage
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode,
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback} onError={onError}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${
    Component.displayName || Component.name
  })`;
  return WrappedComponent;
};

// Lightweight error boundary for smaller components
export const MiniErrorBoundary: React.FC<{
  children: ReactNode;
  message?: string;
}> = ({ children, message = "خطایی رخ داده است" }) => {
  return (
    <ErrorBoundary
      fallback={
        <Alert severity="error" sx={{ m: 2 }}>
          <Typography variant="body2">{message}</Typography>
          <Button
            size="small"
            onClick={() => window.location.reload()}
            sx={{ mt: 1 }}
          >
            بارگذاری مجدد
          </Button>
        </Alert>
      }
    >
      {children}
    </ErrorBoundary>
  );
};
