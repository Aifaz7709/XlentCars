import React, { useState } from 'react'

const UserData = ({onClose}) => {
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
    <div>

        <div className="modern-modal-overlay" onClick={onClose}>
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
                  onClick={onClose}
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

    </div>
  )
}

export default UserData
