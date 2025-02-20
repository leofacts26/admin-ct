import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import GlobalSearch from '../../components/common/GlobalSearch';
import { tableCustomStyles } from '../../components/tableCustomStyles';
import { FaEdit } from "react-icons/fa";
import { adminListFeaturesForRoles, createAdminROle, fetchAdminRoleListData, setListRoleName, updateAdminRole, updateToggleAdminRolesRanges } from '../../features/adminRoleSlice';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';


const initialState = {
  name: '',
  is_active: 1
}


const AdminListRoles = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { adminRoleList, isLoading } = useSelector((state) => state.roleSlice)

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
    dispatch(fetchAdminRoleListData());
  }, [dispatch]);


  useEffect(() => {
    if (adminRoleList) {
      const formattedData = adminRoleList?.map((role, index) => ({
        role_id: role?.role_id,
        role_name: role?.role_name,
        created_at: role?.created_at,
        is_active: role?.is_active
      }));
      setData(formattedData);
      setFilteredData(formattedData);
    }
  }, [adminRoleList]);


  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    if (!searchValue) {
      setFilteredData(data);
      return;
    }
    const newFilteredData = data?.filter((row) => {
      return (
        String(row?.role_id).toLowerCase().includes(searchValue) ||
        String(row?.role_id).toLowerCase().includes(searchValue) ||
        String(row?.created_at).toLowerCase().includes(searchValue) ||
        (row?.is_active && String(row.is_active).toLowerCase().includes(searchValue))
      );
    });
    setFilteredData(newFilteredData);
  };


  const handleStatusToggle = async (item) => {
    const data = {
      role_id: item.role_id,
      is_active: item.is_active === 1 ? 0 : 1
    }
    await dispatch(updateToggleAdminRolesRanges(data))
    await dispatch(fetchAdminRoleListData());
  }


  const onHandleRedirectDetails = (id) => {
    navigate(`/admin-list-roles-details/${id}`)
  }


  const columns = [
    // {
    //   name: "Role ID",
    //   selector: row => row.role_id,
    //   sortable: true,
    // },
    // {
    //   name: "role name",
    //   selector: row => row.role_name,
    //   sortable: true,
    // },
    {
      name: "role Name",
      selector: row => row.role_name,
      sortable: true,
      cell: row => (
        <Link
          to={`/admin-list-roles-details/${row?.role_id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-dark text-truncate d-inline-block"
          style={{ maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
        >
          {row.role_name}
        </Link>
      ),
    },
    // {
    //   name: "is active",
    //   selector: row => row.is_active,
    //   sortable: true,
    // },
    {
      name: "created at",
      selector: row => row.created_at.slice(0, 10),
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
      name: "Details",
      cell: (row) => (
        <>
          <Link target='_blank' className="btn btn-success me-1" to={`/admin-list-roles-details/${row?.role_id}`}
            onClick={() => dispatch(setListRoleName(row?.role_name))}>
            View
          </Link>
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
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
    setEditId(data?.role_id)
    handleShow();
    setValues((prevValues) => ({
      ...prevValues,
      role_id: data?.role_id,
      name: data?.role_name,
      is_active: data?.is_active,
    }))
  }


  // const onHandleDetailsShow = async (row) => {
  //   const { role_id } = row;
  //   await dispatch(adminListFeaturesForRoles(role_id))
  // }


  const onHandleSubmit = async (e) => {
    e.preventDefault();
    const { name, is_active } = values;
    const data = {
      name,
      is_active,
      role_id: editId
    }

    if (editId === null) {
      await dispatch(createAdminROle(data))
    } else {
      await dispatch(updateAdminRole(data))
    }
    await dispatch(fetchAdminRoleListData());
    setValues(initialState)
    handleClose()
  }


  return (
    <>
      <div className="container-fluid my-5">


        <div className="row mb-4  me-2">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="header-title">
              Total Role List - {adminRoleList?.length}
            </h1>
            <button className='btn btn-primary fit-content' variant="primary" onClick={handleShow}>
              Create Role
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
            <Modal.Title> {editId ? 'Edit Admin Role' : 'Create Admin Role'} </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className='col-12'>
                <label for="name" className="form-label"> <b>Name</b> </label>
                <input type="text" className="form-control" placeholder="Role 1" name="name" required onChange={handleChange} value={values.name} />
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

export default AdminListRoles