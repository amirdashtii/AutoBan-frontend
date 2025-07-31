import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { LoginRequest, SignupRequest, User } from "../types/api";
import { AuthService } from "../services/authService";
import { clearAuthData, getAuthToken } from "../utils/api";

// Auth State Interface
interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

// Auth Action Types
type AuthAction =
  | { type: "AUTH_START" }
  | { type: "AUTH_SUCCESS"; payload: { user: User; token: string } }
  | { type: "AUTH_FAILURE"; payload: string }
  | { type: "AUTH_LOGOUT" }
  | { type: "CLEAR_ERROR" };

// Initial State
const initialState: AuthState = {
  user: null,
  token: getAuthToken(),
  isLoading: false,
  isAuthenticated: false,
  error: null,
};

// Auth Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "AUTH_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case "AUTH_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      };
    case "AUTH_FAILURE":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        isAuthenticated: false,
      };
    case "AUTH_LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Auth Context Interface
interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  signup: (userData: SignupRequest) => Promise<void>;
  logout: () => Promise<void>;
  //   forgotPassword: (data: ForgotPasswordRequest) => Promise<void>;
  //   resetPassword: (data: ResetPasswordRequest) => Promise<void>;
  clearError: () => void;
  checkAuth: () => Promise<void>;
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication on mount
  useEffect(() => {
    if (state.token) {
      checkAuth();
    }
  }, []);

  // Check if user is authenticated
  const checkAuth = async () => {
    if (!state.token) return;
    try {
      dispatch({ type: "AUTH_START" });
      const user = await AuthService.getCurrentUser();
      dispatch({
        type: "AUTH_SUCCESS",
        payload: { user, token: state.token },
      });
    } catch (error) {
      console.error("Auth check failed:", error);
      clearAuthData();
      dispatch({ type: "AUTH_LOGOUT" });
    }
  };

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

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
