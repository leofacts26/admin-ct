import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDashboardCount } from '../../features/dashboardSlice';
import DashboardCountChart from '../dashboard/DashboardCountChart'
import DashboardCityCount from '../dashboard/DashboardCityCount'
import DashboardAreaCountChart from '../dashboard/DashboardAreaCountChart'
import DashboardInactiveVendorChart from '../dashboard/DashboardInactiveVendorChart'
import DashboardSubscriptionChart from '../dashboard/DashboardSubscriptionChart'
import DashboardVendorSubCountCaterer from './DashboardVendorSubCountCaterer';
import DashboardVendorSubCountTiffin from './DashboardVendorSubCountTiffin';


const Dashboard = () => {

  const { dashboardCount } = useSelector((state) => state.dashboardSlice)
  // console.log(dashboardCount, "dashboardCount");


  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchDashboardCount());
  }, [dispatch]);


  return (
    <>
      <div className="container-fluid">
        <div className="header">
          <div className="container-fluid">
            <div className="header-body">
              <div className="row align-items-end">
                <div className="col">
                  <h6 className="header-pretitle">Overview</h6>
                  <h1 className="header-title">Dashboard</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <div className="row">

          <div className="container-fluid">

            <div className="row">
              <div className="col-12 col-lg-6 col-xl">
                <div className="card">
                  <div className="card-body">
                    <div className="row align-items-center gx-0">
                      <div className="col">
                        <h6 className="text-uppercase text-body-secondary mb-2">catering vendor count</h6>
                        <span className="h2 mb-0 text-center">{dashboardCount.catering_vendor_count}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              <div className="col-12 col-lg-6 col-xl">
                <div className="card">
                  <div className="card-body">
                    <div className="row align-items-center gx-0">
                      <div className="col">
                        <h6 className="text-uppercase text-body-secondary mb-2">tiffins vendor count</h6>
                        <span className="h2 mb-0 text-center">{dashboardCount.tiffins_vendor_count}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-lg-6 col-xl">
                <div className="card">
                  <div className="card-body">
                    <div className="row align-items-center gx-0">
                      <div className="col">
                        <h6 className="text-uppercase text-body-secondary mb-2">total inactive vendors</h6>
                        <span className="h2 mb-0 text-center">{dashboardCount.total_inactive_vendors}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-lg-6 col-xl">
                <div className="card">
                  <div className="card-body">
                    <div className="row align-items-center gx-0">
                      <div className="col">
                        <h6 className="text-uppercase text-body-secondary mb-2">total newsletter subs</h6>
                        <span className="h2 mb-0 text-center">{dashboardCount.total_newsletter_subs}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-lg-6 col-xl">
                <div className="card">
                  <div className="card-body">
                    <div className="row align-items-center gx-0">
                      <div className="col">
                        <h6 className="text-uppercase text-body-secondary mb-2">total registered users</h6>
                        <span className="h2 mb-0 text-center">{dashboardCount.total_registered_users}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>


      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-6">
            <DashboardCountChart />
          </div>
          <div className="col-lg-6">
            <DashboardInactiveVendorChart />
          </div>
        </div>


        <div className="row">
          <div className="col-lg-12">
            <DashboardAreaCountChart />
          </div>
          <div className="col-lg-12">
            <DashboardCityCount />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6">
            <DashboardVendorSubCountCaterer />
          </div>
          <div className="col-lg-6">
            <DashboardVendorSubCountTiffin />
          </div>
        </div>


        <div className="row">
          <div className="col-lg-12">
            <DashboardSubscriptionChart />
          </div>
        </div>

      </div>
    </>
  )
}

export default Dashboard