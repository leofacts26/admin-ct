import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import GlobalSearch from '../../components/common/GlobalSearch';
import { tableCustomStyles } from '../../components/tableCustomStyles';
import { createRazorpayPlansMapper, fetchRazorpayPlansMapper, fetchSubscriptionTypeCaterer, updateRazorpayPlansMapper } from '../../features/subscriptionSlice';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Loader from '../../components/Loader';

const initialState = {
  subscription_type_id: '',
  plan_id: '',
  duration: '',
}

const RazorpayPlansMapper = () => {
  const dispatch = useDispatch();
  const { razorpayPlansMapperList, isLoading, vendorSubscriptionTypesList } = useSelector((state) => state.subscription);

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [values, setValues] = useState(initialState);
  const [editId, setEditId] = useState(null);
  const [type, setType] = useState("");
  const [mode, setMode] = useState("live"); // Mode state

  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    setEditId(null);
  };
  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  // Fetch data based on mode
  useEffect(() => {
    dispatch(fetchRazorpayPlansMapper(mode));
  }, [dispatch, mode]);

  // Fetch subscription types based on type selection
  useEffect(() => {
    if (type !== '') {
      dispatch(fetchSubscriptionTypeCaterer(type));
    }
  }, [type]);

  // Update data formatting
  useEffect(() => {
    if (razorpayPlansMapperList) {
      const formattedData = razorpayPlansMapperList?.map((subscription) => ({
        id: subscription?.id,
        subscription_type_name: subscription?.subscription_type_name,
        vendor_type: subscription?.vendor_type,
        duration: subscription?.duration,
        plan_id: subscription?.plan_id,
        subscription_type_id: subscription?.subscription_type_id,
      }));
      setData(formattedData);
      setFilteredData(formattedData);
    }
  }, [razorpayPlansMapperList]);

  // Handle search functionality
  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    if (!searchValue) {
      setFilteredData(data);
      return;
    }
    const newFilteredData = data?.filter((row) => {
      return (
        String(row?.id).toLowerCase().includes(searchValue) ||
        String(row?.subscription_type_name).toLowerCase().includes(searchValue) ||
        String(row?.duration).toLowerCase().includes(searchValue) ||
        String(row?.plan_id).toLowerCase().includes(searchValue) ||
        String(row?.subscription_type_id).toLowerCase().includes(searchValue) ||
        String(row?.vendor_type).toLowerCase().includes(searchValue)
      );
    });
    setFilteredData(newFilteredData);
  };

  // Columns for the DataTable
  const columns = [
    { name: "ID", selector: row => row.id, sortable: true },
    { name: "Plan Id", selector: row => row.plan_id, sortable: true },
    { name: "Subscription Type Id", selector: row => row.subscription_type_id, sortable: true },
    { name: "Duration", selector: row => row.duration, sortable: true },
    { name: "Subscription Type Name", selector: row => row.subscription_type_name, sortable: true },
    { name: "Vendor Type", selector: row => row.vendor_type, sortable: true },
  ];

  // Handle form submission
  const onHandleSubmit = async (e) => {
    e.preventDefault();
    const { subscription_type_id, plan_id, duration } = values;
    const data = {
      vendor_type: type,
      subscription_type_id,
      plan_id,
      duration
    }

    if (editId === null) {
      await dispatch(createRazorpayPlansMapper(data));
    } else {
      await dispatch(updateRazorpayPlansMapper(data));
    }
    await dispatch(fetchRazorpayPlansMapper(mode));
    setValues(initialState);
    handleClose();
  }

  return (
    <>
      <div className="container-fluid my-5">
        <div className="row mb-4 me-2">
            <h2>Total Razorpay Plans Mapper List - {razorpayPlansMapperList?.length}</h2>
          <div className="d-flex justify-content-between align-items-center">

            <div>
            <label className="me-2" htmlFor="mode">Select Mode:</label>
              <select
                id="mode"
                className="form-select me-3"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
              >
                <option value="live">Live</option>
                <option value="test">Test</option>
              </select>
            </div>

            {/* Dropdown to select mode (test/live) */}
            <div className="d-flex align-items-center">

              <button className='btn btn-primary' onClick={handleShow}>
                Create Razorpay Plans Mapper
              </button>
            </div>
          </div>
        </div>

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

      {/* Modal for Create/Edit Razorpay Plan Mapper */}
      <Modal centered show={show} onHide={handleClose}>
        <form onSubmit={onHandleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title> {editId ? 'Edit Razorpay Plan' : 'Create Razorpay Plan'} </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div>
                <label htmlFor="vendor_type" className="form-label">Vendor Type</label>
                <select
                  required
                  name="type"
                  className="form-select"
                  value={values.type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="">Select Vendor Type</option>
                  <option value="Caterer">Caterer</option>
                  <option value="Tiffin">Tiffin</option>
                </select>
              </div>

              {type && <div className='mt-4'>
                <label htmlFor="subscription_type_id" className="form-label">Subscription type id</label>
                <select
                  required
                  name="subscription_type_id"
                  className="form-select"
                  value={values.subscription_type_id}
                  onChange={handleChange}
                >
                  {
                    vendorSubscriptionTypesList?.map((item) => (
                      <option key={item.id} value={item.id}>{item.display_name}</option>
                    ))
                  }
                </select>
              </div>}

              <div className='col-12 mt-4'>
                <label htmlFor="plan_id" className="form-label">Plan ID</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Plan ID"
                  name="plan_id"
                  required
                  onChange={handleChange}
                  value={values.plan_id}
                />
              </div>

              <div className='mt-4'>
                <label htmlFor="duration" className="form-label">Duration</label>
                <select
                  required
                  name="duration"
                  className="form-select"
                  value={values.duration}
                  onChange={handleChange}
                >
                  <option value="">Select Duration</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
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

export default RazorpayPlansMapper;
