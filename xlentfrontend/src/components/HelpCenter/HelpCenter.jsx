import React, { useState } from "react";
import { 
  Search, 
  Phone, 
  MessageSquare, 
  HelpCircle, 
  Shield, 
  CreditCard, 
  FileText,
  ChevronDown,
  ChevronUp,
  Mail,
  Clock,
  MapPin,
  Car,
  PhoneCall,
  MessageCircle,
  Mail as MailIcon
} from "lucide-react";
import Footer from "../Footer/Footer";

const HelpCenter = () => {
  const [openCategory, setOpenCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      id: "booking",
      title: "Booking & Reservations",
      icon: <FileText size={20} className="text-primary" />,
      questions: [
        {
          q: "How do I book a car?",
          a: "You can book a car through our website, mobile app, or by calling our customer service. Simply select your pickup location, dates, choose a vehicle, and complete the reservation."
        },
        {
          q: "Can I modify or cancel my booking?",
          a: "Yes, you can modify or cancel your booking up to 24 hours before pickup without any charges. Visit 'My Bookings' section or contact our support team."
        },
        {
          q: "What documents do I need to rent a car?",
          a: "You'll need a valid driver's license, credit card in your name, and a government-issued ID. International renters need a valid passport and international driving permit."
        }
      ]
    },
    {
      id: "payment",
      title: "Payments & Pricing",
      icon: <CreditCard size={20} className="text-primary" />,
      questions: [
        {
          q: "What payment methods do you accept?",
          a: "We accept all major credit/debit cards (Visa, MasterCard, American Express), UPI payments, net banking, and cash payments at select locations."
        },
        {
          q: "Is there a security deposit?",
          a: "Yes, a refundable security deposit is required. The amount varies based on the vehicle category and will be refunded within 5-7 business days after vehicle return."
        },
        {
          q: "What's included in the rental price?",
          a: "Our rental price includes basic insurance, unlimited mileage (for most vehicles), 24/7 roadside assistance, and maintenance costs. Fuel and tolls are extra."
        }
      ]
    },
    {
      id: "insurance",
      title: "Insurance & Safety",
      icon: <Shield size={20} className="text-primary" />,
      questions: [
        {
          q: "What type of insurance is included?",
          a: "All rentals include third-party liability insurance and collision damage waiver (with deductible). Additional coverage options are available at extra cost."
        },
        {
          q: "What happens in case of an accident?",
          a: "Immediately contact our 24/7 emergency hotline (+91 99999 99999). Do not admit liability. We'll guide you through the process and arrange assistance."
        },
        {
          q: "Is roadside assistance available?",
          a: "Yes, we provide 24/7 roadside assistance for all our rentals. This includes flat tires, lockouts, battery jump-starts, and emergency fuel delivery."
        }
      ]
    },
    {
      id: "delivery",
      title: "Pickup & Delivery",
      icon: <Car size={20} className="text-primary" />,
      questions: [
        {
          q: "Do you offer airport pickup?",
          a: "Yes, we offer convenient airport pickup services at major airports. Provide your flight details during booking and our representative will meet you at arrivals."
        },
        {
          q: "Can I get the car delivered to my location?",
          a: "Yes, we offer home/office delivery in select cities for a nominal fee. Check availability during the booking process."
        },
        {
          q: "What if I'm running late for pickup?",
          a: "Please call the location directly if you're running late. We hold reservations for up to 2 hours past the scheduled pickup time."
        }
      ]
    }
  ];

  const contactOptions = [
    {
      title: "Call Support",
      description: "24/7 Customer Support",
      details: "+91 8682844516",
      icon: <PhoneCall size={28} className="text-primary" />,
      action: "Call Now",
      color: "bg-primary bg-opacity-10",
      buttonClass: "btn-primary"
    },
    {
      title: "Live Chat",
      description: "Instant chat support",
      details: "Available 8AM - 10PM IST",
      icon: <MessageCircle size={28} className="text-primary" />,
      action: "Start Chat",
      color: "bg-primary bg-opacity-10",
      buttonClass: "btn-primary"
    },
    {
      title: "Email Support",
      description: "Detailed inquiries",
      details: "support@xlentcar.com",
      icon: <MailIcon size={28} className="text-primary" />,
      action: "Send Email",
      color: "bg-primary bg-opacity-10",
      buttonClass: "btn-primary"
    }
  ];

  const toggleCategory = (categoryId) => {
    setOpenCategory(openCategory === categoryId ? null : categoryId);
  };

  const filteredCategories = categories.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="bg-white text-dark min-vh-100" >
      {/* Hero Section */}
      <div className="text-white py-5" style={{backgroundColor:'rgb(2 40 124)'}}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12 col-lg-8">
              <h1 className="display-5 fw-bold mb-3">
                <HelpCircle className="me-3" size={48} />
                Help Center
              </h1>
              <p className="lead mb-4" style={{ opacity: '0.9' }}>
                Find answers to frequently asked questions or get in touch with our support team.
              </p>
            </div>
            {/* <div className="col-12 col-lg-4">
              <div className="card bg-white bg-opacity-10 border-0 text-white">
                <div className="card-body">
                  <h5 className="card-title mb-3">Need Immediate Help?</h5>
                  <p className="card-text small mb-3">
                    Our team is available 24/7 to assist you with any urgent matters.
                  </p>
                  <a href="tel:+9186828XXXXX" className="btn btn-light text-primary w-100 fw-bold">
                    <Phone size={18} className="me-2" />
                    Emergency Hotline: +91 86828 *****
                  </a>
                </div>
              </div>
            </div> */}
          </div>

          {/* Search Bar */}
          {/* <div className="row mt-4">
            <div className="col-12 col-md-10 col-lg-8 mx-auto">
              <div className="input-group input-group-lg">
                <span className="input-group-text bg-white text-primary border-0">
                  <Search size={20} />
                </span>
                <input
                  type="text"
                  className="form-control border-0"
                  placeholder="Search for help..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ boxShadow: 'none' }}
                />
                <button className="btn btn-light text-primary border-0">
                  Search
                </button>
              </div>
            </div>
          </div> */}
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-5">
        {/* Contact Options */}
        <div className="row mt-4">
          <div className="col-12 mb-5">
            <h2 className="h3 mb-4 text-center text-dark">Get in Touch</h2>
            <div className="row g-4">
              {contactOptions.map((option, index) => (
                <div key={index} className="col-12 col-md-4">
                  <div className={`card border-0 h-100 shadow-sm ${option.color}`}>
                    <div className="card-body text-center p-4">
                      <div className="mb-4">
                        {option.icon}
                      </div>
                      <h5 className="card-title text-dark mb-2">{option.title}</h5>
                      <p className="card-text small text-muted mb-3">
                        {option.description}
                      </p>
                      <p className="fw-bold text-primary mb-4">{option.details}</p>
                      {option.title === "Call Support" ? (
                        <a href="tel:+918682844516" className={`btn ${option.buttonClass} btn-sm w-100`}>
                          {option.action}
                        </a>
                      ) : (
                        <button className={`btn ${option.buttonClass} btn-sm w-100`}>
                          {option.action}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="mb-4">
              <h2 className="h3 text-dark mb-1">Frequently Asked Questions</h2>
              <p className="text-muted">Find quick answers to common questions</p>
            </div>
            
            <div className="accordion" id="faqAccordion">
              {filteredCategories.map((category, categoryIndex) => (
                <div key={category.id} className="accordion-item border mb-3">
                  <h2 className="accordion-header">
                    <button
                      className={`accordion-button ${openCategory === category.id ? '' : 'collapsed'}`}
                      type="button"
                      onClick={() => toggleCategory(category.id)}
                      style={{ 
                        backgroundColor: openCategory === category.id ? '#e3f2fd' : 'white',
                        color: '#0d6efd'
                      }}
                    >
                      <div className="d-flex align-items-center w-100">
                        <span className="me-3">
                          {category.icon}
                        </span>
                        <span className="fw-bold">{category.title}</span>
                        <span className="ms-auto">
                          {openCategory === category.id ? <ChevronUp /> : <ChevronDown />}
                        </span>
                      </div>
                    </button>
                  </h2>
                  
                  <div 
                    className={`accordion-collapse collapse ${openCategory === category.id ? 'show' : ''}`}
                  >
                    <div className="accordion-body">
                      {category.questions.map((item, index) => (
                        <div key={index} className="mb-4 pb-3 border-bottom">
                          <h4 className="h6 mb-2 text-dark">
                            <span className="badge bg-primary bg-opacity-10 text-primary me-2">Q</span>
                            {item.q}
                          </h4>
                          <p className="mb-0 text-muted ps-4">
                            <span className="badge bg-success bg-opacity-10 text-success me-2">A</span>
                            {item.a}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results Message */}
            {filteredCategories.length === 0 && searchQuery && (
              <div className="text-center py-5">
                <HelpCircle size={48} className="text-muted mb-3" />
                <h4 className="h5 text-dark mb-2">No results found</h4>
                <p className="text-muted">
                  Try searching with different keywords or contact our support team directly.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Resources */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h3 className="h4 mb-4 text-dark">Additional Resources</h3>
                <div className="row g-4">
                  <div className="col-12 col-md-6">
                    <div className="d-flex align-items-start p-3 border rounded">
                      <FileText size={24} className="text-primary me-3 mt-1" />
                      <div>
                        <h5 className="h6 text-dark mb-1">Terms & Conditions</h5>
                        <p className="small text-muted mb-0">
                          Read our complete rental agreement and policies
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="d-flex align-items-start p-3 border rounded">
                      <MapPin size={24} className="text-primary me-3 mt-1" />
                      <div>
                        <h5 className="h6 text-dark mb-1">Find Locations</h5>
                        <p className="small text-muted mb-0">
                          Locate our branches and pickup points
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="d-flex align-items-start p-3 border rounded">
                      <Shield size={24} className="text-primary me-3 mt-1" />
                      <div>
                        <h5 className="h6 text-dark mb-1">Safety Guidelines</h5>
                        <p className="small text-muted mb-0">
                          Important safety information for your journey
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="d-flex align-items-start p-3 border rounded">
                      <Clock size={24} className="text-primary me-3 mt-1" />
                      <div>
                        <h5 className="h6 text-dark mb-1">Business Hours</h5>
                        <p className="small text-muted mb-0">
                          Main office: Mon-Sun 8:00 AM - 10:00 PM IST
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Didn't Find Answer Section */}
        {/* <div className="row mt-5">
          <div className="col-12">
            <div className="text-center py-5">
              <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-4 mb-4">
                <HelpCircle size={48} className="text-primary" />
              </div>
              <h3 className="h4 mb-3 text-dark">Still Need Help?</h3>
              <p className="text-muted mb-4">
                Can't find what you're looking for? Our team is ready to help you.
              </p>
              <div className="d-flex flex-column flex-md-row justify-content-center gap-3">
                <button className="btn btn-primary px-4">
                  <MessageSquare size={18} className="me-2" />
                  Start Live Chat
                </button>
                <button className="btn btn-outline-primary px-4">
                  <Mail size={18} className="me-2" />
                  Send us an Email
                </button>
              </div>
            </div>
          </div>
        </div> */}
      </div>

      {/* Quick Stats */}
      <div className="bg-light py-4 mt-5">
        <div className="container">
          <div className="row text-center">
            <div className="col-6 col-md-3 mb-3 mb-md-0">
              <div className="text-primary fw-bold fs-3">24/7</div>
              <div className="text-muted small">Support Available</div>
            </div>
            <div className="col-6 col-md-3 mb-3 mb-md-0">
              <div className="text-primary fw-bold fs-3">15min</div>
              <div className="text-muted small">Average Response Time</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="text-primary fw-bold fs-3">98%</div>
              <div className="text-muted small">Satisfaction Rate</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="text-primary fw-bold fs-3">5000+</div>
              <div className="text-muted small">Customers Helped</div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default HelpCenter;