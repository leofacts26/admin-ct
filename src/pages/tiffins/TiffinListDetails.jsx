import { useDispatch, useSelector } from "react-redux"
import { fetchCateringVendorDetails, fetchGetVendorSettingsInfo } from "../../features/catering/cateringSlice"
import { useEffect } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import Table from 'react-bootstrap/Table';
import { IoMdArrowRoundBack } from "react-icons/io";




const TiffinListDetails = () => {
  const { cateringVendors, cateringVendorsDetail, settingsInfo, isLoading } = useSelector((state) => state.catering)
  const { foodTypes, kitchenTypes, mealTimes, subscriptionDetails, branches, cuisines, occasions, serviceTypes, servingTypes, vendorDetails } = cateringVendorsDetail;
  const navigate = useNavigate();

  const dispatch = useDispatch()
  const location = useLocation();
  const { id } = useParams();

  const queryParams = new URLSearchParams(location.search);
  const companyId = queryParams.get('company_id');



  useEffect(() => {
    dispatch(fetchCateringVendorDetails(id));
  }, [id]);

  useEffect(() => {
    if (companyId && id && cateringVendorsDetail?.phone_number) {
      const data = {
        company_id: companyId,
        id: id,
        phone_number: cateringVendorsDetail.phone_number
      };
      dispatch(fetchGetVendorSettingsInfo(data));
    }
  }, [companyId, id, cateringVendorsDetail?.phone_number]);


  const subscriptionType = cateringVendorsDetail?.subscription_type_display?.toLowerCase();
  let badgeClass = "badge mt-n1";
  switch (subscriptionType) {
    case "Popular":
      badgeClass += " text-bg-popular-bage";
      break;
    case "normal":
      badgeClass += " text-bg-normal-bage";
      break;
    case "branded":
      badgeClass += " text-bg-branded-bage";
      break;
    default:
      badgeClass += " text-bg-default-bage";
      break;
  }

  return (
    <div className="container-fluid my-5">

      <div className="mb-4 cursor-pointer">
        <button className="btn btn-success me-1"
          // onClick={() => navigate(-1)}
          onClick={() => window.close()}
        >
          <IoMdArrowRoundBack /> Back
        </button>
      </div>

      <div className="row mx-2">
        <div className="bg-secondary text-white py-3 d-flex justify-content-between">
          <h3 className='mb-0'>Vendor Details</h3>
          {/* <h3 className='mb-0 text-warning'>Upgrade</h3> */}
        </div>
        <Table responsive="xl" className='m-0'>
          <thead>
            <tr>
              <th style={{ fontSize: '10px' }}>Vendor ID</th>
              <th style={{ fontSize: '10px' }}>Login ID</th>
              <th style={{ fontSize: '10px' }}>Vendor Type</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{id ? id : 'N/A'}</td>
              <td>{companyId ? companyId : 'N/A'}</td>
              <td>{cateringVendorsDetail?.vendor_type ? cateringVendorsDetail?.vendor_type : 'N/A'}</td>
            </tr>
          </tbody>
        </Table>
      </div>
      <hr />


      <div className="row mx-2">
        <div className="bg-secondary text-white py-3 d-flex justify-content-between">
          <h3 className='mb-0'>Subscription Details</h3>
        </div>

        <Table responsive="xl" className='m-0'>
          <thead>
            <tr>
              <th style={{ fontSize: '10px' }}>Subscription Plan</th>
              <th style={{ fontSize: '10px' }}>Plan Type</th>
              <th style={{ fontSize: '10px' }}>Start Date</th>
              <th style={{ fontSize: '10px' }}>Expiry Date</th>
            </tr>
          </thead>
          <tbody>
            {subscriptionDetails && subscriptionDetails.length > 0 ? (
              subscriptionDetails.map((subscription, index) => {
                const subscriptionType = subscription?.subscription_type_display
                  ? subscription.subscription_type_display.toLowerCase() // Convert to lowercase for consistency
                  : "";

                // Determine the appropriate badge class based on subscription type
                let badgeClass = "badge mt-n1";
                switch (subscriptionType) {
                  case "popular":
                    badgeClass += " text-bg-popular-bage";
                    break;
                  case "normal":
                    badgeClass += " text-bg-normal-bage";
                    break;
                  case "branded":
                    badgeClass += " text-bg-branded-bage";
                    break;
                  default:
                    badgeClass += " text-bg-default-bage";
                    break;
                }

                // Plan Type Handling
                const planType = subscription?.subscription_pattern ? subscription?.subscription_pattern.toLowerCase() : "";
                let planBadgeClass = "badge mt-n1";
                switch (planType) {
                  case "subscription-monthly":
                    planBadgeClass += " monthly-tag";
                    break;
                  case "one_time_monthly":
                    planBadgeClass += " monthly-tag";
                    break;
                  case "one_time_yearly":
                    planBadgeClass += " annually-tag";
                    break;
                  default:
                    planBadgeClass += " text-bg-default-bage";
                    break;
                }

                return (
                  <tr key={index}>
                    <td>
                      <span className={badgeClass}>
                        {subscription?.subscription_type_display ? subscription.subscription_type_display : "N/A"}
                      </span>
                    </td>
                    <td>
                      <span className={planBadgeClass}>
                        {subscription?.subscription_pattern ? subscription.subscription_pattern : "N/A"}
                      </span>
                    </td>
                    <td>
                      {subscription?.subscriptionStartDate
                        ? new Date(subscription.subscriptionStartDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td>
                      {subscription?.subscriptionExpiryDate
                        ? new Date(subscription.subscriptionExpiryDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4">No Subscription Details Available</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      <hr />


      <div className="row mx-2">
        <div className="bg-secondary text-white py-3 d-flex justify-content-between">
          <h3 className='mb-0'>Business Information</h3>
          {/* <h3 className='mb-0 text-warning' onClick={handleBusinessProfileEditShow} style={{ cursor: 'pointer' }}>Edit</h3> */}
        </div>
        <Table responsive="xl" className='m-0'>
          <>
            <thead>
              <tr>
                <th style={{ fontSize: '10px' }}>vendor_service_name</th>
                {/* <th style={{ fontSize: '10px' }}>vendor_type</th> */}
                <th style={{ fontSize: '10px' }}>business_email</th>
                <th style={{ fontSize: '10px' }}>business_phone_number</th>
                <th style={{ fontSize: '10px' }}>phone_number</th>
                <th style={{ fontSize: '10px' }}>point_of_contact_name</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{cateringVendorsDetail?.vendor_service_name ? cateringVendorsDetail?.vendor_service_name : 'N/A'}</td>
                {/* <td>{cateringVendorsDetail?.vendor_type ? cateringVendorsDetail?.vendor_type : 'N/A'}</td> */}
                <td>{cateringVendorsDetail?.business_email ? cateringVendorsDetail?.business_email : 'N/A'}</td>
                <td>{cateringVendorsDetail?.business_phone_number ? cateringVendorsDetail?.business_phone_number : 'N/A'}</td>
                <td>{cateringVendorsDetail?.phone_number ? cateringVendorsDetail?.phone_number : 'N/A'}</td>
                <td>{cateringVendorsDetail?.point_of_contact_name ? cateringVendorsDetail?.point_of_contact_name : 'N/A'}</td>
              </tr>
            </tbody>


            <thead>
              <tr>
                <th style={{ fontSize: '10px' }}>whatsapp_business_phone_number</th>
                {/* <th style={{ fontSize: '10px' }}>about_description</th> */}
                <th style={{ fontSize: '10px' }}>facebook_link</th>
                <th style={{ fontSize: '10px' }}>instagram_link</th>
                <th style={{ fontSize: '10px' }}>twitter_id</th>
                <th style={{ fontSize: '10px' }}>website_link</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{cateringVendorsDetail?.whatsapp_business_phone_number ? cateringVendorsDetail?.whatsapp_business_phone_number : 'N/A'}</td>
                {/* <td>{cateringVendorsDetail?.about_description ? cateringVendorsDetail?.about_description : 'N/A'}</td> */}
                <td>{cateringVendorsDetail?.facebook_link ? cateringVendorsDetail?.facebook_link : 'N/A'}</td>
                <td>{cateringVendorsDetail?.instagram_link ? cateringVendorsDetail?.instagram_link : 'N/A'}</td>
                <td>{cateringVendorsDetail?.twitter_id ? cateringVendorsDetail?.twitter_id : 'N/A'}</td>
                <td>{cateringVendorsDetail?.website_link ? cateringVendorsDetail?.website_link : 'N/A'}</td>
              </tr>
            </tbody>



            <thead>
              <tr>
                <th style={{ fontSize: '10px' }}>street_name</th>
                <th style={{ fontSize: '10px' }}>area</th>
                <th style={{ fontSize: '10px' }}>city</th>
                <th style={{ fontSize: '10px' }}>state</th>
                <th style={{ fontSize: '10px' }}>country</th>
                <th style={{ fontSize: '10px' }}>pincode</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{cateringVendorsDetail?.street_name ? cateringVendorsDetail?.street_name : 'N/A'}</td>
                <td>{cateringVendorsDetail?.area ? cateringVendorsDetail?.area : 'N/A'}</td>
                <td>{cateringVendorsDetail?.city ? cateringVendorsDetail?.city : 'N/A'}</td>
                <td>{cateringVendorsDetail?.state ? cateringVendorsDetail?.state : 'N/A'}</td>
                <td>{cateringVendorsDetail?.country ? cateringVendorsDetail?.country : 'N/A'}</td>
                <td>{cateringVendorsDetail?.pincode ? cateringVendorsDetail?.pincode : 'N/A'}</td>
              </tr>
            </tbody>





            <thead>
              <tr>
                <th style={{ fontSize: '10px' }}>latitude</th>
                <th style={{ fontSize: '10px' }}>longitude</th>
                <th style={{ fontSize: '10px' }}>FULL ADDRESS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{cateringVendorsDetail?.latitude ? cateringVendorsDetail?.latitude : 'N/A'}</td>
                <td>{cateringVendorsDetail?.longitude ? cateringVendorsDetail?.longitude : 'N/A'}</td>
                <td>{cateringVendorsDetail?.formatted_address ? cateringVendorsDetail?.formatted_address : 'N/A'}</td>
              </tr>
            </tbody>
          </>
        </Table>
      </div>
      <hr />


      <div className="row mx-2">
        <div className="bg-secondary text-white py-3 d-flex justify-content-between">
          <h3 className='mb-0'>Culinary Details</h3>
          {/* <h3 className='mb-0 text-warning' style={{ cursor: 'pointer' }}>Edit</h3> */}
        </div>
        <Table responsive="xl" className='m-0'>
          <thead>
            <tr>
              <th style={{ fontSize: '10px' }}>Food Type</th>
              <th style={{ fontSize: '10px' }}>Meal Types</th>
              <th style={{ fontSize: '10px' }}>service Types</th>
              <th style={{ fontSize: '10px' }}>serving Types</th>
              <th style={{ fontSize: '10px' }}>Starting Price</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {foodTypes?.length > 0 ? foodTypes?.map(item => item.food_type_name)?.join(', ') : 'N/A'}
              </td>
              <td>
                {mealTimes?.length > 0 ? mealTimes?.map(item => item.meal_time_name)?.join(', ') : 'N/A'}
              </td>
              <td>
                {serviceTypes?.length > 0 ? serviceTypes?.map(item => item.service_type_name)?.join(', ') : 'N/A'}
              </td>
              <td>{servingTypes?.length > 0 ? servingTypes?.map(item => item.serving_type_name)?.join(', ') : 'N/A'}</td>
              <td>{cateringVendorsDetail?.start_price ? cateringVendorsDetail?.start_price : 'N/A'}</td>
            </tr>
          </tbody>
        </Table>
      </div>
      <hr />




      <div className="row mx-2">
        <div className="bg-secondary text-white py-3 d-flex justify-content-between">
          <h3 className='mb-0'>Vintage Details</h3>
        </div>
        <Table responsive="xl" className='m-0'>
          <thead>
            <tr>
              <th style={{ fontSize: '10px' }}>Working Since</th>
              <th style={{ fontSize: '10px' }}>Total Staffs</th>
              <th style={{ fontSize: '10px' }}>Work Hours (Start)</th>
              <th style={{ fontSize: '10px' }}>Work Hours (End)</th>
              <th style={{ fontSize: '10px' }}>Location Link</th>
              {/* <th style={{ fontSize: '10px' }}>Other Branches</th> */}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{cateringVendorsDetail?.working_since ? cateringVendorsDetail?.working_since : 'N/A'}</td>
              <td>{cateringVendorsDetail?.total_staffs_approx ? cateringVendorsDetail?.total_staffs_approx : 'N/A'}</td>
              <td>{cateringVendorsDetail?.start_day ? cateringVendorsDetail?.start_day + ' ' + cateringVendorsDetail?.start_time : 'N/A'}</td>
              <td>{cateringVendorsDetail?.end_day ? cateringVendorsDetail?.end_day + ' ' + cateringVendorsDetail?.end_time : 'N/A'}</td>
              <td>
                {cateringVendorsDetail?.latitude && cateringVendorsDetail?.longitude ? (
                  <a
                    href={`https://www.google.com/maps?q=${cateringVendorsDetail.latitude},${cateringVendorsDetail.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Map
                  </a>
                ) : 'N/A'}
              </td>
              {/* <td> {branches?.length > 0 ? branches?.map(item => item.catering_service_name)?.join(', ') : 'N/A'}</td> */}
            </tr>
          </tbody>
        </Table>
      </div>
      <hr />





      <div className="row mx-2">
        <div className="bg-secondary text-white py-3 d-flex justify-content-between">
          <h3 className="mb-0">Documents</h3>
        </div>
        <Table responsive="xl" className="m-0">
          <thead>
            <tr>
              <th style={{ fontSize: '10px' }}>Pan Card</th>
              <th style={{ fontSize: '10px' }}>Aadhar Card (Front)</th>
              <th style={{ fontSize: '10px' }}>Aadhar Card (Back)</th>
              <th style={{ fontSize: '10px' }}>Fssai Licence</th>
              <th style={{ fontSize: '10px' }}>GST Certificate</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {/* Pan Card */}
              <td>
                <p>{cateringVendorsDetail?.pan_number || 'N/A'}</p>
                {settingsInfo?.gallery_images?.["vendor-encp"]?.[0]?.image_name?.[0]?.large ? (
                  <a href={settingsInfo.gallery_images["vendor-encp"][0].image_name[0].large} target="_blank" rel="noopener noreferrer">
                    View Pan Card
                  </a>
                ) : "N/A"}
              </td>

              {/* Aadhar Card Front */}
              <td>
                <p>{cateringVendorsDetail?.aadhar_card_number || 'N/A'}</p>
                {settingsInfo?.gallery_images?.["vendor-enca"]?.[0]?.image_name?.[0]?.large ? (
                  <a href={settingsInfo.gallery_images["vendor-enca"][0].image_name[0].large} target="_blank" rel="noopener noreferrer">
                    View Aadhar (Front)
                  </a>
                ) : "N/A"}
              </td>

              {/* Aadhar Card Back */}
              <td>
                {settingsInfo?.gallery_images?.["vendor-enca-back"]?.[0]?.image_name?.[0]?.large ? (
                  <a href={settingsInfo.gallery_images["vendor-enca-back"][0].image_name[0].large} target="_blank" rel="noopener noreferrer">
                    View Aadhar (Back)
                  </a>
                ) : "N/A"}
              </td>

              {/* FSSAI License */}
              <td>
                <p>{cateringVendorsDetail?.fssai_number || 'N/A'}</p>
                {settingsInfo?.gallery_images?.["vendor-encf"]?.[0]?.image_name?.[0]?.large ? (
                  <a href={settingsInfo.gallery_images["vendor-encf"][0].image_name[0].large} target="_blank" rel="noopener noreferrer">
                    View FSSAI License
                  </a>
                ) : "N/A"}
              </td>

              {/* GST Certificate */}
              <td>
                <p>{cateringVendorsDetail?.gstin_number || 'N/A'}</p>
              </td>
            </tr>
          </tbody>

        </Table>
      </div>
      <hr />



      <div className="row mx-2">
        <div className="bg-secondary text-white py-3 d-flex justify-content-between">
          <h3 className="mb-0">About</h3>
        </div>
        <Table responsive="xl" className="m-0">
          <thead>
            <tr>
              <th style={{ fontSize: '10px' }}>About Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {/* about_description */}
              <td>{cateringVendorsDetail?.about_description ? cateringVendorsDetail?.about_description : 'N/A'}</td>
            </tr>
          </tbody>
        </Table>
      </div>
      <hr />



    </div>
  )
}
export default TiffinListDetails