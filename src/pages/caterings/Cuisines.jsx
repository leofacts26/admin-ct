import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useSelector, useDispatch } from 'react-redux'
import { addCateringParentCuisine, deleteCateringCuisine, editCateringParentCuisine, fetchCateringCuisines, updateToggleCuisine } from '../../features/catering/cateringSlice';
import { FaCloudUploadAlt } from "react-icons/fa";
import useUploadCusinePhotoos from '../../hooks/useUploadCusinePhotoos';
import GlobalSearch from '../../components/common/GlobalSearch';
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { tableCustomStyles } from '../../components/tableCustomStyles';
import { setCuisineId } from '../../features/userSlice';
import useToggle from '../../hooks/useToggle';
import { fetchexplorecitiesData, updateToggleExplorecity } from '../../features/homepage/homeSlice';
import Loader from '../../components/Loader';




const Cuisines = () => {

  const { onHandleToggleStatus, toggleStatus } = useToggle()
  const { onUploadParentCuisine } = useUploadCusinePhotoos()

  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false)
    setMainCategory("")
    setMainCategoryId(null)
  };
  const handleShow = () => {
    setShow(true)
  };
  const [mainCategory, setMainCategory] = useState("")
  const [mainCategoryId, setMainCategoryId] = useState(null)

  const dispatch = useDispatch()
  const { cuisineList, isLoading } = useSelector((state) => state.catering)
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [subCatdata, setSubCatData] = useState([]);
  const [filteredSubcatData, setFilteredSubcatData] = useState([]);

  const parentList = cuisineList?.filter((item) => item?.parent_id === null)
  const childList = cuisineList?.filter((item) => item?.parent_id !== null)
  // console.log(parentList, "parentList parentList");


  useEffect(() => {
    dispatch(fetchCateringCuisines())
  }, [])

  // const handleParentStatusToggle = async (city) => {
  // const updatedCity = {
  //   ...city,
  //   is_active: city.is_active === 1 ? 0 : 1
  // }
  // await dispatch(updateToggleExplorecity(updatedCity))
  // await dispatch(fetchexplorecitiesData());
  // }

  // const handleChildStatusToggle = async (city) => {
  // const updatedCity = {
  //   ...city,
  //   is_active: city.is_active === 1 ? 0 : 1
  // }
  // await dispatch(updateToggleExplorecity(updatedCity))
  // await dispatch(fetchexplorecitiesData());
  // }

  const handleStatusToggle = async (item) => {
    const data = {
      ...item,
      is_active: item.is_active === 1 ? 0 : 1
    }
    await dispatch(updateToggleCuisine(data))
    await dispatch(fetchCateringCuisines());
  }



  // const count = useSelector((state) => state.cuisine.value)

  useEffect(() => {
    if (cuisineList) {
      const formattedData = parentList?.map((parent, index) => ({
        id: parent?.id,
        mainCategory: parent?.name,
        image: parent?.file_name?.medium,
        is_active: parent?.is_active,
      }));
      setData(formattedData);
      setFilteredData(formattedData);
    }
  }, [cuisineList]);

  console.log(parentList, "parentList parentList");



  useEffect(() => {
    if (cuisineList) {
      const formattedData = childList?.map((child, index) => ({
        id: child?.id,
        parentID: child?.parent_id,
        mainCategory: child?.parent_name,
        subCategory: child?.name,
        image: child?.file_name?.medium,
        is_active: child?.is_active,
      }));
      setSubCatData(formattedData);
      setFilteredSubcatData(formattedData);
    }
  }, [cuisineList]);

  const [showSubCategory, setSubCategory] = useState(false);
  const [mainCategoryChild, setMainCategoryChild] = useState("")
  const [mainCategorySubChild, setMainCategorySubChild] = useState("")
  const [mainCategoryChildId, setMainCategoryChildId] = useState(null)

  console.log(mainCategoryChild, "mainCategoryChild mainCategoryChild");

  const handleImageError = (e) => {
    e.target.src = 'https://www.cateringsandtiffins.com/img/no-image.jpg'; // Provide the path to your error image here
  };

  const handleSubClose = () => {
    setSubCategory(false)
    setMainCategoryChild("")
    setMainCategorySubChild("")
    setMainCategoryChildId(null)
  };
  const handleSubShow = () => setSubCategory(true);


  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    if (!searchValue) {
      setFilteredData(data);
      return;
    }
    const newFilteredData = data.filter((row) => {
      return (
        row?.id?.toString().toLowerCase().includes(searchValue) ||
        row?.mainCategory?.toLowerCase().includes(searchValue)
      );
    });
    setFilteredData(newFilteredData);
  };


  const handleSubCategorySearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    if (!searchValue) {
      setFilteredSubcatData(subCatdata);
      return;
    }
    const newFilteredData = subCatdata?.filter((row) => {
      return (
        row?.id?.toString().toLowerCase().includes(searchValue) ||
        row?.mainCategory?.toLowerCase().includes(searchValue) ||
        row?.subCategory?.toLowerCase().includes(searchValue)
      );
    });
    setFilteredSubcatData(newFilteredData);
  };

  const columns = [
    {
      name: "ID",
      selector: row => row.id,
      sortable: true,
    },
    {
      name: "Main Category",
      selector: row => row.mainCategory,
      sortable: true,
    },
    {
      name: "Image Upload",
      cell: row => (
        row.image ? (
          <>
            <input
              accept="image/*"
              id="onUploadParentCuisine"
              multiple
              type="file"
              style={{ display: 'none' }}
              onChange={(e) => onUploadParentCuisine(e)}
            />
            <label htmlFor="onUploadParentCuisine">
              <span variant="contained" component="span" style={{ cursor: 'pointer' }}
                onClick={() => dispatch(setCuisineId(row?.id))}
              >
                <img onError={handleImageError} src={row.image} style={{ width: '30px', borderRadius: '5px' }} alt="" className="img-fluid" />
              </span>
            </label>
          </>
        ) : (
          <>
            <input
              accept="image/*"
              id="onUploadParentCuisine"
              multiple
              type="file"
              style={{ display: 'none' }}
              onChange={(e) => onUploadParentCuisine(e)}
            />
            <label htmlFor="onUploadParentCuisine">
              <span variant="contained" component="span" style={{ cursor: 'pointer' }}
                onClick={() => dispatch(setCuisineId(row?.id))}
              >
                <FaCloudUploadAlt size={30} />
              </span>
            </label>
          </>
        )
      ),
      sortable: false,
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
          <label className="form-check-label" htmlFor={`status-${row.id}`}>
            {row.is_active === 1 ? 'Active' : 'Inactive'}
          </label>
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
          {/* <button className="btn btn-danger" onClick={() => handleDelete(row.personID)}>
            <MdDeleteForever />
          </button> */}
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];


  const columnsSubCategory = [
    {
      name: "ID",
      selector: row => row.id,
      sortable: true,
    },
    {
      name: "Main Category",
      selector: row => row.mainCategory,
      sortable: true,
    },
    {
      name: "Sub Category",
      selector: row => row.subCategory,
      sortable: true,
    },
    {
      name: "Image Upload",
      cell: row => (
        row.image ? (
          <>
            <input
              accept="image/*"
              id="onUploadParentCuisine"
              multiple
              type="file"
              style={{ display: 'none' }}
              onChange={(e) => onUploadParentCuisine(e)}
            />
            <label htmlFor="onUploadParentCuisine">
              <span variant="contained" component="span" style={{ cursor: 'pointer' }}
                onClick={() => dispatch(setCuisineId(row?.id))}
              >
                <img onError={handleImageError} src={row.image} style={{ width: '30px', borderRadius: '5px' }} alt="" className="img-fluid" />
              </span>
            </label>
          </>
        ) : (
          <>
            <input
              accept="image/*"
              id="onUploadParentCuisine"
              multiple
              type="file"
              style={{ display: 'none' }}
              onChange={(e) => onUploadParentCuisine(e)}
            />
            <label htmlFor="onUploadParentCuisine">
              <span variant="contained" component="span" style={{ cursor: 'pointer' }}
                onClick={() => dispatch(setCuisineId(row?.id))}
              >
                <FaCloudUploadAlt size={30} />
              </span>
            </label>
          </>
        )
      ),
      sortable: false,
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
          <label className="form-check-label" htmlFor={`status-${row.id}`}>
            {row.is_active === 1 ? 'Active' : 'Inactive'}
          </label>
        </div>
      ),
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <>

          <button className="btn btn-success me-1" onClick={() => handleEditChild(row)}>
            <FaEdit />
          </button>
          {/* <button className="btn btn-danger" onClick={() => handleDeleteChild(row.personID)}>
            <MdDeleteForever />
          </button> */}


        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];


  // handleEditChild 
  const handleEditChild = (row) => {
    console.log(row, "row row");
    setMainCategoryChild(row?.mainCategory)
    setMainCategorySubChild(row?.subCategory)
    setMainCategoryChildId(row)
    handleSubShow()
    // handleSubClose()   
  }

  const handleDeleteChild = () => {

  }

  // console.log(mainCategoryId, "mainCategoryId mainCategoryId");

  const handleEdit = (row) => {
    setMainCategoryId(row.id)
    setMainCategory(row.mainCategory);
    handleShow()
  }
  const handleDelete = (cusineId) => {
    // console.log(cusineId, "cusineId");
    const data = {
      is_active: '',
      id: cusineId
    }
    // dispatch(deleteCateringCuisine(data)) 
  }


  const onSubmitMainCategory = async (e) => {
    e.preventDefault();
    const addData = {
      name: mainCategory,
      id: parentList.length + 1
    }
    const data = {
      name: mainCategory,
      id: mainCategoryId
    }
    if (mainCategoryId === null) {
      await dispatch(addCateringParentCuisine(addData))
    } else {
      await dispatch(editCateringParentCuisine(data))
    }
    dispatch(fetchCateringCuisines())
    handleClose()
  }

  // console.log(mainCategoryChildId, "mainCategoryChildId");

  const onSubmitMainCategoryChild = async (e) => {
    e.preventDefault();
    const addData = {
      name: mainCategorySubChild,
      parent_id: mainCategoryChild
    }

    const data = {
      name: mainCategorySubChild,
      id: mainCategoryChildId?.id,
      parent_id: mainCategoryChildId?.parentID
    }

    if (mainCategoryChildId === null) {
      await dispatch(addCateringParentCuisine(addData))
    } else {
      await dispatch(editCateringParentCuisine(data))
    }
    dispatch(fetchCateringCuisines())
    handleSubClose()
  }

  return (
    <>
      <div className="container-fluid my-5">

        <div className="row mb-4  me-2">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="header-title">
              Total Main Categories - {parentList?.length}
            </h1>
            <div>
              <button className='btn btn-primary fit-content me-2' variant="primary" onClick={handleShow}>
                Create Main Category
              </button>
              <button className='btn btn-primary fit-content me-2' variant="primary" onClick={handleSubShow}>
                Create Sub Category
              </button>
            </div>
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

        <hr />

        <h2>Total Sub Categories - {childList?.length} </h2>

        <div className="card">
          <GlobalSearch handleSearch={handleSubCategorySearch} />
          <DataTable
            columns={columnsSubCategory}
            data={filteredSubcatData}
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
        <form onSubmit={onSubmitMainCategory}>
          <Modal.Header closeButton>
            <Modal.Title> {mainCategoryId ? 'Edit Main Category' : 'Add Main Category'} </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <label for="name" className="form-label"> {mainCategoryId ? 'Edit Category' : 'Add Category'} </label>
              <input required type="text" className="form-control" placeholder="Category" value={mainCategory} onChange={(e) => setMainCategory(e.target.value)} />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type='submit' disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Save Changes'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>



      <Modal centered show={showSubCategory} onHide={handleSubClose}>
        <form onSubmit={onSubmitMainCategoryChild}>
          <Modal.Header closeButton>
            <Modal.Title> {mainCategoryChildId ? 'Edit Sub Category' : 'Add Sub Category'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* <div className='mt-3'>
              <label for="name" className="form-label">{mainCategoryChildId ? 'Edit Category' : 'Add Category'}</label>
              <input type="text" className="form-control" placeholder="Category" value={mainCategoryChild} onChange={(e) => setMainCategoryChild(e.target.value)} />
            </div> */}

            <select
              style={{ backgroundColor: `${mainCategoryChildId !== null && 'rgb(0 0 0 / 4%)'}` }}
              disabled={mainCategoryChildId !== null}
              className="form-select"
              value={mainCategoryChild}
              onChange={(e) => setMainCategoryChild(e.target.value)}
            >
              {parentList?.map((item) => {
                return (
                  <>
                    <option key={item.id} value={item.id}
                      disabled={mainCategoryChildId !== null}
                    >{item?.name}</option>
                  </>
                )
              })}
            </select>

            <div className='mt-3'>
              <label for="name" className="form-label"> {mainCategoryChildId ? 'Edit Sub Category' : 'Add Sub Category'} </label>
              <input required type="text" className="form-control" placeholder="Sub Category" value={mainCategorySubChild} onChange={(e) => setMainCategorySubChild(e.target.value)} />
            </div>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleSubClose}>
              Close
            </Button>
            <Button variant="primary" type='submit' disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Save Changes'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  )
}

export default Cuisines