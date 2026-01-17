import React, { useState } from "react";
import ContactUsCard from "./Popups/ContactUsCard";

const Hero = ( {onCloseContactUs} ) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
      phone_no: "",
      email:''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    showNotification("Thank you! We'll contact you within 24 hours.");
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
    <>
      <section className="w-100 overflow-hidden bg-gray-100 hero-section" id="top">
        <div className="container position-relative">
          <div
            className="col-12 col-lg-8 mt-0 h-100 position-absolute top-0 end-0 bg-cover hero-bg"
            data-aos="fade-left"
            style={{ backgroundImage: "url('/img/webp/interior10.webp')", minHeight: "100vh" }}
          />

          <div className="row">
            <div className="col-lg-7 py-vh-6 position-relative hero-copy" data-aos="fade-right">
             
              <button 
                onClick={() => setShowForm(true)} 
                className="btn btn-primary btn-xl shadow me-3 rounded-pill my-4 modern-btn"
                style={{ 
                  background: 'white',
                  color: 'rgb(0, 38, 153)',
                  border: '2px solid rgb(0, 38, 153)',
                  padding: '1rem 2rem',
                  fontSize: '1.1rem',
                  transition: 'all 0.3s ease',
                  fontWeight: '600'
                }}
              >
                <span className="btn-content">Get started</span>
                <span className="btn-arrow">→</span>
              </button>
              <a href="#services" className="btn btn-outline-dark btn-xl rounded-pill my-4">Why XLent Cars?</a>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Animated Modal */}
      {showForm && (
                      <ContactUsCard onClose={()=> setShowForm(false)}/> 
      )}
      <style jsx>{`
        /* Color Variables */
        :root {
          --primary-white: #ffffff;
          --secondary-blue: rgb(0, 38, 153);
          --secondary-blue-light: rgb(0, 82, 204);
          --secondary-blue-lighter: rgba(0, 38, 153, 0.1);
        }

        /* Modern Modal Styles */
        .modern-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.3s ease-out;
        }

        .modern-modal-container {
          background: var(--secondary-blue);
          border-radius: 20px;
          padding: 0;
          max-width: 440px;
          width: 90%;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 20px 40px rgba(0, 38, 153, 0.4);
          animation: slideUp 0.4s ease-out;
        }

        .modal-bg-shapes {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .shape {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          animation: float 6s ease-in-out infinite;
        }

        .shape-1 {
          width: 100px;
          height: 100px;
          top: -30px;
          right: -30px;
          animation-delay: 0s;
        }

        .shape-2 {
          width: 60px;
          height: 60px;
          bottom: 20px;
          left: -20px;
          animation-delay: 2s;
        }

        .shape-3 {
          width: 40px;
          height: 40px;
          top: 50%;
          right: 30px;
          animation-delay: 4s;
        }

        .modern-modal-content {
          position: relative;
          z-index: 2;
          padding: 2.5rem;
        }

        .modal-header {
          text-align: center;
          margin-bottom: 2rem;
          position: relative;
        }

        .modal-icon {
          margin-bottom: 1rem;
        }

        .icon-circle {
          width: 60px;
          height: 60px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          color: var(--secondary-blue);
          box-shadow: 0 8px 20px rgba(255, 255, 255, 0.3);
        }

        .modal-title {
          color: white;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .modal-subtitle {
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.9rem;
        }

        .modal-close-btn {
          position: absolute;
          top: -10px;
          right: -10px;
          background: white;
          border: none;
          color: var(--secondary-blue);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1.2rem;
          font-weight: 300;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .modal-close-btn:hover {
          background: var(--secondary-blue-light);
          color: white;
          transform: rotate(90deg);
        }

        /* Form Styles */
        .modern-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          position: relative;
        }

        .floating-input {
          width: 100%;
          padding: 1rem 0;
          background: transparent;
          border: none;
          border-bottom: 2px solid rgba(255, 255, 255, 0.3);
          color: white;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .floating-input:focus {
          outline: none;
          border-bottom-color: white;
        }

        .floating-input::placeholder {
          color: transparent;
        }

        .floating-label {
          position: absolute;
          top: 1rem;
          left: 0;
          color: rgba(255, 255, 255, 0.7);
          transition: all 0.3s ease;
          pointer-events: none;
          font-size: 1rem;
        }

        .floating-input:focus + .floating-label,
        .floating-input:not(:placeholder-shown) + .floating-label {
          top: -0.5rem;
          font-size: 0.8rem;
          color: white;
          font-weight: 600;
        }

        .input-underline {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: white;
          transition: width 0.3s ease;
        }

        .floating-input:focus ~ .input-underline {
          width: 100%;
        }

        .submit-btn {
          background: white;
          color: var(--secondary-blue);
          border: none;
          padding: 1rem 2rem;
          border-radius: 50px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1rem;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(255, 255, 255, 0.3);
        }

        .submit-btn:hover:not(.submitting) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 255, 255, 0.4);
          background: rgba(255, 255, 255, 0.95);
        }

        .submit-btn.submitting {
          opacity: 0.8;
          cursor: not-allowed;
          background: rgba(255, 255, 255, 0.8);
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top: 2px solid var(--secondary-blue);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .btn-arrow {
          transition: transform 0.3s ease;
          color: var(--secondary-blue);
        }

        .submit-btn:hover .btn-arrow {
          transform: translateX(3px);
        }

        /* Modal Footer */
        .modal-footer {
          margin-top: 1.5rem;
          text-align: center;
        }

        .security-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.8rem;
          background: rgba(255, 255, 255, 0.1);
          padding: 0.75rem 1rem;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        /* Button Animation */
        .modern-btn {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .modern-btn .btn-content {
          display: inline-block;
          transition: transform 0.3s ease;
        }

        .modern-btn .btn-arrow {
          display: inline-block;
          transition: transform 0.3s ease;
          margin-left: 0.5rem;
        }

        .modern-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 38, 153, 0.3);
          background: rgba(255, 255, 255, 0.95);
        }

        .modern-btn:hover .btn-content {
          transform: translateX(-5px);
        }

        .modern-btn:hover .btn-arrow {
          transform: translateX(5px);
        }

        /* Notification Toast */
        .notification-toast {
          position: fixed;
          top: 20px;
          right: 20px;
          background: white;
          color: var(--secondary-blue);
          padding: 1rem 1.5rem;
          border-radius: 10px;
          box-shadow: 0 10px 30px rgba(0, 38, 153, 0.3);
          transform: translateX(400px);
          transition: transform 0.3s ease;
          z-index: 10000;
          border: 2px solid var(--secondary-blue);
        }

        .notification-toast.show {
          transform: translateX(0);
        }

        .notification-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .notification-icon {
          font-size: 1.2rem;
          font-weight: bold;
        }

        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* White Glow Effect */
        .modern-modal-container::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1), rgba(255,255,255,0.3));
          border-radius: 22px;
          z-index: -1;
          animation: glow 3s ease-in-out infinite alternate;
        }

        @keyframes glow {
          0% {
            opacity: 0.3;
            filter: blur(15px);
          }
          100% {
            opacity: 0.6;
            filter: blur(25px);
          }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .modern-modal-container {
            width: 95%;
            margin: 1rem;
          }
          
          .modern-modal-content {
            padding: 2rem 1.5rem;
          }
          
          .modal-title {
            font-size: 1.3rem;
          }
        }
      `}</style>
    </>
  );
};

export default Hero;