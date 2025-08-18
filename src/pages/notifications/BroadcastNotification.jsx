import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { createBroadbandNotification, fetchBroadcastNotificationData, fetchSubscriptionTypesCaterer, fetchSubscriptionTypesTiffin } from '../../features/notificationSlice';
import { useDispatch, useSelector } from 'react-redux';
import GlobalSearch from '../../components/common/GlobalSearch';
import { tableCustomStyles } from '../../components/tableCustomStyles';
import { fetchSubscriptionData, fetchSubscriptionTypeCaterer } from '../../features/subscriptionSlice';
import Loader from '../../components/Loader';



const initialState = {
  title: '',
  message: '',
  // type: '',
  subscriptionTypeId: ''
}

const BroadcastNotification = () => {
  const dispatch = useDispatch()
  const { broadcastNotificationList, isLoading } = useSelector((state) => state.notifications)
  const { vendorSubscriptionTypesList } = useSelector((state) => state.subscription)
  const [values, setValues] = useState(initialState)
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [type, setType] = useState("")

  console.log(type, "typetypetype")


  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value })
  }

  useEffect(() => {
    dispatch(fetchBroadcastNotificationData());
  }, [dispatch]);

  useEffect(() => {
    if (type !== '') {
      dispatch(fetchSubscriptionTypeCaterer(type));
    }
  }, [type]);


  useEffect(() => {
    if (broadcastNotificationList) {
      const formattedData = broadcastNotificationList?.map((broadcast, index) => ({
        vendor_type: broadcast?.vendor_type,
        title: broadcast?.title,
        message: broadcast?.message,
        created_at: broadcast?.created_at,
      }));
      setData(formattedData);
      setFilteredData(formattedData);
    }
  }, [broadcastNotificationList]);


  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    if (!searchValue) {
      setFilteredData(data);
      return;
    }
    const newFilteredData = data?.filter((row) => {
      return (
        String(row?.title).toLowerCase().includes(searchValue) ||
        String(row?.vendor_type).toLowerCase().includes(searchValue) ||
        String(row?.created_at).toLowerCase().includes(searchValue) ||
        String(row?.message).toLowerCase().includes(searchValue)
      );
    });
    setFilteredData(newFilteredData);
  };


  const columns = [
    {
      name: "Vendor Type",
      cell: (row) => {
        // Define badge class based on vendor type
        let badgeClass = "badge mt-n1"; // Base class for the badge
        const vendorType = row.vendor_type ? row.vendor_type.toLowerCase() : ""; // Convert to lowercase for comparison

        // Assign classes based on vendor type
        switch (vendorType) {
          case "caterer":
            badgeClass += " text-bg-orange"; // Orange
            break;
          case "tiffin":
            badgeClass += " text-bg-normal-bage"; // Yellow
            break;
          case "user":
            badgeClass += " annually-tag"; // Blue
            break;
          default:
            badgeClass += " text-bg-secondary"; // Default for unknown
            break;
        }

        return (
          <span className={badgeClass} style={{ textTransform: "capitalize" }}>
            {row.vendor_type || "Unknown"}
          </span>
        );
      },
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
      width: '300px',
    },
  ];

  const onHandleSubmit = async (e) => {
    e.preventDefault();
    const { title, message, subscriptionTypeId } = values;
    const data = {
      message,
      title,
      vendor_type: type,
      subscription_type_id: subscriptionTypeId
    }
    await dispatch(createBroadbandNotification(data))
    await dispatch(fetchBroadcastNotificationData())
    setValues(initialState)
    handleClose()
  }

  return (
    <>
      <div className="container-fluid my-5">

        <div className="row mb-4  me-2">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="header-title">
              Total Broadcast Notifications - {broadcastNotificationList?.length}
            </h1>
            <button className='btn btn-primary fit-content' variant="primary" onClick={handleShow}>
              Create Broadcast Notifications
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
            <Modal.Title>Create Broadcast Notifications</Modal.Title>
          </Modal.Header>
          <Modal.Body>

            <div>
              <label htmlFor="vendor_type" className="form-label">Select Type</label>
              <select
                // required
                name="type"
                className="form-select"
                value={values.type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="">All Vendors Selected</option>
                <option value="Caterer">Caterer</option>
                <option value="Tiffin">Tiffin</option>
                <option value="User">User </option>
              </select>
            </div>


            {type && type !== 'User' && <div className='mt-3'>
              <label for="name" className="form-label">Subscription Types</label>
              <select
                // required
                className="form-select"
                name="subscriptionTypeId"
                value={values.subscriptionTypeId}
                onChange={handleChange}
              >
                <>
                  <option value="">All Sub types Selected</option>
                  {vendorSubscriptionTypesList?.filter((item)=> item.is_active === 1)?.map((item) => (
                    <option key={item?.id} value={item?.id}>
                      {item?.display_name}
                    </option>
                  ))}
                </>
              </select>
            </div>}



            <div className='mt-3'>
              <label for="name" className="form-label">Title</label>
              <input
                required
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
                required
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
              {isLoading ? 'Loading...' : 'Send Notification'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal >


    </>
  )
}

export default BroadcastNotification