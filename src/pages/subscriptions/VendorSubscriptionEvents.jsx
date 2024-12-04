import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import GlobalSearch from '../../components/common/GlobalSearch';
import { tableCustomStyles } from '../../components/tableCustomStyles';
import { fetchVendorSubscriptionEvents } from '../../features/subscriptionSlice';
import Loader from '../../components/Loader';



const VendorSubscriptionEvents = () => {

  const dispatch = useDispatch()
  const { vendorSubscriptionEvents, isLoading } = useSelector((state) => state.subscription)
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  // console.log(vendorSubscriptionEvents, "vendorSubscriptionEvents");


  useEffect(() => {
    dispatch(fetchVendorSubscriptionEvents());
  }, [dispatch]);


  useEffect(() => {
    if (vendorSubscriptionEvents) {
      const formattedData = vendorSubscriptionEvents?.map((subscription, index) => ({
        id: subscription?.id,
        vendor_id: subscription?.vendor_id,
        vendor_subscription_id: subscription?.vendor_subscription_id,
        event_type: subscription?.event_type,
        razorpay_subscription_id: subscription?.razorpay_subscription_id,
        vendor_service_name: subscription?.vendor_service_name,
        created_at: subscription?.created_at,
        event_date: subscription?.event_date,
      }));
      setData(formattedData);
      setFilteredData(formattedData);
    }
  }, [vendorSubscriptionEvents]);


  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    if (!searchValue) {
      setFilteredData(data);
      return;
    }
    const newFilteredData = data?.filter((row) => {
      return (
        String(row?.id).toLowerCase().includes(searchValue) ||
        String(row?.vendor_subscription_id).toLowerCase().includes(searchValue) ||
        String(row?.event_type).toLowerCase().includes(searchValue) ||
        String(row?.razorpay_subscription_id).toLowerCase().includes(searchValue) ||
        String(row?.vendor_service_name).toLowerCase().includes(searchValue) ||
        String(row?.created_at).toLowerCase().includes(searchValue) ||
        String(row?.event_date).toLowerCase().includes(searchValue) ||
        String(row?.vendor_id).toLowerCase().includes(searchValue)
      );
    });
    setFilteredData(newFilteredData);
  };


  const columns = [
    {
      name: "ID",
      selector: row => row.id,
      sortable: true,
    },
    {
      name: "Vendor Id",
      selector: row => row.vendor_id,
      sortable: true,
    },
    {
      name: "vendor subscription id",
      selector: row => row.vendor_subscription_id,
      sortable: true,
    },
    {
      name: "Event Type",
      selector: row => row.event_type,
      sortable: true,
    },
    {
      name: "Razorpay Subscription Id",
      selector: row => row.razorpay_subscription_id,
      sortable: true,
    },
    {
      name: "Vendor Service Name",
      selector: row => row.vendor_service_name,
      sortable: true,
    },
    {
      name: "Created At",
      selector: row => row.created_at.slice(0, 10),
      sortable: true,
    },
    {
      name: "Event Date",
      selector: row => row.event_date.slice(0, 10),
      sortable: true,
    },
  ];


  return (
    <>
      <div className="container-fluid my-5">

        <div className="row mb-4  me-2">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="header-title">
              Total Vendor Subscription Events - {vendorSubscriptionEvents?.length}
            </h1>
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
          />
        </div>
      </div>

      <br />
    </>
  )
}

export default VendorSubscriptionEvents