import React, { useState } from 'react';
import './HeadingsSection.css';
import ContactUsCard from '../Popups/ContactUsCard';

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
 <div style={{ flex: "1", padding: "0 10px", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>

 <h2 
  className="main-headline" 
  style={{ 
    color: "#fff",
    fontSize: "clamp(28px, 8vw, 48px)",
    lineHeight: "1",
    marginBottom: "5px",
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
    margin: "5px 0",
    display: "flex",
    alignItems: "center",
    gap: "1px",
    justifyContent: "flex-start",
    fontWeight:'550'
  }}
>

<span style={{ 
    color: "#fff", 
    fontSize: 14, 
    fontFamily: "emoji"
  }}>
    Starting from 
  </span> 
  <span style={{ 
    color: "#fff", 
    fontSize: "clamp(32px, 10vw, 80px)", 
    fontFamily: "fantasy"
  }}>
    ₹
  </span> 
  599/Day
</div>

<div className="content-wrapper">
  <p className="desktop-only" style={{ 
    color: "#fff", 
    fontSize: "clamp(16px, 4vw, 20px)", 
    lineHeight: "1.3", 
    maxWidth: "100%",
    marginBottom: "25px",
    textAlign: "left"
  }}>
    Start your adventure with our premium fleet at unbeatable rates. 
    <br />
    <strong>No hidden fees, no complicated contracts</strong> - just the perfect car for your journey.
  </p>
  </div>
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
      width: "auto",
      maxWidth: "350px",
      textAlign: "left",
      alignSelf: "flex-start",
    }}
    onMouseOver={(e) => (e.target.style.boxShadow = "0 4px 12px rgba(255,255,255,0.4)")}
    onMouseOut={(e) => (e.target.style.boxShadow = "none")}
  >
    Book Your Ride Today  
  </button>
</div>

  {/* RIGHT SIDE IMAGE */}
  <div style={{ flex: "1", display: "flex", justifyContent: "center" }}>
    <img
      src="/HSImage.jpg"
      alt="Stock Visual"
      className='image-container '
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
  padding: '20px 10px 0',
  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
  borderRadius: '15px',
  margin: '30px 0'
}}>
 

  <div className="stat-card" style={{ 
    textAlign: 'center', 
    padding: '20px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '10px',
    backdropFilter: 'blur(10px)'
  }}>
    <h3 className="stat-category" style={{ color: '#ff6b35', fontSize: '14px', fontWeight: '600', margin: '0 0 10px 0' }}>3,000+</h3>
    <h4 className="stat-value" style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>Customers</h4>
    <p className="stat-description" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', margin: '0' }}>Served</p>
  </div>

  <div className="stat-card" style={{ 
    textAlign: 'center', 
    padding: '20px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '10px',
    backdropFilter: 'blur(10px)'
  }}>
    <h3 className="stat-category" style={{ color: '#ff6b35', fontSize: '14px', fontWeight: '600', margin: '0 0 10px 0' }}>6+</h3>
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
    <h4 className="stat-value" style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}> Assistance</h4>
    <p className="stat-description" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', margin: '0' }}>Always Here For You</p>
  </div>

 

  <div className="stat-card" style={{ 
    textAlign: 'center', 
    padding: '20px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '10px',
    backdropFilter: 'blur(10px)'
  }}>
    <h3 className="stat-category" style={{ color: '#ff6b35', fontSize: '14px', fontWeight: '600', margin: '0 0 10px 0' }}>100+</h3>
    <h4 className="stat-value" style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>Vehicles</h4>
    <p className="stat-description" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', margin: '0' }}> Fleet Available</p>
  </div>
</div>

   {/* Form */}
       {showForm && (
       <ContactUsCard onClose={()=> setShowForm(false)}/>
      )}
      {/* Action Buttons */}
    </section>
  );
};

export default HeadingsSection;