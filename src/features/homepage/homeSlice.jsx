import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api, BASE_URL } from '../../api/apiConfig';
import { datavalidationerror } from '../../utils';
import toast from 'react-hot-toast';

const initialState = {
    isLoading: true,
    exploreCities: [],
}


export const fetchexplorecitiesData = createAsyncThunk(
    'user/fetchexplorecitiesData',
    async (user, thunkAPI) => {
        try {
            const response = await api.get(`${BASE_URL}/admin-list-explore-cities`);
            return response?.data?.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.msg);
        }
    }
)


export const homeSlice = createSlice({
    name: 'homepage',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchexplorecitiesData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchexplorecitiesData.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                state.exploreCities = payload;
            })
            .addCase(fetchexplorecitiesData.rejected, (state, { payload }) => {
                state.isLoading = false;
                toast.error(datavalidationerror(payload));
            })
    }
})

// Action creators are generated for each case reducer function
export const { } = homeSlice.actions

export default homeSlice.reducer