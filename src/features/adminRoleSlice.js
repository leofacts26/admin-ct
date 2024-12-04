import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api, BASE_URL } from '../api/apiConfig';
import { datavalidationerror, successToast } from '../utils';
import toast from 'react-hot-toast';

const initialState = {
  isLoading: true,
  adminRoleList: [],
  adminFeatureRoleList: [],
  adminFeaturesForRolesList: [],
  adminListFeaturesDisassociated: [],
  roleName: ''
}


export const fetchAdminRoleListData = createAsyncThunk(
  'user/fetchAdminRoleListData',
  async (user, thunkAPI) => {
    try {
      const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
      const response = await api.get(`${BASE_URL}/admin-list-roles?current_page=1&limit=1000000`, {
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

export const createAdminROle = createAsyncThunk(
  'user/createAdminROle',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
      const response = await api.post(`${BASE_URL}/admin-create-role`, data, {
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


export const updateAdminRole = createAsyncThunk(
  'user/updateAdminRole',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
      const response = await api.post(`${BASE_URL}/admin-role-update`, data, {
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


export const updateToggleAdminRolesRanges = createAsyncThunk(
  'user/updateToggleAdminRolesRanges',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
      const response = await api.post(`${BASE_URL}/admin-toggle-roles`, data, {
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


// features 
export const fetchAdminListFuture = createAsyncThunk(
  'user/fetchAdminListFuture',
  async (user, thunkAPI) => {
    try {
      const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
      const response = await api.get(`${BASE_URL}/admin-list-features?current_page=1&limit=100000`, {
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


export const updateToggleAdminFeatures = createAsyncThunk(
  'user/updateToggleAdminFeatures',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
      const response = await api.post(`${BASE_URL}/admin-toggle-feature`, data, {
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


export const createAdminFeature = createAsyncThunk(
  'user/createAdminFeature',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
      const response = await api.post(`${BASE_URL}/admin-create-feature`, data, {
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

export const updateAdminFeature = createAsyncThunk(
  'user/updateAdminFeature',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
      const response = await api.post(`${BASE_URL}/admin-feature-update`, data, {
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


export const onHandledeleteFeatures = createAsyncThunk(
  'user/onHandledeleteFeatures',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
      const response = await api.post(`${BASE_URL}/admin-delete-feature`, data, {
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


export const adminListFeaturesForRoles = createAsyncThunk(
  'user/adminListFeaturesForRoles',
  async (role_id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
      const response = await api.get(`${BASE_URL}/admin-list-features-for-roles?current_page=1&limit=100000&role_id=${role_id}`, {
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


export const adminAssociateFeature = createAsyncThunk(
  'user/adminAssociateFeature',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
      const response = await api.post(`${BASE_URL}/admin-associate-feature`, data, {
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

export const adminDeleteFeatureRole = createAsyncThunk(
  'user/adminAssociateFeature',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
      const response = await api.post(`${BASE_URL}/admin-delete-feature-for-role`, data, {
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

export const fetchFeaturesDisassociated = createAsyncThunk(
  'user/fetchFeaturesDisassociated',
  async (roleID, thunkAPI) => {
    try {
      const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
      const response = await api.get(`${BASE_URL}/admin-list-features-disassociated?current_page=1&limit=1000000&role_id=${roleID}`, {
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




export const adminRoleSlice = createSlice({
  name: 'roleSlice',
  initialState,
  reducers: {
    setListRoleName: (state, action) => {
      state.roleName = action.payload;
  },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminRoleListData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAdminRoleListData.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.adminRoleList = payload;
      })
      .addCase(fetchAdminRoleListData.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(datavalidationerror(payload));
      })
      // createAdminROle 
      .addCase(createAdminROle.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createAdminROle.fulfilled, (state, { payload }) => {
        state.isLoading = false;
      })
      .addCase(createAdminROle.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(datavalidationerror(payload));
      })
      // updateAdminRole 
      .addCase(updateAdminRole.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateAdminRole.fulfilled, (state, { payload }) => {
        state.isLoading = false;
      })
      .addCase(updateAdminRole.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(datavalidationerror(payload));
      })
      // updateToggleAdminRolesRanges 
      .addCase(updateToggleAdminRolesRanges.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateToggleAdminRolesRanges.fulfilled, (state, { payload }) => {
        state.isLoading = false;
      })
      .addCase(updateToggleAdminRolesRanges.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(datavalidationerror(payload));
      })
      // fetchAdminListFuture 
      .addCase(fetchAdminListFuture.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAdminListFuture.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.adminFeatureRoleList = payload;
      })
      .addCase(fetchAdminListFuture.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(datavalidationerror(payload));
      })
      // updateToggleAdminFeatures 
      .addCase(updateToggleAdminFeatures.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateToggleAdminFeatures.fulfilled, (state, { payload }) => {
        state.isLoading = false;
      })
      .addCase(updateToggleAdminFeatures.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(datavalidationerror(payload));
      })
      // createAdminFeature 
      .addCase(createAdminFeature.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createAdminFeature.fulfilled, (state, { payload }) => {
        state.isLoading = false;
      })
      .addCase(createAdminFeature.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(datavalidationerror(payload));
      })
      // updateAdminFeature 
      .addCase(updateAdminFeature.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateAdminFeature.fulfilled, (state, { payload }) => {
        state.isLoading = false;
      })
      .addCase(updateAdminFeature.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(datavalidationerror(payload));
      })
      // adminListFeaturesForRoles 
      .addCase(adminListFeaturesForRoles.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminListFeaturesForRoles.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.adminFeaturesForRolesList = payload;
      })
      .addCase(adminListFeaturesForRoles.rejected, (state, { payload }) => {
        state.isLoading = false;
        // toast.error(datavalidationerror(payload)); 
      })
      // fetchFeaturesDisassociated 
      .addCase(fetchFeaturesDisassociated.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFeaturesDisassociated.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.adminListFeaturesDisassociated = payload;
      })
      .addCase(fetchFeaturesDisassociated.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(datavalidationerror(payload));
      })
      // adminDeleteFeatureROle 
      .addCase(adminDeleteFeatureRole.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminDeleteFeatureRole.fulfilled, (state, { payload }) => {
        state.isLoading = false;
      })
      .addCase(adminDeleteFeatureRole.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(datavalidationerror(payload));
      })
  }
})

// Action creators are generated for each case reducer function
export const { setListRoleName } = adminRoleSlice.actions

export default adminRoleSlice.reducer