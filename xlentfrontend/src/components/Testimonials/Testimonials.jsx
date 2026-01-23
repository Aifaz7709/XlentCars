import React, { useEffect, useState } from "react";
import './Testimonials.css'
import UserData from "../CustForm/UserData";
import ContactUsCard from "../Popups/ContactUsCard";

const Testimonials = () => {

  const [showForm, setShowForm] = useState(false);
  const [showPopup, setShowPopup] = useState(false);


  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  return (
<>
<>
      <button
        className="cta-btn secondary"
        onClick={() => setShowPopup(true)}
      >
        Download App
      </button>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <button
              className="popup-close"
              onClick={() => setShowPopup(false)}
            >
              ×
            </button>

            <h3>🚧 App Under Construction</h3>
            <p>We’re cooking something awesome. Coming very soon.</p>
          </div>
        </div>
      )}
    </>


    <section className="testimonials-section" id="testimonials">
      <div className="mainTestStyle">
        {/* Header Section */}
        <div className="testimonials-header">
          <div className="header-content">
            <div className="section-badge">HAPPY CUSTOMERS</div>
            <h2 className="" >
              Trusted by <span className="text-gradient">Thousands</span> of Car Owners
            </h2>
            <p className="section-description">
              Discover why car owners across India choose XLent for reliable, affordable car rental solutions
            </p>
          </div>
          
          <div className="header-stats">
            <div className="stat-item">
              <div className="stat-number">4.7/5</div>
              <div className="stat-label">Customer Rating</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">3K+</div>
              <div className="stat-label">Happy Renters</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Roadside Support</div>
            </div>
          </div>
        </div>

        {/* Featured Testimonial */}
        <div className="featured-testimonial">
          <div className="testimonial-content">
            <div className="quote-icon">❝</div>
            <blockquote className="featured-quote">
              XLent made my first car rental experience incredibly smooth! The Swift Dzire was in perfect condition, 
              and the pickup process at Pune airport took less than 10 minutes. The 24/7 support team was 
              extremely helpful throughout my 5-day trip.
            </blockquote>
            <div className="author-info">
              <img 
                src="/img/webp/person11.webp" 
                alt="Rizwan Khan"
                className="author-avatar"
              />
              <div className="author-details">
                <div className="author-name">Rizwan Khan</div>
                <div className="author-role">Software Engineer</div>
                <div className="company-badge">Regular Customer</div>
              </div>
            </div>
          </div>
          
          <div className="testimonial-stats">
            <div className="stat-card">
              <div className="stat-icon">🚗</div>
              <div className="stat-content">
                <div className="stat-value">500+</div>
                <div className="stat-desc">Cars in Our Fleet</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏙️</div>
              <div className="stat-content">
                <div className="stat-value">25+</div>
                <div className="stat-desc">Cities Across India</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <div className="stat-value">98%</div>
                <div className="stat-desc">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="testimonials-grid">
          {sampleCards.map((testimonial, index) => (
            <div 
              className={`testimonial-card ${testimonial.featured ? 'featured' : ''}`}
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="card-header">
                <div className="rating">
                  {[...Array(5)].map((_, i) => (
                    <span 
                      key={i} 
                      className={`star ${i < testimonial.rating ? 'filled' : ''}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                {testimonial.featured && (
                  <div className="featured-badge">Featured</div>
                )}
              </div>
              
              <div className="car-details">
                <span className="car-model">{testimonial.carModel}</span>
                <span className="rental-duration">{testimonial.rentalPeriod}</span>
              </div>
              
              <blockquote className="testimonial-text">
                "{testimonial.text}"
              </blockquote>
              
              <div className="author-section">
                <img 
                  // src={testimonial.img} 
                  alt={testimonial.name}
                  className="author-image"
                />
                <div className="author-info">
                  <div className="author-name">{testimonial.name}</div>
                  <div className="author-role">{testimonial.tripPurpose}</div>
                  <div className="author-location">{testimonial.location}</div>
                </div>
              </div>
              
              {testimonial.verifiedRenter && (
                <div className="verification-badge">
                  <span className="verified-icon">✓</span>
                  Verified Renter
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="testimonials-cta">
          <div className="cta-content">
            <h3>Ready to experience hassle-free car rental?</h3>
            <p>Join thousands of satisfied customers across India</p>
            <div className="cta-buttons">
              <button className="cta-btn primary"      onClick={() => setShowForm(true)} >Book Your Car Now</button>
              <button className="cta-btn secondary"  onClick={() => setShowPopup(true)}>Download App</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    {showForm && (
  <ContactUsCard onClose={() => setShowForm(false)} />
)}


    </>
  );
};

const sampleCards = [
  { 
    name: "Priya Patel", 
    tripPurpose: "Family Wedding",
    location: "Ahmedabad, Gujarat",
    carModel: "Hyundai Creta",
    rentalPeriod: "4 days",
    text: "Perfect for our family wedding events! The Creta had ample space for 5 adults and all our traditional outfits. The car was spotless and fuel-efficient. Will definitely use XLentagain!",
    img: "/img/webp/person3.webp",
    rating: 5,
    verifiedRenter: true,
    featured: true
  },
  { 
    name: "Arjun Mehta", 
    tripPurpose: "Business Trip",
    location: "Mumbai, Maharashtra",
    carModel: "Honda City",
    rentalPeriod: "3 days",
    text: "As a frequent business traveler, I appreciate the professionalism. The Honda City was perfect for client meetings. The airport pickup and drop-off saved me so much time.",
    img: "/img/webp/person8.webp",
    rating: 5,
    verifiedRenter: true,
    featured: false
  },
  { 
    name: "Ananya Reddy", 
    tripPurpose: "Weekend Getaway",
    location: "Hyderabad, Telangana",
    carModel: "Maruti Swift",
    rentalPeriod: "2 days",
    text: "Amazing experience for our weekend trip to Srisailam! The Swift was fuel-efficient and perfect for hill roads. The booking process was completely digital and hassle-free.",
    img: "/img/webp/person18.webp",
    rating: 5,
    verifiedRenter: true,
    featured: true
  },
  { 
    name: "Vikram Singh", 
    tripPurpose: "Local Commute",
    location: "Delhi, NCR",
    carModel: "Tata Altroz",
    rentalPeriod: "7 days",
    text: "Needed a car for daily office commute while my car was in service. The Altroz was perfect - great mileage and comfortable for Delhi traffic. The weekly discount was a bonus!",
    img: "/img/webp/person5.webp",
    rating: 4,
    verifiedRenter: true,
    featured: false
  },
  { 
    name: "Neha Gupta", 
    tripPurpose: "Moving House",
    location: "Pune, Maharashtra",
    carModel: "Mahindra Bolero",
    rentalPeriod: "1 day",
    text: "Saved me thousands compared to professional movers! The Bolero had plenty of space for all my belongings. The unlimited kilometer policy was perfect for multiple trips.",
    img: "/img/webp/person7.webp",
    rating: 5,
    verifiedRenter: true,
    featured: false
  },
  { 
    name: "Rajesh Kumar", 
    tripPurpose: "Road Trip",
    location: "Chennai, Tamil Nadu",
    carModel: "Toyota Innova",
    rentalPeriod: "10 days",
    text: "Perfect vehicle for our family road trip to Kodaikanal! The Innova was comfortable for long drives and handled the ghat sections beautifully. The all-India permit made it stress-free.",
    img: "/img/webp/person12.webp",
    rating: 5,
    verifiedRenter: true,
    featured: false
  }
];

export default Testimonials;