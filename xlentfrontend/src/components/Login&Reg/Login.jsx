import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  UserPlus, 
  Shield, 
  Car,
  AlertCircle,
  CheckCircle,
  Sparkles,
  X
} from "lucide-react";
import './Login.css'

// Snackbar Component
const Snackbar = ({ message, type = "success", onClose, duration = 2000 }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [startTime] = useState(Date.now());

  React.useEffect(() => {
    const checkVisibility = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(duration - elapsed, 0);
      
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, remaining);
      
      return () => clearTimeout(timer);
    };
    
    const timer = checkVisibility();
    return () => clearTimeout(timer);
  }, [duration, onClose, startTime]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const typeStyles = {
    success: {
      bg: "linear-gradient(135deg, rgb(2, 40, 124) 0%, rgb(13, 110, 253) 100%)",
      icon: <CheckCircle className="me-2" style={{ width: '20px', height: '20px' }} />,
    },
    error: {
      bg: "linear-gradient(135deg, #dc3545 0%, #ff6b6b 100%)",
      icon: <AlertCircle className="me-2" style={{ width: '20px', height: '20px' }} />,
    }
  };

  const style = typeStyles[type] || typeStyles.success;

  return (
    <div 
      className="position-fixed z-5" 
      style={{
        top: '20px',
        right: '20px',
        minWidth: '280px',
        maxWidth: 'calc(100vw - 40px)',
        transition: 'all 0.3s ease',
        transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
        opacity: isVisible ? 1 : 0
      }}
    >
      <div 
        className="card border-0 shadow-lg overflow-hidden"
        style={{
          background: style.bg,
          borderRadius: '12px'
        }}
      >
        <div className="card-body p-3 p-md-4 text-white">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              {style.icon}
              <div style={{ fontSize: '14px' }}>
                <strong style={{ fontSize: '15px' }}>{type === "success" ? "Success!" : "Error!"}</strong>
                <p className="mb-0 mt-1" style={{ fontSize: '14px', opacity: 0.9 }}>
                  {message}
                </p>
              </div>
            </div>
            <button 
              onClick={handleClose}
              className="btn btn-link text-white p-0"
              style={{ minWidth: '24px' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>
        <div 
          className="progress" 
          style={{ 
            height: '3px', 
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: 0 
          }}
        >
          <div 
            className="progress-bar bg-white"
            style={{
              width: isVisible ? '0%' : '100%',
              transition: `width ${duration}ms linear`,
              transitionDelay: '100ms'
            }}
          />
        </div>
      </div>
    </div>
  );
};

const Login = ({ setIsAuthenticated }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState(null);
  const navigate = useNavigate();

  const showNotification = (message, type = "success") => {
    setSnackbar({ message, type });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Username or Email is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true);
      try {
        const apiBase = process.env.REACT_APP_API_BASE_URL ;

        const res = await fetch(`${apiBase}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ 
            email: formData.username,
            password: formData.password 
          })
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.message || 'Login failed. Please check your credentials.');
        }
        
        if (data.token) {
          localStorage.setItem('xlent_token', data.token);
          localStorage.setItem('xlent_refresh_token', data.refresh_token); // Store refresh token too

          localStorage.setItem('xlent_user', JSON.stringify({
            id: data.user?.id || '1',
            username: formData.username,
            name: data.user?.name || formData.username.split('@')[0],
            email: data.user?.email || formData.username,
          }));
          
          if (setIsAuthenticated) {
            setIsAuthenticated(true);
          }
          
          showNotification('Welcome to Xlentcar! Login successful.', 'success');
          
          setTimeout(() => {
            navigate('/');
          }, 2000);
        }
        
      } catch (err) {
        console.error(err);
        showNotification(err.message || 'Login failed. Please try again.', 'error');
        setErrors({ form: err.message || 'Login failed. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center position-relative overflow-hidden p-3">
      {/* Snackbar Component */}
      {snackbar && (
        <Snackbar
          message={snackbar.message}
          type={snackbar.type}
          onClose={() => setSnackbar(null)}
          duration={snackbar.type === 'error' ? 4000 : 3000}
        />
      )}

      {/* Animated Background Elements */}
      <div className="position-absolute top-0 start-0 w-100 h-100 d-none d-md-block">
        <div 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundImage: "url('/OrginalLogo.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundColor: "rgba(255,255,255,0.92)",
            backgroundBlendMode: "overlay",
            animation: 'zoomInOut 20s infinite alternate'
          }}
        />
        
        {/* Animated gradient overlay */}
        <div 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: 'linear-gradient(45deg, rgba(2, 40, 124, 0.03) 0%, rgba(255, 255, 255, 0.95) 100%)',
            animation: 'gradientShift 10s ease-in-out infinite alternate'
          }}
        />
        
        {/* Floating elements - hide on mobile */}
        <div className="position-absolute d-none d-lg-block" style={{ top: '10%', left: '5%' }}>
          <div className="floating-element" style={{ animationDelay: '0s' }}>
            <div className="bg-primary bg-opacity-10 rounded-circle p-3">
              <Car size={24} className="text-primary" />
            </div>
          </div>
        </div>
        <div className="position-absolute d-none d-lg-block" style={{ top: '70%', right: '8%' }}>
          <div className="floating-element" style={{ animationDelay: '1s' }}>
            <div className="bg-primary bg-opacity-10 rounded-circle p-3">
              <Shield size={24} className="text-primary" />
            </div>
          </div>
        </div>
        <div className="position-absolute d-none d-lg-block" style={{ bottom: '20%', left: '15%' }}>
          <div className="floating-element" style={{ animationDelay: '2s' }}>
            <div className="bg-primary bg-opacity-10 rounded-circle p-3">
              <Car size={24} className="text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Background - Simpler */}
      <div className="position-absolute top-0 start-0 w-100 h-100 d-md-none"
        style={{
          backgroundColor: "#f8f9fa",
          background: 'linear-gradient(135deg, rgba(2, 40, 124, 0.05) 0%, rgba(255, 255, 255, 1) 100%)'
        }}
      />

      {/* Main Login Card */}
      <div className="position-relative z-2 w-100" style={{ maxWidth: "480px" }}>
        <div 
          className="card border-0 shadow-lg overflow-hidden animate-slide-up"
          style={{
            width: "100%",
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.97)",
            borderRadius: "20px",
            borderTop: "5px solid rgb(2, 40, 124)"
          }}
        >
          {/* Card Header with gradient */}
          <div 
            className="text-center py-4 px-3 px-md-4"
            style={{
              background: 'linear-gradient(135deg, rgb(2, 40, 124) 0%, rgb(13, 110, 253) 100%)'
            }}
          >
            <div className="d-flex align-items-center justify-content-center mb-2">
              <div className="bg-white rounded-circle p-2 me-3 shadow-sm">
                <LogIn size={24} className="text-primary" />
              </div>
              <h2 className="text-white mb-0 fw-bold" style={{ fontSize: 'clamp(1.5rem, 5vw, 1.8rem)' }}>
                Welcome Back
              </h2>
            </div>
            <p className="text-white-50 mb-0" style={{ fontSize: 'clamp(0.9rem, 3vw, 1rem)' }}>
              Sign in to Xlentcar account
            </p>
          </div>

          {/* Card Body */}
          <div className="card-body p-3 p-md-4 p-lg-5">
            <form onSubmit={handleSubmit} noValidate>
              {/* Username/Email Field */}
              <div className="mb-4">
                <label className="form-label fw-semibold d-flex align-items-center mb-2">
                  <User size={16} className="me-2 text-primary" />
                  <span style={{ fontSize: 'clamp(0.9rem, 3vw, 1rem)' }}>
                    Username or Email
                  </span>
                </label>
                <div className="input-group input-group-lg">
                  <span className="input-group-text bg-light border-end-0">
                    <User size={18} className="text-muted" />
                  </span>
                  <input 
                    type="text"
                    name="username"
                    className={`form-control border-start-0 ${errors.username ? 'is-invalid' : ''}`}
                    placeholder="Enter username or email"
                    value={formData.username}
                    onChange={handleChange}
                    style={{ 
                      borderRadius: "10px",
                      fontSize: 'clamp(0.9rem, 3vw, 1rem)',
                      padding: '0.75rem 1rem'
                    }}
                    autoComplete="username"
                  />
                </div>
                {errors.username && (
                  <div className="invalid-feedback d-flex align-items-center mt-2">
                    <AlertCircle size={14} className="me-2" />
                    <span style={{ fontSize: '0.875rem' }}>{errors.username}</span>
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div className="mb-4">
                <label className="form-label fw-semibold d-flex align-items-center mb-2">
                  <Lock size={16} className="me-2 text-primary" />
                  <span style={{ fontSize: 'clamp(0.9rem, 3vw, 1rem)' }}>
                    Password
                  </span>
                </label>
                <div className="input-group input-group-lg">
                  <span className="input-group-text bg-light border-end-0">
                    <Lock size={18} className="text-muted" />
                  </span>
                  <input 
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className={`form-control border-start-0 ${errors.password ? 'is-invalid' : ''}`}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    style={{ 
                      borderRadius: "10px",
                      fontSize: 'clamp(0.9rem, 3vw, 1rem)',
                      padding: '0.75rem 1rem'
                    }}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary border-start-0"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    style={{ 
                      padding: '0 0.75rem',
                      fontSize: 'clamp(0.9rem, 3vw, 1rem)'
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <div className="invalid-feedback d-flex align-items-center mt-2">
                    <AlertCircle size={14} className="me-2" />
                    <span style={{ fontSize: '0.875rem' }}>{errors.password}</span>
                  </div>
                )}
              </div>

              {/* Form Error */}
              {errors.form && (
                <div className="alert alert-danger d-flex align-items-center" role="alert" style={{ fontSize: '0.875rem' }}>
                  <AlertCircle size={16} className="me-2" />
                  <div>{errors.form}</div>
                </div>
              )}

              {/* Remember Me & Forgot Password */}
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-2">
                <div className="form-check">
                  <input 
                    type="checkbox" 
                    className="form-check-input"
                    name="rememberMe"
                    id="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="rememberMe" style={{ fontSize: '0.9rem' }}>
                    Remember me
                  </label>
                </div>
                <Link 
                  to="/forgot-password" 
                  className="text-decoration-none fw-semibold"
                  style={{ 
                    color: "rgb(2, 40, 124)",
                    fontSize: '0.9rem'
                  }}
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary w-100 py-3 mb-3 d-flex align-items-center justify-content-center"
                disabled={isLoading}
                style={{
                  background: "linear-gradient(135deg, rgb(2, 40, 124) 0%, rgb(13, 110, 253) 100%)",
                  border: "none",
                  borderRadius: "12px",
                  transition: "all 0.3s ease",
                  fontSize: 'clamp(1rem, 3vw, 1.1rem)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 10px 20px rgba(13, 110, 253, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <LogIn size={20} className="me-2" />
                    <span>Sign In</span>
                  </>
                )}
              </button>

              {/* Sign Up Link */}
              <div className="text-center mt-4 pt-3 border-top">
                <p className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
                  Don't have an account?{' '}
                  <Link 
                    to="/register" 
                    className="text-decoration-none fw-bold"
                    style={{ color: "rgb(2, 40, 124)" }}
                  >
                    <UserPlus size={14} className="me-1" />
                    Sign up here
                  </Link>
                </p>
                <div className="d-flex align-items-center justify-content-center mt-2">
                  <Shield size={12} className="text-success me-2" />
                  <span className="small text-muted" style={{ fontSize: '0.8rem' }}>
                    Secure login required to access Xlentcar services
                  </span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Add responsive styles */}
      <style jsx>{`
        @keyframes zoomInOut {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.05);
          } 
        }
        
        @keyframes gradientShift {
          0% {
            opacity: 0.7;
          }
          100% {
            opacity: 0.9;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .floating-element {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-slide-up {
          animation: slideUp 0.6s ease-out;
        }
        
        .form-control:focus {
          border-color: rgb(2, 40, 124);
          box-shadow: 0 0 0 0.25rem rgba(2, 40, 124, 0.25);
        }
        
        .btn-primary {
          transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(2, 40, 124, 0.3);
        }
        
        .form-check-input:checked {
          background-color: rgb(2, 40, 124);
          border-color: rgb(2, 40, 124);
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .min-vh-100 {
            min-height: 100vh;
            padding-top: 1rem;
            padding-bottom: 1rem;
          }
          
          .input-group-lg {
            flex-wrap: nowrap;
          }
          
          .input-group-text {
            padding: 0.5rem;
          }
        }

        @media (max-width: 576px) {
          .card-body {
            padding: 1.5rem !important;
          }
          
          .btn {
            padding: 0.75rem 1rem !important;
          }
          
          .input-group-lg > .form-control,
          .input-group-lg > .input-group-text {
            padding: 0.5rem 0.75rem;
          }
        }

        @media (max-width: 375px) {
          .card {
            border-radius: 15px !important;
          }
          
          .card-body {
            padding: 1rem !important;
          }
          
          .btn {
            padding: 0.625rem 0.875rem !important;
            font-size: 0.95rem !important;
          }
        }
      `}</style>
    </div>
  );
};
  
export default Login;