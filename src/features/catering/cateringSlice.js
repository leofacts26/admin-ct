import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api, BASE_URL } from '../../api/apiConfig';
import { datavalidationerror, successToast } from '../../utils';
import toast from 'react-hot-toast';

const initialState = {
    isLoading: true,
    cateringVendors: [],
    cateringVendorsDetail: [],
    cateringFoodTypes: [],
    cuisineList: [],
}

export const fetchCateringVendors = createAsyncThunk(
    'catering/fetchCateringVendors',
    async (catering, thunkAPI) => {
        try {
            const response = await api.get(`${BASE_URL}/admin-list-vendors`);
            return response?.data?.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.msg);
        }
    }
)

export const fetchCateringVendorDetails = createAsyncThunk(
    'catering/fetchCateringVendorDetails',
    async (companyId, thunkAPI) => {
        try {
            const response = await api.get(`${BASE_URL}/admin-get-vendor-view-details?company_id=${companyId}`);
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
            const response = await api.get(`${BASE_URL}/admin-list-food-types`);
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
            const response = await api.get(`${BASE_URL}/admin-list-cuisines`);
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
            const response = await api.post(`${BASE_URL}/admin-update-cuisine`, catering);
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
            const response = await api.post(`${BASE_URL}/admin-create-cuisine`, catering);
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
            const response = await api.post(`${BASE_URL}/admin-toggle-cuisine`, catering);
            toast.success(successToast(response))
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.msg);
        }
    }
)



export const cateringSlice = createSlice({
    name: 'catering',
    initialState,
    reducers: {

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
    }
})

// Action creators are generated for each case reducer function
export const { } = cateringSlice.actions

export default cateringSlice.reducer