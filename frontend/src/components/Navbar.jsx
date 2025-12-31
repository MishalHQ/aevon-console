// Navbar component
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Don't show navbar on login page or demo showcase
  if (location.pathname === '/login' || location.pathname === '/demos') {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          AEVON Console
        </Link>
        
        {user && (
          <div className="navbar-menu">
            <Link 
              to="/" 
              className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
            >
              Dashboard
            </Link>
            <Link 
              to="/projects" 
              className={location.pathname === '/projects' ? 'nav-link active' : 'nav-link'}
            >
              Projects
            </Link>
            <div className="navbar-user">
              <span className="user-email">{user.email}</span>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;