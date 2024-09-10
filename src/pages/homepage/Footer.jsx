import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { createPriceRanges, fetchpriceRangesList, updatePriceRanges, updateTogglePriceRanges } from '../../features/catering/priceSlice';
import GlobalSearch from '../../components/common/GlobalSearch';
import { tableCustomStyles } from '../../components/tableCustomStyles';
import { FaEdit } from "react-icons/fa";
import { cater_vendor_type } from '../../constants';
import { createFooter, fetchFooterData, updateFooter, updateToggleFooter } from '../../features/footerSlice';


const initialState = {
  category: '',
  sub_category: '',
  link: '',
  status: 'active',
  vendor_type: '',
  category_display_order: '',
  sub_category_display_order: '',
}


const Footer = () => {
  const dispatch = useDispatch()
  const { footerList, isLoading } = useSelector((state) => state.footerSlice)

  const [values, setValues] = useState(initialState)
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [editId, setEditId] = useState(null)

  console.log(editId, "editId editId");


  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false)
    setEditId(null)
  };
  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value })
  }

  useEffect(() => {
    dispatch(fetchFooterData());
  }, [dispatch]);


  useEffect(() => {
    if (footerList) {
      const formattedData = footerList?.map((footer, index) => ({
        id: footer?.id,
        category: footer?.category,
        sub_category: footer?.sub_category,
        is_active: footer?.status,
        link: footer?.link,
        vendor_type: footer?.vendor_type,
        category_display_order: footer?.category_display_order,
        sub_category_display_order: footer?.sub_category_display_order,
        updated_at: footer?.updated_at,
      }));
      setData(formattedData);
      setFilteredData(formattedData);
    }
  }, [footerList]);



  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    if (!searchValue) {
      setFilteredData(data);
      return;
    }
    const newFilteredData = data?.filter((row) => {
      return (
        String(row?.id).toLowerCase().includes(searchValue) ||
        (row?.category && String(row.category).toLowerCase().includes(searchValue)) ||
        (row?.vendor_type && String(row.vendor_type).toLowerCase().includes(searchValue)) ||
        (row?.sub_category && String(row.sub_category).toLowerCase().includes(searchValue))
      );
    });
    setFilteredData(newFilteredData);
  };


  const handleStatusToggle = async (item) => {
    const data = {
      ...item,
      is_active: item.is_active === 1 ? 0 : 1
    }
    // await dispatch(updateToggleFooter(data))
    // await dispatch(fetchFooterData());
  }


  const columns = [
    {
      name: "ID",
      selector: row => row.id,
      sortable: true,
    },
    {
      name: "Category",
      selector: row => row.category,
      sortable: true,
    },
    {
      name: "Sub Category",
      selector: row => row.sub_category,
      sortable: true,
    },
    {
      name: "Link",
      selector: row => row.link,
      sortable: true,
    },
    {
      name: "Vendor Type",
      selector: row => row.vendor_type,
      sortable: true,
    },
    {
      name: "Display Order",
      selector: row => row.category_display_order,
      sortable: true,
    },
    {
      name: "Updated At",
      selector: row => row.updated_at,
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
          {/* <label className="form-check-label" htmlFor={`status-${row.id}`}>
            {row.is_active === 1 ? 'Active' : 'Inactive'}
          </label> */}
        </div>
      ),
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

  const handleEdit = (data) => {
    // console.log(data, "data");
    setEditId(data?.id)
    handleShow();
    setValues((prevValues) => ({
      ...prevValues,
      id: data?.id,
      category: data?.category,
      sub_category: data?.sub_category,
      link: data?.link,
      status: data?.status,
      vendor_type: data?.vendor_type,
      category_display_order: data?.category_display_order,
      sub_category_display_order: data?.sub_category_display_order,
    }))
  }


  const handleDelete = (event) => {
    console.log(event, "event");
  }


  const onHandleSubmit = async (e) => {
    e.preventDefault();

    // category: '',
    // sub_category: '',
    // link: '',
    // status: 'active',
    // vendor_type: '',
    // category_display_order: '',
    // sub_category_display_order: '',

    const { category, sub_category, link, status, vendor_type, category_display_order, sub_category_display_order } = values;
    const data = {
      category, sub_category, link, status, vendor_type, category_display_order, sub_category_display_order, id: editId
    }

    if (editId === null) {
      await dispatch(createFooter(data))
    } else {
      await dispatch(updateFooter(data))
    }
    await dispatch(fetchFooterData());
    setValues(initialState)
    handleClose()
  }


  return (
    <>
      <div className="container-fluid my-5">



        <div className="row mb-4 me-2">
          <div className="d-flex justify-content-between">
            <h2>Total Catering Budjet List - {footerList?.length} </h2>
            <button className='btn btn-primary fit-content' variant="primary" onClick={handleShow}>
              Create Catering Budget
            </button>
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
          // title="React-Data-Table-Component Tutorial."
          />
        </div>
      </div>

      <br />

      <Modal centered show={show} onHide={handleClose}>
        <form onSubmit={onHandleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title> {editId ? 'Edit Footer' : 'Create Footer'} </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className='col-12'>
                <label for="name" className="form-label"> <b>category</b> </label>
                <input type="text" className="form-control" placeholder="Eg. Home" name="category" required onChange={handleChange} value={values.category} />
              </div>
              <div className='col-12 mt-4'>
                <label for="name" className="form-label"> <b>Sub Category</b> </label>
                <input type="text" className="form-control" placeholder="Eg. sub category" name="sub_category" required onChange={handleChange} value={values.sub_category} />
              </div>
              <div className='col-12 mt-4'>
                <label for="name" className="form-label"> <b>Link</b> </label>
                <input type="text" className="form-control" placeholder="Eg. instagram.com" name="link" required onChange={handleChange} value={values.link} />
              </div>
              <div className='col-12 mt-4'>
                <label for="name" className="form-label"> <b>category display order</b> </label>
                <input type="number" className="form-control" placeholder="Eg. 1" name="category_display_order" required onChange={handleChange} value={values.category_display_order} />
              </div>
              <div className='col-12 mt-4'>
                <label for="name" className="form-label"> <b>Sub Category Display Order</b> </label>
                <input type="number" className="form-control" placeholder="Eg. 1" name="sub_category_display_order" required onChange={handleChange} value={values.sub_category_display_order} />
              </div>
              <div className='mt-4'>
                <label htmlFor="vendor_type" className="form-label"><b>Vendor Type</b></label>
                <select
                  name="vendor_type"
                  className="form-select"
                  value={values.vendor_type}
                  onChange={handleChange}
                >
                  <option value=""><b>Select Vendor Type</b></option>
                  <option value="Caterer">Caterer</option>
                  <option value="Tiffin">Tiffin</option>
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

export default Footer