import React from 'react'
import toast from 'react-hot-toast';
import { api, BASE_URL } from '../api/apiConfig';
import { datavalidationerror, successToast } from '../utils';
import { setIsLoading } from '../features/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCateringCuisines } from '../features/catering/cateringSlice';
import { fetchexplorecitiesData } from '../features/homepage/homeSlice';
import { fetchKitchenTypes } from '../features/catering/kitchenSlice';

const useUploadCusinePhotoos = () => {
    const dispatch = useDispatch()
    const { cuisineId } = useSelector((state) => state.users)
    const { kitchenId } = useSelector((state) => state.kitchentypes)
    const { token } = useSelector((state) => state.authSlice);

    console.log(kitchenId, "kitchenIdkitchenId");
    

    const onUploadParentCuisine = async (event) => {
        const formData = new FormData();
        formData.append('id', cuisineId);
        formData.append('image', event.target.files[0]);
        formData.append('table', 'cuisines')

        dispatch(setIsLoading(true))
        try {
            toast.loading('Uploading Image...');
            const response = await api.post(`${BASE_URL}/admin-upload-cuisine`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            dispatch(fetchCateringCuisines());
            toast.success(successToast(response))
        } catch (error) {
            console.log(error);
            toast.error(datavalidationerror(error))
        } finally {
            dispatch(setIsLoading(false))
            toast.dismiss();
        }
    }

    const onUploadCityImage = async (event) => {
        const formData = new FormData();
        formData.append('id', cuisineId);
        formData.append('image', event.target.files[0]);
        formData.append('table', 'explore_cities')
        // const token = thunkAPI.getState().authSlice.token || localStorage.getItem('token');
        dispatch(setIsLoading(true))
        try {
            toast.loading('Uploading Image...');
            const response = await api.post(`${BASE_URL}/admin-upload-explore-city`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            dispatch(fetchexplorecitiesData());
            toast.success(successToast(response))
        } catch (error) {
            console.log(error);
            toast.error(datavalidationerror(error))
        } finally {
            dispatch(setIsLoading(false))
            toast.dismiss();
        }
    }


    const onUploadKitchenImage = async (event) => {
        const formData = new FormData();
        formData.append('id', kitchenId);
        formData.append('image', event.target.files[0]);
        formData.append('table', 'kitchen_types')
        dispatch(setIsLoading(true))
        try {
            toast.loading('Uploading Image...');
            const response = await api.post(`${BASE_URL}/admin-upload-kitchen-types`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            dispatch(fetchKitchenTypes());
            toast.success(successToast(response))
        } catch (error) {
            console.log(error);
            toast.error(datavalidationerror(error))
        } finally {
            dispatch(setIsLoading(false))
            toast.dismiss();
        }
    }

    return {
        onUploadParentCuisine,
        onUploadCityImage,
        onUploadKitchenImage
    }
}

export default useUploadCusinePhotoos