import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import GlobalSearch from '../../components/common/GlobalSearch';
import { tableCustomStyles } from '../../components/tableCustomStyles';
import { FaEdit } from "react-icons/fa";
import { createAdminFeature, createAdminROle, fetchAdminListFuture, onHandledeleteFeatures, updateAdminFeature, updateAdminRole, updateToggleAdminFeatures, updateToggleAdminRolesRanges } from '../../features/adminRoleSlice';
import { MdDelete } from "react-icons/md";
import Loader from '../../components/Loader';


const initialState = {
  name: '',
  is_active: 1,
  is_menu: '',
  link: '',
  parent_id: '',
  parent_display_order: '',
  child_display_order: ''
};

const AdminListFeatures = () => {
  const dispatch = useDispatch();
  const { adminFeatureRoleList, isLoading } = useSelector((state) => state.roleSlice);
  console.log(adminFeatureRoleList, "adminFeatureRoleList adminFeatureRoleList");


  const [values, setValues] = useState(initialState);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    setEditId(null);
  };

  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value
    });
  };

  useEffect(() => {
    dispatch(fetchAdminListFuture());
  }, [dispatch]);

  useEffect(() => {
    if (adminFeatureRoleList) {
      const flattenData = [];

      adminFeatureRoleList.forEach((feature) => {
        // Parent feature
        flattenData.push({
          feature_id: feature.feature_id,
          feature_name: feature.feature_name,
          is_menu: feature.is_menu,
          link: feature.link,
          is_active: feature.is_active,
          parent: true, // Parent flag
          parent_id: feature.parent_id || "", // Parent ID if applicable
          parent_display_order: feature.parent_display_order || "",
          child_display_order: feature.child_display_order || ""
        });

        // Push child features
        if (feature.children && feature.children.length > 0) {
          feature.children.forEach((child) => {
            flattenData.push({
              feature_id: child.feature_id,
              feature_name: `-- ${child.feature_name}`, // Indent for child
              is_menu: child.is_menu,
              link: child.link,
              is_active: child.is_active,
              parent: false, // Child flag
              parent_id: feature.feature_id, // Child inherits parent feature ID
              parent_display_order: feature.parent_display_order || "",
              child_display_order: child.child_display_order || ""
            });
          });
        }
      });

      setData(flattenData);
      setFilteredData(flattenData); // Optionally filter or search
    }
  }, [adminFeatureRoleList]);


  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    if (!searchValue) {
      setFilteredData(data);
      return;
    }
    const newFilteredData = data.filter((row) =>
      String(row.feature_id).toLowerCase().includes(searchValue) ||
      String(row.is_menu).toLowerCase().includes(searchValue) ||
      String(row.link).toLowerCase().includes(searchValue) ||
      String(row.is_active).toLowerCase().includes(searchValue) ||
      String(row.parent).toLowerCase().includes(searchValue) ||
      String(row.parent_id).toLowerCase().includes(searchValue) ||
      String(row.parent_display_order).toLowerCase().includes(searchValue) ||
      String(row.child_display_order).toLowerCase().includes(searchValue) ||
      (row.feature_name && row.feature_name.toLowerCase().includes(searchValue))
    );
    setFilteredData(newFilteredData);
  };

  const handleStatusToggle = async (item) => {
    const data = {
      feature_id: item.feature_id,
      is_active: item.is_active === 1 ? 0 : 1,
    };
    await dispatch(updateToggleAdminFeatures(data));
    await dispatch(fetchAdminListFuture());
  };


  const handleDelete = async (item) => {
    console.log(item, "item");

    const data = {
      feature_id: item.feature_id,
      is_active: item.is_active === 1 ? 0 : 1,
    };
    await dispatch(onHandledeleteFeatures(data));
    await dispatch(fetchAdminListFuture());
  };


  const columns = [
    {
      name: "Feature ID",
      selector: row => row.feature_id,
      sortable: true,
    },
    {
      name: "Feature Name",
      selector: row => row.feature_name,
      sortable: true,
    },
    {
      name: "Is Menu",
      selector: row => row.is_menu ? "Yes" : "No",
      sortable: true,
    },
    {
      name: "Link",
      cell: row => (
        <a href={row.link} target="_blank" rel="noopener noreferrer">
          link
        </a>
      ),
      sortable: true,
    },
    {
      name: "Is Active",
      selector: row => row.is_active === 1 ? "Active" : "Inactive",
      sortable: true,
    },
    {
      name: "Parent/Child",
      selector: row => row.parent ? "Parent" : `Child of ${row.parent_id}`,
      sortable: true,
    },
    {
      name: "Parent ID",
      selector: row => row.parent_id || "N/A",
      sortable: true,
    },
    {
      name: "Status",
      cell: row => (
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id={`status-${row.feature_id}`}
            checked={row.is_active === 1}
            onChange={() => handleStatusToggle(row)}
          />
          {/* <label className="form-check-label" htmlFor={`status-${row.feature_id}`}>
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
          <button className="btn btn-success me-1" onClick={() => handleDelete(row)}>
            <MdDelete />
          </button>
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const handleEdit = (data) => {
    console.log(data, "data HGFG");

    setEditId(data.feature_id);
    handleShow();

    setValues({
      name: data.feature_name.replace("-- ", ""),
      is_active: data.is_active,
      is_menu: data.is_menu,
      link: data.link || "",
      parent_id: data.parent_id || "",
      parent_display_order: data.parent_display_order || "",
      child_display_order: data.child_display_order || ""
    });
  };


  const onHandleSubmit = async (e) => {
    e.preventDefault();

    // Destructure the values from the form state
    const { name, is_active, is_menu, link, parent_id, parent_display_order, child_display_order } = values;

    // Prepare the payload with all required fields
    const data = {
      feature_id: editId || null, // If editing, include feature_id; otherwise null for new creation
      name,
      is_menu: is_menu || 0,      // Default to 0 if not selected
      link: link || "",           // Default to empty string if not provided
      is_active,
      parent_id: parent_id || "",  // Include parent_id if available
      parent_display_order: parent_display_order || "",  // Parent display order
      child_display_order: child_display_order || ""     // Child display order
    };

    // Dispatch action to create or update the feature
    if (!editId) {
      await dispatch(createAdminFeature(data)); // Create new feature
    } else {
      await dispatch(updateAdminFeature(data)); // Update existing feature
    }

    // Fetch updated feature list
    await dispatch(fetchAdminListFuture());

    // Reset form and close modal
    setValues(initialState);
    handleClose();
  };


  // Conditional row styling for parent rows
  const conditionalRowStyles = [
    {
      when: row => row.parent === true,  // Applies to parent rows
      style: {
        backgroundColor: '#f0f0f0',  // Gray background for parent rows
        fontWeight: 'bold',  // Bold text
      },
    },
  ];

  return (
    <>
      <div className="container-fluid my-5">

        <div className="row mb-4  me-2">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="header-title">
              Total Admin Feature List - {adminFeatureRoleList?.length}
            </h1>
            <button className='btn btn-primary' onClick={handleShow}>
              Create Feature Role
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
            conditionalRowStyles={conditionalRowStyles}
            progressPending={isLoading}
            progressComponent={<Loader />}
          />
        </div>
      </div>

      <Modal centered show={show} onHide={handleClose}>
        <form onSubmit={onHandleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{editId ? 'Edit Feature' : 'Create Feature'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              {/* Name Input */}
              <div className='col-12'>
                <label htmlFor="name" className="form-label"><b>Name</b></label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  required
                  onChange={handleChange}
                  value={values.name}
                />
              </div>

              {/* Is Active Input */}
              <div className='col-12 mt-3'>
                <label htmlFor="is_active" className="form-label"><b>Is Active</b></label>
                <select
                  className="form-control"
                  name="is_active"
                  onChange={handleChange}
                  value={values.is_active}
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
              </div>



              {/* Link Input */}
              <div className='col-12 mt-3'>
                <label htmlFor="link" className="form-label"><b>Link / Constant</b></label>
                <input
                  type="text"
                  className="form-control"
                  name="link"
                  onChange={handleChange}
                  value={values.link}
                />
              </div>

              {/* Parent ID Input changed to Dropdown */}
              <div className='col-12 mt-3'>
                <label htmlFor="parent_id" className="form-label"><b>Parent ID</b></label>
                <select
                  className="form-control"
                  name="parent_id"
                  onChange={handleChange}
                  value={values.parent_id}
                >
                  <option value="">Select Parent</option>
                  {/* Populate the dropdown with options excluding children */}
                  {adminFeatureRoleList
                    .filter(feature => feature.parent_id === null) // Only include parent features
                    .map((feature) => (
                      <option key={feature.feature_id} value={feature.feature_id}>
                        {feature.feature_name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Is Menu Input */}
              {/* Is Menu Input */}
              <div className='col-12 mt-3'>
                <label htmlFor="is_menu" className="form-label"><b>Is Menu</b></label>
                <select
                  className="form-control"
                  name="is_menu"
                  onChange={handleChange}
                  value={values.is_menu}
                >
                  <option value="0">No</option> {/* Set "No" as the first option */}
                  <option value="1">Yes</option>
                </select>
              </div>


              {/* Show Parent Display Order and Child Display Order inputs when is_menu is "1" */}
              {values.is_menu === '1' && (
                <>
                  <div className='col-12 mt-3'>
                    <label htmlFor="parent_display_order" className="form-label"><b>Parent Display Order</b></label>
                    <input
                      type="number"
                      className="form-control"
                      name="parent_display_order"
                      onChange={handleChange}
                      value={values.parent_display_order}
                    />
                  </div>

                  {/* Child Display Order Input */}
                  <div className='col-12 mt-3'>
                    <label htmlFor="child_display_order" className="form-label"><b>Child Display Order</b></label>
                    <input
                      type="number"
                      className="form-control"
                      name="child_display_order"
                      onChange={handleChange}
                      value={values.child_display_order}
                    />
                  </div>
                </>
              )}




            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
            <Button variant="primary" type="submit">
              {isLoading ? 'Loading...' : 'Save Changes'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal >


    </>
  );
};

export default AdminListFeatures;
