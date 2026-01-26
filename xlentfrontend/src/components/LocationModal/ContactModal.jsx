import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Phone, Star, Car, Bike, Clock, Shield, Zap, MessageCircle, ChevronRight 
} from 'lucide-react';
import './ContactModal.css';

const ContactModal = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState(4.5);
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const features = [
    { icon: <Zap size={18} />, text: 'Instant Confirmation', color: 'bg-success bg-gradient' },
    { icon: <Shield size={18} />, text: 'Fully Insured', color: 'bg-info bg-gradient' },
    { icon: <Clock size={18} />, text: '24/7 Roadside Assistance', color: 'bg-warning bg-gradient' },
    { icon: <MessageCircle size={18} />, text: 'Multilingual Support', color: 'bg-danger bg-gradient' }
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal-backdrop show d-flex align-items-center justify-content-center p-3"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          zIndex: 9999
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="modal-content border-0 shadow-lg rounded-4 overflow-hidden"
          style={{
            maxWidth: '800px',
            width: '100%',
            backgroundColor: '#1a1a2e',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="btn btn-sm position-absolute"
            style={{
              top: '15px',
              right: '15px',
              zIndex: 10,
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: 'white'
            }}
          >
            <X size={20} />
          </motion.button>

          {/* Header */}
          <div className="p-2 p-md-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="mb-4">
              <h2 className="text-white mb-2 fw-bold">
                Need Help? Call Our<br />
                <span className="text-primary" style={{ 
                  background: 'linear-gradient(90deg, #007bff, #00b894)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Booking Experts!
                </span>
              </h2>
            </div>

            {/* Call CTA */}
            <div className="bg-primary bg-opacity-10 border border-primary border-opacity-25 rounded-3 p-4">
              <div className="row align-items-center">
                <div className="col-md-8 mb-1 mb-md-0">
                  <div className="d-flex align-items-center">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="rounded-circle p-3 me-3 bg-primary"
                      style={{ width: '60px', height: '60px' }}
                    >
                      <Phone size={24} className="text-white" />
                    </motion.div>
                    <div>
                      <p className="text-white-50 mb-1 small">Call Now for Instant Booking</p>
                      <h3 className="text-white mb-0 fw-bold">+91 86828 44516 </h3>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href="tel:+918682844516 "
                    className="btn btn-primary btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
                  >
                    <Phone size={20} />
                    Call Now
                  </motion.a>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="p-4 p-md-5">
      

      
            {/* Rating Section */}
            <div className="bg-dark bg-opacity-50 rounded-4 p-4 mb-2">
              <div className="row align-items-center">
                <div className="col-md-6 mb-2 mb-md-0">
                  <h5 className="text-white mb-2">Your Experience Matters</h5>
                  <p className="text-white-50 mb-0">Rate our service to help us improve</p>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center justify-content-md-end gap-4">
                    <div className="d-flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                          key={star}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setRating(star)}
                          className="btn p-1"
                        >
                          <Star
                            size={28}
                            className={star <= rating ? 'text-warning fill-warning' : 'text-secondary'}
                          />
                        </motion.button>
                      ))}
                    </div>
                    <div className="text-center">
                      <div className="h2 text-white mb-0">{rating.toFixed(1)}</div>
                      <div className="text-white-50 small">/ 5.0</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-top border-white border-opacity-10">
              <div className="row align-items-center">
                <div className="col-md-6 mb-3 mb-md-0">
                  <p className="text-white-50 mb-0">
                    © 2025 XLentCar. All rights reserved.
                  </p>
                </div>
                <div className="col-md-6">
                  <div className="d-flex gap-3 justify-content-md-end">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn btn-outline-light"
                      onClick={onClose}
                    >
                      Book Later
                    </motion.button>
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href="https://wa.me/8682844516"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-success"
                    >
                      WhatsApp Us
                    </motion.a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ContactModal;