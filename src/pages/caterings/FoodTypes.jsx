import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCateringFoodTypes } from '../../features/catering/cateringSlice';
import GlobalSearch from '../../components/common/GlobalSearch';
import { tableCustomStyles } from '../../components/tableCustomStyles';
import { FaEdit } from "react-icons/fa";
import Loader from '../../components/Loader';



const FoodTypes = () => {
  const dispatch = useDispatch()
  const { cateringFoodTypes, isLoading } = useSelector((state) => state.catering)
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    dispatch(fetchCateringFoodTypes());
  }, [dispatch]);


  const handleStatusToggle = async (city) => {
    // const updatedCity = {
    //   ...city,
    //   is_active: city.is_active === 1 ? 0 : 1
    // }
    // await dispatch(updateToggleExplorecity(updatedCity))
    // await dispatch(fetchexplorecitiesData());
  }


  useEffect(() => {
    if (cateringFoodTypes) {
      const formattedData = cateringFoodTypes.map((foodType, index) => ({
        name: foodType?.name,
        is_active: foodType?.is_active,
        order: foodType?.id,
      }));
      setData(formattedData);
      setFilteredData(formattedData);
    }
  }, [cateringFoodTypes]);


  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    if (!searchValue) {
      setFilteredData(data);
      return;
    }
    const newFilteredData = data?.filter((row) => {
      return (
        row?.name?.toLowerCase().includes(searchValue) ||
        row?.order?.toLowerCase().includes(searchValue)
        // row?.order?.toLowerCase().includes(searchValue)
      );
    });
    setFilteredData(newFilteredData);
  };


  const columns = [
    {
      name: "Food Type",
      selector: row => row.name,
      sortable: true,
    },
    // {
    //   name: "Status",
    //   cell: row => (
    //     <div className="form-check form-switch">
    //       <input
    //         className="form-check-input"
    //         type="checkbox"
    //         id={`status-${row.id}`}
    //         checked={row.is_active === 1}
    //         onChange={() => handleStatusToggle(row)}
    //       />
    //       <label className="form-check-label" htmlFor={`status-${row.id}`}>
    //         {row.is_active === 1 ? 'Active' : 'Inactive'}
    //       </label>
    //     </div>
    //   ),
    //   sortable: false,
    // },
    {
      name: "Order",
      selector: row => row.order,
      sortable: true,
    },
    // {
    //   name: "Action",
    //   cell: (row) => (
    //     <>
    //       <button className="btn btn-success me-1" onClick={() => handleEdit(row)}>
    //         <FaEdit />
    //       </button>
    //     </>
    //   ),
    //   ignoreRowClick: true,
    //   allowOverflow: true,
    //   button: true,
    // },
  ];

  const handleEdit = (event) => {
    console.log(event, "event");
  }
  const handleDelete = (event) => {
    console.log(event, "event");
  }


  // console.log(cateringFoodTypes, "cateringFoodTypes");

  return (
    <>
      <div className="container-fluid my-5">

        {/* <div className="row mb-4 d-flex justify-content-end me-2">
          <button className='btn btn-primary fit-content' variant="primary" onClick={handleShow}>
            Add Food Types
          </button>
        </div> */}

        <div className="row mb-4  me-2">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="header-title">
             Food Types - {cateringFoodTypes.length}
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
          // title="React-Data-Table-Component Tutorial."
          />
        </div>
      </div>

      <br />

      <Modal centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Food Types</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <label for="name" className="form-label">Add Food Types</label>
            <input type="text" className="form-control" placeholder="Food Types" />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default FoodTypes