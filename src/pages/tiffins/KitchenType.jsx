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
import { createMealTime, fetchMealTypes, updateMealTime, updateToggleMealTime } from '../../features/catering/mealSlice';
import { createKitchenType, fetchKitchenTypes, updateKitchenType, updateToggleKitchenType } from '../../features/catering/kitchenSlice';
import Loader from '../../components/Loader';



const initialState = {
  name: '',
}


const KitchenType = () => {

  const dispatch = useDispatch()
  const { kitchenTypesList, isLoading } = useSelector((state) => state.kitchentypes)

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
    dispatch(fetchKitchenTypes());
  }, [dispatch]);


  useEffect(() => {
    if (kitchenTypesList) {
      const formattedData = kitchenTypesList?.map((kitchen, index) => ({
        id: kitchen?.id,
        name: kitchen?.name,
        createdAt: kitchen?.created_at,
        is_active: kitchen?.is_active
      }));
      setData(formattedData);
      setFilteredData(formattedData);
    }
  }, [kitchenTypesList]);



  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    if (!searchValue) {
      setFilteredData(data);
      return;
    }
    const newFilteredData = data?.filter((row) => {
      return (
        String(row?.id).toLowerCase().includes(searchValue) ||
        String(row?.createdAt).toLowerCase().includes(searchValue) ||
        (row?.name && String(row.name).toLowerCase().includes(searchValue))
      );
    });
    setFilteredData(newFilteredData);
  };


  const handleStatusToggle = async (item) => {
    const data = {
      ...item,
      is_active: item.is_active === 1 ? 0 : 1
    }
    await dispatch(updateToggleKitchenType(data))
    await dispatch(fetchKitchenTypes());
  }


  const columns = [
    // {
    //   name: "ID",
    //   selector: row => row.id,
    //   sortable: true,
    // },
    {
      name: "Name",
      selector: row => row.name,
      sortable: true,
    },
    {
      name: "Created at",
      selector: row => row.createdAt.slice(0, 10),
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
          <label className="form-check-label" htmlFor={`status-${row.id}`}>
            {row.is_active === 1 ? 'Active' : 'Inactive'}
          </label>
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
      name: data?.name,
    }))
  }


  const handleDelete = (event) => {
    console.log(event, "event");
  }


  const onHandleSubmit = async (e) => {
    e.preventDefault();
    const { name } = values;
    const data = {
      name,
      id: editId
    }

    if (editId === null) {
      await dispatch(createKitchenType(data))
    } else {
      await dispatch(updateKitchenType(data))
    }
    await dispatch(fetchKitchenTypes());
    setValues(initialState)
    handleClose()
  }


  return (
    <>
      <div className="container-fluid my-5">


        <div className="row mb-4  me-2">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="header-title">
            Total Kitchen Type List - {kitchenTypesList?.length}
            </h1>
            <button className='btn btn-primary fit-content' variant="primary" onClick={handleShow}>
              Create Kitchen  Type
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
          // title="React-Data-Table-Component Tutorial."
          />
        </div>
      </div>

      <br />

      <Modal centered show={show} onHide={handleClose}>
        <form onSubmit={onHandleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title> {editId ? 'Edit Kitchen Type' : 'Create Kitchen Type'} </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className='col-12'>
                <label for="name" className="form-label"> <b>Name</b> </label>
                <input type="text" className="form-control" placeholder="Dinner"
                  name="name" required onChange={handleChange} value={values.name} />
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

export default KitchenType