import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { createVendorSubscription, fetchBroadcastNotificationData, fetchVendorNotificationData } from '../../features/notificationSlice';
import { useDispatch, useSelector } from 'react-redux';
import GlobalSearch from '../../components/common/GlobalSearch';
import { tableCustomStyles } from '../../components/tableCustomStyles';
import { fetchSubscriptionData } from '../../features/subscriptionSlice';
import Select from 'react-select';
import Loader from '../../components/Loader';



const initialState = {
  title: '',
  message: '',
  receiverId: '',
}

const VendorNotification = () => {
  const dispatch = useDispatch()
  const { vendorNotificationList, isLoading } = useSelector((state) => state.notifications)
  const [values, setValues] = useState(initialState)
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  console.log(vendorNotificationList, "vendorNotificationList");


  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value })
  }

  useEffect(() => {
    dispatch(fetchVendorNotificationData());
  }, [dispatch]);



  useEffect(() => {
    if (vendorNotificationList) {
      const formattedData = vendorNotificationList?.map((broadcast, index) => ({
        vendorID: broadcast?.vendor_id,
        title: broadcast?.title,
        message: broadcast?.message,
        created_at: broadcast?.created_at,
        type: broadcast?.type,
        vendor_service_name: broadcast?.vendor_service_name,
        company_id: broadcast?.company_id,
      }));
      setData(formattedData);
      setFilteredData(formattedData);
    }
  }, [vendorNotificationList]);


  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    if (!searchValue) {
      setFilteredData(data);
      return;
    }
    const newFilteredData = data?.filter((row) => {
      return (
        String(row?.id).toLowerCase().includes(searchValue) ||
        String(row?.title).toLowerCase().includes(searchValue) ||
        String(row?.message).toLowerCase().includes(searchValue) ||
        String(row?.type).toLowerCase().includes(searchValue) ||
        String(row?.company_id).toLowerCase().includes(searchValue) ||
        String(row?.vendor_service_name).toLowerCase().includes(searchValue) ||
        String(row?.created_at).toLowerCase().includes(searchValue)
      );
    });
    setFilteredData(newFilteredData);
  };

  const columns = [
    // {
    //   name: "vendor ID",
    //   selector: row => row.vendorID,
    //   sortable: true,
    // },
    {
      name: "Company ID",
      selector: row => row.company_id,
      sortable: true,
    },
    // {
    //   name: "vendor Service Name",
    //   selector: row => row.vendor_service_name,
    //   sortable: true,
    // },
    {
      name: "Vendor Type",
      selector: row => row.type,
      sortable: true,
    },
    {
      name: "created_at",
      selector: row => row.created_at.slice(0, 10),
      sortable: true,
    },
    {
      name: "title",
      selector: row => row.title,
      sortable: true,
    },
    {
      name: "message",
      selector: row => row.message,
      sortable: true,
      wrap: true,
      width: '250px',
    },
    // {
    //   name: "Action",
    //   cell: (row) => (
    //     <>
    //       <span className='text-primary cursor-pointer' onClick={() => alert("test")}>View </span>
    //     </>
    //   ),
    //   ignoreRowClick: true,
    //   allowOverflow: true,
    //   button: true,
    // },
  ];

  const onHandleSubmit = async (e) => {
    e.preventDefault();
    const { title, message, receiverId } = values;
    const data = {
      message,
      title,
      receiver_id: receiverId
    }
    await dispatch(createVendorSubscription(data))
    await dispatch(fetchVendorNotificationData())
    setValues(initialState)
    handleClose()

    // if (editId === null) {
    //   await dispatch(createPriceRanges(data))
    // } else {
    //   await dispatch(updatePriceRanges(data))
    // }
    // await dispatch(fetchpriceRangesList());
    // setValues(initialState)
    // handleClose()
  }

  const receiverOptions = vendorNotificationList
    ?.filter((item) => item && item.receiver_id && item.company_id)
    .map((item) => ({
      value: item.receiver_id,
      label: item.company_id,
    }));



  return (
    <>
      <div className="container-fluid my-5">

        <div className="row mb-4  me-2">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="header-title">
              Total Vendor Notifications - {vendorNotificationList?.length}
            </h1>
            <button className='btn btn-primary fit-content' variant="primary" onClick={handleShow}>
              Create Vendor Notifications
            </button>
          </div>
        </div>
        <hr />





        <div className="card">
          {/* Search */}
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
          />
        </div>
        <hr />
      </div>
      <br />


      <Modal centered show={show} onHide={handleClose}>
        <form onSubmit={onHandleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Create Vendor Notifications</Modal.Title>
          </Modal.Header>
          <Modal.Body>

            <div>
              <label htmlFor="receiverId" className="form-label">Receiver ID</label>
              <Select
                options={receiverOptions}
                onChange={(selectedOption) =>
                  handleChange({ target: { name: 'receiverId', value: selectedOption ? selectedOption.value : '' } })
                }
                placeholder="Select Receiver ID"
                isClearable // Allows the user to clear the selection
                isSearchable // Enables search functionality
              />
            </div>


            <div className='mt-3'>
              <label for="name" className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Title"
                name="title"
                value={values.title}
                onChange={handleChange}
              />
            </div>
            <div className='mt-3'>
              <label for="name" className="form-label">Message</label>
              <textarea
                className="form-control"
                data-autosize rows="1"
                placeholder="Enter Message..."
                name="message"
                value={values.message}
                onChange={handleChange}
              ></textarea>
            </div>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type='submit' disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Save Changes'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  )
}

export default VendorNotification