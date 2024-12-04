



import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCateringVendorsExport } from '../../features/catering/cateringSlice';
import GlobalSearch from '../../components/common/GlobalSearch';
import { tableCustomStyles } from '../../components/tableCustomStyles';
import { FaEdit } from "react-icons/fa";
import useExportData from '../../hooks/useExportData';
import moment from 'moment/moment';
import Loader from '../../components/Loader';



const TiffinListExport = () => {
  const dispatch = useDispatch()
  const { vandorExportList, isLoading } = useSelector((state) => state.catering)
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const { exportToExcel } = useExportData();
  const [searchValues, setSearchValues] = useState({});


  useEffect(() => {
    dispatch(fetchCateringVendorsExport('Tiffin'));
  }, [dispatch]);



  useEffect(() => {
    if (vandorExportList) {
      const formattedData = vandorExportList.map((catering, index) => ({
        id: catering?.id,
        company_id: catering?.company_id,
        vendor_type: catering?.vendor_type,
        created_at: catering?.created_at,
        vendor_service_name: catering?.vendor_service_name,
        phone_number_extension: catering?.phone_number_extension,
        phone_number: catering?.phone_number,
        point_of_contact_name: catering?.point_of_contact_name,
        city: catering?.city,
        status: catering?.status,
        formatted_address: catering?.formatted_address,
        place_id: catering?.place_id,
        listing_status: catering?.listing_status,
        total_ratings: catering?.total_ratings,
        rating_count: catering?.rating_count,
        average_rating: catering?.average_rating,
        final_status: catering?.final_status,
        subscription_type_display: catering?.details?.subscriptionDetails[0]?.subscription_type_display,
        subscription_type_name: catering?.details?.subscriptionDetails[0]?.subscription_type_name,
        subscriptionStartDate: catering?.details?.subscriptionDetails[0]?.subscriptionStartDate,
        subscriptionExpiryDate: catering?.details?.subscriptionDetails[0]?.subscriptionExpiryDate,
        subscription_pattern: catering?.details?.subscriptionDetails[0]?.subscription_pattern,
        remaining_days: catering?.details?.subscriptionDetails[0]?.remaining_days,
        about_description: catering?.details?.about_description,
        aadhar_card_number: catering?.details?.aadhar_card_number,
        pan_number: catering?.details?.pan_number,
        gstin_number: catering?.details?.gstin_number,
        business_phone_number: catering?.details?.business_phone_number,
        cuisines: catering?.details?.cuisines?.map(cuisine => cuisine?.cuisine_name).join(', '),
        occasions: catering?.details?.occasions?.map(occasion => occasion?.occasion_name).join(', '),
        foodTypes: catering?.details?.foodTypes?.map(foodType => foodType?.food_type_name).join(', '),
        serviceTypes: catering?.details?.serviceTypes?.map(serviceType => serviceType?.service_type_name).join(', '),
        servingTypes: catering?.details?.servingTypes?.map(servingType => servingType?.serving_type_name).join(', '),
      }));
      setData(formattedData);
      setFilteredData(formattedData);
    }
  }, [vandorExportList]);



  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
  
    // Update searchValues only with global search text
    setSearchValues(value);
  
    const newFilteredData = data.filter((row) => {
      // Check if any value in the row contains the search term
      return Object.values(row).some((field) => 
        field?.toString().toLowerCase().includes(value)
      );
    });
  
    setFilteredData(newFilteredData);
  };
  

  const columns = [
    {
      name: "ID",
      selector: row => row.id,
      sortable: true,
      width: "100px",
    },
    {
      name: "Company ID",
      selector: row => row.company_id,
      sortable: true,
      width: "150px",
    },
    {
      name: "Vendor Type",
      selector: row => row.vendor_type,
      sortable: true,
      width: "150px",
    },
    {
      name: "Created At",
      selector: row => moment(row.created_at).format("YYYY-MM-DD"), // Adjust format as needed
      sortable: true,
      width: "150px",
    },
    {
      name: "Vendor Service Name",
      selector: row => row.vendor_service_name,
      sortable: true,
      width: "150px",
    },
    {
      name: "Phone Number",
      selector: row => row.phone_number,
      sortable: true,
      width: "150px",
    },
    {
      name: "Point of Contact",
      selector: row => row.point_of_contact_name,
      sortable: true,
      width: "150px",
    },
    {
      name: "City",
      selector: row => row.city,
      sortable: true,
      width: "150px",
    },
    {
      name: "Listing Status",
      selector: row => row.listing_status,
      sortable: true,
      width: "150px",
    },
    {
      name: "Total Ratings",
      selector: row => row.total_ratings,
      sortable: true,
      width: "150px",
    },
    {
      name: "Rating Count",
      selector: row => row.rating_count,
      sortable: true,
      width: "150px",
    },
    {
      name: "Average Rating",
      selector: row => row.average_rating,
      sortable: true,
      width: "150px",
    },
    {
      name: "Final Status",
      selector: row => row.final_status,
      sortable: true,
      width: "150px",
    },
    {
      name: "Subscription Type",
      selector: row => row.subscription_type_display,
      sortable: true,
      width: "150px",
    },
    {
      name: "Subscription Start Date",
      selector: row => row.subscriptionStartDate,
      sortable: true,
      width: "150px",
    },
    {
      name: "Subscription Expiry Date",
      selector: row => row.subscriptionExpiryDate,
      sortable: true,
      width: "150px",
    },
    {
      name: "Subscription Pattern",
      selector: row => row.subscription_pattern,
      sortable: true,
      width: "150px",
    },
    {
      name: "Remaining Days",
      selector: row => row.remaining_days,
      sortable: true,
      width: "150px",
    },
    {
      name: "Description",
      selector: row => row.about_description,
      sortable: true,
      width: "150px",
    },
    {
      name: "Aadhar Card Number",
      selector: row => row.aadhar_card_number,
      sortable: true,
      width: "150px",
    },
    {
      name: "PAN Number",
      selector: row => row.pan_number,
      sortable: true,
      width: "150px",
    },
    {
      name: "Cuisines",
      selector: row => row.cuisines,
      sortable: true,
      width: "400px",
    },
    {
      name: "Occasions",
      selector: row => row.occasions,
      sortable: true,
      width: "400px",
    },
    {
      name: "Food Types",
      selector: row => row.foodTypes,
      sortable: true,
      width: "150px",
    },
    {
      name: "Service Types",
      selector: row => row.serviceTypes,
      sortable: true,
      width: "150px",
    },
    {
      name: "Serving Types",
      selector: row => row.servingTypes,
      sortable: true,
      width: "200px",
    },
  ];


  const formatDataForExport = () => {
    return filteredData.map((row) => {
      // Create a new formatted row object
      const formattedRow = {};

      // Loop through each column and get the value using the selector function
      columns.forEach((col) => {
          formattedRow[col.name] = col.selector ? col.selector(row) : row[col.name];
      });

      // formattedRow['Plan Type'] = row.plan_type_name ? row.plan_type_name : "Unknown Vendor Type"; // Add vendor type
      // formattedRow['Subscription'] = row.subscription_text ? row.subscription_text : "Unknown Status"; // Add status
      // formattedRow['Is Active'] = row.final_status ? row.final_status : "Unknown Status"; // Add status

      return formattedRow;
    });
  };


  return (
    <>
      <div className="container-fluid my-5">

        <div className="row mb-4  me-2">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="header-title">
              Vendor List Export - {vandorExportList.length}
            </h1>
            <Button variant="primary" onClick={() => exportToExcel(formatDataForExport(), 'vendorlistExport')}>
              Export
            </Button>
          </div>
        </div>
        <hr />

        <div className="card">
          <GlobalSearch handleSearch={handleSearch} /> 
          <DataTable
            columns={columns}
            data={filteredData}
            paginationRowsPerPageOptions={[50, 100, 300, 500, 1000]}
            paginationPerPage="100"
            fixedHeader
            pagination
            selectableRows
            customStyles={tableCustomStyles}
            progressPending={isLoading}
            progressComponent={<Loader />}
          // title="React-Data-Table-Component Tutorial."
          />
        </div>
      </div>

      <br />


    </>
  )
}

export default TiffinListExport