import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { LogOut, User, Settings } from "lucide-react";
import LocationModal from "../LocationModal/LocationModal";

const Navbar = ({ theme, toggleTheme, isAuthenticated, onLogout }) => {
  const [showInvestingDropdown, setShowInvestingDropdown] = useState(false);
  const [showBorrowDropdown, setShowBorrowDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const investingRef = useRef(null);
  const borrowRef = useRef(null);
  const userDropdownRef = useRef(null);
  const navbarCollapseRef = useRef(null);
  const navigate = useNavigate();

  // Show tabs always (trial restriction removed)
  const showTabs = true;

  // Get user data from localStorage
  useEffect(() => {
    const getUserData = () => {
      const user = localStorage.getItem('xlent_user');
      if (user) {
        try {
          setUserData(JSON.parse(user));
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    };
    
    getUserData();
    
    // Listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'xlent_user') {
        getUserData();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (investingRef.current && !investingRef.current.contains(event.target)) {
        setShowInvestingDropdown(false);
      }
      if (borrowRef.current && !borrowRef.current.contains(event.target)) {
        setShowBorrowDropdown(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close navbar menu on link click
  const closeMenu = () => {
    setIsMenuOpen(false);
    setShowInvestingDropdown(false);
    setShowBorrowDropdown(false);
    setShowUserDropdown(false);
    
    // Also close Bootstrap's collapse
    const navbarCollapse = navbarCollapseRef.current;
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      const toggleButton = document.querySelector('[data-bs-target="#navbarSupportedContent"]');
      if (toggleButton) {
        toggleButton.click();
      }
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Fallback logout function
      localStorage.removeItem('xlent_token');
      localStorage.removeItem('xlent_user');
      window.location.href = '/login';
    }
    closeMenu();
  };

  return (
    <>
      <nav 
        className="navbar navbar-expand-lg navbar-light fixed-top navbar-custom" 
        style={{
          backgroundColor: 'rgba(2, 40, 124, 1)',
          zIndex: 1111,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        <div className="container-fluid px-3 px-md-5">
          {/* Brand on the left corner */}
          <Link className="navbar-brand d-flex align-items-center" to="/" style={{ color: 'white' }}>
            <img src="/LogoTranWhite.png" alt="xlentcar Icon" width="60" height="50" className="d-inline-block align-text-top" />
            <span className="ms-2 fw-bolder navbar-brand-text">Xlentcar</span>
          </Link>

          <button
            className="navbar-toggler navbar-toggler-custom"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
            style={{ borderColor: 'rgba(255, 255, 255, 0.5)' }}
          >
            <span className="navbar-toggler-icon" style={{ filter: 'invert(1)' }}></span>
          </button>

          <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent" ref={navbarCollapseRef}>
            <ul className="navbar-nav align-items-center navbar-nav-custom">
              {/* Show these tabs when authenticated */}
              {showTabs && (
                <>
                  
                  <li className="nav-item dropdown" ref={borrowRef}>
                    <a 
                      className="nav-link dropdown-toggle nav-link-custom" 
                      onClick={() => setShowLocationModal(true)}

                      style={{ 
                        cursor: 'pointer',
                        color: 'white'
                      }}
                    >
                      Locations
                    </a>
                  
                  </li>

                  <li className="nav-item">
                    <Link to="/deals" onClick={closeMenu} className="nav-link nav-link-custom"  style={{ color: 'white' }}>
                      Special Deals
                    </Link>
                  </li>

                  {isAuthenticated && (
                    <li className="nav-item">
                      <Link to="/add-car" onClick={closeMenu} className="nav-link nav-link-custom"  style={{ color: 'white' }}>
                        Add Car
                      </Link>
                    </li>
                  )}

                  <li className="nav-item">
                    <Link to='/about' onClick={closeMenu} className="nav-link nav-link-custom"  style={{ color: 'white' }}>
                      About Us
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link to="/HelpCenter" onClick={closeMenu} className="nav-link nav-link-custom" style={{ color: 'white' }}>
                      HelpCenter
                    </Link>
                  </li>
                </>
              )}

              {/* User Dropdown - Shows when authenticated */}
              {isAuthenticated ? (
                <li className="nav-item dropdown ms-2" ref={userDropdownRef}>
                  <button
                    className="btn d-flex align-items-center p-2 nav-link-custom"
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    style={{
                      background: 'transparent',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '50px',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      padding: '0.5rem 1rem'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                    }}
                  >
                    <div className="rounded-circle bg-white text-primary d-flex align-items-center justify-content-center me-2" 
                         style={{ width: '28px', height: '28px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      {userData?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span>{userData?.name?.split(' ')[0] || 'User'}</span>
                    <i className={`bi bi-chevron-down ms-2 ${showUserDropdown ? 'rotate-180' : ''}`} 
                       style={{ transition: 'transform 0.3s ease' }}></i>
                  </button>
                  
                  {showUserDropdown && (
                    <div 
                      className="dropdown-menu show dropdown-menu-custom1"
                      style={{
                        position: 'absolute',
                        right: 0,
                        left: 'auto',
                        backgroundColor: 'white',
                        border: '1px solid #dee2e6',
                        borderRadius: '8px',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                        minWidth: '200px',
                        padding: '0.5rem 0'
                      }}
                    >
                      <div className="px-3 py-2 border-bottom">
                        <div className="small text-muted">Signed in as</div>
                        <div className="fw-semibold text-truncate">{userData?.name || 'user@example.com'}</div>
                      </div>
                      
                      {/* <Link to="/dashboard" className="dropdown-item dropdown-item-custom d-flex align-items-center" >
                        <i className="bi bi-speedometer2 me-2"></i>
                        Dashboard
                      </Link>
                      
                      <Link to="/profile" className="dropdown-item dropdown-item-custom d-flex align-items-center" >
                        <User size={16} className="me-2" />
                        My Profile
                      </Link>
                      
                      <Link to="/settings" className="dropdown-item dropdown-item-custom d-flex align-items-center" >
                        <Settings size={16} className="me-2" />
                        Settings
                      </Link> */}
                      
                    
                      
                      <button 
                        className="dropdown-item dropdown-item-custom d-flex align-items-center text-danger"
                        onClick={handleLogout}
                      >
                        <LogOut size={16} className="me-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </li>
              ) : (
                // Login & Register buttons - Shows when NOT authenticated
                <>
                  <li className="nav-item nav-button-item">
                    <button 
                      className="btn login-btn nav-btn-custom"
                      style={{
                        background: 'transparent',
                        color: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '25px',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                      }}
                    >
                      <Link to="/login" onClick={closeMenu} style={{ color: 'white', textDecoration: 'none' }}>
                        Login
                      </Link>
                    </button>
                  </li>

                  {/* <li className="nav-item nav-button-item">
                    <button 
                      className="btn signup-btn nav-btn-custom"
                      style={{
                        background: '#ff6b35',
                        color: 'white',
                        border: 'none',
                        borderRadius: '25px',
                        padding: '0.5rem 1.5rem',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#e55a2b';
                        e.target.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = '#ff6b35';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      <Link to="/register" onClick={closeMenu} style={{ color: 'white', textDecoration: 'none' }}>
                        Register
                      </Link>
                    </button>
                  </li> */}
             
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <LocationModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onSelectLocation={(city) => {
          console.log('Selected city:', city);
          // Save to state, localStorage, or whatever you need
        }}
      />
      {/* Add CSS for dropdown arrow animation */}
      <style jsx>{`
        .rotate-180 {
          transform: rotate(180deg);
        }
        
        .dropdown-item-custom {
          padding: 0.75rem 1.5rem !important;
          color: #333 !important;
          transition: all 0.2s ease;
        }
        
        .dropdown-item-custom:hover {
          background-color: #f8f9fa !important;
          color: #02287c !important;
        }
        
        .dropdown-item-custom.text-danger:hover {
          background-color: #fee !important;
          color: #dc3545 !important;
        }
        
        /* Responsive adjustments */
        @media (max-width: 991.98px) {
          .navbar-nav-custom {
            padding-top: 1rem;
            padding-bottom: 1rem;
          }
          
          .nav-button-item {
            margin-top: 0.5rem;
            margin-bottom: 0.5rem;
          }
          
          .dropdown-menu-custom1 {
            position: static !important;
            float: none;
            width: 100%;
            margin-top: 0.5rem;
            box-shadow: none !important;
            border: 1px solid #dee2e6 !important;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;