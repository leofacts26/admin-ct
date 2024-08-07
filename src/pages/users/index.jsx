import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import GlobalSearch from '../../components/common/GlobalSearch';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserData } from '../../features/userSlice';
import Heading from '../../components/common/Heading';
import useExportData from '../../hooks/useExportData';
import { tableCustomStyles } from '../../components/tableCustomStyles';


const Users = () => {
  const dispatch = useDispatch()
  const { userList } = useSelector((state) => state.users)
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const { exportToExcel } = useExportData()

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  useEffect(() => {
    if (userList) {
      const formattedData = userList.map((user, index) => ({
        sNO: index + 1,
        name: user.username,
        role: user.role,
        phoneNo: user.phone_extension + user.phone_number,
        DateTime: new Date(user.created_at).toLocaleDateString(),
        EmailID: user.email,
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
        row?.sNO?.toString().toLowerCase().includes(searchValue) ||
        row?.name?.toLowerCase().includes(searchValue) ||
        row?.role?.toLowerCase().includes(searchValue) ||
        row?.phoneNo?.toLowerCase().includes(searchValue) ||
        row?.DateTime?.toLowerCase().includes(searchValue) ||
        row?.EmailID?.toLowerCase().includes(searchValue)
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
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Role",
      selector: (row) => row.role,
      sortable: true,
    },
    {
      name: "Phone No",
      selector: (row) => row.phoneNo,
      sortable: true,
    },
    {
      name: "Date Time",
      selector: (row) => row.DateTime,
      sortable: true,
    },
    {
      name: "Email ID",
      selector: (row) => row.EmailID,
      sortable: true,
    }
  ];


  return (
    <>
      <div className="container-fluid my-5">
        <Heading length={userList?.length} />
        <hr />

        <div className="row mb-4 d-flex justify-content-end me-2">
          <button className='btn btn-secondary fit-content ms-2' variant="primary" onClick={()=> exportToExcel(filteredData, 'users')}>
            Export
          </button>
        </div>


        <div className="card">
          {/* Search */}
          <GlobalSearch handleSearch={handleSearch} />
          <DataTable
            columns={columns}
            data={filteredData}
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

export default Users