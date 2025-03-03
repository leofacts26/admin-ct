import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import GlobalSearch from '../../components/common/GlobalSearch';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminUsers, fetchUserData } from '../../features/userSlice';
import Heading from '../../components/common/Heading';
import useExportData from '../../hooks/useExportData';
import { tableCustomStyles } from '../../components/tableCustomStyles';
import Loader from '../../components/Loader';



const Users = () => {
  const dispatch = useDispatch()
  const { userList, adminUserList, isLoading } = useSelector((state) => state.users)
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const { exportToExcel } = useExportData()

  useEffect(() => {
    // dispatch(fetchUserData());
    dispatch(fetchAdminUsers());
  }, [dispatch]);



  useEffect(() => {
    if (adminUserList) {
      const formattedData = adminUserList.map((user, index) => ({
        sNO: index + 1,
        name: user.username,
        role: user.role_name,
        phoneNo: user.phone_number,
        DateTime: new Date(user.created_at).toLocaleDateString(),
        EmailID: user.email,
      }));
      setData(formattedData);
      setFilteredData(formattedData);
    }
  }, [adminUserList]);

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    if (!searchValue) {
      setFilteredData(data);
      return;
    }
    const newFilteredData = data.filter((row) => {
      return (
        row?.sNO?.toString().toLowerCase().includes(searchValue) ||
        row?.name?.toLowerCase().includes(searchValue) ||
        // row?.role?.toLowerCase().includes(searchValue) ||
        row?.phoneNo?.toLowerCase().includes(searchValue) ||
        row?.DateTime?.toLowerCase().includes(searchValue)
        // row?.EmailID?.toLowerCase().includes(searchValue)
      );
    });
    setFilteredData(newFilteredData);
  };


  const columns = [
    {
      name: "S.NO",
      selector: (row) => row.sNO,
      sortable: true,
    },
    {
      name: "Username",
      selector: (row) => row.name,
      sortable: true,
    },
    // {
    //   name: "Role",
    //   selector: (row) => row.role,
    //   sortable: true,
    // },
    {
      name: "Phone No",
      selector: (row) => row.phoneNo,
      sortable: true,
    },
    {
      name: "Date Created",
      selector: (row) => row.DateTime,
      sortable: true,
    },
    // {
    //   name: "Email ID",
    //   selector: (row) => row.EmailID,
    //   sortable: true,
    // }
  ];


  return (
    <>
      <div className="container-fluid my-5">

        <div className="row mb-4  me-2">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="header-title">
              Total Registered Users  - {adminUserList?.length}
            </h1>
            <button className='btn btn-secondary fit-content ms-2' variant="primary" onClick={() => exportToExcel(filteredData, 'users')}>
              Export
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
            progressPending={isLoading}
            progressComponent={<Loader />}
          />
        </div>
      </div>
      <br />
    </>
  )
}

export default Users