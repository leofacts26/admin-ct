import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import Button from 'react-bootstrap/Button';
import { tableCustomStyles } from '../../components/tableCustomStyles';
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import GlobalSearch from '../../components/common/GlobalSearch';
import { useDispatch, useSelector } from 'react-redux';
import { createExplorecity, fetchexplorecitiesData, updateExplorecity, updateToggleExplorecity } from '../../features/homepage/homeSlice';
import Modal from 'react-bootstrap/Modal';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { setCuisineId } from '../../features/userSlice';
import { FaCloudUploadAlt } from "react-icons/fa";
import useUploadCusinePhotoos from '../../hooks/useUploadCusinePhotoos';
import ImagePreviewColumn from '../../components/ImagePreviewColumn';


const initialState = {
  name: '',
  state: '',
  country: '',
  latitude: '',
  longitude: ''
}

const ExploreIndia = () => {
  const dispatch = useDispatch()
  const { exploreCities, isLoading } = useSelector((state) => state.homepage)
  const { token } = useSelector((state) => state.authSlice)
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [values, setValues] = useState(initialState)
  const [editId, setEditId] = useState(null)
  const { onUploadCityImage } = useUploadCusinePhotoos()

  // console.log(token, "token token token token");

  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false)
    setEditId(null)
    setValues(initialState)
  };
  const handleShow = () => setShow(true);

  useEffect(() => {
    dispatch(fetchexplorecitiesData());
  }, [dispatch]);


  const handleImageError = (e) => {
    e.target.src = 'https://www.cateringsandtiffins.com/img/no-image.jpg'; // Provide the path to your error image here
  };

  useEffect(() => {
    if (exploreCities) {
      const formattedData = exploreCities?.map((city, index) => ({
        id: city?.id,
        name: city?.name,
        image: city?.file_name?.medium,
        state: city?.state,
        country: city?.country,
        latitude: city?.latitude,
        longitude: city?.longitude,
        is_active: city?.is_active,
        created_at: city?.created_at
      }));
      setData(formattedData);
      setFilteredData(formattedData);
    }
  }, [exploreCities]);


  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    if (!searchValue) {
      setFilteredData(data);
      return;
    }
    const newFilteredData = data.filter((row) => {
      return (
        row?.id?.toString().toLowerCase().includes(searchValue) ||
        row?.name?.toLowerCase().includes(searchValue) ||
        row?.created_at?.toLowerCase().includes(searchValue)
      );
    });
    setFilteredData(newFilteredData);
  };


  const handleStatusToggle = async (city) => {
    const updatedCity = {
      ...city,
      is_active: city.is_active === 1 ? 0 : 1
    }
    await dispatch(updateToggleExplorecity(updatedCity))
    await dispatch(fetchexplorecitiesData());
  }

  const columns = [
    {
      name: "S.NO",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "City Name",
      selector: row => row.name,
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
            {row.is_active === 1 ? 'Active' : 'In-active'}
          </label> */}
        </div>
      ),
      sortable: true,
    },
    {
      name: "Created At",
      selector: row => row.created_at.slice(0, 10),
      sortable: true,
    },
    {
      name: "Image Preview",
      cell: (row) => (
        <ImagePreviewColumn
          row={row}
          dispatch={dispatch}
          setCuisineId={setCuisineId}
          onUploadCityImage={onUploadCityImage}
          handleImageError={handleImageError}
        />
      ),
      sortable: false,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <button className="btn btn-success me-1" onClick={() => handleEdit(row)}>
            <FaEdit />
          </button>
          {/* <button className="btn btn-danger" onClick={() => handleDelete(row.id)}>
            <MdDeleteForever />
          </button> */}
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  // validation schema
  const schema = Yup.object().shape({
    name: Yup.string()
      .required('Name is required')
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be at most 50 characters'),
    state: Yup.string()
      .required('State is required')
      .min(2, 'State must be at least 2 characters')
      .max(50, 'State must be at most 50 characters'),
    country: Yup.string()
      .required('Country is required')
      .min(2, 'Country must be at least 2 characters')
      .max(50, 'Country must be at most 50 characters'),
    latitude: Yup.number()
      .required('Latitude is required'),
    longitude: Yup.number()
      .required('Longitude is required')
  });

  const handleEdit = async (data) => {
    setEditId(data?.id)
    handleShow();
    setValues((prevValues) => ({
      ...prevValues,
      name: data?.name,
      state: data?.state,
      country: data?.country,
      latitude: data?.latitude,
      longitude: data?.longitude,
      id: data?.id
    }))
  }

  const handleDelete = (event) => {
    console.log(event, "event");
  }

  const handleSubmit = async (data, resetForm) => {
    if (editId === null) {
      await dispatch(createExplorecity(data))
    } else {
      await dispatch(updateExplorecity(data))
    }
    await dispatch(fetchexplorecitiesData())
    handleClose()
    resetForm(initialState);
  }


  // console.log(exploreCities,   "exploreCities exploreCities"); 

  return (
    <>
      <div className="container-fluid my-5">


        <div className="row mb-4  me-2">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="header-title">
              Total Cities - 12
            </h1>
            <button className='btn btn-primary fit-content' variant="primary" onClick={handleShow}>
              Create City
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
          />
        </div>

      </div>
      <br />

      <Modal centered show={show} onHide={handleClose}>
        <Formik enableReinitialize={true} initialValues={values} validationSchema={schema} onSubmit={(values, { resetForm }) => handleSubmit(values, resetForm)}>
          {({ values, errors, handleChange, handleSubmit }) => (
            <form onSubmit={handleSubmit} autocomplete="off">
              <Modal.Header closeButton>
                <Modal.Title> {editId ? 'Edit City' : 'Create City'}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div>
                  <label for="name" className="form-label">{editId ? 'Edit Name' : 'Add Name'}</label>
                  <input type="text" className="form-control" placeholder="City Name" name="name" value={values.name} onChange={handleChange} />
                  {errors.name && <small className='text-danger mb-2 ms-1'>{errors.name}</small>}
                </div>
                <div className='mt-3'>
                  <label for="name" className="form-label">Add State</label>
                  <input type="text" className="form-control" placeholder="State Name" name="state" value={values.state} onChange={handleChange} />
                  {errors.name && <small className='text-danger mb-2 ms-1'>{errors.state}</small>}
                </div>
                <div className='mt-3'>
                  <label for="name" className="form-label">Add Country</label>
                  <input type="text" className="form-control" placeholder="Country Name" name="country" value={values.country} onChange={handleChange} />
                  {errors.name && <small className='text-danger mb-2 ms-1'>{errors.country}</small>}
                </div>
                <div className='mt-3'>
                  <label for="name" className="form-label">Add Latitude</label>
                  <input type="text" className="form-control" placeholder="Enter Latitude" name="latitude" value={values.latitude} onChange={handleChange} />
                  {errors.name && <small className='text-danger mb-2 ms-1'>{errors.latitude}</small>}
                </div>
                <div className='mt-3'>
                  <label for="name" className="form-label">Add Longitude</label>
                  <input type="text" className="form-control" placeholder="Enter longitude" name="longitude" value={values.longitude} onChange={handleChange} />
                  {errors.name && <small className='text-danger mb-2 ms-1'>{errors.longitude}</small>}
                </div>
                {/* <div className='mt-3'>
            <label for="image" className="form-label">Add Image</label>
            <input className="form-control" type="file" id="formFile" accept="image/*" />
          </div> */}
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
          )}
        </Formik>
      </Modal>
    </>
  )
}

export default ExploreIndia