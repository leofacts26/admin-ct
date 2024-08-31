import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { fetchBroadcastNotificationData } from '../../features/notificationSlice';
import { useDispatch, useSelector } from 'react-redux';
import GlobalSearch from '../../components/common/GlobalSearch';
import { tableCustomStyles } from '../../components/tableCustomStyles';


const rows = [
  {
    service: "Catering",
    title: "Explore Caterers Around You",
    body: "Test",
  },
  {
    service: "Catering",
    title: "Explore Caterers Around You",
    body: "Test",
  },
  {
    service: "Catering",
    title: "Explore Caterers Around You",
    body: "",
  }
];


const rowsSubCategory = [
  {
    vendorId: 6546546,
    title: "Explore Caterers Around You",
    body: "Test",
  },
  {
    vendorId: 6546546,
    title: "Explore Caterers Around You",
    body: "Test",
  },
];

const Notifications = () => {
  // const [data, setData] = useState(rows);
  const [subCatdata, setSubCatData] = useState(rowsSubCategory);

  const dispatch = useDispatch()
  const { broadcastNotificationList, isLoading } = useSelector((state) => state.notifications)
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  console.log(broadcastNotificationList, "broadcastNotificationList broadcastNotificationList");


  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showSubCategory, setSubCategory] = useState(false);
  const handleSubClose = () => setSubCategory(false);
  const handleSubShow = () => setSubCategory(true);

  useEffect(() => {
    dispatch(fetchBroadcastNotificationData());
  }, [dispatch]);


  useEffect(() => {
    if (broadcastNotificationList) {
      const formattedData = broadcastNotificationList?.map((broadcast, index) => ({
        vendor_type: broadcast?.vendor_type,
        title: broadcast?.title,
        message: broadcast?.message,
        created_at: broadcast?.created_at,
      }));
      setData(formattedData);
      setFilteredData(formattedData);
    }
  }, [broadcastNotificationList]);


  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    if (!searchValue) {
      setFilteredData(data);
      return;
    }
    const newFilteredData = data.filter((row) => {
      return (
        row?.title?.toLowerCase().includes(searchValue),
        row?.message?.toLowerCase().includes(searchValue)
      );
    });
    setFilteredData(newFilteredData);
  };


  const handleSubCategorySearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const newRows = rows.filter((row) => {
      return (
        row.mainCategory.toLowerCase().includes(searchValue)
      );
    });
    setSubCatData(newRows);
  };

  const columns = [
    {
      name: "vendor_type",
      selector: row => row.vendor_type,
      sortable: true,
    },
    {
      name: "title",
      selector: row => row.title,
      sortable: true,
    },
    {
      name: "message",
      selector: row => row.message,
      sortable: true,
    },
    {
      name: "created_at",
      selector: row => row.created_at.slice(0, 10),
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <span className='text-primary cursor-pointer' onClick={() => alert("test")}>View </span>
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];


  const columnsSubCategory = [
    {
      name: "Vendor Id",
      selector: row => row.vendorId,
      sortable: true,
    },
    {
      name: "Title",
      selector: row => row.title,
      sortable: true,
    },
    {
      name: "Body",
      selector: row => row.body,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <span className='text-primary cursor-pointer' onClick={() => alert("test")}>View </span>
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];


  const handleEdit = (event) => {
    console.log(event, "event");
  }
  const handleDelete = (event) => {
    console.log(event, "event");
  }

  return (
    <>
      <div className="container-fluid my-5">

        <div className="row mb-4 d-flex justify-content-between me-2 ms-2">
          <button className='btn btn-primary fit-content' variant="primary" onClick={handleShow}>
            Send Broadcast Notifications
          </button>

          <button className='btn btn-primary fit-content ms-3' variant="primary" onClick={handleSubShow}>
            Send Individual Notifications
          </button>
        </div>

        <hr />

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

        <hr />

        <div className="card">
          <input
            type="search"
            className="form-control-sm border ps-3 py-3"
            placeholder="Search"
            onChange={handleSubCategorySearch}
          />
          <DataTable
            columns={columnsSubCategory}
            data={subCatdata}
            fixedHeader
            pagination
            selectableRows
          // title="React-Data-Table-Component Tutorial."
          />
        </div>
      </div>

      <br />

      <Modal centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Send Broadcast Notifications</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label for="name" className="form-label">Choose Service</label>
            <select className="form-select" data-choices>
              <option>All</option>
              <option>catering</option>
              <option>Tiffin</option>
              <option>Users</option>
            </select>
          </div>

          <div className="mb-3">
            <label for="name" className="form-label">Sub type</label>
            <select className="form-select" data-choices>
              <option>All</option>
              <option>Branded</option>
              <option>popular</option>
              <option>Basic</option>
            </select>
          </div>

          <div>
            <label for="name" className="form-label">Title</label>
            <input type="text" className="form-control" placeholder="Title" />
          </div>
          <div className='mt-3'>
            <label for="name" className="form-label">Body</label>
            <textarea class="form-control" data-autosize rows="1" placeholder="Try typing something..."></textarea>
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

      <Modal centered show={showSubCategory} onHide={handleSubClose}>
        <Modal.Header closeButton>
          <Modal.Title>Send individual Notifications</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <label for="name" className="form-label">Vendor ID</label>
            <input type="text" className="form-control" placeholder="Vendor ID" />
          </div>
          <div className='mt-4'>
            <label for="name" className="form-label">Title</label>
            <input type="text" className="form-control" placeholder="Title" />
          </div>
          <div className='mt-4'>
            <label for="name" className="form-label">Body</label>
            <input type="text" className="form-control" placeholder="Enter Something" />
          </div>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleSubClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Notifications