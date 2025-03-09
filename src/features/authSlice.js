import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api, BASE_URL } from '../api/apiConfig';
import { datavalidationerror } from '../utils';
import toast from 'react-hot-toast';

const initialState = {
    isLoading: false,
    phoneNumber: '',
    otpPage: false,
    otp: '',
    token: localStorage.getItem('token') || '',
}


export const createUserOtp = createAsyncThunk(
    'user/createUserOtp',
    async (data, thunkAPI) => {
        try {
            const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
            const response = await api.post(`${BASE_URL}/send-admin-user-otp`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response?.data;
        } catch (error) {
            toast.error(error.response.data.message)
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
)
export const verifyAdminOtp = createAsyncThunk(
    'user/verifyAdminOtp',
    async (data, thunkAPI) => {
        try {
            const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
            const response = await api.post(`${BASE_URL}/verify-admin-user-otp`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response?.data;
        } catch (error) {
            toast.error(error.response.data.message)
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
)

export const resendAdminOtp = createAsyncThunk(
    'user/resendAdminOtp',
    async (data, thunkAPI) => {
        try {
            const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
            const response = await api.post(`${BASE_URL}/resend-admin-user-otp`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response?.data;
        } catch (error) {
            toast.error(error.response.data.message)
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
)



export const authSlice = createSlice({
    name: 'authSlice',
    initialState,
    reducers: {
        setPhoneNumber: (state, action) => {
            console.log('Setting phone number:', action.payload);
            state.phoneNumber = action.payload;
        },
        setOtpPage: (state, action) => {
            state.otpPage = action.payload;
        },
        setOtp: (state, action) => {
            state.otp = action.payload;
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
        logout: (state) => {
            state.token = '';
            localStorage.removeItem('token');
            window.location.href = '/login'; // Redirect after logout
        },
    },
    extraReducers: (builder) => {
        builder
            // createUserOtp 
            .addCase(createUserOtp.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createUserOtp.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                toast.success(payload.message)
            })
            .addCase(createUserOtp.rejected, (state, { payload }) => {
                state.isLoading = false;
            })
            // verifyAdminOtp 
            .addCase(verifyAdminOtp.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(verifyAdminOtp.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                toast.success(payload.message)
            })
            .addCase(verifyAdminOtp.rejected, (state, { payload }) => {
                state.isLoading = false;
            })
            // resendAdminOtp 
            .addCase(resendAdminOtp.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(resendAdminOtp.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                toast.success(payload.message)
            })
            .addCase(resendAdminOtp.rejected, (state, { payload }) => {
                state.isLoading = false;
            })
    }
})

// Action creators are generated for each case reducer function
export const { setPhoneNumber, setOtpPage, setOtp, setToken, logout } = authSlice.actions

export default authSlice.reducer