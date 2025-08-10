import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api, BASE_URL } from '../../api/apiConfig';
import { datavalidationerror, successToast } from '../../utils';
import toast from 'react-hot-toast';
import { cater_vendor_type, tiffin_vendor_type } from '../../constants';

const initialState = {
  isLoading: true,
  couponsList: [],
}

export const fetchCouponList = createAsyncThunk(
  'catering/fetchCouponList',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
      const response = await api.get(`${BASE_URL}/admin-list-coupons?current_page=1&limit=1000`, {
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


export const createCouponList = createAsyncThunk(
  'user/createCouponList',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
      const response = await api.post(`${BASE_URL}/admin-create-coupon`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response?.data?.data;
    } catch (error) {
      // return thunkAPI.rejectWithValue(error.response.data.msg);
      toast.error(error.response.data.message)
    }
  }
)



export const updateCouponList = createAsyncThunk(
  'user/updateCouponList',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
      const response = await api.post(`${BASE_URL}/admin-update-coupon`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response?.data?.data;
    } catch (error) {
      // console.log(error, "errorerrorerror");
      toast.error(error.response.data.message)
      // return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
)


export const couponSlice = createSlice({
  name: 'coupons',
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      // fetchCouponList 
      .addCase(fetchCouponList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCouponList.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.couponsList = payload;
      })
      .addCase(fetchCouponList.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(datavalidationerror(payload));
      })
      // createCouponList 
      .addCase(createCouponList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCouponList.fulfilled, (state, { payload }) => {
        state.isLoading = false;
      })
      .addCase(createCouponList.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(datavalidationerror(payload));
      })
      // updateCouponList 
      .addCase(updateCouponList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCouponList.fulfilled, (state, { payload }) => {
        state.isLoading = false;
      })
      .addCase(updateCouponList.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(datavalidationerror(payload));
      })

  }
})

// Action creators are generated for each case reducer function
export const { } = couponSlice.actions

export default couponSlice.reducer