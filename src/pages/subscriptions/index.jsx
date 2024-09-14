import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import GlobalSearch from '../../components/common/GlobalSearch';
import { tableCustomStyles } from '../../components/tableCustomStyles';
import { FaEdit } from "react-icons/fa";
import { cancelSubscription, fetchSubscriptionData } from '../../features/subscriptionSlice';
import { MdDelete } from "react-icons/md";
import { Modal, Button } from 'react-bootstrap';



const Subscriptions = () => {

  const dispatch = useDispatch()
  const { subscriptionList, isLoading } = useSelector((state) => state.subscription)
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  // console.log(subscriptionList, "subscriptionList subscriptionList");
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);



  // useEffect(() => {
  //   dispatch(fetchVendorSubscriptionList());
  // }, [dispatch]);


  useEffect(() => {
    dispatch(fetchSubscriptionData());
  }, [dispatch]);


  useEffect(() => {
    if (subscriptionList) {
      const formattedData = subscriptionList?.map((subscription, index) => ({
        id: subscription?.id,
        auth_status: subscription?.auth_status,
        carried_forward_days: subscription?.carried_forward_days,
        created_at: subscription?.created_at,
        discount_amount: subscription?.discount_amount,
        final_amount: subscription?.final_amount,
        payment_status: subscription?.payment_status,
        razorpay_subscription_id: subscription?.razorpay_subscription_id,
        status: subscription?.status,
        sub_amount: subscription?.sub_amount,
        subscription_pattern: subscription?.subscription_pattern,
        vendor_id: subscription?.vendor_id,
        vendor_service_name: subscription?.vendor_service_name,
      }));
      setData(formattedData);
      setFilteredData(formattedData);
    }
  }, [subscriptionList]);


  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    if (!searchValue) {
      setFilteredData(data);
      return;
    }
    const newFilteredData = data?.filter((row) => {
      return (
        String(row?.id).toLowerCase().includes(searchValue) ||
        (row?.startprice && String(row.startprice).toLowerCase().includes(searchValue)) ||
        (row?.endprice && String(row.endprice).toLowerCase().includes(searchValue))
      );
    });
    setFilteredData(newFilteredData);
  };



  // const onHandleCancelSubscription = async (row) => {
  //   const { razorpay_subscription_id, vendor_id } = row;
  //   const data = { subscription_id: razorpay_subscription_id, vendor_id };
  //   console.log(row, "row data");

  //   await dispatch(cancelSubscription(data));
  //   handleClose();
  // }


  const onHandleCancelSubscription = async (row) => {
    const { razorpay_subscription_id, vendor_id, status } = row;

    if ((status === "active" || status === "pending") && razorpay_subscription_id !== null) {
      const data = { subscription_id: razorpay_subscription_id, vendor_id };
      await dispatch(cancelSubscription(data));
      handleClose();
    } else {
      alert("Cancellation not allowed: Subscription is either not active/queued or does not have a valid Razorpay subscription ID.")
      console.log("Cancellation not allowed: Subscription is either not active/queued or does not have a valid Razorpay subscription ID.");
    }
  }



  const onHandleSubscriptionModal = (row) => {
    setSelectedRow(row);
    handleShow();
  }


  const columns = [
    {
      name: "ID",
      selector: row => row.id,
      sortable: true,
    },
    {
      name: "auth_status",
      selector: row => row.auth_status,
      sortable: true,
    },
    {
      name: "payment_status",
      selector: row => row.payment_status,
      sortable: true,
    },
    {
      name: "carried_forward_days",
      selector: row => row.carried_forward_days,
      sortable: true,
    },
    {
      name: "created_at",
      selector: row => row.created_at,
      sortable: true,
    },
    {
      name: "discount_amount",
      selector: row => row.discount_amount,
      sortable: true,
    },
    {
      name: "final_amount",
      selector: row => row.final_amount,
      sortable: true,
    },
    {
      name: "razorpay_subscription_id",
      selector: row => row.razorpay_subscription_id,
      sortable: true,
    },
    {
      name: "status",
      selector: row => row.status,
      sortable: true,
    },
    {
      name: "sub_amount",
      selector: row => row.sub_amount,
      sortable: true,
    },
    {
      name: "subscription_pattern",
      selector: row => row.subscription_pattern,
      sortable: true,
    },
    {
      name: "vendor_id",
      selector: row => row.vendor_id,
      sortable: true,
    },
    {
      name: "vendor_service_name",
      selector: row => row.vendor_service_name,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <button className="btn btn-success me-1">
            <FaEdit />
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
              Cancel <MdDelete />
            </button>
          )}
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    }
  ];


  return (
    <>
      <div className="container-fluid my-5">
        <div className="row mb-4 me-2">
          <div className="d-flex justify-content-between">
            <h2>Total Vendor Subscription List - {subscriptionList?.length} </h2>
            {/* <button className='btn btn-primary fit-content' variant="primary">
              Create Subscription List
            </button> */}
          </div>
        </div>

        <div className="card">
          <GlobalSearch handleSearch={handleSearch} />
          <DataTable
            columns={columns}
            data={filteredData}
            fixedHeader
            pagination
            selectableRows
            customStyles={tableCustomStyles}
          />
        </div>
      </div>

      <br />



      {/* React Bootstrap Modal */}
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
  )
}

export default Subscriptions