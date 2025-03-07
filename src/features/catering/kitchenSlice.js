import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api, BASE_URL } from '../../api/apiConfig';
import { datavalidationerror, successToast } from '../../utils';
import toast from 'react-hot-toast';
import { cater_vendor_type, tiffin_vendor_type } from '../../constants';

const initialState = {
  isLoading: true,
  kitchenTypesList: [],
  kitchenId: null,
}

export const fetchKitchenTypes = createAsyncThunk(
  'catering/fetchKitchenTypes',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
      const response = await api.get(`${BASE_URL}/admin-list-kitchen-types?current_page=1&limit=100`, {
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

export const createKitchenType = createAsyncThunk(
  'user/createKitchenType',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
      const response = await api.post(`${BASE_URL}/admin-create-kitchen-type`, data, {
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


export const updateKitchenType = createAsyncThunk(
  'user/updateKitchenType',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
      const response = await api.post(`${BASE_URL}/admin-update-kitchen-type`, data, {
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


export const updateToggleKitchenType = createAsyncThunk(
  'user/updateToggleKitchenType',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
      const response = await api.post(`${BASE_URL}/admin-toggle-kitchen-type`, data, {
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



export const kitchenSlice = createSlice({
  name: 'kitchentypes',
  initialState,
  reducers: {
    setKitchenId: (state, action) => {
      state.kitchenId = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchKitchenTypes 
      .addCase(fetchKitchenTypes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchKitchenTypes.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.kitchenTypesList = payload;
      })
      .addCase(fetchKitchenTypes.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(datavalidationerror(payload));
      })
      // createKitchenType 
      .addCase(createKitchenType.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createKitchenType.fulfilled, (state, { payload }) => {
        state.isLoading = false;
      })
      .addCase(createKitchenType.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(datavalidationerror(payload));
      })
      // updateKitchenType 
      .addCase(updateKitchenType.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateKitchenType.fulfilled, (state, { payload }) => {
        state.isLoading = false;
      })
      .addCase(updateKitchenType.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(datavalidationerror(payload));
      })

  }
})

// Action creators are generated for each case reducer function
export const { setKitchenId } = kitchenSlice.actions

export default kitchenSlice.reducer