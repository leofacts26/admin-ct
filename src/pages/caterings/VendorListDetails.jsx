import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import Table from 'react-bootstrap/Table';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { fetchCateringCuisines, fetchCateringVendorDetails } from '../../features/catering/cateringSlice';



const businessProfile = {
  vendor_service_name: '',
  vendor_type: '',
  street_name: '',
  point_of_contact_name: '',
  total_staffs_approx: '',
  pin_code: '',
  about_description: '',
  working_since: '',
  business_email: '',
  business_phone_number: '',
  landline_number: '',
  whatsapp_business_phone_number: '',
  website_link: '',
  twitter_id: '',
  instagram_link: '',
  facebook_link: '',
  country: '',
  state: '',
  city: '',
  pincode: '',
  place_id: '',
  latitude: '',
  longitude: '',
  area: '',
  formatted_address: '',
  working_days_start: '',
  working_days_end: '',
  working_hours_start: '',
  working_hours_end: '',
}


const passwordData = {
  id: '',
  company_id: '',
  phone_number: '',
  new_password: ''
}


const VendorListDetails = () => {
  const location = useLocation();
  const { id } = useParams();

  const queryParams = new URLSearchParams(location.search);
  const companyId = queryParams.get('company_id');

  const dispatch = useDispatch()
  const { cateringVendors, cateringVendorsDetail, isLoading } = useSelector((state) => state.catering)
  const { foodTypes, kitchenTypes, mealTimes, cuisines, serviceTypes, servingTypes, vendorDetails } = cateringVendorsDetail;
  const { cuisineList } = useSelector((state) => state.catering)

  const [foodTypesList, setFoodTypesList] = useState(foodTypes)
  const [startPrice, setStartPrice] = useState(cateringVendorsDetail?.start_price || null)
  const [serviceTypesList, setServiceTypesList] = useState(serviceTypes)
  const [servingTypesList, setServingTypesList] = useState(servingTypes)
  const [maximumCapacity, setMaximumCapacity] = useState(cateringVendorsDetail?.maximum_capacity)
  const [minimumCapacity, setMinimumCapacity] = useState(cateringVendorsDetail?.minimum_capacity)

  console.log(cateringVendorsDetail, "cateringVendorsDetail 897");


  const [businessProfileValues, setBusinessProfileValues] = useState(businessProfile)
  const [passwordDataValues, setPasswordDataValues] = useState(passwordData)
  const [editId, setEditId] = useState(null)
  const [show, setShow] = useState(false);
  const [showBusiness, setShowBusiness] = useState(false);
  const [showPasswordData, setShowPasswordData] = useState(false)
  const [showCuisineModal, setShowCuisineModal] = useState(false)

  console.log(cuisineList, "cuisineList cuisineList");

  useEffect(() => {
    dispatch(fetchCateringCuisines())
  }, [])


  const handleClose = () => {
    setShow(false)
    setEditId(null)
  };


  const handleShow = () => {
    setShow(true)
    setFoodTypesList(foodTypes)
    setStartPrice(cateringVendorsDetail?.start_price)
    setServiceTypesList(serviceTypes)
    setServingTypesList(servingTypes)
    setMaximumCapacity(cateringVendorsDetail?.maximum_capacity)
    setMinimumCapacity(cateringVendorsDetail?.minimum_capacity)
  };


  const handleShowBusinessProfileEditClose = () => {
    setShowBusiness(false)
  }
  const handleBusinessProfileEditShow = () => {
    setShowBusiness(true)
  }

  const onHandleCuisineModalClose = () => {
    setShowCuisineModal(false)
  }
  const onHandleCuisineModalOpen = () => {
    setShowCuisineModal(true)
  }


  const onHandlePasswordClose = () => {
    setShowPasswordData(false)
  }
  const onHandlePasswordShow = () => {
    setShowPasswordData(true)
    setPasswordDataValues({
      ...passwordData,
      company_id: companyId,
      id: id,
      phone_number: cateringVendorsDetail?.business_phone_number
    })
  }




  const handleChange = (e) => {
    const { name, value } = e.target;
    setBusinessProfileValues({ ...businessProfileValues, [name]: value })
  }


  const onHandlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordDataValues({ ...passwordDataValues, [name]: value })
  }


  useEffect(() => {
    setBusinessProfileValues(cateringVendorsDetail);
  }, [cateringVendorsDetail]);


  useEffect(() => {
    dispatch(fetchCateringVendorDetails(id));
  }, [id]);





  const handleFoodSwitchToggle = (index) => {
    const updatedFoodTypes = foodTypesList?.length > 0 && foodTypesList?.map((food, i) =>
      i === index ? { ...food, selected: food.selected === 1 ? 0 : 1 } : food
    );
    setFoodTypesList(updatedFoodTypes);
  };


  const handleServiceSwitchToggle = (index) => {
    const updatedServiceTypes = serviceTypesList.map((service, i) =>
      i === index ? { ...service, selected: service.selected === 1 ? 0 : 1 } : service
    );
    setServiceTypesList(updatedServiceTypes);
  };

  const handleServingSwitchToggle = (index) => {
    const updatedServingTypes = servingTypesList.map((serving, i) =>
      i === index ? { ...serving, selected: serving.selected === 1 ? 0 : 1 } : serving
    );
    setServingTypesList(updatedServingTypes);
  };




  const onHandleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      foodTypesList,
      startPrice,
      serviceTypesList,
      servingTypesList,
      maximumCapacity,
      minimumCapacity,
      company_id: companyId
    }

    console.log(data, "Datatatatat");

    // handleClose()
  }


  const onHandleBusinessProfileSubmit = (e) => {
    e.preventDefault();


    const {
      vendor_service_name,
      vendor_type,
      street_name,
      point_of_contact_name,
      total_staffs_approx,
      pin_code,
      about_description,
      working_since,
      business_email,
      business_phone_number,
      landline_number,
      whatsapp_business_phone_number,
      website_link,
      twitter_id,
      instagram_link,
      facebook_link,
      country,
      state,
      city,
      pincode,
      place_id,
      latitude,
      longitude,
      area,
      formatted_address,
      working_days_start,
      working_days_end,
      working_hours_start,
      working_hours_end,
    } = businessProfileValues;

    const data = {
      vendor_service_name,
      vendor_type,
      street_name,
      point_of_contact_name,
      total_staffs_approx,
      pin_code,
      about_description,
      working_since,
      business_email,
      business_phone_number,
      landline_number,
      whatsapp_business_phone_number,
      website_link,
      twitter_id,
      instagram_link,
      facebook_link,
      country,
      state,
      city,
      pincode,
      place_id,
      latitude,
      longitude,
      area,
      formatted_address,
      working_days_start,
      working_days_end,
      working_hours_start,
      working_hours_end,
    }


    console.log(data, "data businessProfileValuestatatat");


    // handleShowBusinessProfileEditClose() 
  }



  const onHandlePasswordSubmit = (e) => {
    e.preventDefault()

    onHandlePasswordClose()
  }


  const onHandleCuisineSubmit = (e) => {
    e.preventDefault()

    onHandlePasswordClose()
  }



  return (
    <>
      <div className="container-fluid my-5">

        <div className="row mx-2">
          <div className="bg-secondary text-white py-3 d-flex justify-content-between">
            <h3 className='mb-0'>Vendor Details</h3>
            <h3 className='mb-0 text-warning'>Upgrade</h3>
          </div>
          <Table responsive="xl" className='m-0'>
            <thead>
              <tr>
                <th style={{ fontSize: '10px' }}>Vendor ID</th>
                <th style={{ fontSize: '10px' }}>Vendor Type</th>
                <th style={{ fontSize: '10px' }}>Subscription Plan</th>
                <th style={{ fontSize: '10px' }}>Plan Type</th>
                <th style={{ fontSize: '10px' }}>Start Date</th>
                <th style={{ fontSize: '10px' }}>Expiry Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{id ? id : 'N/A'}</td>
                <td>{cateringVendorsDetail?.vendor_type ? cateringVendorsDetail?.vendor_type : 'N/A'}</td>
                <td>{cateringVendorsDetail?.sub_plan ? cateringVendorsDetail?.sub_plan : 'N/A'}</td>
                <td>{cateringVendorsDetail?.plan_type ? cateringVendorsDetail?.plan_type : 'N/A'}</td>
                <td>{cateringVendorsDetail?.start_date ? cateringVendorsDetail?.start_date : 'N/A'}</td>
                <td>{cateringVendorsDetail?.expiry_date ? cateringVendorsDetail?.expiry_date : 'N/A'}</td>
              </tr>
            </tbody>
          </Table>
        </div>
        <hr />


        <div className="row mx-2">
          <div className="bg-secondary text-white py-3 d-flex justify-content-between">
            <h3 className='mb-0'>Business Information</h3>
            <h3 className='mb-0 text-warning' onClick={handleBusinessProfileEditShow} style={{ cursor: 'pointer' }}>Edit</h3>
          </div>
          <Table responsive="xl" className='m-0'>
            <>
              <thead>
                <tr>
                  <th style={{ fontSize: '10px' }}>vendor_service_name</th>
                  <th style={{ fontSize: '10px' }}>vendor_type</th>
                  <th style={{ fontSize: '10px' }}>business_email</th>
                  <th style={{ fontSize: '10px' }}>business_phone_number</th>
                  <th style={{ fontSize: '10px' }}>landline_number</th>
                  <th style={{ fontSize: '10px' }}>point_of_contact_name</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{cateringVendorsDetail?.vendor_service_name ? cateringVendorsDetail?.vendor_service_name : 'N/A'}</td>
                  <td>{cateringVendorsDetail?.vendor_type ? cateringVendorsDetail?.vendor_type : 'N/A'}</td>
                  <td>{cateringVendorsDetail?.business_email ? cateringVendorsDetail?.business_email : 'N/A'}</td>
                  <td>{cateringVendorsDetail?.business_phone_number ? cateringVendorsDetail?.business_phone_number : 'N/A'}</td>
                  <td>{cateringVendorsDetail?.landline_number ? cateringVendorsDetail?.landline_number : 'N/A'}</td>
                  <td>{cateringVendorsDetail?.point_of_contact_name ? cateringVendorsDetail?.point_of_contact_name : 'N/A'}</td>
                </tr>
              </tbody>


              <thead>
                <tr>
                  <th style={{ fontSize: '10px' }}>whatsapp_business_phone_number</th>
                  <th style={{ fontSize: '10px' }}>about_description</th>
                  <th style={{ fontSize: '10px' }}>facebook_link</th>
                  <th style={{ fontSize: '10px' }}>instagram_link</th>
                  <th style={{ fontSize: '10px' }}>twitter_id</th>
                  <th style={{ fontSize: '10px' }}>website_link</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{cateringVendorsDetail?.whatsapp_business_phone_number ? cateringVendorsDetail?.whatsapp_business_phone_number : 'N/A'}</td>
                  <td>{cateringVendorsDetail?.about_description ? cateringVendorsDetail?.about_description : 'N/A'}</td>
                  <td>{cateringVendorsDetail?.facebook_link ? cateringVendorsDetail?.facebook_link : 'N/A'}</td>
                  <td>{cateringVendorsDetail?.instagram_link ? cateringVendorsDetail?.instagram_link : 'N/A'}</td>
                  <td>{cateringVendorsDetail?.twitter_id ? cateringVendorsDetail?.twitter_id : 'N/A'}</td>
                  <td>{cateringVendorsDetail?.website_link ? cateringVendorsDetail?.website_link : 'N/A'}</td>
                </tr>
              </tbody>



              <thead>
                <tr>
                  <th style={{ fontSize: '10px' }}>total_staffs_approx</th>
                  <th style={{ fontSize: '10px' }}>working_days_hours</th>
                  <th style={{ fontSize: '10px' }}>working_since</th>
                  <th style={{ fontSize: '10px' }}>street_name</th>
                  <th style={{ fontSize: '10px' }}>state</th>
                  <th style={{ fontSize: '10px' }}>area</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{cateringVendorsDetail?.total_staffs_approx ? cateringVendorsDetail?.total_staffs_approx : 'N/A'}</td>
                  <td>{cateringVendorsDetail?.working_days_hours ? cateringVendorsDetail?.working_days_hours : 'N/A'}</td>
                  <td>{cateringVendorsDetail?.working_since ? cateringVendorsDetail?.working_since : 'N/A'}</td>
                  <td>{cateringVendorsDetail?.street_name ? cateringVendorsDetail?.street_name : 'N/A'}</td>
                  <td>{cateringVendorsDetail?.state ? cateringVendorsDetail?.state : 'N/A'}</td>
                  <td>{cateringVendorsDetail?.area ? cateringVendorsDetail?.area : 'N/A'}</td>
                </tr>
              </tbody>





              <thead>
                <tr>
                  <th style={{ fontSize: '10px' }}>city</th>
                  <th style={{ fontSize: '10px' }}>country</th>
                  <th style={{ fontSize: '10px' }}>formatted_address</th>
                  <th style={{ fontSize: '10px' }}>latitude</th>
                  <th style={{ fontSize: '10px' }}>longitude</th>
                  <th style={{ fontSize: '10px' }}>pincode</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{cateringVendorsDetail?.city ? cateringVendorsDetail?.city : 'N/A'}</td>
                  <td>{cateringVendorsDetail?.country ? cateringVendorsDetail?.country : 'N/A'}</td>
                  <td>{cateringVendorsDetail?.formatted_address ? cateringVendorsDetail?.formatted_address : 'N/A'}</td>
                  <td>{cateringVendorsDetail?.latitude ? cateringVendorsDetail?.latitude : 'N/A'}</td>
                  <td>{cateringVendorsDetail?.longitude ? cateringVendorsDetail?.longitude : 'N/A'}</td>
                  <td>{cateringVendorsDetail?.pincode ? cateringVendorsDetail?.pincode : 'N/A'}</td>
                </tr>
              </tbody>
            </>
          </Table>
        </div>
        <hr />



        <div className="row mx-2">
          <div className="bg-secondary text-white py-3 d-flex justify-content-between">
            <h3 className='mb-0'>Culinary Details</h3>
            <h3 className='mb-0 text-warning' onClick={handleShow} style={{ cursor: 'pointer' }}>Edit</h3>
          </div>
          <Table responsive="xl" className='m-0'>
            <thead>
              <tr>
                <th style={{ fontSize: '10px' }}>Food Type</th>
                <th style={{ fontSize: '10px' }}>serviceTypes</th>
                <th style={{ fontSize: '10px' }}>servingTypes</th>
                <th style={{ fontSize: '10px' }}>maximum_capacity</th>
                <th style={{ fontSize: '10px' }}>minimum_capacity</th>
                <th style={{ fontSize: '10px' }}>start_price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {foodTypes?.length > 0 ? foodTypes?.map(item => item.food_type_name)?.join(', ') : 'N/A'}
                </td>
                <td>
                  {serviceTypes?.length > 0 ? serviceTypes?.map(item => item.service_type_name)?.join(', ') : 'N/A'}
                </td>
                <td>
                  {servingTypes?.length > 0 ? servingTypes?.map(item => item.serving_type_name)?.join(', ') : 'N/A'}
                </td>
                <td>{cateringVendorsDetail?.maximum_capacity ? cateringVendorsDetail?.maximum_capacity : 'N/A'}</td>
                <td>{cateringVendorsDetail?.minimum_capacity ? cateringVendorsDetail?.minimum_capacity : 'N/A'}</td>
                <td>{cateringVendorsDetail?.start_price ? cateringVendorsDetail?.start_price : 'N/A'}</td>
              </tr>
            </tbody>
          </Table>
        </div>
        <hr />




        <div className="row mx-2">
          <div className="bg-secondary text-white py-3 d-flex justify-content-between">
            <h3 className='mb-0'>Cuisines You cater</h3>
            <h3 className='mb-0 text-warning' style={{ cursor: 'pointer' }} onClick={onHandleCuisineModalOpen}>Edit</h3>
          </div>
          <div className='mt-3'>
            {cuisines && cuisines.length > 0
              ? cuisines.map((item, index) => (
                <span key={item.cuisine_name} className='cuisine-item'>
                  {item.cuisine_name}
                  {index < cuisines.length - 1 && ', '}
                </span>
              ))
              : 'N/A'}
          </div>
        </div>
        <hr />




        <div className="row mx-2">
          <div className="bg-secondary text-white py-3 d-flex justify-content-between">
            <h3 className='mb-0'>Profile</h3>
            <h3 className='mb-0 text-warning' style={{ cursor: 'pointer' }} onClick={onHandlePasswordShow}>Edit</h3>
          </div>
          <div className='mt-3'>
            <Table responsive="xl" className='m-0'>
              <thead>
                <tr>
                  <th style={{ fontSize: '10px' }}>Login ID</th>
                  <th style={{ fontSize: '10px' }}>Password</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{companyId}</td>
                  <td>Passsssword</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
        <hr />



      </div>




      <Modal size="xl" centered show={showCuisineModal} onHide={onHandleCuisineModalClose}>
        <form onSubmit={onHandleCuisineSubmit}>
          <Modal.Header closeButton>
            <Modal.Title> Update Cuisine </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className='col-6 mt-1'>
                <label for="name" className="form-label"> <b>vendor ID</b> </label>

              </div>
            </div>
            <hr />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onHandleCuisineModalClose}>
              Close
            </Button>
            <Button variant="primary" type='submit'>
              {isLoading ? 'Loading...' : 'Save Changes'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>



      <Modal size="xl" centered show={showPasswordData} onHide={onHandlePasswordClose}>
        <form onSubmit={onHandlePasswordSubmit}>
          <Modal.Header closeButton>
            <Modal.Title> Update Password </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className='col-6 mt-1'>
                <label for="name" className="form-label"> <b>vendor ID</b> </label>
                <input type="text" className="form-control" placeholder="vendor id" name="id"
                  value={passwordDataValues?.id}
                  onChange={onHandlePasswordChange}
                />
              </div>
              <div className='col-6 mt-1'>
                <label for="name" className="form-label"> <b>company id</b> </label>
                <input type="text" className="form-control" placeholder="company id" name="company id"
                  value={passwordDataValues?.company_id}
                  onChange={onHandlePasswordChange}
                />
              </div>
              <div className='col-6 mt-4'>
                <label for="name" className="form-label"> <b>phone_number</b> </label>
                <input type="text" className="form-control" placeholder="phone number" name="phone_number"
                  value={passwordDataValues?.phone_number}
                  onChange={onHandlePasswordChange}
                />
              </div>
              <div className='col-6 mt-4'>
                <label for="name" className="form-label"> <b>new_password</b> </label>
                <input type="text" className="form-control" placeholder="new password" name="new_password"
                  value={passwordDataValues?.new_password}
                  onChange={onHandlePasswordChange}
                />
              </div>


            </div>
            <hr />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onHandlePasswordClose}>
              Close
            </Button>
            <Button variant="primary" type='submit'>
              {isLoading ? 'Loading...' : 'Save Changes'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>





      <Modal size="xl" centered show={showBusiness} onHide={handleShowBusinessProfileEditClose}>
        <form onSubmit={onHandleBusinessProfileSubmit}>
          <Modal.Header closeButton>
            <Modal.Title> Update Business Profile </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className='col-3 mt-4'>
                <label for="name" className="form-label"> <b>vendor service name</b> </label>
                <input type="text" className="form-control" placeholder="Name" name="vendor_service_name"
                  value={businessProfileValues?.vendor_service_name}
                  onChange={handleChange}
                />
              </div>
              <div className='col-3 mt-4'>
                <label for="name" className="form-label"> <b>vendor type</b> </label>
                <input type="text" className="form-control" placeholder="type" name="vendor_type"
                  value={businessProfileValues?.vendor_type}
                  onChange={handleChange}
                />
              </div>
              <div className='col-3 mt-4'>
                <label for="name" className="form-label"> <b>street name</b> </label>
                <input type="text" className="form-control" placeholder="street name" name="street_name"
                  value={businessProfileValues?.street_name}
                  onChange={handleChange}
                />
              </div>
              <div className='col-3 mt-4'>
                <label for="name" className="form-label"> <b>point of contact name</b> </label>
                <input type="text" className="form-control" placeholder="point of contact name" name="point_of_contact_name"
                  value={businessProfileValues?.point_of_contact_name}
                  onChange={handleChange}
                />
              </div>
              <div className='col-3 mt-4'>
                <label for="name" className="form-label"> <b>total staffs approx</b> </label>
                <input type="text" className="form-control" placeholder="total staffs approx" name="total_staffs_approx"
                  value={businessProfileValues?.total_staffs_approx}
                  onChange={handleChange}
                />
              </div>
              <div className='col-3 mt-4'>
                <label for="name" className="form-label"> <b>pin code</b> </label>
                <input type="text" className="form-control" placeholder="pin code" name="pin_code"
                  value={businessProfileValues?.pin_code}
                  onChange={handleChange}
                />
              </div>
              <div className='col-3 mt-4'>
                <label for="name" className="form-label"> <b>about description</b> </label>
                <input type="text" className="form-control" placeholder="about description" name="about_description"
                  value={businessProfileValues?.about_description}
                  onChange={handleChange}
                />
              </div>
              <div className='col-3 mt-4'>
                <label for="name" className="form-label"> <b>working since</b> </label>
                <input type="text" className="form-control" placeholder="working since" name="working_since"
                  value={businessProfileValues?.working_since}
                  onChange={handleChange}
                />
              </div>
              <div className='col-3 mt-4'>
                <label for="name" className="form-label"> <b>business email</b> </label>
                <input type="text" className="form-control" placeholder="business email" name="business_email"
                  value={businessProfileValues?.business_email}
                  onChange={handleChange}
                />
              </div>
              <div className='col-3 mt-4'>
                <label for="name" className="form-label"> <b>business phone number</b> </label>
                <input type="text" className="form-control" placeholder="business phone number" name="business_phone_number"
                  value={businessProfileValues?.business_phone_number}
                  onChange={handleChange}
                />
              </div>
              <div className='col-3 mt-4'>
                <label for="name" className="form-label"> <b>landline number</b> </label>
                <input type="text" className="form-control" placeholder="landline number" name="landline_number"
                  value={businessProfileValues?.landline_number}
                  onChange={handleChange}
                />
              </div>
              <div className='col-3 mt-4'>
                <label for="name" className="form-label"> <b>whatsapp business phone number</b> </label>
                <input type="text" className="form-control" placeholder="whatsapp business phone number" name="whatsapp_business_phone_number"
                  value={businessProfileValues?.whatsapp_business_phone_number}
                  onChange={handleChange}
                />
              </div>
              <div className='col-3 mt-4'>
                <label for="name" className="form-label"> <b>website link</b> </label>
                <input type="text" className="form-control" placeholder="website link" name="website_link"
                  value={businessProfileValues?.website_link}
                  onChange={handleChange}
                />
              </div>
              <div className='col-3 mt-4'>
                <label for="name" className="form-label"> <b>twitter id</b> </label>
                <input type="text" className="form-control" placeholder="twitter id" name="twitter_id"
                  value={businessProfileValues?.twitter_id}
                  onChange={handleChange}
                />
              </div>
              <div className='col-3 mt-4'>
                <label for="name" className="form-label"> <b>instagram link</b> </label>
                <input type="text" className="form-control" placeholder="instagram link" name="instagram_link"
                  value={businessProfileValues?.instagram_link}
                  onChange={handleChange}
                />
              </div>
              <div className='col-3 mt-4'>
                <label for="name" className="form-label"> <b>facebook link</b> </label>
                <input type="text" className="form-control" placeholder="facebook link" name="facebook_link"
                  value={businessProfileValues?.facebook_link}
                  onChange={handleChange}
                />
              </div>
              <div className='col-3 mt-4'>
                <label for="name" className="form-label"> <b>country</b> </label>
                <input type="text" className="form-control" placeholder="country" name="country"
                  value={businessProfileValues?.country}
                  onChange={handleChange}
                />
              </div>
              <div className='col-3 mt-4'>
                <label for="name" className="form-label"> <b>state</b> </label>
                <input type="text" className="form-control" placeholder="state" name="state"
                  value={businessProfileValues?.state}
                  onChange={handleChange}
                />
              </div>
              <div className='col-3 mt-4'>
                <label for="name" className="form-label"> <b>city</b> </label>
                <input type="text" className="form-control" placeholder="city" name="city"
                  value={businessProfileValues?.city}
                  onChange={handleChange}
                />
              </div>
              <div className='col-3 mt-4'>
                <label for="name" className="form-label"> <b>pincode</b> </label>
                <input type="text" className="form-control" placeholder="pincode" name="pincode"
                  value={businessProfileValues?.pincode}
                  onChange={handleChange}
                />
              </div>
              <div className='col-3 mt-4'>
                <label for="name" className="form-label"> <b>place_id</b> </label>
                <input type="text" className="form-control" placeholder="place_id" name="place_id"
                  value={businessProfileValues?.place_id}
                  onChange={handleChange}
                />
              </div>
              <div className='col-3 mt-4'>
                <label for="name" className="form-label"> <b>latitude</b> </label>
                <input type="text" className="form-control" placeholder="latitude" name="latitude"
                  value={businessProfileValues?.latitude}
                  onChange={handleChange}
                />
              </div>
              <div className='col-3 mt-4'>
                <label for="name" className="form-label"> <b>longitude</b> </label>
                <input type="text" className="form-control" placeholder="longitude" name="longitude"
                  value={businessProfileValues?.longitude}
                  onChange={handleChange}
                />
              </div>
              <div className='col-3 mt-4'>
                <label for="name" className="form-label"> <b>area</b> </label>
                <input type="text" className="form-control" placeholder="area" name="area"
                  value={businessProfileValues?.area}
                  onChange={handleChange}
                />
              </div>
              <div className='col-3 mt-4'>
                <label for="name" className="form-label"> <b>formatted address</b> </label>
                <input type="text" className="form-control" placeholder="formatted address" name="formatted_address"
                  value={businessProfileValues?.formatted_address}
                  onChange={handleChange}
                />
              </div>
              <div className='col-3 mt-4'>
                <label for="name" className="form-label"> <b>working days start</b> </label>
                <input type="text" className="form-control" placeholder="working days start" name="working_days_start"
                  value={businessProfileValues?.working_days_start}
                  onChange={handleChange}
                />
              </div>
              <div className='col-3 mt-4'>
                <label for="name" className="form-label"> <b>working days end</b> </label>
                <input type="text" className="form-control" placeholder="working days end" name="working_days_end"
                  value={businessProfileValues?.working_days_end}
                  onChange={handleChange}
                />
              </div>
              <div className='col-3 mt-4'>
                <label for="name" className="form-label"> <b>working hours start</b> </label>
                <input type="text" className="form-control" placeholder="working hours start" name="working_hours_start"
                  value={businessProfileValues?.working_hours_start}
                  onChange={handleChange}
                />
              </div>
              <div className='col-3 mt-4'>
                <label for="name" className="form-label"> <b>working hours end</b> </label>
                <input type="text" className="form-control" placeholder="working hours end" name="working_hours_end"
                  value={businessProfileValues?.working_hours_end}
                  onChange={handleChange}
                />
              </div>

            </div>
            <hr />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleShowBusinessProfileEditClose}>
              Close
            </Button>
            <Button variant="primary" type='submit'>
              {isLoading ? 'Loading...' : 'Save Changes'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>




      <Modal centered show={show} onHide={handleClose}>
        <form onSubmit={onHandleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title> {editId ? 'Edit Budget' : 'Create Budget'} </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className='col-6'>
                <h3 className='package-capacity mt-0 mb-4'>Manage Your Package</h3>
                {foodTypesList?.length > 0 && foodTypesList?.map((food, index) => (
                  <div className="vd-ft mb-5" key={food.id}>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`status-${food.id}`}
                        checked={food.selected === 1}
                        onChange={() => handleFoodSwitchToggle(index)}
                      />
                      <label className="form-check-label" htmlFor={`status-${food.id}`}>
                        {food?.food_type_name}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              <div className='col-6'>
                <label for="name" className="form-label"> <b>End Price</b> </label>
                <input type="text" className="form-control" placeholder="Enter Minimum Capacity - Eg: 100plates" name="startPrice" required
                  value={startPrice}
                  onChange={(e) => setStartPrice(e.target.value)}
                />
              </div>
            </div>
            <hr />

            <div className="row">
              <div className='col-6'>
                <h3 className='package-capacity mt-0 mb-4'>Choose your Service type Below</h3>
                {serviceTypesList?.length > 0 && serviceTypesList?.map((service, index) => (
                  <div className="vd-ft mb-5" key={service.id}>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`status-${service.id}`}
                        checked={service.selected === 1}
                        onChange={() => handleServiceSwitchToggle(index)}
                      />
                      <label className="form-check-label" htmlFor={`status-${service.id}`}>
                        {service.service_type_name}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              <div className='col-6'>
                <h3 className='package-capacity mt-0 mb-4'>Choose your Serving type Below</h3>
                {servingTypesList?.length > 0 && servingTypesList?.map((serving, index) => (
                  <div className="vd-ft mb-5" key={serving.id}>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`status-${serving.id}`}
                        checked={serving.selected === 1}
                        onChange={() => handleServingSwitchToggle(index)}
                      />
                      <label className="form-check-label" htmlFor={`status-${serving.id}`}>
                        {serving.serving_type_name}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <hr />


            <div className="row">
              <h3 className='package-capacity text-center mt-0 mb-4'>Capacity</h3>
              <div className='col-6'>
                <>
                  <label for="name" className="form-label"> <b>Minimum Capacity</b> </label>
                  <input type="text" className="form-control" placeholder="Enter Minimum Capacity - Eg: 100plates" name="minimumCapacity" required
                    value={minimumCapacity}
                    onChange={(e) => setMinimumCapacity(e.target.value)}
                  />
                </>
              </div>
              <div className='col-6'>
                <>
                  <label for="name" className="form-label"> <b>Maximum Capacity</b> </label>
                  <input type="text" className="form-control" placeholder="Enter Maximum Capacity - Eg: 100plates" name="maximumCapacity" required
                    value={maximumCapacity}
                    onChange={(e) => setMaximumCapacity(e.target.value)}
                  />
                </>
              </div>
            </div>


          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type='submit'>
              {isLoading ? 'Loading...' : 'Save Changes'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>


    </>
  )
}
export default VendorListDetails