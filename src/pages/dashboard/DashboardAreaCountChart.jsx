import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import GlobalSearch from '../../components/common/GlobalSearch';
import { fetchAdminDashboardAreaCount } from '../../features/dashboardSlice';
import Loader from '../../components/Loader';



const DashboardAreaCountChart = () => {
  const dispatch = useDispatch();
  const { dashboardAreaCount, isLoading } = useSelector((state) => state.dashboardSlice);


  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    dispatch(fetchAdminDashboardAreaCount());
  }, [dispatch]);

  useEffect(() => {
    if (dashboardAreaCount) {
      setData(dashboardAreaCount);
      setFilteredData(dashboardAreaCount);
    }
  }, [dashboardAreaCount]);

  // Handle search with safe access to properties
  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    if (!searchValue) {
      setFilteredData(data);
      return;
    }

    const newFilteredData = data.filter((row) =>
      (row.city?.toLowerCase() || '').includes(searchValue) ||
      (row.area?.toLowerCase() || '').includes(searchValue) ||
      (row.vendor_count?.toString().toLowerCase() || '').includes(searchValue) ||
      (row.tiffin_count?.toString().toLowerCase() || '').includes(searchValue)
    );
    setFilteredData(newFilteredData);
  };


  const getBadgeClass = (type, count) => {
    let badgeClass = "badge ";
    switch (type) {
      case "tiffin":
        badgeClass += count > 0 ? "text-bg-normal-bage" : "text-bg-normal-bage";
        break;
      case "caterer":
        badgeClass += count > 0 ? "text-bg-default-bage" : "text-bg-default-bage";
        break;
      default:
        badgeClass += "text-bg-popular-bage";
        break;
    }
    return badgeClass;
  };


  const columns = [
    {
      name: "City",
      selector: row => row.city,
      sortable: true,
    },
    {
      name: "Area",
      selector: row => row.area,
      sortable: true,
    },
    {
      name: "Caterer Count",
      cell: (row) => (
        <span className={getBadgeClass("caterer", row.vendor_count)}>
          {row.vendor_count}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Tiffin Count",
      cell: (row) => (
        <span className={getBadgeClass("tiffin", row.tiffin_count)}>
          {row.tiffin_count}
        </span>
      ),
      sortable: true,
    },
  ];

  return (
    <div className="container-fluid my-5">
      <h2 className="header-title mb-3">
        Area Based Count
      </h2>

      <div className="card">
        {/* Search Input */}
        <GlobalSearch handleSearch={handleSearch} />
        <DataTable
          columns={columns}
          data={filteredData}
          paginationRowsPerPageOptions={[50, 100, 300]}
          paginationPerPage="50"
          fixedHeader
          pagination
          progressPending={isLoading}
          progressComponent={<Loader />}
        />
      </div>
    </div>
  );
};

export default DashboardAreaCountChart;



























// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Bar } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
// import { fetchAdminDashboardAreaCount } from '../../features/dashboardSlice';

// // Register the required Chart.js components
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// const DashboardAreaCountChart = () => {
//   const { dashboardAreaCount } = useSelector((state) => state.dashboardSlice);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(fetchAdminDashboardAreaCount());
//   }, [dispatch]);

//   // Ensure the data exists before mapping
//   const cateringAreas = dashboardAreaCount?.catering_area_based_counts?.map(item => item.area || 'Unknown Area') || [];
//   const cateringCounts = dashboardAreaCount?.catering_area_based_counts?.map(item => item.subscription_count) || [];

//   const tiffinsAreas = dashboardAreaCount?.tiffins_area_based_counts?.map(item => item.area) || [];
//   const tiffinsCounts = dashboardAreaCount?.tiffins_area_based_counts?.map(item => item.subscription_count) || [];

//   // Merge the area data (ensure the areas are unique)
//   const allAreas = Array.from(new Set([...cateringAreas, ...tiffinsAreas]));

//   // Map the data for each area for both catering and tiffins
//   const cateringData = allAreas.map(area => {
//     const found = dashboardAreaCount?.catering_area_based_counts?.find(item => item.area === area);
//     return found ? parseInt(found.subscription_count) : 0;
//   });

//   const tiffinsData = allAreas.map(area => {
//     const found = dashboardAreaCount?.tiffins_area_based_counts?.find(item => item.area === area);
//     return found ? parseInt(found.subscription_count) : 0;
//   });

//   // Chart configuration
//   const chartData = {
//     labels: allAreas,
//     datasets: [
//       {
//         label: 'Catering Subscription Count',
//         data: cateringData,
//         backgroundColor: 'rgba(75, 192, 192, 0.6)',
//         borderColor: 'rgba(75, 192, 192, 1)',
//         borderWidth: 1,
//       },
//       {
//         label: 'Tiffins Subscription Count',
//         data: tiffinsData,
//         backgroundColor: 'rgba(153, 102, 255, 0.6)',
//         borderColor: 'rgba(153, 102, 255, 1)',
//         borderWidth: 1,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false, // Ensures custom height works
//     aspectRatio: 2,
//     plugins: {
//       legend: {
//         position: 'top',
//       },
//       title: {
//         display: true,
//         text: 'Subscription Count by Area',
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//       },
//     },
//   };

//   return (
//     <>
//       <div className="container-fluid">
//         {/* Your existing dashboard header */}
//       </div>

//       <div className="container-fluid">
//         <div className="row">
//           <div className="col-12">
//             <div className="card">
//               <div className="card-body" style={{ overflowX: 'auto', overflowY: 'hidden', maxHeight: '500px' }}>
//                 <div style={{ width: allAreas.length * 60 + 'px', height: '400px' }}>
//                   {allAreas.length > 0 ? (
//                     <Bar data={chartData} options={options} />
//                   ) : (
//                     <p>Loading chart...</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default DashboardAreaCountChart;
