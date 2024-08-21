import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api, BASE_URL } from '../api/apiConfig';
import { datavalidationerror } from '../utils';
import toast from 'react-hot-toast';

const initialState = {
  isLoading: true,
  subscriptionList: [],
}


export const fetchSubscriptionData = createAsyncThunk(
  'user/fetchSubscriptionData',
  async (user, thunkAPI) => {
    try {
      const response = await api.get(`${BASE_URL}/admin-list-vendor-subscriptions`);
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
  }
})

// Action creators are generated for each case reducer function
export const {  } = subscriptionSlice.actions

export default subscriptionSlice.reducer