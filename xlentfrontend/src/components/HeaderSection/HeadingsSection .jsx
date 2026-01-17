import React, { useState } from 'react';
import './HeadingsSection.css';

const HeadingsSection = () => {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
   const [formData, setFormData] = useState({
      name: "",
      phone: "",
      phone_no: "",
      email:'' 
    });

   const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setFormData({ name: "", phone: "" });
    setShowForm(false);
    
    // Show success notification
    showNotification("Thank you! We'll contact you soon.");
  };




    const showNotification = (message) => {
    const notification = document.createElement('div');
    notification.className = 'notification-toast show';
    notification.innerHTML = `
      <div class="notification-content">
        <div class="notification-icon">✓</div>
        <div class="notification-text">${message}</div>
      </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  };

  return (
    <section className="headings-container">
      
      <header className="main-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "50px", flexWrap: "wrap" }}>

  {/* LEFT SIDE TEXT */}
 <div style={{ flex: "1", padding: "0 15px" }}>

 <h2 
  className="main-headline" 
  style={{ 
    color: "#fff",
    fontSize: "clamp(28px, 8vw, 48px)",
    lineHeight: "1.2",
    marginBottom: "20px",
    fontWeight: "700",
    textAlign: "left"
  }}
>
  Your Journey, Your Way.
</h2>

<div 
  style={{ 
    color: "#fff", 
    fontSize: "clamp(40px, 12vw, 100px)",
    fontFamily: "fantasy", 
    margin: "10px 0",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    justifyContent: "flex-start"
  }}
>
  <span style={{ 
    color: "#fff", 
    fontSize: "clamp(30px, 10vw, 80px)", 
    fontFamily: "fantasy"
  }}>
    ₹
  </span> 
  500/Day
</div>

<p style={{ 
  color: "#fff", 
  fontSize: "clamp(16px, 4vw, 20px)", 
  lineHeight: "1.6", 
  maxWidth: "100%",
  marginBottom: "25px",
  textAlign: "left"
}}>
  Start your adventure with our premium fleet at unbeatable rates. 
  <br />
  <strong>No hidden fees, no complicated contracts</strong> - just the perfect car for your journey.
</p>
  <button
    onClick={() => setShowForm(true)} 
    style={{
      backgroundColor: "#1949b1ff",
      color: "#ffffffff",
      border: "1px solid #023AAF",
      padding: "clamp(12px, 4vw, 14px) clamp(20px, 6vw, 32px)",
      borderRadius: "8px",
      fontWeight: "600",
      fontSize: "clamp(16px, 4vw, 18px)",
      cursor: "pointer",
      transition: "0.3s",
      marginTop: "20px",
      display: "inline-block",
      width: "100%",
      maxWidth: "350px"
    }}
    onMouseOver={(e) => (e.target.style.boxShadow = "0 4px 12px rgba(255,255,255,0.4)")}
    onMouseOut={(e) => (e.target.style.boxShadow = "none")}
  >
    Book Your Car Now
  </button>
</div>

  {/* RIGHT SIDE IMAGE */}
  <div style={{ flex: "1", display: "flex", justifyContent: "center" }}>
    <img
      src="/HSImage.jpg"
      alt="Stock Visual"
      style={{
        width: "60%",
        borderRadius: "14px",
        boxShadow: "0 12px 28px rgba(0, 0, 0, 0.35)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
      onMouseOver={(e) => {
        e.target.style.transform = "translateY(-8px)";
        e.target.style.boxShadow = "0 18px 36px rgba(0, 0, 0, 0.5)";
      }}
      onMouseOut={(e) => {
        e.target.style.transform = "translateY(0)";
        e.target.style.boxShadow = "0 12px 28px rgba(0, 0, 0, 0.35)";
      }}
    />
  </div>

</header>


      {/* Stats Section */}
      {/* Add this to your component */}
<div className="stats-section" style={{ 
  display: 'grid', 
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
  gap: '20px', 
  padding: '40px 0',
  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
  borderRadius: '15px',
  margin: '40px 0'
}}>
 

  <div className="stat-card" style={{ 
    textAlign: 'center', 
    padding: '20px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '10px',
    backdropFilter: 'blur(10px)'
  }}>
    <h3 className="stat-category" style={{ color: '#ff6b35', fontSize: '14px', fontWeight: '600', margin: '0 0 10px 0' }}>50,000+</h3>
    <h4 className="stat-value" style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>Happy Customers</h4>
    <p className="stat-description" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', margin: '0' }}>Served This Year</p>
  </div>

  <div className="stat-card" style={{ 
    textAlign: 'center', 
    padding: '20px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '10px',
    backdropFilter: 'blur(10px)'
  }}>
    <h3 className="stat-category" style={{ color: '#ff6b35', fontSize: '14px', fontWeight: '600', margin: '0 0 10px 0' }}>200+</h3>
    <h4 className="stat-value" style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>Locations</h4>
    <p className="stat-description" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', margin: '0' }}>Nationwide Coverage</p>
  </div>

  <div className="stat-card" style={{ 
    textAlign: 'center', 
    padding: '20px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '10px',
    backdropFilter: 'blur(10px)'
  }}>
    <h3 className="stat-category" style={{ color: '#ff6b35', fontSize: '14px', fontWeight: '600', margin: '0 0 10px 0' }}>24/7</h3>
    <h4 className="stat-value" style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>Roadside Assistance</h4>
    <p className="stat-description" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', margin: '0' }}>Always Here For You</p>
  </div>

  <div className="stat-card" style={{ 
    textAlign: 'center', 
    padding: '20px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '10px',
    backdropFilter: 'blur(10px)'
  }}>
    <h3 className="stat-category" style={{ color: '#ff6b35', fontSize: '14px', fontWeight: '600', margin: '0 0 10px 0' }}>4.8/5</h3>
    <h4 className="stat-value" style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>Customer Rating</h4>
    <p className="stat-description" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', margin: '0' }}>Based on 10,000+ Reviews</p>
  </div>

  <div className="stat-card" style={{ 
    textAlign: 'center', 
    padding: '20px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '10px',
    backdropFilter: 'blur(10px)'
  }}>
    <h3 className="stat-category" style={{ color: '#ff6b35', fontSize: '14px', fontWeight: '600', margin: '0 0 10px 0' }}>500+</h3>
    <h4 className="stat-value" style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>Vehicles</h4>
    <p className="stat-description" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', margin: '0' }}>Modern Fleet Available</p>
  </div>
</div>

   {/* Form */}
       {showForm && (
        <div className="modern-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modern-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modern-modal-content">
              {/* Animated Background */}
              <div className="modal-bg-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
              </div>
              
              {/* Header */}
              <div className="modal-header">
              
                <h2 className="modal-title">Get started with XLent</h2>
             
                <button 
                  className="modal-close-btn"
                  onClick={() => setShowForm(false)}
                >
                  <span style={{paddingBottom: '5px'}}>×</span>
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="modern-form">
                <div className="form-group floating-group">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="floating-input"
                    placeholder=" "
                  />
                  <label htmlFor="name" className="floating-label">Your Name</label>
                  <div className="input-underline"></div>
                </div>

   <div className="form-group floating-group">
                  <input
                    type="tel"
                    id="phone_no"
                    name="phone_no"
                    value={formData.phone_no}
                    onChange={handleInputChange}
                    required
                    className="floating-input"
                    placeholder=" "
                  />
                  <label htmlFor="phone_no" className="floating-label">Your phone_no</label>
                  <div className="input-underline"></div>
                </div>

    <div className="form-group floating-group">
                  <input
                    type="text"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="floating-input"
                    placeholder=" "
                  />
                  <label htmlFor="email" className="floating-label">Email</label>
                  <div className="input-underline"></div>
                </div>

              <div>

</div>

                <button 
                  type="submit" 
                  className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <span>Get Started Now</span>
                      <svg className="btn-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 1L14.5 8L8 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14.5 8H1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </>
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="modal-footer">
                <div className="security-badge">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 1L14.5 4V7C14.5 10.5 12 13.5 8 15C4 13.5 1.5 10.5 1.5 7V4L8 1Z" fill="currentColor"/>
                  </svg>
                  <span>Your information is secure and encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Action Buttons */}
    </section>
  );
};

export default HeadingsSection;