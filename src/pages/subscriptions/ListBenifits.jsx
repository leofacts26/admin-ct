import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { adminUpdateSubscriptionBenifit, fetchRzrazorpayPlans } from '../../features/subscriptionSlice';
import GlobalSearch from '../../components/common/GlobalSearch';
import { tableCustomStyles } from '../../components/tableCustomStyles';
import { FaEdit } from "react-icons/fa";
import Loader from '../../components/Loader';

const initialState = {
  benifit: '',
};

const ListBenifits = () => {
  const dispatch = useDispatch();
  const { razorpayPlansList, isLoading } = useSelector((state) => state.subscription);

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
    setValues({ ...values, [name]: value });
  };

  useEffect(() => {
    dispatch(fetchRzrazorpayPlans('Caterer'));
  }, [dispatch]);

  useEffect(() => {
    if (razorpayPlansList) {
      const formattedData = [];
      razorpayPlansList.forEach((plan) => {
        Object.entries(plan.benefits).forEach(([id, benifit]) => {
          formattedData.push({
            id,
            benifit,
            planName: plan.subscriptionTypeDisplayName,
          });
        });
      });
      setData(formattedData);
      setFilteredData(formattedData);
    }
  }, [razorpayPlansList]);

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    if (!searchValue) {
      setFilteredData(data);
      return;
    }
    const newFilteredData = data.filter((row) => {
      return (
        String(row?.id).toLowerCase().includes(searchValue) ||
        (row?.benifit && String(row.benifit).toLowerCase().includes(searchValue)) ||
        (row?.planName && String(row.planName).toLowerCase().includes(searchValue))
      );
    });
    setFilteredData(newFilteredData);
  };

  const handleEdit = (benefitData) => {
    setEditId(benefitData?.id);
    handleShow();
    setValues({ benifit: benefitData?.benifit });
  };

  const onHandleSubmit = async (e) => {
    e.preventDefault();
    const { benifit } = values;
    const data = {
      id: editId,
      benefit: benifit
    }
    await dispatch(adminUpdateSubscriptionBenifit(data))
    await dispatch(fetchRzrazorpayPlans('Caterer'));
    handleClose();
  };

  const columns = [
    {
      name: "ID",
      selector: row => row.id,
      sortable: true,
    },
    {
      name: "Benefit",
      selector: row => row.benifit,
      sortable: true,
    },
    {
      name: "Plan Name",
      selector: row => row.planName,
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

  return (
    <>
      <div className="container-fluid my-5">
        <div className="row mb-4 me-2">
          <div className="d-flex justify-content-between">
            {/* <h2>Total Caterer Benefits List - {razorpayPlansList?.length} </h2> */}
            {/* <button className='btn btn-primary fit-content' variant="primary" onClick={handleShow}>
              Create Benefit
            </button> */}
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
            progressPending={isLoading}
            progressComponent={<Loader />}
          />
        </div>
      </div>

      <br />

      <Modal centered show={show} onHide={handleClose}>
        <form onSubmit={onHandleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title> {editId ? 'Edit Benefit' : 'Create Benefit'} </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className='col-12'>
                <label htmlFor="name" className="form-label"> <b>Benefit</b> </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Benefit"
                  name="benifit"
                  required
                  onChange={handleChange}
                  value={values.benifit}
                />
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
  );
};

export default ListBenifits;
