import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { createPriceRanges, fetchpriceRangesList, fetchpriceRangesListTiffin, updatePriceRanges, updateTogglePriceRanges } from '../../features/catering/priceSlice';
import GlobalSearch from '../../components/common/GlobalSearch';
import { tableCustomStyles } from '../../components/tableCustomStyles';
import { FaEdit } from "react-icons/fa";
import { tiffin_vendor_type } from '../../constants';


// const rows = [
//   {
//     personID: 1,
//     minimum: "Rs. 50",
//     maximum: "Rs. 100",
//     image: "https://dashkit.goodthemes.co/assets/img/avatars/profiles/avatar-1.jpg",
//   }
// ];

const initialState = {
  start_price: '',
  end_price: '',
}


const TiffinBudjet = () => {

  const dispatch = useDispatch()
  const { priceRangesListTiffin, isLoading } = useSelector((state) => state.priceranges)

  const [values, setValues] = useState(initialState)
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [editId, setEditId] = useState(null)

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
    dispatch(fetchpriceRangesListTiffin(tiffin_vendor_type));
  }, [dispatch]);


  useEffect(() => {
    if (priceRangesListTiffin) {
      const formattedData = priceRangesListTiffin?.map((price, index) => ({
        id: price?.id,
        startprice: price?.start_price,
        endprice: price?.end_price,
        is_active: price?.is_active
      }));
      setData(formattedData);
      setFilteredData(formattedData);
    }
  }, [priceRangesListTiffin]);



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


  const handleStatusToggle = async (item) => {
    const data = {
      ...item,
      is_active: item.is_active === 1 ? 0 : 1
    }
    await dispatch(updateTogglePriceRanges(data))
    await dispatch(fetchpriceRangesListTiffin());
  }


  const columns = [
    // {
    //   name: "ID",
    //   selector: row => row.id,
    //   sortable: true,
    // },
    {
      name: "Start Price",
      selector: row => row.startprice,
      sortable: true,
    },
    {
      name: "End Price",
      selector: row => row.endprice,
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
      start_price: data?.startprice,
      end_price: data?.endprice,
    }))
  }


  const handleDelete = (event) => {
    console.log(event, "event");
  }


  const onHandleSubmit = async (e) => {
    e.preventDefault();
    const { start_price, end_price } = values;
    const data = {
      vendor_type: tiffin_vendor_type,
      start_price,
      end_price,
      id: editId
    }

    if (editId === null) {
      await dispatch(createPriceRanges(data))
    } else {
      await dispatch(updatePriceRanges(data))
    }
    await dispatch(fetchpriceRangesListTiffin());
    setValues(initialState)
    handleClose()
  }


  return (
    <>
      <div className="container-fluid my-5">


        <div className="row mb-4  me-2">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="header-title">
              Total Tiffin Budget List - {priceRangesListTiffin?.length}
            </h1>
            <button className='btn btn-primary fit-content' variant="primary" onClick={handleShow}>
              Create Tiffin Budget
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
          // title="React-Data-Table-Component Tutorial."
          />
        </div>
      </div>

      <br />

      <Modal centered show={show} onHide={handleClose}>
        <form onSubmit={onHandleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title> {editId ? 'Edit Budget' : 'Create Budget'} </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className='col-6'>
                <label for="name" className="form-label"> <b>Start Price</b> </label>
                <input type="text" className="form-control" placeholder="Rs. 100" name="start_price" required onChange={handleChange} value={values.start_price} />
              </div>
              <div className='col-6'>
                <label for="name" className="form-label"> <b>End Price</b> </label>
                <input type="text" className="form-control" placeholder="Rs. 200" name="end_price" required onChange={handleChange} value={values.end_price} />
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

export default TiffinBudjet