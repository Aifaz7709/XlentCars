import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  Car, 
  Lock, 
  Eye, 
  EyeOff,
  CheckCircle,
  Shield,
  CreditCard,
  Clock,
  Award,
  Zap,
  Headphones
} from 'lucide-react';
import './RegisterPage.css';
const RegisterPage = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phoneNumber: '',
    vehicleRegNumber: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Customer Name validation
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    } else if (formData.customerName.trim().length < 2) {
      newErrors.customerName = 'Name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone Number validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }

    // Vehicle Registration Number validation (Indian format)
    const vehicleRegRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/;
    if (!formData.vehicleRegNumber.trim()) {
      newErrors.vehicleRegNumber = 'Vehicle registration number is required';
    } else if (!vehicleRegRegex.test(formData.vehicleRegNumber.toUpperCase())) {
      newErrors.vehicleRegNumber = 'Please enter a valid Indian vehicle registration (e.g., TN07AB1234)';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and numbers';
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Terms acceptance validation
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'You must accept the terms and conditions';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
  
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
  
      (async () => {
        try {
          const apiBase = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
          const res = await fetch(`${apiBase}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              customer_name: formData.customerName,      // snake_case for Supabase
              email: formData.email,
              phone_number: formData.phoneNumber.replace(/\s/g, ''),
              vehicle_reg_number: formData.vehicleRegNumber,
              password: formData.password               // backend will hash it
            })
          });
  
          const data = await res.json();
  
          if (!res.ok) {
            // If backend returns Supabase error, show it
            throw new Error(data.error || 'Registration failed');
          }
  
          alert('Registration successful! You can now log in.');
          setFormData({
            customerName: '',
            email: '',
            phoneNumber: '',
            vehicleRegNumber: '',
            password: '',
            confirmPassword: '',
            termsAccepted: false
          });
  
        } catch (err) {
          console.error('Registration error:', err);
          alert(err.message || 'Registration error');
        } finally {
          setIsSubmitting(false);
        }
      })();
    } else {
      setErrors(validationErrors);
    }
  };
  

  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)} ${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6, 10)}`;
  };

  const formatVehicleReg = (value) => {
    return value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
  };

  const benefits = [
    {
      icon: <Award size={20} />,
      title: "Exclusive Deals",
      description: "Get member-only discounts and special offers"
    },
    {
      icon: <Zap size={20} />,
      title: "Quick Booking",
      description: "Save your details for faster reservations"
    },
    {
      icon: <Award size={20} />,
      title: "Loyalty Rewards",
      description: "Earn points with every rental"
    },
    {
      icon: <Headphones size={20} />,
      title: "Priority Support",
      description: "24/7 dedicated customer service"
    }
  ];

  const securityFeatures = [
    {
      icon: <Shield size={16} />,
      text: "Secure Registration"
    },
    {
      icon: <CreditCard size={16} />,
      text: "No Credit Card Required"
    },
    {
      icon: <Clock size={16} />,
      text: "Takes Less Than 2 Minutes"
    }
  ];

  return (
    <div className="min-vh-100 d-flex align-items-center" 
      style={{
        backgroundImage: "url('/OrginalLogo.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "rgba(255,255,255,0.90)",
        backgroundBlendMode: "overlay"
      }}
    >
      <div className="container py-5" >
        <div className="row justify-content-center">
          <div className="col-xl-8 col-lg-10">
            <div className="card border-0 shadow-lg overflow-hidden">
              <div className="row g-0">
                {/* Left Side - Form */}
                <div className="col-lg-7 p-4 p-md-5">
                  <div className="text-center mb-4">
                    <Link to="/" className="text-decoration-none">
                      <h2 className="fw-bold text-primary mb-1">XlentCar</h2>
                    </Link>
                    <p className="text-muted">Create your account</p>
                  </div>
                  
                  <form onSubmit={handleSubmit} noValidate>
                    {/* Customer Name Field */}
                    <div className="mb-3">
                      <label htmlFor="customerName" className="form-label fw-semibold">
                        <User size={16} className="me-2" />
                        Customer Name *
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <User size={18} className="text-muted" />
                        </span>
                        <input
                          type="text"
                          id="customerName"
                          name="customerName"
                          className={`form-control ${errors.customerName ? 'is-invalid' : ''}`}
                          placeholder="Enter your full name"
                          value={formData.customerName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      {errors.customerName && (
                        <div className="invalid-feedback d-block">{errors.customerName}</div>
                      )}
                    </div>

                    {/* Email Field */}
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label fw-semibold">
                        <Mail size={16} className="me-2" />
                        Email Address *
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <Mail size={18} className="text-muted" />
                        </span>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                          placeholder="example@email.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      {errors.email && (
                        <div className="invalid-feedback d-block">{errors.email}</div>
                      )}
                    </div>

                    {/* Phone Number Field */}
                    <div className="mb-3">
                      <label htmlFor="phoneNumber" className="form-label fw-semibold">
                        <Phone size={16} className="me-2" />
                        Phone Number *
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <Phone size={18} className="text-muted" />
                        </span>
                        <input
                          type="tel"
                          id="phoneNumber"
                          name="phoneNumber"
                          className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''}`}
                          placeholder="98765 43210"
                          value={formData.phoneNumber}
                          onChange={(e) => {
                            const formatted = formatPhoneNumber(e.target.value);
                            handleChange({
                              target: {
                                name: 'phoneNumber',
                                value: formatted,
                                type: 'text'
                              }
                            });
                          }}
                          maxLength="12"
                          required
                        />
                      </div>
                      {errors.phoneNumber && (
                        <div className="invalid-feedback d-block">{errors.phoneNumber}</div>
                      )}
                      <div className="form-text">
                        Enter your 10-digit mobile number
                      </div>
                    </div>

                    {/* Vehicle Registration Number Field */}
                    <div className="mb-3">
                      <label htmlFor="vehicleRegNumber" className="form-label fw-semibold">
                        <Car size={16} className="me-2" />
                        Vehicle Registration Number *
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <Car size={18} className="text-muted" />
                        </span>
                        <input
                          type="text"
                          id="vehicleRegNumber"
                          name="vehicleRegNumber"
                          className={`form-control text-uppercase ${errors.vehicleRegNumber ? 'is-invalid' : ''}`}
                          placeholder="TN07AB1234"
                          value={formData.vehicleRegNumber}
                          onChange={(e) => {
                            const formatted = formatVehicleReg(e.target.value);
                            handleChange({
                              target: {
                                name: 'vehicleRegNumber',
                                value: formatted,
                                type: 'text'
                              }
                            });
                          }}
                          maxLength="10"
                          required
                        />
                      </div>
                      {errors.vehicleRegNumber && (
                        <div className="invalid-feedback d-block">{errors.vehicleRegNumber}</div>
                      )}
                      <div className="form-text">
                        Enter your vehicle registration number (e.g., TN07AB1234)
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label fw-semibold">
                        <Lock size={16} className="me-2" />
                        Password *
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <Lock size={18} className="text-muted" />
                        </span>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="password"
                          name="password"
                          className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {errors.password && (
                        <div className="invalid-feedback d-block">{errors.password}</div>
                      )}
                      <div className="form-text">
                        Password must be at least 8 characters with uppercase, lowercase, and numbers
                      </div>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="mb-4">
                      <label htmlFor="confirmPassword" className="form-label fw-semibold">
                        <Lock size={16} className="me-2" />
                        Confirm Password *
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <Lock size={18} className="text-muted" />
                        </span>
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          id="confirmPassword"
                          name="confirmPassword"
                          className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                          placeholder="Re-enter your password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <div className="invalid-feedback d-block">{errors.confirmPassword}</div>
                      )}
                    </div>

                    {/* Terms and Conditions */}
                    {/* In RegisterPage.js, update the Terms and Conditions section */}
<div className="mb-4">
  <div className="form-check">
    <input
      className={`form-check-input ${errors.termsAccepted ? 'is-invalid' : ''}`}
      type="checkbox"
      id="termsAccepted"
      name="termsAccepted"
      checked={formData.termsAccepted}
      onChange={handleChange}
      required
    />
    <label className="form-check-label" htmlFor="termsAccepted">
      I agree to the{' '}
      <Link to="/terms" className="text-decoration-none text-primary fw-semibold">
        Terms & Conditions
      </Link>
      {' '}and{' '}
      <Link to="/privacy" className="text-decoration-none text-primary fw-semibold">
        Privacy Policy
      </Link>
    </label>
  </div>
  {errors.termsAccepted && (
    <div className="invalid-feedback d-block">{errors.termsAccepted}</div>
  )}
</div>

                    {/* Submit Button */}
                    <div className="d-grid gap-2">
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Creating Account...
                          </>
                        ) : (
                          'Create Account'
                        )}
                      </button>
                    </div>
                  </form>
                  
                  <div className="text-center mt-4">
                    <p className="text-muted mb-0">
                      Already have an account?{' '}
                      <Link to="/login" className="text-decoration-none fw-bold text-primary">
                        Sign in here
                      </Link>
                    </p>
                  </div>
                </div>
                
                {/* Right Side - Promo/Benefits */}
                <div className="col-lg-5 d-none d-lg-block" style={{
                  background: 'linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%)',
                  color: 'white',
                  padding: '3rem'
                }}>
                  <div className="h-100 d-flex flex-column justify-content-center">
                    <h3 className="fw-bold mb-4">Why Join XlentCar?</h3>
                    
                    <div className="mb-5">
                      {benefits.map((benefit, index) => (
                        <div key={index} className="mb-4 d-flex align-items-start">
                          <div className="me-3 mt-1">
                            {benefit.icon}
                          </div>
                          <div>
                            <h6 className="fw-bold mb-1">{benefit.title}</h6>
                            <p className="small opacity-90 mb-0">{benefit.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-auto">
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          <Shield size={32} className="opacity-75" />
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <p className="small mb-0 opacity-90">
                            Your information is secured with 256-bit SSL encryption
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Security Badges */}
            <div className="text-center mt-4">
              <div className="d-flex flex-wrap justify-content-center gap-4">
                {securityFeatures.map((feature, index) => (
                  <div key={index} className="text-muted small d-flex align-items-center">
                    {feature.icon}
                    <span className="ms-2">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;