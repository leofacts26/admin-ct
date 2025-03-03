import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import GlobalSearch from '../../components/common/GlobalSearch';
import { useDispatch, useSelector } from 'react-redux';
import { createAdminUser, fetchAdminUsers, fetchUserData, toggleAdminUser, updateAdminUser } from '../../features/userSlice';
import Heading from '../../components/common/Heading';
import useExportData from '../../hooks/useExportData';
import { tableCustomStyles } from '../../components/tableCustomStyles';
import { cater_vendor_type } from '../../constants';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FaEdit } from "react-icons/fa";
import Select from 'react-select';
import { fetchAdminRoleListData } from '../../features/adminRoleSlice';
import Loader from '../../components/Loader';



const initialState = {
  username: '',
  password: '',
  phone_number: '',
  email: '',
  role_id: '',
  is_active: '1',
  country: '',
  state: '',
  city: '',
  pincode: '',
  formatted_address: ''
}



const AdminListUsers = () => {
  const { adminRoleList } = useSelector((state) => state.roleSlice)
  const dispatch = useDispatch()
  const { adminUserList, userList, isLoading } = useSelector((state) => state.users)
  const [values, setValues] = useState(initialState)
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const { exportToExcel } = useExportData()
  const [editId, setEditId] = useState(null)

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);


  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false)
    setEditId(null)
    setValues(initialState)
  };
  const handleShow = () => setShow(true);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value })
  }

  useEffect(() => {
    dispatch(fetchAdminRoleListData());
  }, [dispatch]);


  useEffect(() => {
    dispatch(fetchAdminUsers());
  }, [dispatch]);

  useEffect(() => {
    if (userList) {
      const formattedData = userList.map((user, index) => ({
        id: user.id,
        password: user.password,
        role_name: user.role_name,
        email: user.email,
        username: user.username,
        phone_number: user.phone_number,
        pincode: user.pincode,
        state: user.state,
        formatted_address: user.formatted_address,
        is_active: user.is_active,
        city: user.city,
        country: user.country,
        role_id: user.role_id,
        created_at: user.created_at
      }));
      setData(formattedData);
      setFilteredData(formattedData);
    }
  }, [userList]);

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    if (!searchValue) {
      setFilteredData(data);
      return;
    }
    const newFilteredData = data.filter((row) => {
      return (
        row?.id?.toString().toLowerCase().includes(searchValue) ||
        row?.password?.toLowerCase().includes(searchValue) ||
        row?.role_name?.toLowerCase().includes(searchValue) ||
        row?.email?.toLowerCase().includes(searchValue) ||
        row?.username?.toLowerCase().includes(searchValue) ||
        row?.phone_number?.toLowerCase().includes(searchValue) ||
        row?.pincode?.toLowerCase().includes(searchValue) ||
        row?.state?.toLowerCase().includes(searchValue) ||
        row?.formatted_address?.toLowerCase().includes(searchValue) ||
        row?.city?.toLowerCase().includes(searchValue) ||
        row?.created_at?.toLowerCase().includes(searchValue) ||
        row?.country?.toLowerCase().includes(searchValue)
      );
    });
    setFilteredData(newFilteredData);
  };



  // Prepare options from vendorNotificationList
  const receiverOptions = adminRoleList?.map((item) => ({
    value: item.role_id,
    label: item.role_name,
  }));



  const handleStatusToggle = async (item) => {
    const data = {
      ...item,
      is_active: item.is_active === '1' ? 0 : '1'
    }
    await dispatch(toggleAdminUser(data))
    // await dispatch(fetchAdminUsers());
    dispatch(fetchUserData());
  }


  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      // width: '100px'
    },
    {
      name: "Role",
      selector: (row) => row.role_name,
      sortable: true,
      // width: '150px'
    },
    {
      name: "Username",
      selector: (row) => row.username,
      sortable: true,
      // width: '150px'
    },
    {
      name: "Password",
      selector: (row) => row.password,
      sortable: true,
      // width: '150px'
    },
    {
      name: "Phone Number",
      selector: (row) => row.phone_number,
      sortable: true,
      // width: '150px'
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      // width: '150px'
    },
    // {
    //   name: "Pincode",
    //   selector: (row) => row.pincode,
    //   sortable: true,
    // },
    // {
    //   name: "State",
    //   selector: (row) => row.state,
    //   sortable: true,
    // },
    // {
    //   name: "Formatted Address",
    //   selector: (row) => row.formatted_address,
    //   sortable: true,
    // },
    // {
    //   name: "City",
    //   selector: (row) => row.city,
    //   sortable: true,
    // },
    // {
    //   name: "Country",
    //   selector: (row) => row.country,
    //   sortable: true,
    // },
    {
      name: "created_at",
      selector: row => row.created_at.slice(0, 10),
      sortable: true,
      // width: '150px'
    },
    {
      name: "Status",
      // width: '150px',
      cell: row => (
        <div className="form-check form-switch" >
          <input
            className="form-check-input"
            type="checkbox"
            id={`status-${row.id}`}
            checked={row.is_active === '1'}
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
    console.log(data, "data Edit");
    setEditId(data?.id)
    handleShow();
    setValues((prevValues) => ({
      ...prevValues,
      username: data?.username,
      password: data?.password,
      phone_number: data?.phone_number,
      email: data?.email,
      role_id: data?.role_id,
      is_active: data?.is_active,
      country: data?.country,
      state: data?.state,
      city: data?.city,
      pincode: data?.pincode,
      formatted_address: data?.formatted_address,
    }))
  }


  const onHandleSubmit = async (e) => {
    e.preventDefault();
    const {
      username,
      password,
      phone_number,
      email,
      role_id,
      is_active,
      country,
      state,
      city,
      pincode,
      formatted_address,
    } = values;

    const data = {
      username,
      password,
      phone_number,
      email,
      role_id,
      is_active,
      country,
      state,
      city,
      pincode,
      formatted_address,
      id: editId,
    }

    console.log(data, "data data data");


    if (editId === null) {
      await dispatch(createAdminUser(data))
    } else {
      await dispatch(updateAdminUser(data))
    }
    // await dispatch(fetchAdminUsers());
    dispatch(fetchUserData());
    setValues(initialState)
    handleClose()
  }


  return (
    <>
      <div className="container-fluid my-5">




        <div className="row mb-4 me-2">
          <div className="d-flex justify-content-between">
            <h1 className="header-title">
              Total Employee’s - {userList?.length}
            </h1>
            <button className='btn btn-primary fit-content' variant="primary" onClick={handleShow}>
              Add Employee
            </button>
          </div>
        </div>

        <hr />

        <div className="row mb-4 d-flex justify-content-end me-2">
          <button className='btn btn-secondary fit-content ms-2' variant="primary" onClick={() => exportToExcel(filteredData, 'users')}>
            Export
          </button>
        </div>


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
            progressPending={isLoading}
            progressComponent={<Loader />}
          />
        </div>
      </div>
      <br />



      <Modal centered show={show} onHide={handleClose}>
        <form onSubmit={onHandleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title> {editId ? 'Edit Employee' : 'Add Employee'} </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className='col-12'>
                <label for="name" className="form-label"> <b>Username</b> </label>
                <input type="text" className="form-control" placeholder="username" name="username" required onChange={handleChange} value={values.username} />
              </div>
              <div className='col-12 mt-3'>
                <label htmlFor="password" className="form-label">
                  <b>Password</b>
                </label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  name="password"
                  required
                  onChange={handleChange}
                  value={values.password}
                />
              </div>
              <div className='col-12 mt-4'>
                <label for="name" className="form-label"> <b>Phone Number</b> </label>
                <input type="tel" className="form-control" placeholder="9999999999" name="phone_number" required onChange={handleChange} value={values.phone_number} />
              </div>
              <div className='col-12 mt-4'>
                <label for="name" className="form-label"> <b>Email</b> </label>
                <input type="text" className="form-control" placeholder="email@gmail.com" name="email" required onChange={handleChange} value={values.email} />
              </div>
              <div className='col-12 mt-4'>
                <label htmlFor="receiverId" className="form-label"><b>Role</b></label>
                <Select
                  options={receiverOptions}
                  onChange={(selectedOption) =>
                    handleChange({ target: { name: 'role_id', value: selectedOption ? selectedOption.value : '' } })
                  }
                  placeholder="Role"
                  isClearable
                  isSearchable
                />
              </div>
              <div className='col-12 mt-4'>
                <label for="name" className="form-label"> <b>Country</b> </label>
                <input type="text" className="form-control" placeholder="country" name="country" required onChange={handleChange} value={values.country} />
              </div>
              <div className='col-12 mt-4'>
                <label for="name" className="form-label"> <b>State</b> </label>
                <input type="text" className="form-control" placeholder="state" name="state" required onChange={handleChange} value={values.state} />
              </div>
              <div className='col-12 mt-4'>
                <label for="name" className="form-label"> <b>City</b> </label>
                <input type="text" className="form-control" placeholder="city" name="city" required onChange={handleChange} value={values.city} />
              </div>
              <div className='col-12 mt-4'>
                <label for="name" className="form-label"> <b>Pincode</b> </label>
                <input type="text" className="form-control" placeholder="pincode" name="pincode" required onChange={handleChange} value={values.pincode} />
              </div>
              <div className='col-12 mt-4'>
                <label for="name" className="form-label"> <b>Formatted Address</b> </label>
                <input type="text" className="form-control" placeholder="formatted_address" name="formatted_address" required onChange={handleChange} value={values.formatted_address} />
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

export default AdminListUsers