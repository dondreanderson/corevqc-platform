import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Configure axios defaults
axios.defaults.baseURL = API_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  organizationId: string;
  isActive: boolean;
  organization: {
    id: string;
    name: string;
    description?: string;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('corevqc_token'),
  isLoading: false,
  isAuthenticated: !!localStorage.getItem('corevqc_token'),
  error: null,
};

// Register user
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    organizationName: string;
  }, { rejectWithValue }) => {
    try {
      console.log('🔄 Attempting registration...', userData.email);
      const response = await axios.post('/auth/register', userData);
      console.log('✅ Registration successful', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Registration failed', error);
      const message = error.response?.data?.error || error.response?.data?.message || 'Registration failed';
      return rejectWithValue(message);
    }
  }
);

// Login user
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      console.log('🔄 Attempting login...', credentials.email);
      const response = await axios.post('/auth/login', credentials);
      console.log('✅ Login successful', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Login failed', error);
      const message = error.response?.data?.error || error.response?.data?.message || 'Login failed';
      return rejectWithValue(message);
    }
  }
);

// Get profile
export const getProfile = createAsyncThunk(
  'auth/profile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const token = state.auth.token;
      
      if (!token) {
        return rejectWithValue('No token available');
      }

      console.log('🔄 Fetching profile...');
      const response = await axios.get('/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('✅ Profile fetched', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Profile fetch failed', error);
      const message = error.response?.data?.error || error.response?.data?.message || 'Failed to get profile';
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      console.log('👋 Logging out...');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('corevqc_token');
    },
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('corevqc_token', action.payload.token);
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('corevqc_token', action.payload.token);
        console.log('✅ User registered and authenticated');
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        console.error('❌ Registration rejected:', action.payload);
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('corevqc_token', action.payload.token);
        console.log('✅ User logged in and authenticated');
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        console.error('❌ Login rejected:', action.payload);
      })
      // Get Profile
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        console.log('✅ Profile loaded');
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.token = null;
        localStorage.removeItem('corevqc_token');
        console.error('❌ Profile fetch rejected:', action.payload);
      });
  },
});

export const { logout, clearError, setCredentials } = authSlice.actions;
export default authSlice.reducer;
