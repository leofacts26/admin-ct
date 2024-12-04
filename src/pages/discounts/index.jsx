import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { createCouponList, fetchCouponList, updateCouponList } from '../../features/catering/couponSlice';
import GlobalSearch from '../../components/common/GlobalSearch';
import { tableCustomStyles } from '../../components/tableCustomStyles';
import { FaEdit } from "react-icons/fa";
import Loader from '../../components/Loader';


const initialState = {
  discount_name: '',
  vendor_type: '',  
  coupon_code: '',
  valid_from: '',
  valid_till: '',
  status: '',
  coupon_type: '',
  discount_percent: '0',
  discount_price: '0',
}


const Discounts = () => {
  const dispatch = useDispatch()
  const { couponsList, isLoading } = useSelector((state) => state.coupons)

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  // const [subCatdata, setSubCatData] = useState(rowsSubCategory);
  const [editId, setEditId] = useState(null)
  const [editSubscriptionTypeId, setEditSubscriptionTypeId] = useState(null)

  const [values, setValues] = useState(initialState)

  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false)
    setEditId(null)
    setEditSubscriptionTypeId(null)
    setValues(initialState)
  };
  const handleShow = () => setShow(true);

  const [showSubCategory, setSubCategory] = useState(false);
  const handleSubClose = () => setSubCategory(false);
  const handleSubShow = () => setSubCategory(true);

  console.log(values, "values values values");


  useEffect(() => {
    dispatch(fetchCouponList())
  }, [])


  useEffect(() => {
    if (couponsList) {
      const formattedData = couponsList?.filter((item) => item.vendor_id !== '').map((item, index) => ({
        id: item?.id,
        discount_name: item?.discount_name,
        vendor_type: item?.vendor_type,
        coupon_code: item?.coupon_code,
        valid_from: item?.valid_from,
        valid_till: item?.valid_till,
        status: item?.status,
        coupon_type: item?.coupon_type,
        discount_percent: item?.discount_percent,
        discount_price: item?.discount_price,
        subscription_type_id: item?.subscription_type_id,
      }));
      setData(formattedData);
      setFilteredData(formattedData);
    }
  }, [couponsList]);


  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    if (!searchValue) {
      setFilteredData(data);
      return;
    }
    const newFilteredData = data?.filter((row) => {
      return (
        String(row?.id).toLowerCase().includes(searchValue) ||
        String(row?.discount_name).toLowerCase().includes(searchValue) ||
        String(row?.vendor_type).toLowerCase().includes(searchValue) ||
        String(row?.coupon_code).toLowerCase().includes(searchValue) ||
        String(row?.valid_from).toLowerCase().includes(searchValue) ||
        String(row?.valid_till).toLowerCase().includes(searchValue) ||
        String(row?.status).toLowerCase().includes(searchValue) ||
        String(row?.discount_percent).toLowerCase().includes(searchValue) ||
        String(row?.discount_price).toLowerCase().includes(searchValue) ||
        String(row?.subscription_type_id).toLowerCase().includes(searchValue) ||
        String(row?.coupon_type).toLowerCase().includes(searchValue)
      );
    });
    setFilteredData(newFilteredData);
  };



  const onHandleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevState) => ({ ...prevState, [name]: value }))
  };


  const columns = [
    // {
    //   name: "S.No",
    //   selector: row => row.id,
    //   sortable: true,
    // },
    {
      name: "Discount Name",
      selector: row => row.discount_name,
      sortable: true,
    },
    // {
    //   name: "Sub Id",
    //   selector: row => row.subscription_type_id,
    //   sortable: true,
    // },
    {
      name: "Vendor Type",
      cell: (row) => {
        let badgeClass = "badge"; // Common badge class
        const vendorType = row.vendor_type ? row.vendor_type.toLowerCase() : ""; // Convert vendor_type to lowercase for comparison

        // Assign specific badge class based on vendor type
        switch (vendorType) {
          case "caterer":
            badgeClass += " text-bg-orange"; // Orange for Caterer
            break;
          case "tiffin":
            badgeClass += " text-bg-normal-bage"; // Yellow for Tiffin
            break;
          default:
            badgeClass += " text-bg-default-bage"; // Default color for unknown
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
      name: "Coupon Code",
      selector: row => row.coupon_code,
      sortable: true,
    },
    {
      name: "Valid From",
      selector: row => row.valid_from.slice(0, 10),
      sortable: true,
    },
    {
      name: "Valid Till",
      selector: row => row.valid_till.slice(0, 10),
      sortable: true,
    },
    {
      name: "Coupon type",
      cell: (row) => {
        // Determine the class based on status
        let badgeClass = "badge"; // Common badge class
        const status = row.coupon_type ? row.coupon_type.toLowerCase() : ""; // Convert status to lowercase for comparison

        // Assign specific badge class based on status
        switch (status) {
          case "regular":
            badgeClass += " annually-tag"; // Green for Active
            break;
          case "trial":
            badgeClass += " gray-color"; // Red for Expired
            break;
          default:
            badgeClass += " gray-color"; // Default color for unknown
            break;
        }

        return (
          <span className={badgeClass} style={{ textTransform: "capitalize" }}>
            {row.coupon_type || "Unknown"}
          </span>
        );
      },
      sortable: true,
    },
    {
      name: "Discount Percent",
      selector: row => row.discount_percent,
      sortable: true,
      width: '160px'
    },
    {
      name: "Discount Price",
      selector: row => row.discount_price,
      sortable: true,
      width: '140px'
    },
    {
      name: "Status",
      cell: (row) => {
        // Determine the class based on status
        let badgeClass = "badge"; // Common badge class
        const status = row.status ? row.status.toLowerCase() : ""; // Convert status to lowercase for comparison

        // Assign specific badge class based on status
        switch (status) {
          case "active":
            badgeClass += " text-bg-popular-bage"; // Green for Active
            break;
          case "expired":
            badgeClass += " text-bg-default-bage"; // Red for Expired
            break;
          default:
            badgeClass += " text-bg-branded-bage"; // Default color for unknown
            break;
        }

        return (
          <span className={badgeClass} style={{ textTransform: "capitalize" }}>
            {row.status || "Unknown"}
          </span>
        );
      },
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <button className="btn btn-success me-1" onClick={() => handleEdit(row)}>
            <FaEdit />
          </button>
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];


  // const vendorCouponList = [
  //   {
  //     name: "S.No",
  //     selector: row => row.ID,
  //     sortable: true,
  //   },
  //   {
  //     name: "vendor ID",
  //     selector: row => row.vendorID,
  //     sortable: true,
  //   },
  //   {
  //     name: "coupons",
  //     selector: row => row.coupons,
  //     sortable: true,
  //   },
  //   {
  //     name: "discount",
  //     selector: row => row.discount,
  //     sortable: true,
  //   },
  //   {
  //     name: "valid From",
  //     selector: row => row.validForm,
  //     sortable: true,
  //   },
  //   {
  //     name: "valid Till",
  //     selector: row => row.validTill,
  //     sortable: true,
  //   },
  //   {
  //     name: "status",
  //     selector: row => row.status,
  //     sortable: true,
  //   },
  //   {
  //     name: "Time To Use",
  //     selector: row => row.timeToUse,
  //     sortable: true,
  //   },
  //   {
  //     name: "Action",
  //     cell: (row) => (
  //       <>
  //         <span className='text-primary cursor-pointer' onClick={() => alert("test")}> Edit / </span>
  //         <span className='text-primary cursor-pointer' onClick={() => alert("test")}> {" "} Delete </span>
  //       </>
  //     ),
  //     ignoreRowClick: true,
  //     allowOverflow: true,
  //     button: true,
  //   },
  // ];


  const handleEdit = (data) => {
    // Map vendor_type and coupon_type to match the values in select options
    const mappedVendorType = data.vendor_type === 'user-caterer' ? 'user-caterer' : data.vendor_type === 'Tiffin' ? 'user-tiffin' : '';
    const mappedCouponType = data.coupon_type === 'discount' ? 'discount' : data.coupon_type === 'Offer' ? 'offer' : '';

    console.log(data, "data data");


    setEditId(data?.id)
    setEditSubscriptionTypeId(data?.subscription_type_id)
    handleShow()
    if (data) {
      setValues(prevValues => ({
        ...prevValues,
        discount_name: data.discount_name || prevValues.discount_name,
        vendor_type: data.vendor_type || prevValues.vendor_type, // Use mapped value for vendor_type
        coupon_type: data.coupon_type || prevValues.coupon_type, // Use mapped value for coupon_type
        coupon_code: data.coupon_code || prevValues.coupon_code,
        valid_from: data.valid_from ? new Date(data.valid_from).toISOString().split('T')[0] : prevValues.valid_from,
        valid_till: data.valid_till ? new Date(data.valid_till).toISOString().split('T')[0] : prevValues.valid_till,
        status: data.status || prevValues.status,
        discount_percent: data.discount_percent || prevValues.discount_percent,
        discount_price: data.discount_price || prevValues.discount_price,
      }));
    }
  }
  const handleDelete = (event) => {
    console.log(event, "event");
  }

  console.log(editId, "editId editId");

  const onHandleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      ...values,
    }
    const updateData = {
      ...values,
      id: editId,
      subscription_type_id: editSubscriptionTypeId
    }

    if (editId === null) {
      await dispatch(createCouponList(data))
    } else {
      await dispatch(updateCouponList(updateData))
    }
    await dispatch(fetchCouponList())
    handleClose()
  }

  return (
    <>
      <div className="container-fluid my-5">

        <div className="row mb-4  me-2">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="header-title">
              Total Multi Vendor discounts List - {couponsList?.filter((item) => item.vendor_id !== '').length}
            </h1>
            <button className='btn btn-primary fit-content' variant="primary" onClick={handleShow}>
              Create Multi Vendor Discount
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

        <hr />

        {/* <h4>Create Single vendor Discount</h4>
        <div className="card">
          <input
            type="search"
            className="form-control-sm border ps-3 py-3"
            placeholder="Search"
            onChange={handleSubCategorySearch}
          />
          <DataTable
            columns={vendorCouponList}
            data={subCatdata}
            fixedHeader
            pagination
            selectableRows
          />
        </div> */}
      </div>

      <br />

      <Modal centered show={show} onHide={handleClose}>
        <form onSubmit={onHandleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Create Multi Vendor Discount</Modal.Title>
          </Modal.Header>
          <Modal.Body>

            <div className="row mt-3">
              <div className="col-6">
                <div>
                  <label for="name" className="form-label">Discount Name</label>
                  <input type="text" className="form-control" placeholder="Discount Name"
                    name="discount_name" value={values.discount_name} onChange={onHandleChange}
                  />
                </div>
              </div>
              <div className="col-6">
                <div>
                  <label htmlFor="name" className="form-label">Vendor Type</label>
                  <select className="form-select" name="vendor_type" value={values.vendor_type} onChange={onHandleChange}>
                    <option value="">Select an option</option>
                    <option value="caterer">Caterer</option>
                    <option value="tiffin">Tiffin</option>
                  </select>

                </div>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-6">
                <div>
                  <label for="name" className="form-label">Coupon Code</label>
                  <input type="text" className="form-control" placeholder="Coupon Code"
                    name="coupon_code" value={values.coupon_code} onChange={onHandleChange}
                  />
                </div>
              </div>
              <div className="col-6">
                <div>
                  <label for="name" className="form-label">Status</label>
                  <select className="form-select" name="status" value={values.status} onChange={onHandleChange}>
                    <option value="">Select Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-6">
                <div>
                  <label for="name" className="form-label">Valid From</label>
                  <input type="date" className="form-control"
                    name="valid_from" value={values.valid_from} onChange={onHandleChange} />
                </div>
              </div>
              <div className="col-6">
                <div>
                  <label for="name" className="form-label">Valid Till</label>
                  <input type="date" className="form-control"
                    name="valid_till" value={values.valid_till} onChange={onHandleChange}
                  />
                </div>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-6">
                <div>
                  <label for="name" className="form-label">Coupon Type</label>
                  <select className="form-select" name="coupon_type" value={values.coupon_type} onChange={onHandleChange}>
                    <option value="">Select Coupon Type</option>
                    <option value="trial">Trial</option>
                    <option value="regular ">Regular </option>
                  </select>
                </div>
              </div>
              <div className="col-6">
                <div>
                  <label for="name" className="form-label">Discount Percentage</label>
                  <input type="text" className="form-control" placeholder="Discount Percentage"
                    name="discount_percent" value={values.discount_percent} onChange={onHandleChange}
                  />
                </div>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-6">
                <div>
                  <label for="name" className="form-label">Discount Price</label>
                  <input type="text" className="form-control" placeholder="Discount Price"
                    name="discount_price" value={values.discount_price} onChange={onHandleChange}
                  />
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type='submit'>
              Submit
            </Button>
          </Modal.Footer>
        </form>
      </Modal>



      {/* <Modal centered show={showSubCategory} onHide={handleSubClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Single Vendor List</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-6">
              <div>
                <label for="name" className="form-label">Vendor ID</label>
                <input type="text" className="form-control" placeholder="Vendor ID" />
              </div>
            </div>
            <div className="col-6">
              <div>
                <label for="name" className="form-label">Coupon Code</label>
                <input type="text" className="form-control" placeholder="Coupon Code" />
              </div>
            </div>
          </div>


          <div className="row mt-3">
            <div className="col-6">
              <div>
                <label for="name" className="form-label">% Discount</label>
                <input type="text" className="form-control" placeholder="Ex:- 5%" />
              </div>
            </div>
            <div className="col-6">
              <div>
                <label for="name" className="form-label">Time To Use</label>
                <input type="text" className="form-control" placeholder="Ex:- 5" />
              </div>
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-6">
              <div>
                <label for="name" className="form-label">Valid From</label>
                <input type="date" className="form-control" />
              </div>
            </div>
            <div className="col-6">
              <div>
                <label for="name" className="form-label">Valid Till</label>
                <input type="date" className="form-control" />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleSubClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubClose}>
            Create
          </Button>
        </Modal.Footer>
      </Modal> */}
    </>
  )
}

export default Discounts