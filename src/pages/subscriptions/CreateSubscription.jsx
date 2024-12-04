import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import GlobalSearch from '../../components/common/GlobalSearch';
import { tableCustomStyles } from '../../components/tableCustomStyles';
import { FaEdit } from "react-icons/fa";
import { adminAddSubBenifit, createSubscriptionData, fetchVendorSubscriptionList, updateSubscriptionData, updateToggleSubscriptionList } from '../../features/subscriptionSlice';
import Modal from 'react-bootstrap/Modal';
import { Formik } from 'formik';
import Button from 'react-bootstrap/Button';
import ListBenifits from './ListBenifits';
import ListBenifitsTiffin from './ListBenifitsTiffin';
import Loader from '../../components/Loader';



const initialState = {
  firstName: '',
  display_name: '',
  display_color: '',
  vendor_type: '',
  search_result_order: '',
  monthly_charges: '',
  yearly_charges: '',
  is_active: 1,
}

const CreateSubscription = () => {

  const dispatch = useDispatch()
  const { vendorSubscriptionList, isLoading } = useSelector((state) => state.subscription)
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [editId, setEditId] = useState(null)
  const [values, setValues] = useState(initialState)
  const [benifit, setBenifit] = useState("")
  const [benifitId, setBenifitId] = useState(null)


  const [showBenifit, setShowBenifit] = useState(false);
  const handleBenifitClose = () => {
    setShowBenifit(false)
    setBenifit("")
    setBenifitId("")
  };
  const handleBenifitShow = () => setShowBenifit(true);


  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false)
    setEditId(null)
    setValues(initialState)
  };
  const handleShow = () => setShow(true);

  // console.log(vendorSubscriptionList, "vendorSubscriptionList vendorSubscriptionList");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value })
  }

  useEffect(() => {
    dispatch(fetchVendorSubscriptionList());
  }, [dispatch]);


  useEffect(() => {
    if (vendorSubscriptionList) {
      const formattedData = vendorSubscriptionList?.map((subscription, index) => ({
        id: subscription?.id,
        display_name: subscription?.display_name,
        display_color: subscription?.display_color,
        monthly_charges: subscription?.monthly_charges,
        name: subscription?.name,
        vendor_type: subscription?.vendor_type,
        yearly_charges: subscription?.yearly_charges,
        is_active: subscription?.is_active,
        search_result_order: subscription?.search_result_order,
        created_at: subscription?.created_at,
      }));
      setData(formattedData);
      setFilteredData(formattedData);
    }
  }, [vendorSubscriptionList]);


  const handleStatusToggle = async (sub) => {
    const updatedSub = {
      ...sub,
      is_active: sub.is_active === 1 ? 0 : 1
    }
    await dispatch(updateToggleSubscriptionList(updatedSub))
    await dispatch(fetchVendorSubscriptionList());
  }


  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    if (!searchValue) {
      setFilteredData(data);
      return;
    }
    const newFilteredData = data?.filter((row) => {
      return (
        String(row?.id).toLowerCase().includes(searchValue) ||
        String(row?.display_name).toLowerCase().includes(searchValue) ||
        String(row?.display_color).toLowerCase().includes(searchValue) ||
        String(row?.monthly_charges).toLowerCase().includes(searchValue) ||
        String(row?.name).toLowerCase().includes(searchValue) ||
        String(row?.vendor_type).toLowerCase().includes(searchValue) ||
        String(row?.yearly_charges).toLowerCase().includes(searchValue) ||
        String(row?.search_result_order).toLowerCase().includes(searchValue) ||
        String(row?.created_at).toLowerCase().includes(searchValue)
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
      name: "name",
      selector: row => row.name,
      sortable: true,
    },
    {
      name: "Display Name",
      selector: row => row.display_name,
      sortable: true,
    },
    {
      name: "Display Color",
      selector: row => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span
            style={{
              backgroundColor: row.display_color,
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              display: 'inline-block',
              marginRight: '10px'
            }}
          ></span>
          {row.display_color}
        </div>
      ),
      sortable: true,
    },
    {
      name: "Vendor Type",
      selector: row => row.vendor_type,
      sortable: true,
    },
    {
      name: "Monthly Charges",
      selector: row => row.monthly_charges,
      sortable: true,
    },
    {
      name: "Yearly Charges",
      selector: row => row.yearly_charges,
      sortable: true,
    },
    {
      name: "Created At",
      selector: row => row.created_at,
      sortable: true,
    },
    {
      name: "Add Benifit",
      cell: row => (
        <button className="btn btn-success me-1" onClick={() => {
          handleBenifitShow()
          setBenifitId(row.id)
        }}>
          + Add
        </button>
      ),
      sortable: true,
    },
    {
      name: "Status",
      cell: row => (
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id={`status-${row.id}`}
            checked={row.is_active === 1}
            onChange={() => handleStatusToggle(row)}
          />
        </div>
      ),
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <button className="btn btn-success me-1" onClick={() => { handleEdit(row) }}>
            <FaEdit />
          </button>
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];


  const handleEdit = async (data) => {
    console.log(data, "data data 333");
    setEditId(data?.id)
    handleShow();
    setValues((prevValues) => ({
      ...prevValues,
      id: data?.id,
      firstName: data?.name,
      display_name: data?.display_name,
      display_color: data?.display_color,
      vendor_type: data?.vendor_type,
      search_result_order: data?.search_result_order,
      monthly_charges: data?.monthly_charges,
      yearly_charges: data?.yearly_charges,
      is_active: data?.is_active,
    }))
  }



  const handleSubmit = async (e) => {
    e.preventDefault()
    const { firstName, display_name, display_color, vendor_type, search_result_order, monthly_charges, yearly_charges, is_active } = values;
    const data = {
      name: firstName, display_name, display_color, vendor_type, search_result_order, monthly_charges, yearly_charges, is_active
    }

    const editData = {
      id: editId, name: firstName, display_name, display_color, vendor_type, search_result_order, monthly_charges, yearly_charges, is_active
    }


    if (editId === null) {
      await dispatch(createSubscriptionData(data))
    } else {
      await dispatch(updateSubscriptionData(editData))
    }
    await dispatch(fetchVendorSubscriptionList())
    handleClose()
    setValues(initialState);
  }


  const onHandleBenifitSubmit = async (e) => {
    e.preventDefault();

    const data = {
      subscription_type_id: benifitId,
      benefit: benifit
    };

    try {
      await dispatch(adminAddSubBenifit(data));
      handleBenifitClose();
    } catch (error) {
      console.error("Error creating benefit:", error);
    }
  };



  return (
    <>
      <div className="container-fluid my-5">


        <div className="row mb-4  me-2">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="header-title">
              Subscription Plans List - {vendorSubscriptionList?.length}
            </h1>
            <button className='btn btn-primary fit-content' variant="primary" onClick={handleShow}>
              Create Subscription Plan
            </button>
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


      <Modal centered show={show} onHide={handleClose}>
        <form onSubmit={handleSubmit} autocomplete="off">
          <Modal.Header closeButton>
            <Modal.Title> {editId ? 'Edit Subscription Plan' : 'Create Subscription Plan'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <label for="name" className="form-label">{editId ? 'Edit Name' : 'Add Name'}</label>
              <input type="text" required className="form-control" placeholder="Enter First Name" name="firstName" value={values.firstName} onChange={handleChange} />
            </div>
            <div className='mt-3'>
              <label for="name" className="form-label">Display Name</label>
              <input type="text" required className="form-control" placeholder="display_name" name="display_name" value={values.display_name} onChange={handleChange} />
            </div>
            <div className='mt-3'>
              <label for="name" className="form-label me-3" >Display Color</label>
              <input type="color" id="favcolor" placeholder="display_color"
                name="display_color" value={values.display_color} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="vendor_type" className="form-label mt-3">Vendor Type</label>
              <select
                name="vendor_type"
                className="form-select"
                value={values.vendor_type}
                onChange={handleChange}
              >
                <option value="">Select Vendor Type</option>
                <option value="Caterer">Caterer</option>
                <option value="Tiffin">Tiffin</option>
              </select>
            </div>
            <div className='mt-3'>
              <label for="name" className="form-label">Search Result Order</label>
              <input type="number" required className="form-control" placeholder="search_result_order" name="search_result_order" value={values.search_result_order} onChange={handleChange} />
            </div>
            <div className='mt-3'>
              <label for="name" className="form-label">Monthly Charges</label>
              <input type="number" required className="form-control" placeholder="monthly_charges" name="monthly_charges" value={values.monthly_charges} onChange={handleChange} />
            </div>
            <div className='mt-3'>
              <label for="name" className="form-label">Yearly Charges</label>
              <input type="number" required className="form-control" placeholder="yearly_charges" name="yearly_charges" value={values.yearly_charges} onChange={handleChange} />
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


      <Modal centered show={showBenifit} onHide={handleBenifitClose}>
        <form onSubmit={onHandleBenifitSubmit} autocomplete="off">
          <Modal.Header closeButton>
            <Modal.Title> {editId ? 'Edit City' : 'Create City'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <label for="name" className="form-label">Benifit</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="Enter Benefit"
                name="benifit"
                value={benifit}
                onChange={(e) => setBenifit(e.target.value)}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleBenifitClose}>
              Close
            </Button>
            <Button variant="primary" type='submit'>
              {isLoading ? 'Loading...' : 'Save Changes'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>




      {/* <ListBenifits />
      <ListBenifitsTiffin /> */}

    </>
  )
}

export default CreateSubscription