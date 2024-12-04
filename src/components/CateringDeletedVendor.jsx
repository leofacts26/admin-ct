import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import * as XLSX from "xlsx";
import toast from 'react-hot-toast';
import Table from 'react-bootstrap/Table';
import { Form, Link } from 'react-router-dom';
import DatePicker from 'react-datepicker'; // Import DatePicker
import 'react-datepicker/dist/react-datepicker.css';
import { format, parse, isValid, compareAsc } from 'date-fns';
import useExportData from '../hooks/useExportData';
import { fetchCateringDeletedVendors, fetchCateringVendors, setVendorListId, updateCateringDeletedVendorsStatus } from '../features/catering/cateringSlice';
import { tableCustomStyles } from './tableCustomStyles';
import Loader from './Loader';



const initialState = {
  is_deleted_by_admin: "0",
  listing_status: "active",
}


const CateringVendorDeletedList = () => {
  const dispatch = useDispatch();
  const { vandorDeleteList, isLoading } = useSelector((state) => state.catering);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const { exportToExcel } = useExportData();
  const [values, setValues] = useState(initialState)
  const [editId, setEditId] = useState(null)

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

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false)
    setEditId(null)
  };
  const handleShow = () => setShow(true);

  useEffect(() => {
    dispatch(fetchCateringDeletedVendors('Caterer'));
  }, [dispatch]);




  useEffect(() => {
    if (vandorDeleteList) {
      const formattedData = vandorDeleteList.map((catering, index) => ({
        id: catering.id,
        company_id: catering?.company_id,
        vendor_service_name: catering?.vendor_service_name || 'N/A',
        phone_number: catering?.phone_number || 'N?A',
        city: catering?.city || 'N/A',
        plan_type_name: catering?.subscription_pattern_text || "N/A",
        subscription_text: catering?.subscription_text || "N/A",
        subscription_subscription_start_date_text: new Date(catering?.subscription_subscription_start_date_text).toLocaleDateString(),
        subscription_subscription_end_date_text: new Date(catering?.subscription_subscription_end_date_text).toLocaleDateString(),
        final_status_description: catering?.final_status_description || 'N/A',
        final_status: catering?.final_status || 'N/A',
      }));
      setData(formattedData);
      setFilteredData(formattedData);
    }
  }, [vandorDeleteList]);

  // Function to handle date range filtering
  const handleDateFilter = () => {
    const filtered = data.filter((item) => {
      const itemDate = new Date(item.subscription_subscription_start_date_text);
      return (
        (!startDate || itemDate >= startDate) &&
        (!endDate || itemDate <= endDate)
      );
    });
    setFilteredData(filtered);
  };

  // Apply date filter whenever the date range is updated
  useEffect(() => {
    handleDateFilter();
  }, [startDate, endDate]);

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

  const onHandleCateringDetails = (row) => {
    handleShow();
    dispatch(setVendorListId(row?.id));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const columns = [
    {
      name: "company id",
      selector: row => row.company_id,
      sortable: true,
    },
    {
      name: "Business Name",
      selector: row => row.vendor_service_name,
      sortable: true,
    },
    {
      name: "Phone No",
      selector: row => row.phone_number,
      sortable: true,
    },
    {
      name: "City",
      selector: row => row.city,
      sortable: true,
    },
    {
      name: "Plan Type",
      cell: (row) => {
        let badgeClass = "badge mt-n1";
        const planType = row.plan_type_name ? row.plan_type_name.toLowerCase() : "";

        switch (planType) {
          case "subscription-monthly":
            badgeClass += " monthly-tag";
            break;
          case "one_time_monthly":
            badgeClass += " monthly-tag";
            break;
          case "one_time_yearly":
            badgeClass += " annually-tag";
            break;
          default:
            badgeClass += " text-bg-default-bage";
            break;
        }

        return (
          <span className={badgeClass}>
            {row.plan_type_name || "Unknown Plan"}
          </span>
        );
      },
      sortable: true,
      sortFunction: (a, b) => {
        const textA = a.plan_type_name && a.plan_type_name.toLowerCase() !== "na" ? a.plan_type_name : "";
        const textB = b.plan_type_name && b.plan_type_name.toLowerCase() !== "na" ? b.plan_type_name : "";

        // Case-insensitive comparison
        return textA.toLowerCase().localeCompare(textB.toLowerCase());
      },
    },
    {
      name: "Subscription",
      cell: (row) => {
        let badgeClass = "badge mt-n1";
        const subscriptionType = row.subscription_text ? row.subscription_text.toLowerCase() : "";

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

        return (
          <span className={badgeClass} style={{ width: '100px' }}>
            {row.subscription_text || "Unknown Subscription"}
          </span>
        );
      },
      sortable: true,
      sortFunction: (a, b) => {
        const textA = a.subscription_text && a.subscription_text.toLowerCase() !== "na" ? a.subscription_text : "";
        const textB = b.subscription_text && b.subscription_text.toLowerCase() !== "na" ? b.subscription_text : "";

        // Case-insensitive comparison
        return textA.toLowerCase().localeCompare(textB.toLowerCase());
      },
    },
    {
      name: "Start Date",
      selector: row => {
        const startDate = new Date(row.subscription_subscription_start_date_text);
        return isValid(startDate) ? format(startDate, 'dd/MMM/yyyy') : 'N/A';
      },
      sortable: true,
      sortFunction: (rowA, rowB) => {
        const dateA = new Date(rowA.subscription_subscription_start_date_text);
        const dateB = new Date(rowB.subscription_subscription_start_date_text);

        // Handle invalid dates by sorting them to the end
        if (!isValid(dateA)) return 1;
        if (!isValid(dateB)) return -1;

        return dateA - dateB; // For ascending order
      }
    },
    {
      name: "End Date",
      selector: row => {
        const endDate = new Date(row.subscription_subscription_end_date_text);
        return isValid(endDate) ? format(endDate, 'dd/MMM/yyyy') : 'N/A';
      },
      sortable: true,
      sortFunction: (rowA, rowB) => {
        const dateA = new Date(rowA.subscription_subscription_end_date_text);
        const dateB = new Date(rowB.subscription_subscription_end_date_text);

        // Handle invalid dates by sorting them to the end
        if (!isValid(dateA)) return 1;
        if (!isValid(dateB)) return -1;

        return dateA - dateB; // For ascending order
      }
    },
    {
      name: "Status Description",
      selector: row => row.final_status_description,
      sortable: true,
    },
    {
      name: "Is Active",
      cell: (row) => {
        let badgeClass = "badge mt-n1";

        switch (row.final_status.toLowerCase()) {
          case "yes":
            badgeClass += " text-bg-popular-bage";
            break;
          case "no":
            badgeClass += " text-bg-default-bage";
            break;
          default:
            badgeClass += " text-bg-default-bage";
            break;
        }

        return (
          <span className={badgeClass}>
            {row.final_status}
          </span>
        );
      },
      sortable: true,
      sortFunction: (rowA, rowB) => {
        const statusA = rowA.final_status.toLowerCase();
        const statusB = rowB.final_status.toLowerCase();

        // Define a custom order for sorting
        const order = { "yes": 1, "no": 0 };

        return (order[statusA] || 0) - (order[statusB] || 0);
      },
    },
    {
      name: "Details",
      cell: (row) => (
        <>
          {row?.company_id ? (
            <Link
              onClick={() => onHandleCateringDetails(row)}
              to={`/vendor-list/${row.id}?company_id=${row.company_id}`}
              className='text-primary cursor-pointer'
            >
              View
            </Link>
          ) : (
            <span>N/A</span>
          )}
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },

    {
      name: "Action",
      cell: (row) => (
        <>
          <button className="btn btn-success me-1"
            onClick={() => handleEdit(row)}
          >
            Restore
          </button>
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];



  const handleEdit = (data) => {
    setEditId(data?.id)
    handleShow();
  }



  const formatDataForExport = () => {
    return filteredData.map((row) => {
      // Create a new formatted row object
      const formattedRow = {};

      // Loop through each column and get the value using the selector function
      columns.forEach((col) => {
        if (col.name !== "Details") {
          formattedRow[col.name] = col.selector ? col.selector(row) : row[col.name];
        }
      });

      formattedRow['Plan Type'] = row.plan_type_name ? row.plan_type_name : "Unknown Vendor Type"; // Add vendor type
      formattedRow['Subscription'] = row.subscription_text ? row.subscription_text : "Unknown Status"; // Add status
      formattedRow['Is Active'] = row.final_status ? row.final_status : "Unknown Status"; // Add status

      return formattedRow;
    });
  };


  const onHandleSubmit = async (e) => {
    e.preventDefault();
    const { is_deleted_by_admin, listing_status } = values;

    const data = {
      is_deleted_by_admin,
      listing_status,
      id: editId
    }

    // console.log(data, "data");


    if (editId === null) {
    } else {
      await dispatch(updateCateringDeletedVendorsStatus(data))
    }
    await dispatch(fetchCateringVendors('Caterer'));
    await dispatch(fetchCateringDeletedVendors('Caterer'));
    setValues(initialState)
    handleClose()
  }



  return (
    <>
      <div className="container-fluid my-5">

        <div className="row mb-4  me-2">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="header-title">
              Deleted Caterers - {vandorDeleteList?.length}
            </h1>
            <Button variant="primary" onClick={() => exportToExcel(formatDataForExport(), 'vendorlist')}>
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
      </div>

      <br />

      <Modal centered show={show} onHide={handleClose}>
        <form onSubmit={onHandleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{editId ? 'Edit Kitchen Type' : 'Create Kitchen Type'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              {/* Input field for Edit ID */}
              {/* <div className="col-12 mb-3">
                <label htmlFor="editId" className="form-label"><b>ID</b></label>
                <input
                  disabled
                  type="text"
                  className="form-control"
                  placeholder="Enter ID"
                  name="editId"
                  onChange={(e) => setEditId(e.target.value)}
                  value={editId || ''}
                />
              </div> */}


              {/* Select box for is_deleted_by_admin */}
              {/* <div className="col-12 mb-3">
                <label htmlFor="is_deleted_by_admin" className="form-label"><b>Deleted by Admin</b></label>
                <select
                  className="form-select"
                  name="is_deleted_by_admin"
                  onChange={handleChange}
                  value={values.is_deleted_by_admin}
                >
                  <option value="1">Yes</option>
                  <option value="2">No</option>
                </select>
              </div> */}

              {/* Select box for listing_status */}
              <div className="col-12 mb-3">
                <label htmlFor="listing_status" className="form-label"><b>Listing Status</b></label>
                <select
                  className="form-select"
                  name="listing_status"
                  onChange={handleChange}
                  value={values.listing_status}
                >
                  <option value="inactive">Inactive</option>
                  <option value="active">Active</option>
                </select>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              {isLoading ? 'Loading...' : 'Save Changes'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

    </>
  );
};

export default CateringVendorDeletedList;
