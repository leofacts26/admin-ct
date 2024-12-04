import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { createOccasionData, fetchOccasionList, setOccasionId, updateOccasionData, updateToggleOccasion } from '../../features/catering/occasionSlice';
import GlobalSearch from '../../components/common/GlobalSearch';
import { tableCustomStyles } from '../../components/tableCustomStyles';
import { FaEdit } from "react-icons/fa";
import { FaCloudUploadAlt } from "react-icons/fa";
// import { updatePriceRanges } from '../../features/catering/priceSlice';
import useUploadOccasionPhotoos from '../../hooks/useUploadOccasionPhotos';
import Loader from '../../components/Loader';
// import { updateToggleOccasion } from '../../features/catering/cateringFaq';


const initialState = {
  name: '',
}


const Occasions = () => {
  const dispatch = useDispatch()
  const { occasionsList, isLoading } = useSelector((state) => state.occasion)
  // console.log(occasionsList, "occasionsList");
  const { onUploadOccasionImage } = useUploadOccasionPhotoos()


  useEffect(() => {
    dispatch(fetchOccasionList());
  }, [dispatch]);

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


  const handleImageError = (e) => {
    e.target.src = 'https://www.cateringsandtiffins.com/img/no-image.jpg'; // Provide the path to your error image here
  };

  useEffect(() => {
    if (occasionsList) {
      const formattedData = occasionsList?.map((occasion, index) => ({
        id: occasion?.occasion_id,
        name: occasion?.occasion_name,
        image: occasion?.file_name?.medium,
        is_active: occasion?.is_active
      }));
      setData(formattedData);
      setFilteredData(formattedData);
    }
  }, [occasionsList]);


  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    if (!searchValue) {
      setFilteredData(data);
      return;
    }
    const newFilteredData = data.filter((row) => {
      return (
        row?.id?.toString().toLowerCase().includes(searchValue) ||
        row?.name?.toLowerCase().includes(searchValue)
      );
    });
    setFilteredData(newFilteredData);
  };


  const handleStatusToggle = async (occasion) => {
    const updatedOccastion = {
      id: occasion?.id,
      is_active: occasion?.is_active === 1 ? 0 : 1
    }
    await dispatch(updateToggleOccasion(updatedOccastion))
    await dispatch(fetchOccasionList());
  }


  const columns = [
    {
      name: "ID",
      selector: row => row.id,
      sortable: true,
    },
    {
      name: "City Name",
      selector: row => row.name,
      sortable: true,
    },
    {
      name: "Image Preview",
      cell: row => (
        row.image ? (
          <>
            <input
              accept="image/*"
              id="onUploadOccasionImage"
              multiple
              type="file"
              style={{ display: 'none' }}
              onChange={(e) => onUploadOccasionImage(e)}
            />
            <label htmlFor="onUploadOccasionImage">
              <span variant="contained" component="span" style={{ cursor: 'pointer' }}
                onClick={() => dispatch(setOccasionId(row?.id))}
              >
                <img onError={handleImageError} src={row?.image} style={{ width: '30px', borderRadius: '5px' }} alt="" className="img-fluid" />
              </span>
            </label>
          </>
        ) : (
          <>
            <input
              accept="image/*"
              id="onUploadOccasionImage"
              multiple
              type="file"
              style={{ display: 'none' }}
              onChange={(e) => onUploadOccasionImage(e)}
            />
            <label htmlFor="onUploadOccasionImage">
              <span variant="contained" component="span" style={{ cursor: 'pointer' }}
                onClick={() => dispatch(setOccasionId(row?.id))}
              >
                <FaCloudUploadAlt size={30} />
              </span>
            </label>
          </>
        )
      ),
      sortable: false,
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



  const handleEdit = (data) => {
    console.log(data, "data");
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
      // vendor_type: cater_vendor_type,
      name,
      id: editId
    }

    if (editId === null) {
      await dispatch(createOccasionData(data))
    } else {
      await dispatch(updateOccasionData(data))
    }
    await dispatch(fetchOccasionList());
    setValues(initialState)
    handleClose()

  }

  return (
    <>
      <div className="container-fluid my-5">

        <div className="row mb-4  me-2">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="header-title">
              Total Occasions - {occasionsList.length}
            </h1>
            <button className='btn btn-primary fit-content' variant="primary" onClick={handleShow}>
              Create Occasion
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
            <Modal.Title> {editId ? 'Update' : 'Create'} Occasion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <label for="name" name="name" value={values.name} onChange={handleChange} className="form-label"> {editId ? 'Update' : 'Create'} Occasion</label>
              <input type="text" className="form-control" placeholder="Add Occasion"
                name="name" required onChange={handleChange} value={values.name}
              />
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

export default Occasions