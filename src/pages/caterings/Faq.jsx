import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { createCateringFaq, fetchCatteringFaqs, updateCateringFaq, updateToggleFaq } from '../../features/catering/cateringFaq';
import { FaEdit } from "react-icons/fa";
import GlobalSearch from '../../components/common/GlobalSearch';
import { tableCustomStyles } from '../../components/tableCustomStyles';
import { cater_Faq_type } from '../../constants';
import Form from 'react-bootstrap/Form';


const vendorFaqState = {
  type: '',
  question_text: '',
  answer_text: '',
}


const Faq = () => {
  const { faqList, isLoading } = useSelector((state) => state.faq)
  const dispatch = useDispatch()
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [editId, setEditId] = useState(null)
  const [values, setValues] = useState(vendorFaqState)
  const [selectType, setSelectType] = useState("user-caterer")

  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false)
    setEditId(null)
    setValues(vendorFaqState)
  };
  const handleShow = () => setShow(true);


  const [showUser, setShowUser] = useState(false);
  const handleShowUserClose = () => setShowUser(false);
  const handleShowUserShow = () => setShowUser(true);

  const onHandleChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value })
  }


  useEffect(() => {
    dispatch(fetchCatteringFaqs(selectType))
  }, [selectType])

  // console.log(faqList, "faqListfaqListfaqListfaqList");


  useEffect(() => {
    if (faqList) {
      const formattedData = faqList?.map((item, index) => ({
        question_id: item?.question_id,
        answer_id: item?.answer_id,
        question_text: item?.question_text,
        answer_text: item?.answer_text,
        is_active: item?.is_active,
        type: item?.type
      }));
      setData(formattedData);
      setFilteredData(formattedData);
    }
  }, [faqList]);


  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    if (!searchValue) {
      setFilteredData(data);
      return;
    }
    const newFilteredData = data?.filter((row) => {
      return (
        row?.question_text?.toString().toLowerCase().includes(searchValue) ||
        row?.question_id?.toString().toLowerCase().includes(searchValue) ||
        row?.answer_text?.toLowerCase().includes(searchValue)
      );
    });
    setFilteredData(newFilteredData);
  };


  // const handleUserSearch = (e) => {
  //   const searchValue = e.target.value.toLowerCase();
  //   const newRows = rows.filter((row) => {
  //     return (
  //       row.personID.toString().toLowerCase().includes(searchValue) ||
  //       row.question.toLowerCase().includes(searchValue) ||
  //       row.answer.toLowerCase().includes(searchValue)
  //     );
  //   });
  //   setData(newRows);
  // };

  const handleStatusToggle = async (item) => {
    const data = {
      ...item,
      is_active: item.is_active === 1 ? 0 : 1
    }
    await dispatch(updateToggleFaq(data))
    await dispatch(fetchCatteringFaqs(selectType));
  }


  const columns = [
    {
      name: "S.NO",
      selector: (row) => row.question_id,
      sortable: true,
      width: '100px'
    },
    {
      name: "Question",
      selector: row => row.question_text,
      sortable: true,
      width: '250px'
    },
    {
      name: "Answer",
      selector: row => row.answer_text,
      sortable: true,
    },
    {
      name: "Type",
      selector: row => row.type,
      sortable: true,
    },
    {
      name: "Status",
      width: '120px',
      cell: row => (
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id={`status-${row.id}`}
            checked={row.is_active === 1}
            onChange={() => handleStatusToggle(row)}
          />
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
    setEditId(data?.question_id)
    handleShow()
    if (data) {
      setValues(prevValues => ({
        ...prevValues,
        question_text: data.question_text || prevValues.question_text,
        answer_text: data.answer_text || prevValues.answer_text,
        type: data.type || prevValues.type,
      }));
    }
  };



  const handleDelete = (event) => {
    console.log(event, "event");
  }

  console.log(values, "values values");

  const onHandleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...values,
      // type: 'vendor'
    }
    const updateData = {
      ...values,
      question_id: editId,
      // type: 'vendor' 
    }

    if (editId === null) {
      await dispatch(createCateringFaq(data))
    } else {
      await dispatch(updateCateringFaq(updateData))
    }
    await dispatch(fetchCatteringFaqs(selectType))
    handleClose()
  }


  return (
    <>
      <div className="container-fluid my-5">

        <div className="row mb-4 d-flex justify-content-end me-2">
          <button className='btn btn-primary fit-content ms-3' variant="primary" onClick={handleShow}>
            Create FAQ's
          </button>
          {/* <button className='btn btn-primary fit-content' variant="primary" onClick={handleShowUserShow}>
            Create User FAQ's
          </button> */}
        </div>

        <hr />

        <div className='row w-100 mb-4 d-flex justify-content-between'>
          <div style={{ width: 'fit-content' }}>
            <h1 className="header-title">
              FAQ’s Management
            </h1>
          </div>
          <div style={{ width: 'fit-content' }}>
            <Form.Select aria-label="Default select example" name="selectType"
              value={selectType} onChange={(e) => setSelectType(e.target.value)} style={{ width: '300px' }}>
              <option value="user-caterer">Customer Caterer Faq</option>
              <option value="user-tiffin">Customer Tiffin Faq</option>
              <option value="vendor-caterer">Vendor Caterer Faq</option>
              <option value="vendor-tiffin">Vendor Tiffin Faq</option>
            </Form.Select>
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
          // title="React-Data-Table-Component Tutorial."
          />
        </div>


        {/* <h4>Vendor User FAQ's</h4>
        <div className="card">
          <input
            type="search"
            className="form-control-sm border ps-3 py-3"
            placeholder="Search"
            onChange={handleUserSearch}
          />
          <DataTable
            columns={columns}
            data={data}
            fixedHeader
            pagination
            selectableRows
          // title="React-Data-Table-Component Tutorial."
          />
        </div> */}


      </div>

      <br />

      <Modal centered show={show} onHide={handleClose}>
        <form onSubmit={onHandleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title> {editId ? "Edit" : 'Create'}  FAQ's </Modal.Title>
          </Modal.Header>
          <Modal.Body>

            <label for="name" className="form-label"> {editId ? "Edit" : "Add"}  Question</label>
            <Form.Select required aria-label="Default select example" name="type" value={values.type} onChange={onHandleChange}>
              <option value="">Select an option</option>
              <option value="user-caterer">Customer Caterer Faq</option>
              <option value="user-tiffin">Customer Tiffin Faq</option>
              <option value="vendor-caterer">Vendor Caterer Faq</option>
              <option value="vendor-tiffin">Vendor Tiffin Faq</option>
            </Form.Select>


            <div className='mt-4'>
              <label for="name" className="form-label"> {editId ? "Edit" : "Add"}  Question Text</label>
              <input type="text" className="form-control" placeholder="Question Text" required
                name='question_text' value={values.question_text} onChange={onHandleChange}
              />
            </div>
            <div className='mt-4'>
              <label for="name" className="form-label">Write Answer</label>
              <textarea class="form-control" data-autosize rows="3" placeholder="Try typing something..." required
                name='answer_text' value={values.answer_text} onChange={onHandleChange}
              ></textarea>
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


      {/* 
      <Modal centered show={showUser} onHide={handleShowUserClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create User FAQ's</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <label for="name" className="form-label">Add Question</label>
            <input type="text" className="form-control" placeholder="City Name" />
          </div>
          <div className='mt-4'>
            <label for="name" className="form-label">Write Answer</label>
            <textarea class="form-control" data-autosize rows="1" placeholder="Try typing something..."></textarea>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleShowUserClose}>
            Close
          </Button>
          <Button variant="primary" type='submit'>
            Add FAQ
          </Button>
        </Modal.Footer>
      </Modal> */}
    </>
  )
}

export default Faq