import React, { useState } from "react";
import { 
  Award,
  Shield,
  Users,
  MapPin,
  Clock,
  Star,
  TrendingUp,
  Heart,
  Car,
  Phone,
  Mail,
  Target,
  Globe,
  CheckCircle,
  ArrowRight,
  ThumbsUp,
  Trophy,
  Zap,
  ShieldCheck,
  Users as GroupUsers,
  Smile
} from "lucide-react";
import Footer from "../Footer/Footer";
import { useNavigate } from 'react-router-dom';

import './About.css'
import ContactModal from "../LocationModal/ContactModal";
const AboutPage = () => {
  const navigate = useNavigate();
  const [showContactModal, setShowContactModal] = useState(false);

  const teamMembers = [
    {
      name: "Justin Chacko",
      role: "Founder & CEO",
      experience: "10+ years in automotive industry",
      imageColor: "bg-blue-100",
      quote: "Driven by innovation and customer satisfaction."
    },
    {
      name: "Varun Nishad",
      role: "Chief Operations Officer",
      experience: "7+ years in logistics",
      imageColor: "bg-sky-100",
      quote: "Ensuring seamless journeys, every time."
    },
    {
      name: "Aifaz Khan",
      role: "Technology Director",
      experience: "7+ years pioneering tech solutions in luxury hospitality",
      imageColor: "bg-cyan-100",
      quote: "Your journey is our priority."
    },
    {
      name: "Payal Bahadur",
      role: "Customer Experience Head",
      experience: "5+ years in automotive",
      imageColor: "bg-lightBlue-100",
      quote: "Maintaining excellence in every vehicle."
    }
  ];

  const milestones = [
    { year: "2025", title: "Founded in Chennai", description: "Started with 10 cars" }
  ];

  const values = [
    {
      icon: <ShieldCheck size={32} className="text-primary" />,
      title: "Safety First",
      description: "Every vehicle undergoes rigorous safety checks"
    },
    {
      icon: <Heart size={32} className="text-primary" />,
      title: "Customer Centric",
      description: "Your satisfaction is our top priority"
    },
    {
      icon: <Zap size={32} className="text-primary" />,
      title: "Innovation",
      description: "Continuously improving our services"
    },
    {
      icon: <GroupUsers size={32} className="text-primary" />,
      title: "Community",
      description: "Supporting local communities"
    },
    {
      icon: <Globe size={32} className="text-primary" />,
      title: "Sustainability",
      description: "Eco-friendly practices and vehicles"
    },
    {
      icon: <Target size={32} className="text-primary" />,
      title: "Excellence",
      description: "Striving for perfection in every journey"
    }
  ];

  const stats = [
    { icon: <Car size={24} />, value: "300+", label: "Vehicles" },
    { icon: <Users size={24} />, value: "5,000+", label: "Happy Customers" },
    { icon: <MapPin size={24} />, value: "6+", label: "Cities" },
    { icon: <Star size={24} />, value: "4.7/5", label: "Customer Rating" },
    { icon: <Clock size={24} />, value: "24/7", label: "Support" },
    { icon: <TrendingUp size={24} />, value: "95%", label: "Satisfaction Rate" }
  ];

  return (
    <div className="text-dark min-vh-100" >
      {/* Hero Section */}
      <div className="bg-gradient-to-r to-blue-600  py-5" style={{backgroundColor:'#02287c'}}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12 col-lg-7">
              <h1 className="display-4 fw-bold mb-4" style={{color:'white'}}>
                Driving Excellence Since 2025
              </h1>
              <p className="lead mb-4" style={{ opacity: '0.9' , color:'white'}}>
                Xlentcar is more than just a car rental service. We're your trusted partner 
                for memorable journeys across Tamil Nadu and beyond.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <button className="btn btn-light text-primary px-4"  onClick={()=>navigate('/deals')}>
                  <ArrowRight size={18} className="me-2" />
                  Explore Our Fleet
                </button>
                <button className="btn btn-outline-light px-4"    onClick={() => setShowContactModal(true)}
       >
                  Contact Us
                </button>
              </div>
            </div>
            <div className="col-12 col-lg-5 mt-5 mt-lg-0" style={{color:"white"}}>
              <div className="position-relative">
                <div className="bg-white bg-opacity-10 rounded-3 p-4">
                  <div className="d-flex align-items-center mb-3">
                    <Award size={32} className="me-3" />
                    <div>
                      <h3 className="h5 mb-0">Award Winning Service</h3>
                      <p className="small mb-0 opacity-90">Best Car Rental 2025</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <Shield size={32} className="me-3" />
                    <div>
                      <h3 className="h5 mb-0">Fully Insured</h3>
                      <p className="small mb-0 opacity-90">24/7 Roadside Assistance</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <Users size={32} className="me-3" />
                    <div>
                      <h3 className="h5 mb-0">Trusted by Thousands</h3>
                      <p className="small mb-0 opacity-90">Since 2025</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showContactModal && ( <ContactModal    isOpen={showContactModal} 
        onClose={() => setShowContactModal(false)}/> )}
      {/* Our Story */}
      <div className="container py-5">
        <div className="row align-items-center">
          <div className="col-12 col-lg-6 mb-5 mb-lg-0">
            <h2 className="display-6 fw-bold text-dark mb-4">
              Our <span className="text-primary">Story</span>
            </h2>
            <p className="lead mb-4">
              Founded in 2025 in the heart of Chennai, Xlentcar began with a simple vision: 
              to make car rental accessible, reliable, and exceptional for everyone.
            </p>
            <p className="mb-4">
              What started as a small fleet of 10 vehicles has grown into Tamil Nadu's most 
              trusted car rental service. Our journey has been fueled by a passion for 
              automotive excellence and an unwavering commitment to customer satisfaction.
            </p>
            <p className="mb-0">
              Today, with over 500 vehicles and operations across 25+ cities, we continue to 
              innovate and set new standards in the car rental industry.
            </p>
          </div>
          <div className="col-12 col-lg-6">
            <div className="bg-primary bg-opacity-10 rounded-3 p-4 p-lg-5">
              <div className="text-center mb-4">
                <Car size={48} className="text-primary mb-3" />
                <h3 className="h4 text-dark">Our Mission</h3>
              </div>
              <p className="text-center mb-4">
                To provide exceptional car rental experiences through innovation, 
                reliability, and customer-centric service, making every journey memorable.
              </p>
              <div className="text-center">
                <h3 className="h4 text-dark mb-3">Our Vision</h3>
                <p className="mb-0">
                  To be India's most trusted and innovative car rental service, 
                  setting new standards in mobility solutions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-light py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold text-dark mb-3">
              By The <span className="text-primary">Numbers</span>
            </h2>
            <p className="lead text-muted">Our journey in numbers</p>
          </div>
          <div className="row g-4">
            {stats.map((stat, index) => (
              <div key={index} className="col-6 col-md-4 col-lg-2">
                <div className="text-center">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '70px', height: '70px' }}>
                    <div className="text-primary">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="h2 fw-bold text-dark mb-1">{stat.value}</div>
                  <div className="text-muted small">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="container py-5">
        <div className="text-center mb-5">
          <h2 className="display-6 fw-bold text-dark mb-3">
            Our Core <span className="text-primary">Values</span>
          </h2>
          <p className="lead text-muted">The principles that drive everything we do</p>
        </div>
        <div className="row g-4">
          {values.map((value, index) => (
            <div key={index} className="col-12 col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm h-100 hover-lift">
                <div className="card-body text-center p-4">
                  <div className="mb-4">
                    {value.icon}
                  </div>
                  <h4 className="h5 text-dark mb-3">{value.title}</h4>
                  <p className="text-muted mb-0">{value.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Our Team */}
      <div className="bg-opacity-5 py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold text-dark mb-3">
              Meet Our <span className="">Leadership</span>
            </h2>
            <p className="lead text-muted">The passionate team behind Xlentcar</p>
          </div>
          <div className="row g-4">
            {teamMembers.map((member, index) => (
              <div key={index} className="col-12 col-md-6 col-lg-3">
                <div className="card border-0 shadow-sm h-100">
                  <div className={`${member.imageColor} rounded-top text-center p-5`}>
                    <div className="display-4 mb-3">👤</div>
                    <div className="text-primary fw-bold">{member.name[0]}</div>
                  </div>
                  <div className="card-body text-center">
                    <h5 className="card-title text-dark fw-bold mb-2">{member.name}</h5>
                    <p className="text-primary fw-semibold mb-2">{member.role}</p>
                    <p className="small text-muted mb-3">{member.experience}</p>
                    <p className="fst-italic text-muted small mb-0">"{member.quote}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

     

      {/* Commitment Section */}
      <div className="container py-5">
        <div className="row align-items-center">
          <div className="col-12 col-lg-6 mb-5 mb-lg-0">
            <div className="bg-primary bg-opacity-10 rounded-3 p-4 p-lg-5">
              <h3 className="h2 fw-bold text-dark mb-4">
                Our Commitment to <span className="text-primary">You</span>
              </h3>
              <ul className="list-unstyled">
                <li className="mb-3">
                  <div className="d-flex">
                    <CheckCircle size={20} className="text-primary me-3 mt-1" />
                    <div>
                      <h5 className="h6 text-dark mb-1">Quality Assurance</h5>
                      <p className="text-muted small mb-0">Every vehicle undergoes 50+ point inspection</p>
                    </div>
                  </div>
                </li>
                <li className="mb-3">
                  <div className="d-flex">
                    <CheckCircle size={20} className="text-primary me-3 mt-1" />
                    <div>
                      <h5 className="h6 text-dark mb-1">Transparent Pricing</h5>
                      <p className="text-muted small mb-0">No hidden charges, what you see is what you pay</p>
                    </div>
                  </div>
                </li>
                <li className="mb-3">
                  <div className="d-flex">
                    <CheckCircle size={20} className="text-primary me-3 mt-1" />
                    <div>
                      <h5 className="h6 text-dark mb-1">24/7 Support</h5>
                      <p className="text-muted small mb-0">Round-the-clock assistance for all your needs</p>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="d-flex">
                    <CheckCircle size={20} className="text-primary me-3 mt-1" />
                    <div>
                      <h5 className="h6 text-dark mb-1">Easy Booking</h5>
                      <p className="text-muted small mb-0">Book in under 2 minutes through multiple channels</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="text-center">
              <div className="display-1 mb-4">🚗</div>
              <h3 className="h2 fw-bold text-dark mb-3">
                Ready for Your Next <span className="text-primary">Adventure</span>?
              </h3>
              <p className="lead mb-4">
                Join thousands of satisfied customers who trust Xlentcar for their journeys.
              </p>
              <div className="d-flex flex-wrap gap-3 justify-content-center">
                <button className="btn btn-primary px-4 py-3" onClick={() => navigate('/deals')}>
                  <Car size={20} className="me-2" />
                  Book Your Ride
                </button>
                <a href="tel:+918682844516" className="btn btn-outline-primary px-4 py-3">
                  <Phone size={20} className="me-2" />
                  Call Us Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Footer */}
     <Footer/>
    </div>
  );
};

export default AboutPage;