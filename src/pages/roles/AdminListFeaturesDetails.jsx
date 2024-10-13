import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import GlobalSearch from '../../components/common/GlobalSearch';
import { tableCustomStyles } from '../../components/tableCustomStyles';
import { FaEdit } from "react-icons/fa";
import { adminAssociateFeature, adminDeleteFeatureRole, adminListFeaturesForRoles, fetchFeaturesDisassociated } from '../../features/adminRoleSlice';
import { useParams } from 'react-router-dom';



const AdminListFeaturesDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch()
  const { adminFeaturesForRolesList, adminListFeaturesDisassociated, isLoading } = useSelector((state) => state.roleSlice)

  // console.log(adminListFeaturesDisassociated, "adminListFeaturesDisassociated");

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [dataOne, setDataOne] = useState([]);
  const [filteredDataOne, setFilteredDataOne] = useState([]);

  const onHandleAssociateFeature = async (row) => {
    const { feature_id } = row;
    const role_id = id;
    const data = {
      feature_id,
      role_id
    }
    await dispatch(adminAssociateFeature(data))
    await dispatch(fetchFeaturesDisassociated(id));
    await dispatch(adminListFeaturesForRoles(id));
  }

  const onHandleAdminDIsAssociateFeatureFOrRole = async (row) => {
    const { feature_id } = row;
    const role_id = id;
    const data = {
      feature_id,
      role_id
    }
    await dispatch(adminDeleteFeatureRole(data))
    await dispatch(adminListFeaturesForRoles(id));
    await dispatch(fetchFeaturesDisassociated(id));
  }

  useEffect(() => {
    if (id) {
      dispatch(adminListFeaturesForRoles(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(fetchFeaturesDisassociated(id));
    }
  }, [id, dispatch]);


  useEffect(() => {
    if (adminFeaturesForRolesList) {
      const formattedData = adminFeaturesForRolesList?.map((role, index) => ({
        feature_id: role?.feature_id,
        feature_name: role?.feature_name,
        link: role?.link,
        role_id: role?.role_id,
        parent_name: role?.parent_name,
        child_display_order: role?.child_display_order,
        parent_display_order: role?.parent_display_order,
        created_by: role?.created_by,
        is_menu: role?.is_menu,
        updated_at: role?.updated_at,
      }));
      setData(formattedData);
      setFilteredData(formattedData);
    }
  }, [adminFeaturesForRolesList]);


  useEffect(() => {
    if (adminListFeaturesDisassociated) {
      const formattedDataOne = adminListFeaturesDisassociated?.map((role, index) => ({
        feature_id: role?.feature_id,
        feature_name: role?.feature_name,
        is_menu: role?.is_menu,
        link: role?.link,
        is_active: role?.is_active,
        created_at: role?.created_at,
        parent_id: role?.parent_id,
        parent_name: role?.parent_name,
        parent_display_order: role?.parent_display_order,
        child_display_order: role?.child_display_order,
      }));
      setDataOne(formattedDataOne);
      setFilteredDataOne(formattedDataOne);
    }
  }, [adminListFeaturesDisassociated]);


  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    if (!searchValue) {
      setFilteredData(data);
      return;
    }
    const newFilteredData = data?.filter((row) => {
      return (
        String(row?.feature_name).toLowerCase().includes(searchValue) ||
        (row?.feature_id && String(row.feature_id).toLowerCase().includes(searchValue)) ||
        (row?.link && String(row.link).toLowerCase().includes(searchValue)) ||
        (row?.role_id && String(row.role_id).toLowerCase().includes(searchValue)) ||
        (row?.child_display_order && String(row.child_display_order).toLowerCase().includes(searchValue)) ||
        (row?.parent_display_order && String(row.parent_display_order).toLowerCase().includes(searchValue)) ||
        (row?.created_by && String(row.created_by).toLowerCase().includes(searchValue)) ||
        (row?.is_menu && String(row.is_menu).toLowerCase().includes(searchValue)) ||
        (row?.parent_name && String(row.parent_name).toLowerCase().includes(searchValue))
      );
    });
    setFilteredData(newFilteredData);
  };

  const handleSearchOne = (e) => {
    const searchValue = e.target.value.toLowerCase();
    if (!searchValue) {
      setFilteredDataOne(dataOne);
      return;
    }
    const newFilteredData = dataOne?.filter((row) => {
      return (
        String(row?.feature_id).toLowerCase().includes(searchValue) ||
        (row?.feature_name && String(row.feature_name).toLowerCase().includes(searchValue)) ||
        (row?.is_menu && String(row.is_menu).toLowerCase().includes(searchValue)) ||
        (row?.link && String(row.link).toLowerCase().includes(searchValue)) ||
        (row?.is_active && String(row.is_active).toLowerCase().includes(searchValue)) ||
        (row?.created_at && String(row.created_at).toLowerCase().includes(searchValue)) ||
        (row?.parent_name && String(row.parent_name).toLowerCase().includes(searchValue)) ||
        (row?.parent_id && String(row.parent_id).toLowerCase().includes(searchValue)) ||
        (row?.parent_display_order && String(row.parent_display_order).toLowerCase().includes(searchValue)) ||
        (row?.child_display_order && String(row.child_display_order).toLowerCase().includes(searchValue))
      );
    });
    setFilteredDataOne(newFilteredData);
  };


  const columns = [
    {
      name: "feature_id",
      selector: row => row?.feature_id,
      sortable: true,
    },
    {
      name: "feature_name",
      selector: row => row?.feature_name,
      sortable: true,
    },
    {
      name: "link",
      selector: row => row?.link,
      sortable: true,
    },
    {
      name: "role id",
      selector: row => row?.role_id,
      sortable: true,
    },
    {
      name: "parent name",
      cell: (row) => (
        <>
          <span>{row?.parent_name ? row?.parent_name : '----'}</span>
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "child display order",
      selector: row => row?.child_display_order,
      sortable: true,
    },
    {
      name: "parent display order",
      selector: row => row?.parent_display_order,
      sortable: true,
    },
    {
      name: "created by",
      selector: row => row?.created_by,
      sortable: true,
    },
    {
      name: "is_menu",
      selector: row => row?.is_menu,
      sortable: true,
    },
    {
      name: "updated at",
      selector: row => row?.updated_at?.slice(0, 10),
      sortable: true,
    },
    {
      name: "Details",
      cell: (row) => (
        <>
          <button className="btn btn-success me-1" style={{ fontSize: '12px' }} onClick={() => onHandleAdminDIsAssociateFeatureFOrRole(row)}>
            DisAssociate
          </button>
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    }
  ];

  const columnsOne = [
    {
      name: "feature_id",
      selector: row => row?.feature_id,
      sortable: true,
    },
    {
      name: "feature_name",
      selector: row => row?.feature_name,
      sortable: true,
    },
    {
      name: "is_menu",
      selector: row => row?.is_menu,
      sortable: true,
    },
    {
      name: "link",
      selector: row => row?.link,
      sortable: true,
    },
    {
      name: "is_active",
      selector: row => row?.is_active,
      sortable: true,
    },

    {
      name: "parent_id",
      selector: row => row?.parent_id,
      sortable: true,
    },
    {
      name: "parent_name",
      selector: row => row?.parent_name,
      sortable: true,
    },
    {
      name: "parent_display_order",
      selector: row => row?.parent_display_order,
      sortable: true,
    },
    {
      name: "child_display_order",
      selector: row => row?.child_display_order,
      sortable: true,
    },
    {
      name: "created_at",
      selector: row => row?.created_at.slice(0, 10),
      sortable: true,
    },
    {
      name: "Details",
      cell: (row) => (
        <>
          <button className="btn btn-success me-1" style={{ fontSize: '12px' }} onClick={() => onHandleAssociateFeature(row)}>
            Associate
          </button>
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    }
  ];


  return (
    <>
      <div className="container-fluid my-5">
        <div className="row mb-4 me-2">
          <div className="d-flex justify-content-between">
            <h2>Total Admin Role List - {adminFeaturesForRolesList?.length} </h2>
          </div>
        </div>

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
          />
        </div>
      </div>
      <br />




      <div className="container-fluid my-5">
        <div className="row mb-4 me-2">
          <div className="d-flex justify-content-between">
            <h2>Total Admin DisAssociated List - {adminListFeaturesDisassociated?.length} </h2>
          </div>
        </div>

        <div className="card">
          <GlobalSearch handleSearch={handleSearchOne} />
          <DataTable
            columns={columnsOne}
            data={filteredDataOne}
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
    </>
  )
}

export default AdminListFeaturesDetails