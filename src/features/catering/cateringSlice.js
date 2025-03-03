import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api, BASE_URL } from '../../api/apiConfig';
import { datavalidationerror, successToast } from '../../utils';
import toast from 'react-hot-toast';

const initialState = {
    vendorListId: '',
    isLoading: true,
    cateringVendors: [],
    cateringVendorsDetail: [],
    cateringFoodTypes: [],
    cuisineList: [],
    settingsInfo: [],
    vandorExportList: [],
    vandorDeleteList: []
}

export const fetchCateringVendorsExport = createAsyncThunk(
    'catering/fetchCateringVendorsExport',
    async (type, thunkAPI) => {
        const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
        try {
            const response = await api.get(`${BASE_URL}/admin-list-vendors-export?vendor_type=${type}&current_page=1&limit=100000`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response?.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.msg);
        }
    }
)

export const fetchCateringVendors = createAsyncThunk(
    'catering/fetchCateringVendors',
    async (type, thunkAPI) => {
        const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
        try {
            const response = await api.get(`${BASE_URL}/admin-list-vendors?vendor_type=${type}&current_page=1&limit=100000`, {
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


export const fetchCateringDeletedVendors = createAsyncThunk(
    'catering/fetchCateringDeletedVendors',
    async (type, thunkAPI) => {
        const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
        try {
            const response = await api.get(`${BASE_URL}/admin-list-vendors-del?vendor_type=${type}&current_page=1&limit=1000000`, {
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

export const fetchCateringVendorDetails = createAsyncThunk(
    'catering/fetchCateringVendorDetails',
    async (vendorId, thunkAPI) => {
        try {
            const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
            const response = await api.get(`${BASE_URL}/admin-get-vendor-show-detailed?vendor_id=${vendorId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response, "response123");

            return response?.data?.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.msg);
        }
    }
)


export const fetchGetVendorSettingsInfo = createAsyncThunk(
    'catering/fetchGetVendorSettingsInfo',
    async (vendorData, thunkAPI) => {
        try {
            const { company_id, id, phone_number } = vendorData;
            const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
            const response = await api.get(`${BASE_URL}/admin-get-vendor-settings-info?company_id=${company_id}&vendor_id=${id}&phone_number=${phone_number}`, {
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


export const fetchCateringFoodTypes = createAsyncThunk(
    'catering/fetchCateringFoodTypes',
    async (catering, thunkAPI) => {
        try {
            const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
            const response = await api.get(`${BASE_URL}/admin-list-food-types`, {
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

export const fetchCateringCuisines = createAsyncThunk(
    'catering/fetchCateringCuisines',
    async (catering, thunkAPI) => {
        try {
            const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
            const response = await api.get(`${BASE_URL}/admin-list-cuisines`, {
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

export const editCateringParentCuisine = createAsyncThunk(
    'catering/editCateringParentCuisine',
    async (catering, thunkAPI) => {
        try {
            const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
            const response = await api.post(`${BASE_URL}/admin-update-cuisine`, catering, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success(successToast(response))
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.msg);
        }
    }
)

export const addCateringParentCuisine = createAsyncThunk(
    'catering/addCateringParentCuisine',
    async (catering, thunkAPI) => {
        try {
            const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
            const response = await api.post(`${BASE_URL}/admin-create-cuisine`, catering, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success(successToast(response))
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.msg);
        }
    }
)

export const deleteCateringCuisine = createAsyncThunk(
    'catering/deleteCateringCuisine',
    async (catering, thunkAPI) => {
        try {
            const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
            const response = await api.post(`${BASE_URL}/admin-toggle-cuisine`, catering, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success(successToast(response))
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.msg);
        }
    }
)

export const updateToggleCuisine = createAsyncThunk(
    'user/updateToggleCuisine',
    async (data, thunkAPI) => {
        try {
            const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
            const response = await api.post(`${BASE_URL}/admin-toggle-cuisine`, data, {
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


export const updateCateringDeletedVendorsStatus = createAsyncThunk(
    'user/updateCateringDeletedVendorsStatus',
    async (data, thunkAPI) => {
        try {
            const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
            const response = await api.post(`${BASE_URL}/admin-update-vendor-status`, data, {
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


export const cateringSlice = createSlice({
    name: 'catering',
    initialState,
    reducers: {
        setVendorListId: (state, { payload }) => {
            console.log(payload, "payload payloadpayloadpayloadpayload");
            state.vendorListId = payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // fetchCateringVendors 
            .addCase(fetchCateringVendors.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchCateringVendors.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                state.cateringVendors = payload;
            })
            .addCase(fetchCateringVendors.rejected, (state, { payload }) => {
                state.isLoading = false;
                toast.error(datavalidationerror(payload));
            })
            // fetchCateringDeletedVendors 
            .addCase(fetchCateringDeletedVendors.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchCateringDeletedVendors.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                state.vandorDeleteList = payload;
            })
            .addCase(fetchCateringDeletedVendors.rejected, (state, { payload }) => {
                state.isLoading = false;
                toast.error(datavalidationerror(payload));
            })
            // fetchCateringVendorDetails 
            .addCase(fetchCateringVendorDetails.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchCateringVendorDetails.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                state.cateringVendorsDetail = payload;
            })
            .addCase(fetchCateringVendorDetails.rejected, (state, { payload }) => {
                state.isLoading = false;
                toast.error(datavalidationerror(payload));
            })
            // fetchCateringVendors 
            .addCase(fetchCateringFoodTypes.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchCateringFoodTypes.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                state.cateringFoodTypes = payload;
            })
            .addCase(fetchCateringFoodTypes.rejected, (state, { payload }) => {
                state.isLoading = false;
                toast.error(datavalidationerror(payload));
            })
            // fetchCateringCuisines 
            .addCase(fetchCateringCuisines.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchCateringCuisines.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                state.cuisineList = payload;
            })
            .addCase(fetchCateringCuisines.rejected, (state, { payload }) => {
                state.isLoading = false;
                toast.error(datavalidationerror(payload));
            })
            // editCateringParentCuisine 
            .addCase(editCateringParentCuisine.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(editCateringParentCuisine.fulfilled, (state, { payload }) => {
                state.isLoading = false;
            })
            .addCase(editCateringParentCuisine.rejected, (state, { payload }) => {
                state.isLoading = false;
                toast.error(datavalidationerror(payload));
            })
            // addCateringParentCuisine 
            .addCase(addCateringParentCuisine.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addCateringParentCuisine.fulfilled, (state, { payload }) => {
                state.isLoading = false;
            })
            .addCase(addCateringParentCuisine.rejected, (state, { payload }) => {
                state.isLoading = false;
                toast.error(datavalidationerror(payload));
            })
            // fetchGetVendorSettingsInfo 
            .addCase(fetchGetVendorSettingsInfo.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchGetVendorSettingsInfo.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                state.settingsInfo = payload;
            })
            .addCase(fetchGetVendorSettingsInfo.rejected, (state, { payload }) => {
                state.isLoading = false;
                // toast.error(datavalidationerror(payload));
            })
            // fetchCateringVendorsExport 
            .addCase(fetchCateringVendorsExport.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchCateringVendorsExport.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                state.vandorExportList = payload;
            })
            .addCase(fetchCateringVendorsExport.rejected, (state, { payload }) => {
                state.isLoading = false;
                // toast.error(datavalidationerror(payload));
            })
            // updateCateringDeletedVendorsStatus 
            .addCase(updateCateringDeletedVendorsStatus.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateCateringDeletedVendorsStatus.fulfilled, (state, { payload }) => {
                state.isLoading = false;
            })
            .addCase(updateCateringDeletedVendorsStatus.rejected, (state, { payload }) => {
                state.isLoading = false;
                // toast.error(datavalidationerror(payload));
            })
    }
})

// Action creators are generated for each case reducer function
export const { setVendorListId } = cateringSlice.actions

export default cateringSlice.reducer