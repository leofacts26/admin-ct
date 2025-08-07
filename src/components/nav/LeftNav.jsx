import React from 'react'
import { Link, NavLink } from 'react-router-dom'

const LeftNav = () => {
    return (
        <>
            <div data-bs-theme="dark">
                <nav
                    className="navbar navbar-vertical fixed-start navbar-expand-md"
                    id="sidebar"
                >
                    <div className="container-fluid">
                        {/* Toggler */}
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#sidebarCollapse"
                            aria-controls="sidebarCollapse"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon" />
                        </button>
                        {/* Brand */}
                        <a className="navbar-brand" href="./index.html">
                            <img
                                src="https://dashkit.goodthemes.co/assets/img/logo.svg"
                                className="navbar-brand-img mx-auto"
                                alt="..."
                            />
                        </a>
                        {/* User (xs) */}
                        <div className="navbar-user d-md-none">
                            {/* Dropdown */}
                            <div className="dropdown">
                                {/* Toggle */}
                                <a
                                    href="#"
                                    id="sidebarIcon"
                                    className="dropdown-toggle"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                >
                                    <div className="avatar avatar-sm avatar-online">
                                        <img
                                            src="./assets/img/avatars/profiles/avatar-1.jpg"
                                            className="avatar-img rounded-circle"
                                            alt="..."
                                        />
                                    </div>
                                </a>
                                {/* Menu */}
                                <div
                                    className="dropdown-menu dropdown-menu-end"
                                    aria-labelledby="sidebarIcon"
                                >
                                    <a href="./profile-posts.html" className="dropdown-item">
                                        Profile
                                    </a>
                                    <a href="./account-general.html" className="dropdown-item">
                                        Settings
                                    </a>
                                    <hr className="dropdown-divider" />
                                    <a href="./sign-in.html" className="dropdown-item">
                                        Logout
                                    </a>
                                </div>
                            </div>
                        </div>
                        {/* Collapse */}
                        <div className="collapse navbar-collapse" id="sidebarCollapse">
                            {/* Form */}
                            <form className="mt-4 mb-3 d-md-none">
                                <div className="input-group input-group-rounded input-group-merge input-group-reverse">
                                    <input
                                        className="form-control"
                                        type="search"
                                        placeholder="Search"
                                        aria-label="Search"
                                    />
                                    <div className="input-group-text">
                                        <span className="fe fe-search" />
                                    </div>
                                </div>
                            </form>
                            {/* Navigation */}
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <NavLink className="nav-link " to="/">
                                        <i className="fe fe-grid" /> Dashboard
                                    </NavLink>
                                </li>

                                <li className="nav-item">
                                    <a
                                        className="nav-link"
                                        href="#sidebarDashboards"
                                        data-bs-toggle="collapse"
                                        role="button"
                                        aria-expanded="true"
                                        aria-controls="sidebarDashboards"
                                    >
                                        <i className="fe fe-home" /> Home Page
                                    </a>
                                    <div className="collapse" id="sidebarDashboards">
                                        <ul className="nav nav-sm flex-column">
                                            <li className="nav-item">
                                                <NavLink to="/explore-india" className="nav-link">
                                                    Explore India
                                                </NavLink>
                                            </li>
                                            <li className="nav-item">
                                                <NavLink
                                                    to="/news-letter"
                                                    className="nav-link"
                                                >
                                                    News Letter
                                                </NavLink>
                                            </li>
                                            {/* <li className="nav-item">
                                                <NavLink to="/footer" className="nav-link">
                                                    Footer
                                                </NavLink>
                                            </li> */}
                                            <li className="nav-item">
                                                <NavLink to="/social" className="nav-link">
                                                    Social
                                                </NavLink>
                                            </li>
                                            <li className="nav-item">
                                                <NavLink to="/faq" className="nav-link">
                                                    Faq Management
                                                </NavLink>
                                            </li>
                                        </ul>
                                    </div>
                                </li>


                                <li className="nav-item">
                                    <a
                                        className="nav-link"
                                        href="#caterings"
                                        data-bs-toggle="collapse"
                                        role="button"
                                        aria-expanded="true"
                                        aria-controls="caterings"
                                    >
                                        <i className="fe fe-home" /> Caterings
                                    </a>
                                    <div className="collapse" id="caterings">
                                        <ul className="nav nav-sm flex-column">
                                            <li className="nav-item">
                                                <NavLink to="/vendor-list" className="nav-link">
                                                    Vendor List
                                                </NavLink>
                                            </li>
                                            <li className="nav-item">
                                                <NavLink to="/vendor-list-export" className="nav-link">
                                                    Vendor List Export
                                                </NavLink>
                                            </li>
                                            <li className="nav-item">
                                                <NavLink
                                                    to="/cuisines"
                                                    className="nav-link"
                                                >
                                                    Cuisines
                                                </NavLink>
                                            </li>
                                            <li className="nav-item">
                                                <NavLink to="/occasions" className="nav-link">
                                                    Occasions
                                                </NavLink>
                                            </li>
                                            <li className="nav-item">
                                                <NavLink to="/budjet-filter" className="nav-link">
                                                    Budget Filter
                                                </NavLink>
                                            </li>
                                            <li className="nav-item">
                                                <NavLink to="/food-types" className="nav-link">
                                                    Food Types
                                                </NavLink>
                                            </li>
                                        </ul>
                                    </div>
                                </li>

                                <li className="nav-item">
                                    <a
                                        className="nav-link"
                                        href="#tiffins"
                                        data-bs-toggle="collapse"
                                        role="button"
                                        aria-expanded="true"
                                        aria-controls="tiffins"
                                    >
                                        <i className="fe fe-home" /> Tiffins
                                    </a>
                                    <div className="collapse" id="tiffins">
                                        <ul className="nav nav-sm flex-column">
                                            <li className="nav-item">
                                                <NavLink to="/tiffin-vendor-list" className="nav-link">
                                                    Vendor List
                                                </NavLink>
                                            </li>
                                            <li className="nav-item">
                                                <NavLink to="/tiffin-list-export" className="nav-link">
                                                    Tiffin List Export
                                                </NavLink>
                                            </li>
                                            <li className="nav-item">
                                                <NavLink to="/meal-time" className="nav-link">
                                                    Meal Time
                                                </NavLink>
                                            </li>
                                            <li className="nav-item">
                                                <NavLink to="/kitchen-type" className="nav-link">
                                                    Kitchen Type
                                                </NavLink>
                                            </li>
                                            <li className="nav-item">
                                                <NavLink to="/tiffin-budjet" className="nav-link">
                                                    Tiffin Budget
                                                </NavLink>
                                            </li>
                                            {/* <li className="nav-item">
                                            <NavLink to="/tiffin-food-types" className="nav-link">
                                                Tiffin Food Types
                                            </NavLink>
                                        </li> */}
                                            {/* <li className="nav-item">
                                            <NavLink to="/tiffin-faq" className="nav-link">
                                                Tiffin Faq
                                            </NavLink>
                                        </li> */}
                                        </ul>
                                    </div>
                                </li>


                                <li className="nav-item">
                                    <NavLink className="nav-link " to="/users">
                                        <i className="fe fe-home" /> Users
                                    </NavLink>
                                </li>


                                {/* <li className="nav-item">
                                <a
                                    className="nav-link"
                                    href="#users"
                                    data-bs-toggle="collapse"
                                    role="button"
                                    aria-expanded="true"
                                    aria-controls="users"
                                >
                                    <i className="fe fe-home" /> users
                                </a>
                                <div className="collapse" id="users">
                                    <ul className="nav nav-sm flex-column">
                                        <li className="nav-item">
                                            <NavLink to="/users" className="nav-link">
                                                List Users
                                            </NavLink>
                                        </li>
                                    </ul>
                                </div>
                                <div className="collapse" id="users">
                                    <ul className="nav nav-sm flex-column">
                                        <li className="nav-item">
                                            <NavLink to="/admin-list-users" className="nav-link">
                                                Admin List Users
                                            </NavLink>
                                        </li>
                                    </ul>
                                </div>
                            </li> */}


                                <li className="nav-item">
                                    <a
                                        className="nav-link"
                                        href="#ManageSubs"
                                        data-bs-toggle="collapse"
                                        role="button"
                                        aria-expanded="true"
                                        aria-controls="ManageSubs"
                                    >
                                        <i className="fe fe-home" /> Subscription
                                    </a>
                                    <div className="collapse" id="ManageSubs">
                                        <ul className="nav nav-sm flex-column">
                                            <li className="nav-item">
                                                <NavLink to="/create-subscription" className="nav-link">
                                                    Local Plans
                                                </NavLink>
                                            </li>
                                            <li className="nav-item">
                                                <NavLink to="/list-benifits-caterer" className="nav-link">
                                                    list-benifits-caterer
                                                </NavLink>
                                            </li>
                                            <li className="nav-item">
                                                <NavLink to="/list-benifits-tiffin" className="nav-link">
                                                    list-benifits-tiffin
                                                </NavLink>
                                            </li>
                                            <li className="nav-item">
                                                <NavLink to="/razorpay-plans-mapper" className="nav-link">
                                                    Razorpay Plans Mapper
                                                </NavLink>
                                            </li>
                                            <li className="nav-item">
                                                <NavLink to="/subscriptions" className="nav-link">
                                                    Vendor Subscriptions
                                                </NavLink>
                                            </li>
                                            <li className="nav-item">
                                                <NavLink to="/vendor-subscription-events" className="nav-link">
                                                    Vendor Subscription Events
                                                </NavLink>
                                            </li>
                                        </ul>
                                    </div>
                                </li>

                                <li className="nav-item">
                                    <a
                                        className="nav-link"
                                        href="#discounts"
                                        data-bs-toggle="collapse"
                                        role="button"
                                        aria-expanded="true"
                                        aria-controls="discounts"
                                    >
                                        <i className="fe fe-home" /> Discounts
                                    </a>
                                    <div className="collapse" id="discounts">
                                        <ul className="nav nav-sm flex-column">
                                            <li className="nav-item">
                                                <NavLink to="/discounts" className="nav-link">
                                                    Multi Coupon Discounts
                                                </NavLink>
                                            </li>
                                            <li className="nav-item">
                                                <NavLink to="/single-vendor-discounts" className="nav-link">
                                                    Single Coupon Discounts
                                                </NavLink>
                                            </li>
                                        </ul>
                                    </div>
                                </li>


                                <li className="nav-item">
                                    <a
                                        className="nav-link"
                                        href="#ManageNotification"
                                        data-bs-toggle="collapse"
                                        role="button"
                                        aria-expanded="true"
                                        aria-controls="ManageNotification"
                                    >
                                        <i className="fe fe-home" /> Notifications
                                    </a>
                                    <div className="collapse" id="ManageNotification">
                                        <ul className="nav nav-sm flex-column">
                                            <li className="nav-item">
                                                <NavLink to="/broadcast-notifications" className="nav-link">
                                                    Broadcast Notifications
                                                </NavLink>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="collapse" id="ManageNotification">
                                        <ul className="nav nav-sm flex-column">
                                            <li className="nav-item">
                                                <NavLink to="/user-notifications" className="nav-link">
                                                    User Notifications
                                                </NavLink>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="collapse" id="ManageNotification">
                                        <ul className="nav nav-sm flex-column">
                                            <li className="nav-item">
                                                <NavLink to="/vendor-notifications" className="nav-link">
                                                    Vendor Notifications
                                                </NavLink>
                                            </li>
                                        </ul>
                                    </div>
                                </li>


                                <li className="nav-item">
                                    <a
                                        className="nav-link"
                                        href="#ManageRoles"
                                        data-bs-toggle="collapse"
                                        role="button"
                                        aria-expanded="true"
                                        aria-controls="ManageRoles"
                                    >
                                        <i className="fe fe-home" /> Customer Care
                                    </a>
                                    <div className="collapse" id="ManageRoles">
                                        <ul className="nav nav-sm flex-column">
                                            <li className="nav-item">
                                                <NavLink to="/admin-list-users" className="nav-link">
                                                    Employee Master
                                                </NavLink>
                                            </li>
                                            <li className="nav-item">
                                                <NavLink to="/admin-list-roles" className="nav-link">
                                                    Roles
                                                </NavLink>
                                            </li>
                                            <li className="nav-item">
                                                <NavLink to="/admin-list-features" className="nav-link">
                                                    Features
                                                </NavLink>
                                            </li>

                                        </ul>
                                    </div>
                                </li>



                                {/* <li className="nav-item">
                                <a
                                    className="nav-link"
                                    href="#customercare"
                                    data-bs-toggle="collapse"
                                    role="button"
                                    aria-expanded="true"
                                    aria-controls="customercare"
                                >
                                    <i className="fe fe-home" /> Customer Care
                                </a>
                                <div className="collapse" id="customercare">
                                    <ul className="nav nav-sm flex-column">
                                        <li className="nav-item">
                                            <NavLink to="/roles-access" className="nav-link">
                                                Roles Access
                                            </NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink to="/employee-master" className="nav-link">
                                                Employee Master
                                            </NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink to="/user-master" className="nav-link">
                                                User Master
                                            </NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink to="/add-new" className="nav-link">
                                                Add New
                                            </NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink to="/share-links" className="nav-link">
                                                Share Links
                                            </NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink to="/follow-ups" className="nav-link">
                                                Follow Ups
                                            </NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink to="/support-tickets" className="nav-link">
                                                Support Tickets
                                            </NavLink>
                                        </li>
                                    </ul>
                                </div>
                            </li> */}


                            </ul>
                            {/* Divider */}
                            {/* <hr className="navbar-divider my-3" /> */}

                        </div>
                    </div>
                </nav>
            </div>
        </>
    )
}

export default LeftNav