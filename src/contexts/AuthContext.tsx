import React, { ReactNode, useCallback, useEffect, useReducer } from "react";
import { LoginRequest, SignupRequest } from "../types/api";
import { AuthService } from "../services/authService";
import { clearAuthData, getAuthToken } from "../utils/api";
import {
  AuthContext,
  AuthContextType,
  authReducer,
  initialState,
} from "./authUtils";

// Auth Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      const token = getAuthToken();
      if (!token) {
        dispatch({ type: "AUTH_LOGOUT" });
        return;
      }

      try {
        const user = await AuthService.getCurrentUser();
        dispatch({
          type: "AUTH_SUCCESS",
          payload: { user, token },
        });
      } catch (error) {
        console.error("Auth check failed:", error);
        clearAuthData();
        dispatch({ type: "AUTH_LOGOUT" });
      }
    };

    if (state.isLoading && state.token) {
      initializeAuth();
    } else if (state.isLoading) {
      dispatch({ type: "AUTH_LOGOUT" });
    }
  }, [state.isLoading, state.token]); // Only run when isLoading or token changes

  // Check auth status
  const checkAuth = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      dispatch({ type: "AUTH_LOGOUT" });
      return;
    }

    try {
      const user = await AuthService.getCurrentUser();
      dispatch({
        type: "AUTH_SUCCESS",
        payload: { user, token },
      });
    } catch (error) {
      console.error("Auth check failed:", error);
      clearAuthData();
      dispatch({ type: "AUTH_LOGOUT" });
    }
  }, [dispatch]);

  //login function
  const login = async (credentials: LoginRequest) => {
    try {
      dispatch({ type: "AUTH_START" });
      const response = await AuthService.login(credentials);

      // After successful login, get user info
      const user = await AuthService.getCurrentUser();

      dispatch({
        type: "AUTH_SUCCESS",
        payload: { user, token: response.access_token },
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "خطا در ورود";
      dispatch({ type: "AUTH_FAILURE", payload: errorMessage });
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dispatch({ type: "AUTH_LOGOUT" });
    }
  };

  // Signup function
  const signup = async (userData: SignupRequest) => {
    try {
      dispatch({ type: "AUTH_START" });
      const response = await AuthService.signup(userData);

      // After successful signup, get user info
      const user = await AuthService.getCurrentUser();

      dispatch({
        type: "AUTH_SUCCESS",
        payload: { user, token: response.access_token },
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "خطا در ثبت نام";
      dispatch({ type: "AUTH_FAILURE", payload: errorMessage });
      throw error;
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const value: AuthContextType = {
    ...state,
    login,
    signup,
    logout,
    //  forgotPassword,
    //  resetPassword,
    clearError,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
