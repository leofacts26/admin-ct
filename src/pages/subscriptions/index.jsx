import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import { cancelSubscription, fetchSubscriptionData } from '../../features/subscriptionSlice';
import GlobalSearch from '../../components/common/GlobalSearch';
import { tableCustomStyles } from '../../components/tableCustomStyles';
import { format, parse, isValid, compareAsc } from 'date-fns';
import DatePicker from 'react-datepicker'; // Import DatePicker
import 'react-datepicker/dist/react-datepicker.css';
import { Modal, Button } from 'react-bootstrap';
import useExportData from '../../hooks/useExportData';
import { MdDelete } from "react-icons/md";
import Loader from '../../components/Loader';


const Subscription = () => {
  const dispatch = useDispatch();
  const { subscriptionList, isLoading } = useSelector((state) => state.subscription);
  const { exportToExcel } = useExportData();

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [SubscribeModalData, setShowSubscribeModalData] = useState(null);

  const handleSubscribeShow = () => setShowSubscribeModal(true);
  const handleSubscribeClose = () => {
    setShowSubscribeModal(false)
    setShowSubscribeModalData(null)
  };


  // State to store search values for each column
  const [searchValues, setSearchValues] = useState({
    company_id: "",
    vendor_service_name: "",
    vendor_id: "",
    subscription_pattern: "",
    sub_amount: "",
    discount_amount: "",
    final_amount: "",
    status: "",
    payment_status: "",
    start_date_search: "",
    end_date_search: "",
  });


  const onHandleCancelSubscription = async (row) => {
    const { razorpay_subscription_id, vendor_id, status } = row;

    if ((status === "active" || status === "pending") && razorpay_subscription_id !== null) {
      const data = { subscription_id: razorpay_subscription_id, vendor_id };
      await dispatch(cancelSubscription(data));
      handleClose();
    } else {
      alert("Cancellation not allowed: Subscription is either not active/queued or does not have a valid Razorpay subscription ID.")
    }
  }

  // Fetch subscription data on component mount
  useEffect(() => {
    dispatch(fetchSubscriptionData());
  }, [dispatch]);

  // Format subscription data
  useEffect(() => {
    if (subscriptionList) {
      const formattedData = subscriptionList.map((subscription) => ({
        company_id: subscription?.company_id,
        vendor_service_name: subscription?.vendor_service_name,
        vendor_id: subscription?.vendor_id,
        subscription_pattern: subscription?.subscription_pattern,
        sub_amount: subscription?.sub_amount,
        discount_amount: subscription?.discount_amount,
        final_amount: subscription?.final_amount,
        status: subscription?.status,
        start_date: new Date(subscription?.start_date).toLocaleDateString(),
        end_date: new Date(subscription?.end_date).toLocaleDateString(),
        payment_status: subscription?.payment_status,
        razorpay_response: subscription?.razorpay_response,
        // payment_id: subscription?.payment_id,
        // id: subscription?.id
      }));
      setData(formattedData);
      setFilteredData(formattedData);
    }
  }, [subscriptionList]);


  // Function to handle date range filtering
  const handleDateFilter = () => {
    const filtered = data.filter((item) => {
      const itemDate = new Date(item.start_date);
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

        // Handle date filtering manually for start_date_search and end_date_search
        if (key === "start_date_search" || key === "end_date_search") {
          const rowDateString = row.subscription_date || ''; // Use actual date field from your data, handle if it's undefined or null
          const rowDate = parse(rowDateString, 'MM/dd/yyyy', new Date()); // Parse the row date in MM/DD/YYYY format

          // Ensure the row date is valid
          if (!isValid(rowDate)) return false;

          // Parse the search input as a date in MM/DD/YYYY format
          const searchDate = parse(searchValue, 'MM/dd/yyyy', new Date());

          // Ensure the search input date is valid
          if (!isValid(searchDate)) return false;

          // For start_date_search, only include rows with dates after or equal to the start_date_search
          if (key === "start_date_search") {
            return compareAsc(rowDate, searchDate) >= 0; // Compare rowDate with searchDate
          }

          // For end_date_search, only include rows with dates before or equal to the end_date_search
          if (key === "end_date_search") {
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


  const onHandleSubscriptionModal = (row) => {
    setSelectedRow(row);
    handleShow();
  }


  // Columns for the DataTable
  const columns = [
    {
      name: 'Company ID',
      selector: (row) => row.company_id,
      sortable: true,
    },
    {
      name: 'Vendor Name',
      selector: (row) => row.vendor_service_name,
      sortable: true,
      width: '150px'
    },
    {
      name: 'Vendor Type',
      cell: (row) => {
        let badgeClass = "badge mt-n1"; // Common badge class
        const vendorType = row.vendor_id ? row.vendor_id.toLowerCase() : ""; // Use vendor_id for comparison

        // Switch case to assign different background classes
        switch (vendorType) {
          case 'caterer':
            badgeClass += " text-bg-default-bage";
            break;
          case 'tiffin':
            badgeClass += " text-bg-normal-bage";
            break;
          default:
            badgeClass += " text-bg-popular-bage";
            break;
        }

        return (
          <span className={badgeClass}>
            {row.vendor_id || "Unknown Vendor"}
          </span>
        );
      },
      sortable: true,
      sortFunction: (a, b) => {
        const typeA = a.vendor_id || ""; // Handle null or undefined values
        const typeB = b.vendor_id || "";

        // Sort based on vendor_type_name, ignoring case
        return typeA.toLowerCase().localeCompare(typeB.toLowerCase());
      },
    },
    {
      name: 'Subscription Pattern',
      selector: (row) => row.subscription_pattern,
      sortable: true,
      width: '200px'
    },
    {
      name: 'Sub Amount',
      selector: (row) => row.sub_amount,
      sortable: true,
    },
    {
      name: 'Discount Amount',
      selector: (row) => row.discount_amount,
      sortable: true,
    },
    {
      name: 'Final Amount',
      selector: (row) => row.final_amount,
      sortable: true,
    },
    {
      name: 'Status',
      cell: (row) => {
        let badgeClass = "badge mt-n1"; // Common badge class
        const status = row.status ? row.status.toLowerCase() : ""; // Ensure status is lowercase
    
        // Switch case to assign different background classes based on status
        switch (status) {
          case 'active':
            badgeClass += " text-bg-popular-bage";
            break;
          case 'pending':
            badgeClass += " text-bg-branded-bage";
            break;
          case 'queued':
            badgeClass += " text-bg-normal-bage";
            break;
          case 'cancelled':
            badgeClass += " text-bg-default-bage";
            break;
          default:
            badgeClass += " text-bg-popular-bage"; // Default class for unknown statuses
            break;
        }
    
        return (
          <span className={badgeClass}>
            {row.status || "Unknown Status"}
          </span>
        );
      },
      sortable: true,
      sortFunction: (a, b) => {
        const statusA = a.status ? a.status.toLowerCase() : ""; // Handle null or undefined values
        const statusB = b.status ? b.status.toLowerCase() : "";
    
        // Sort based on status, ignoring case
        return statusA.localeCompare(statusB);
      },
    },    
    {
      name: "Start Date",
      selector: row => {
        const startDate = new Date(row.start_date);
        return isValid(startDate) ? format(startDate, 'dd/MMM/yyyy') : 'N/A';
      },
      sortable: true,
      sortFunction: (rowA, rowB) => {
        const dateA = new Date(rowA.start_date);
        const dateB = new Date(rowB.start_date);

        // Handle invalid dates by sorting them to the end
        if (!isValid(dateA)) return 1;
        if (!isValid(dateB)) return -1;

        return dateA - dateB; // For ascending order
      },
      width: '150px'
    },
    {
      name: "End Date",
      selector: row => {
        const endDate = new Date(row.end_date);
        return isValid(endDate) ? format(endDate, 'dd/MMM/yyyy') : 'N/A';
      },
      sortable: true,
      sortFunction: (rowA, rowB) => {
        const dateA = new Date(rowA.end_date);
        const dateB = new Date(rowB.end_date);

        // Handle invalid dates by sorting them to the end
        if (!isValid(dateA)) return 1;
        if (!isValid(dateB)) return -1;

        return dateA - dateB; // For ascending order
      },
      width: '150px'
    },
    {
      name: "View",
      cell: (row) => (
        <>
          <button className="btn py-0 btn-success me-1" onClick={() => {
            handleSubscribeShow()
            setShowSubscribeModalData(row)
          }}>
            View
          </button>
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "Cancel",
      cell: (row) => (
        <>
          {(row.status === "active" || row.status === "pending") && row.razorpay_subscription_id !== null && (
            <button
              className="btn btn-danger me-1"
              onClick={() => onHandleSubscriptionModal(row)}
            >
              <MdDelete />
            </button>
          )}
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    }
  ];


  const formatDataForExport = () => {
    return filteredData.map((row) => {
      // Create a new formatted row object
      const formattedRow = {};

      // Loop through each column and get the value using the selector function
      columns.forEach((col) => {
        if (col.name !== "View" && col.name !== "Cancel") {
          formattedRow[col.name] = col.selector ? col.selector(row) : row[col.name];
        }
      });

      formattedRow['Vendor Type'] = row.vendor_id ? row.vendor_id : "Unknown Vendor Type"; // Add vendor type
      formattedRow['Status'] = row.status ? row.status : "Unknown Status"; // Add status

      return formattedRow;
    });
  };



  return (
    <>
      <div className="container-fluid my-5">
        <div className="row mb-4 me-2">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="header-title">
              Total Subscriptions - {subscriptionList?.length}
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
                  placeholder="Vendor Name"
                  className="form-control"
                />
              </div>
              <div className="col-lg-3 mb-2">
                <input
                  type="text"
                  value={searchValues.vendor_id}
                  onChange={(e) => handleSearch("vendor_id", e.target.value)}
                  placeholder="Vendor Type"
                  className="form-control"
                />
              </div>
              <div className="col-lg-3 mb-2">
                <input
                  type="text"
                  value={searchValues.subscription_pattern}
                  onChange={(e) => handleSearch("subscription_pattern", e.target.value)}
                  placeholder="Subscription Pattern"
                  className="form-control"
                />
              </div>
              <div className="col-lg-3 mb-2">
                <input
                  type="text"
                  value={searchValues.sub_amount}
                  onChange={(e) => handleSearch("sub_amount", e.target.value)}
                  placeholder="Sub Amount"
                  className="form-control"
                />
              </div>
              <div className="col-lg-3 mb-2">
                <input
                  type="text"
                  value={searchValues.discount_amount}
                  onChange={(e) => handleSearch("discount_amount", e.target.value)}
                  placeholder="Discount Amount"
                  className="form-control"
                />
              </div>

              <div className="col-lg-3 mb-2">
                <input
                  type="text"
                  value={searchValues.final_amount}
                  onChange={(e) => handleSearch("final_amount", e.target.value)}
                  placeholder="Final Amount"
                  className="form-control"
                />
              </div>
              <div className="col-lg-3 mb-2">
                <input
                  type="text"
                  value={searchValues.status}
                  onChange={(e) => handleSearch("status", e.target.value)}
                  placeholder="Status"
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
            progressPending={isLoading}
            progressComponent={<Loader />}
          />
        </div>
      </div>


      <Modal show={showSubscribeModal} onHide={handleSubscribeClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>View Subscription Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {SubscribeModalData ? (
            <div className="subscription-details">
              <h4 className="text-center">Subscription ID: {SubscribeModalData?.id}</h4>
              <p><strong>Company ID:</strong> {SubscribeModalData?.company_id}</p>
              <p><strong>Vendor Service Name:</strong> {SubscribeModalData?.vendor_service_name}</p>
              <p><strong>Vendor Type:</strong> {SubscribeModalData?.vendor_id}</p>
              <p><strong>Subscription Pattern:</strong> {SubscribeModalData?.subscription_pattern}</p>
              <p><strong>Start Date:</strong> {new Date(SubscribeModalData?.created_at).toLocaleDateString()}</p>
              <p><strong>End Date:</strong> {new Date(SubscribeModalData?.end_date).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {SubscribeModalData?.status}</p>
              <p><strong>Payment Status:</strong> {SubscribeModalData?.payment_status}</p>
              <p><strong>Payment ID:</strong> {SubscribeModalData?.payment_id}</p>
              <p><strong>Order ID:</strong> {SubscribeModalData?.razorpay_order_id}</p>
              <p><strong>Amount:</strong> {SubscribeModalData?.sub_amount}</p>
              <p><strong>Discount:</strong> {SubscribeModalData?.discount_amount}</p>
              <p><strong>Final Amount:</strong> {SubscribeModalData?.final_amount}</p>
              <p><strong>Razorpay Final Amount:</strong> {SubscribeModalData?.razorpay_final_amount}</p>
              <p><strong>Carried Forward Days:</strong> {SubscribeModalData?.carried_forward_days}</p>
              <p><strong>Razorpay Response:</strong></p>
              <pre>{JSON.stringify(JSON.parse(SubscribeModalData?.razorpay_response), null, 2)}</pre>
            </div>
          ) : (
            <h2 className='text-center'>No Subscription Selected</h2>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleSubscribeClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>



      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Cancel Subscription</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h2 className='text-center'>Are you sure you want to cancel the subscription?</h2>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            No, Keep Subscription
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              onHandleCancelSubscription(selectedRow);
            }}
          >
            Yes, Cancel Subscription
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
};

export default Subscription;
