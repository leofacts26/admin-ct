import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { createPriceRanges, updatePriceRanges, updateTogglePriceRanges } from '../../features/catering/priceSlice';
import GlobalSearch from '../../components/common/GlobalSearch';
import { tableCustomStyles } from '../../components/tableCustomStyles';
import { FaEdit } from "react-icons/fa";
import { cater_vendor_type } from '../../constants';
import { fetchSocialData, updateSocialData } from '../../features/footerSlice';
import Loader from '../../components/Loader';


const initialState = {
  name: '',
  link: '',
}


const Social = () => {

  const dispatch = useDispatch()
  const { socialList, isLoading } = useSelector((state) => state.footerSlice)

  // console.log(socialList, "socialList socialList");


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
    dispatch(fetchSocialData());
  }, [dispatch]);


  useEffect(() => {
    if (socialList) {
      const formattedData = socialList?.map((social, index) => ({
        id: social?.id,
        link: social?.link,
        platform_name: social?.platform_name,
        created_at: social?.created_at,
      }));
      setData(formattedData);
      setFilteredData(formattedData);
    }
  }, [socialList]);



  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    if (!searchValue) {
      setFilteredData(data);
      return;
    }
    const newFilteredData = data?.filter((row) => {
      return (
        String(row?.id).toLowerCase().includes(searchValue) ||
        (row?.link && String(row.link).toLowerCase().includes(searchValue)) ||
        (row?.created_at && String(row.created_at).toLowerCase().includes(searchValue)) ||
        (row?.platform_name && String(row.platform_name).toLowerCase().includes(searchValue))
      );
    });
    setFilteredData(newFilteredData);
  };


  // const handleStatusToggle = async (item) => {
  //   const data = {
  //     ...item,
  //     is_active: item.is_active === 1 ? 0 : 1
  //   }
  //   await dispatch(updateTogglePriceRanges(data))
  //   await dispatch(fetchSocialData());
  // }


  const columns = [
    // {
    //   name: "ID",
    //   selector: row => row.id,
    //   sortable: true,
    // },
    {
      name: "Name",
      selector: row => row.platform_name,
      sortable: true,
      width: '200px'
    },
    {
      name: "Link",
      selector: row => row.link,
      sortable: true,
    },
    {
      name: "Created At",
      selector: row => row.created_at.slice(0, 10),
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
      link: data?.link,
      name: data?.platform_name,
    }))
  }


  const handleDelete = (event) => {
    console.log(event, "event");
  }


  const onHandleSubmit = async (e) => {
    e.preventDefault();
    const { name, link } = values;
    const data = {
      name,
      link,
      id: editId
    }

    if (editId === null) {
      // await dispatch(createPriceRanges(data))
    } else {
      await dispatch(updateSocialData(data))
    }
    await dispatch(fetchSocialData());
    setValues(initialState)
    handleClose()
  }


  return (
    <>
      <div className="container-fluid my-5">


        <div className="row mb-4  me-2">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="header-title">
              Total Social List - {socialList?.length}
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
        <form onSubmit={onHandleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title> {editId ? 'Edit Social' : 'Create Social'} </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className='col-6'>
                <label for="name" className="form-label"> <b>Name</b> </label>
                <input type="text" disabled className="form-control" placeholder="Your Name" name="name" required onChange={handleChange} value={values.name} />
              </div>
              <div className='col-6'>
                <label for="name" className="form-label"> <b>Link</b> </label>
                <input type="text" className="form-control" placeholder="Your Link" name="link" required onChange={handleChange} value={values.link} />
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

export default Social