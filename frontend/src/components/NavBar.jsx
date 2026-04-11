import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity } from 'lucide-react';

const NavBar = () => {
  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        <Activity size={28} />
        <span>LassoPredict</span>
      </NavLink>
      <div className="navbar-links">
        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Home</NavLink>
        <NavLink to="/learn" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Learn</NavLink>
        <NavLink to="/download" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Download</NavLink>
        <NavLink to="/predict" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Prediction</NavLink>
        <NavLink to="/developed-by" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Developed by</NavLink>
      </div>
    </nav>
  );
};

export default NavBar;
