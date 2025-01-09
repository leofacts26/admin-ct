import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api, BASE_URL } from '../api/apiConfig';
import { datavalidationerror, successToast } from '../utils';
import toast from 'react-hot-toast';

const initialState = {
  isLoading: true,
  subscriptionList: [],
  razorpayPlansMapperList: [],
  vendorSubscriptionEvents: [],
  vendorSubscriptionList: [],
  vendorTiffinSubscriptionList: [],
  vendorSubscriptionTypesList: [],
  razorpayPlansList: [],
}


export const fetchSubscriptionData = createAsyncThunk(
  'user/fetchSubscriptionData',
  async (user, thunkAPI) => {
    try {
      const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
      const response = await api.get(`${BASE_URL}/admin-list-vendor-subscriptions?limit=10000&page=1`, {
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


export const fetchRazorpayPlansMapper = createAsyncThunk(
  'user/fetchRazorpayPlansMapper',
  async (mode, thunkAPI) => {
    try {
      const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
      const response = await api.get(`${BASE_URL}/admin-list-razorpay-plans-mapper?limit=1000&current_page=1&mode=${mode}`, {
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


export const fetchVendorSubscriptionEvents = createAsyncThunk(
  'user/fetchVendorSubscriptionEvents',
  async (user, thunkAPI) => {
    try {
      const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
      const response = await api.get(`${BASE_URL}/admin-list-vendor-subscription-events?limit=1000&page=1`, {
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

export const fetchVendorSubscriptionList = createAsyncThunk(
  'user/fetchSubscriptionList',
  async (category, thunkAPI) => {
    try {
      const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
      const response = await api.get(`${BASE_URL}/rz-list-subscription-types-by-vendor-type?vendor_type=${category}&limit=10000&page=1`, {
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

export const fetchTiffinVendorSubscriptionList = createAsyncThunk(
  'user/fetchTiffinVendorSubscriptionList',
  async (category, thunkAPI) => {
    try {
      const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
      const response = await api.get(`${BASE_URL}/rz-list-subscription-types-by-vendor-type?vendor_type=${category}&limit=10000&page=1`, {
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


export const createSubscriptionData = createAsyncThunk(
  'user/createSubscriptionData',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
      const response = await api.post(`${BASE_URL}/admin-create-subscription-type`, data, {
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


export const adminAddSubBenifit = createAsyncThunk(
  'user/adminAddSubBenifit',
  async (data, thunkAPI) => {
    console.log("NTRRR");

    try {
      const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
      const response = await api.post(`${BASE_URL}/admin-create-subscription-benefit`, data, {
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


export const updateSubscriptionData = createAsyncThunk(
  'user/updateSubscriptionData',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
      const response = await api.post(`${BASE_URL}/admin-update-subscription-type`, data, {
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



export const fetchSubscriptionTypeCaterer = createAsyncThunk(
  'user/fetchSubscriptionTypeCaterer',
  async (vendor_type, thunkAPI) => {
    try {
      const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
      const response = await api.get(`${BASE_URL}/rz-list-subscription-types-by-vendor-type?vendor_type=${vendor_type}&limit=1000&page=1`, {
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


// admin-create-razorpay-plan-mapper 
export const createRazorpayPlansMapper = createAsyncThunk(
  'user/createRazorpayPlansMapper',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
      const response = await api.post(`${BASE_URL}/admin-create-razorpay-plan-mapper`, data, {
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


export const updateRazorpayPlansMapper = createAsyncThunk(
  'user/updateRazorpayPlansMapper',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
      const response = await api.post(`${BASE_URL}/admin-update-razorpay-plan-mapper`, data, {
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


export const updateToggleSubscriptionList = createAsyncThunk(
  'user/updateToggleSubscriptionList',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
      const response = await api.post(`${BASE_URL}/admin-toggle-subscription-types`, data, {
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

// admin-rz-cancel-subscription
export const cancelSubscription = createAsyncThunk(
  'user/cancelSubscription',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
      const response = await api.post(`${BASE_URL}/admin-rz-cancel-subscription`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(response)
      return response?.data?.data;
    } catch (error) {
      toast.error(error.response.data.message)
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
)




export const fetchRzrazorpayPlans = createAsyncThunk(
  'user/fetchRzrazorpayPlans',
  async (type, thunkAPI) => {
    try {
      const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
      const response = await api.get(`${BASE_URL}/rz-get-razorpay-plans?vendor_type=${type}`, {
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


export const adminUpdateSubscriptionBenifit = createAsyncThunk(
  'user/adminUpdateSubscriptionBenifit',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
      const response = await api.post(`${BASE_URL}/admin-update-subscription-benefit`, data, {
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


export const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptionData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSubscriptionData.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.subscriptionList = payload;
      })
      .addCase(fetchSubscriptionData.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(datavalidationerror(payload));
      })
      // fetchRazorpayPlansMapper 
      .addCase(fetchRazorpayPlansMapper.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRazorpayPlansMapper.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.razorpayPlansMapperList = payload;
      })
      .addCase(fetchRazorpayPlansMapper.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(datavalidationerror(payload));
      })
      // fetchVendorSubscriptionEvents 
      .addCase(fetchVendorSubscriptionEvents.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchVendorSubscriptionEvents.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.vendorSubscriptionEvents = payload;
      })
      .addCase(fetchVendorSubscriptionEvents.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(datavalidationerror(payload));
      })
      // fetchVendorSubscriptionList 
      .addCase(fetchVendorSubscriptionList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchVendorSubscriptionList.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.vendorSubscriptionList = payload;
      })
      .addCase(fetchVendorSubscriptionList.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(datavalidationerror(payload));
      })
      // fetchTiffinVendorSubscriptionList 
      .addCase(fetchTiffinVendorSubscriptionList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTiffinVendorSubscriptionList.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.vendorTiffinSubscriptionList = payload;
      })
      .addCase(fetchTiffinVendorSubscriptionList.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(datavalidationerror(payload));
      })
      // fetchSubscriptionTypeCaterer 
      .addCase(fetchSubscriptionTypeCaterer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSubscriptionTypeCaterer.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.vendorSubscriptionTypesList = payload;
      })
      .addCase(fetchSubscriptionTypeCaterer.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(datavalidationerror(payload));
      })
      // createRazorpayPlansMapper 
      .addCase(createRazorpayPlansMapper.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createRazorpayPlansMapper.fulfilled, (state, { payload }) => {
        state.isLoading = false;
      })
      .addCase(createRazorpayPlansMapper.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(datavalidationerror(payload));
      })
      // updateRazorpayPlansMapper 
      .addCase(updateRazorpayPlansMapper.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateRazorpayPlansMapper.fulfilled, (state, { payload }) => {
        state.isLoading = false;
      })
      .addCase(updateRazorpayPlansMapper.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(datavalidationerror(payload));
      })
      // adminAddSubBenifit 
      .addCase(adminAddSubBenifit.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminAddSubBenifit.fulfilled, (state, { payload }) => {
        state.isLoading = false;
      })
      .addCase(adminAddSubBenifit.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(datavalidationerror(payload));
      })
      // fetchRzrazorpayPlans 
      .addCase(fetchRzrazorpayPlans.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRzrazorpayPlans.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.razorpayPlansList = payload;
      })
      .addCase(fetchRzrazorpayPlans.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(datavalidationerror(payload));
      })
      // adminUpdateSubscriptionBenifit 
      .addCase(adminUpdateSubscriptionBenifit.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminUpdateSubscriptionBenifit.fulfilled, (state, { payload }) => {
        state.isLoading = false;
      })
      .addCase(adminUpdateSubscriptionBenifit.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(datavalidationerror(payload));
      })
  }
})

// Action creators are generated for each case reducer function
export const { } = subscriptionSlice.actions

export default subscriptionSlice.reducer