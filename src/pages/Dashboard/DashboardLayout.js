
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './Dashboard.css';

const DashboardLayout = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-body">
        <aside className="sidebar">
          <ul>
            <h3>METADATA CLEANER</h3>
            <li>
              <NavLink
                to="/dashboard/cleaner/video"
                className={({ isActive }) => isActive ? 'active' : ''}>
                Video Cleaner
              </NavLink>
            </li>
            {/* <li>
              <NavLink 
                to="/dashboard/cleaner/image"
                className={({ isActive }) => isActive ? 'active' : ''}>
                Image Cleaner
              </NavLink>
            </li> */}
            <hr />
            <h3>SCRAPER</h3>
            <li>
              <NavLink
                to="/dashboard/scraper/reel"
                className={({ isActive }) => isActive ? 'active' : ''}>
                Instagram Reel
              </NavLink>
            </li>
          </ul>
        </aside>
        <main className="main-content">
          <Outlet /> {/* renders the corresponding child routes */}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
