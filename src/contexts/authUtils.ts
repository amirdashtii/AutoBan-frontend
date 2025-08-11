import { createContext } from "react";
import { LoginRequest, SignupRequest, User, AuthResponse } from "@/types/api";

// Auth State Interface
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

// Auth Action Types
type AuthAction =
  | { type: "AUTH_START" }
  | { type: "AUTH_SUCCESS"; payload: { user: User } }
  | { type: "AUTH_ERROR"; payload: string }
  | { type: "AUTH_LOGOUT" }
  | { type: "CLEAR_ERROR" };

// Initial State
export const initialState: AuthState = {
  user: null,
  isLoading: true, // Start with loading true until auth check completes
  isAuthenticated: false,
  error: null,
};

// Auth Reducer
export const authReducer = (
  state: AuthState,
  action: AuthAction
): AuthState => {
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
        isLoading: false,
        isAuthenticated: true,
        error: null,
      };
    case "AUTH_ERROR":
      return {
        ...state,
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: action.payload,
      };
    case "AUTH_LOGOUT":
      return {
        ...state,
        user: null,
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

// Auth Context Type
export interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<AuthResponse>;
  signup: (userData: SignupRequest) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  clearError: () => void;
}

// Auth Context
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
