


import { format, parse, isValid, compareAsc } from 'date-fns';
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
import DatePicker from 'react-datepicker'; // Import DatePicker
import 'react-datepicker/dist/react-datepicker.css';


const VendorListExport = () => {
  const dispatch = useDispatch()
  const { vandorExportList, isLoading } = useSelector((state) => state.catering)
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const { exportToExcel } = useExportData();
  // const [searchValues, setSearchValues] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);


  // State to store search values for each column
  const [searchValues, setSearchValues] = useState({
    company_id: "",
    vendor_service_name: "",
    phone_number: "",
    city: "",
    plan_type_name: "",
    subscription_text: "",
    start_date: "",
    end_date: "",
    final_status_description: "",
    final_status: "",
  });


  useEffect(() => {
    dispatch(fetchCateringVendorsExport('Caterer'));
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


  const handleSearch = (column, value) => {
    const newSearchValues = { ...searchValues, [column]: value };
    setSearchValues(newSearchValues);

    const newFilteredData = data.filter((row) => {
      return Object.keys(newSearchValues).every((key) => {
        const searchValue = newSearchValues[key].trim();

        // If no search value for this column, skip filtering
        if (!searchValue) return true;

        // Handle date filtering manually for start_date and end_date
        if (key === "start_date" || key === "end_date") {
          const rowDateString = row.subscription_date || ''; // Use actual date field from your data, handle if it's undefined or null
          const rowDate = parse(rowDateString, 'MM/dd/yyyy', new Date()); // Parse the row date in MM/DD/YYYY format

          // Ensure the row date is valid
          if (!isValid(rowDate)) return false;

          // Parse the search input as a date in MM/DD/YYYY format
          const searchDate = parse(searchValue, 'MM/dd/yyyy', new Date());

          // Ensure the search input date is valid
          if (!isValid(searchDate)) return false;

          // For start_date, only include rows with dates after or equal to the start_date
          if (key === "start_date") {
            return compareAsc(rowDate, searchDate) >= 0; // Compare rowDate with searchDate
          }

          // For end_date, only include rows with dates before or equal to the end_date
          if (key === "end_date") {
            return compareAsc(rowDate, searchDate) <= 0; // Compare rowDate with searchDate
          }
        }

        // Handle normal string filtering for non-date columns
        const rowValue = (row[key] || '').toString().toLowerCase(); // Ensure row[key] is always a string
        return rowValue.includes(searchValue.toLowerCase());
      });
    });

    setFilteredData(newFilteredData);
  };


  // const handleSearch = (e) => {
  //   const value = e.target.value.toLowerCase();

  //   // Update searchValues only with global search text
  //   setSearchValues(value);

  //   const newFilteredData = data.filter((row) => {
  //     // Check if any value in the row contains the search term
  //     return Object.values(row).some((field) =>
  //       field?.toString().toLowerCase().includes(value)
  //     );
  //   });

  //   setFilteredData(newFilteredData);
  // };


  const columns = [
    // {
    //   name: "ID",
    //   selector: row => row.id,
    //   sortable: true,
    //   width: "100px",
    // },
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
          {/* <GlobalSearch handleSearch={handleSearch} /> */}

          {/* Add a single row for column-based searches */}
          <div className="table-search-row mb-0">
            <div className="row p-3">
              <div className="col-lg-3 mb-2">
                <input
                  type="text"
                  value={searchValues.company_id}
                  onChange={(e) => handleSearch("company_id", e.target.value)}
                  placeholder="Company ID"
                  className="form-control"
                />
              </div>
              <div className="col-lg-3 mb-2">
                <input
                  type="text"
                  value={searchValues.vendor_service_name}
                  onChange={(e) => handleSearch("vendor_service_name", e.target.value)}
                  placeholder="Business Name"
                  className="form-control"
                />
              </div>
              <div className="col-lg-3 mb-2">
                <input
                  type="text"
                  value={searchValues.phone_number}
                  onChange={(e) => handleSearch("phone_number", e.target.value)}
                  placeholder="Phone"
                  className="form-control"
                />
              </div>
              <div className="col-lg-3 mb-2">
                <input
                  type="text"
                  value={searchValues.city}
                  onChange={(e) => handleSearch("city", e.target.value)}
                  placeholder="City"
                  className="form-control"
                />
              </div>
              <div className="col-lg-3 mb-2">
                <input
                  type="text"
                  value={searchValues.plan_type_name}
                  onChange={(e) => handleSearch("plan_type_name", e.target.value)}
                  placeholder="Plan Type"
                  className="form-control"
                />
              </div>
              <div className="col-lg-3 mb-2">
                <input
                  type="text"
                  value={searchValues.subscription_text}
                  onChange={(e) => handleSearch("subscription_text", e.target.value)}
                  placeholder="Subscription"
                  className="form-control"
                />
              </div>

              {/* <div className="col-lg-3 mb-2">
                <input
                  type="text"
                  value={searchValues.start_date}
                  onChange={(e) => handleSearch("start_date", e.target.value)}
                  placeholder="Start Date (MM/DD/YYYY)"
                  className="form-control"
                />
              </div>
              <div className="col-lg-3 mb-2">
                <input
                  type="text"
                  value={searchValues.end_date}
                  onChange={(e) => handleSearch("end_date", e.target.value)}
                  placeholder="End Date (MM/DD/YYYY)"
                  className="form-control"
                />
              </div> */}

              <div className="col-lg-3 mb-2">
                <input
                  type="text"
                  value={searchValues.final_status_description}
                  onChange={(e) => handleSearch("final_status_description", e.target.value)}
                  placeholder="Status Description"
                  className="form-control"
                />
              </div>
              <div className="col-lg-3 mb-2">
                <input
                  type="text"
                  value={searchValues.final_status}
                  onChange={(e) => handleSearch("final_status", e.target.value)}
                  placeholder="Is Active"
                  className="form-control"
                />
              </div>
            </div>

            <div className="mb-3 ps-3 d-flex justify-content-start">
              <div className='me-4'>
                {/* <label className='me-2'>Start Date</label> */}
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={50}
                  placeholderText="Select start date"
                  dateFormat="dd/MM/yyyy"
                  className="form-control"
                  popperClassName="higher-zindex"
                />
              </div>
              <div className="">
                {/* <label className='me-2'>End Date</label> */}
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={50}
                  placeholderText="Select end date"
                  dateFormat="dd/MM/yyyy"
                  className="form-control"
                  popperClassName="higher-zindex"
                />
              </div>
            </div>

          </div>



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
          />
        </div>

        <div className="card">
          {/* <GlobalSearch handleSearch={handleSearch} /> */}
          {/* <DataTable
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
          /> */}
        </div>
      </div>

      <br />


    </>
  )
}

export default VendorListExport