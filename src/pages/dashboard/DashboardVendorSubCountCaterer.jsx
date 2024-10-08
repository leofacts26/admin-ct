import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { fetchDashboardVendorSubCountCaterer } from '../../features/dashboardSlice';

// Register the required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardVendorSubCountCaterer = () => {
    const { vendorCatererSubCount } = useSelector((state) => state.dashboardSlice);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchDashboardVendorSubCountCaterer());
    }, [dispatch]);

    // Prepare data for the chart
    const labels = vendorCatererSubCount.map(item => item.subscription_type_name);
    const dataValues = vendorCatererSubCount.map(item => parseInt(item.vendor_count));

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Vendor Count',
                data: dataValues,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }
        ],
    };

    const options = {
        responsive: true,
        aspectRatio: 2,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Admin dashboard vendor subscription counts By Caterer',
            },
        },
    };

    return (
        <>
            <div className="container-fluid">
                {/* Your existing dashboard header */}
            </div>

            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <Bar data={data} options={options} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashboardVendorSubCountCaterer;
