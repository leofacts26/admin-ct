import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api, BASE_URL } from '../api/apiConfig';
import { datavalidationerror, successToast } from '../utils';
import toast from 'react-hot-toast';

const initialState = {
    isLoading: true,
    userList: [],
    adminUserList: [],
    cuisineId: null,
}


export const fetchUserData = createAsyncThunk(
    'user/fetchUserData',
    async (user, thunkAPI) => {
        try {
            const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
            const response = await api.get(`${BASE_URL}/admin-list-users?limit=200&page=1`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response?.data?.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.msg);
        }
    }
)


export const fetchAdminUsers = createAsyncThunk(
    'user/fetchAdminUsers',
    async (user, thunkAPI) => {
        try {
            const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
            const response = await api.get(`${BASE_URL}/admin-list-admin-users`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response?.data?.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.msg);
        }
    }
)




export const createAdminUser = createAsyncThunk(
    'user/createAdminUser',
    async (data, thunkAPI) => {
        try {
            const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
            const response = await api.post(`${BASE_URL}/admin-create-admin-user`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success(response.data.message)
            return response?.data?.data;
        } catch (error) {
            toast.error(error.response.data.meaasge)
            return thunkAPI.rejectWithValue(error.response.data.msg);
        }
    }
)


export const updateAdminUser = createAsyncThunk(
    'user/updateAdminUser',
    async (data, thunkAPI) => {
        try {
            const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
            const response = await api.post(`${BASE_URL}/admin-update-admin-user`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response?.data?.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.msg);
        }
    }
)


export const toggleAdminUser = createAsyncThunk(
    'user/toggleAdminUser',
    async (data, thunkAPI) => {
        try {
            const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
            const response = await api.post(`${BASE_URL}/admin-toggle-admin-user`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success(successToast(response))
            // return response?.data?.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.msg);
        }
    }
)




export const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setCuisineId: (state, action) => {
            state.cuisineId = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchUserData.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                state.userList = payload;
            })
            .addCase(fetchUserData.rejected, (state, { payload }) => {
                state.isLoading = false;
                toast.error(datavalidationerror(payload));
            })
            // fetchAdminUsers 
            .addCase(fetchAdminUsers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAdminUsers.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                state.adminUserList = payload;
            })
            .addCase(fetchAdminUsers.rejected, (state, { payload }) => {
                state.isLoading = false;
                toast.error(datavalidationerror(payload));
            })


    }
})

// Action creators are generated for each case reducer function
export const { setIsLoading, setCuisineId } = usersSlice.actions

export default usersSlice.reducer