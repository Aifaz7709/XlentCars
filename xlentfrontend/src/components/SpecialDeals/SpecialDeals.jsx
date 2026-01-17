import React, { useState } from "react";
import { 
  Star,
  Clock,
  Tag,
  Shield,
  Zap,
  Calendar,
  MapPin,
  Users,
  Fuel,
  Car,
  Filter,
  Search,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  TrendingUp,
  Award,
  Percent,
  Timer,
  ArrowRight,
  Phone
} from "lucide-react";

const SpecialDeals = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");
  const [searchQuery, setSearchQuery] = useState("");
  const [subscriberEmail, setSubscriberEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState("");
  const dealCategories = [
    { id: "all", label: "All Deals" },
    { id: "weekend", label: "Weekend Specials" },
    { id: "long-term", label: "Long Term" },
    { id: "airport", label: "Airport Deals" },
    { id: "luxury", label: "Luxury Cars" },
    { id: "economy", label: "Economy" },
    { id: "family", label: "Family Packages" }
  ];

  const specialDeals = [
    {
      id: 1,
      title: "Weekend Getaway Special",
      category: ["weekend", "economy"],
      originalPrice: 2999,
      discountedPrice: 1999,
      discount: 33,
      period: "3 Days / 2 Nights",
      features: ["Free Delivery", "Unlimited KMs", "No Security Deposit"],
      vehicle: "Maruti Swift",
      imageColor: "bg-blue-100",
      popular: true,
      tag: "Most Popular",
      expiry: "2024-12-31",
      seats: 5,
      fuel: "Petrol",
      transmission: "Manual"
    },
    {
      id: 2,
      title: "Monthly Rental Bonanza",
      category: ["long-term", "family"],
      originalPrice: 24999,
      discountedPrice: 17999,
      discount: 28,
      period: "30 Days",
      features: ["Free Insurance", "24/7 Support", "Flexible Extension"],
      vehicle: "Hyundai Creta",
      imageColor: "bg-indigo-100",
      popular: true,
      tag: "Best Value",
      expiry: "2024-11-30",
      seats: 5,
      fuel: "Diesel",
      transmission: "Automatic"
    },
    {
      id: 3,
      title: "Airport Express Deal",
      category: ["airport"],
      originalPrice: 2499,
      discountedPrice: 1699,
      discount: 32,
      period: "24 Hours",
      features: ["Airport Pickup", "Flight Tracking", "Free Waiting"],
      vehicle: "Toyota Etios",
      imageColor: "bg-sky-100",
      popular: false,
      tag: "Limited Time",
      expiry: "2024-12-15",
      seats: 5,
      fuel: "Petrol",
      transmission: "Manual"
    },
    {
      id: 4,
      title: "Luxury Experience Package",
      category: ["luxury", "weekend"],
      originalPrice: 8999,
      discountedPrice: 6299,
      discount: 30,
      period: "2 Days",
      features: ["Chauffeur Option", "Premium Insurance", "VIP Service"],
      vehicle: "Mercedes-Benz C-Class",
      imageColor: "bg-violet-100",
      popular: true,
      tag: "Premium",
      expiry: "2024-12-25",
      seats: 5,
      fuel: "Petrol",
      transmission: "Automatic"
    },
    {
      id: 5,
      title: "Family Road Trip Package",
      category: ["family", "long-term"],
      originalPrice: 12999,
      discountedPrice: 8999,
      discount: 31,
      period: "7 Days",
      features: ["Child Seats Free", "Roof Carrier", "Emergency Kit"],
      vehicle: "Toyota Innova",
      imageColor: "bg-cyan-100",
      popular: false,
      tag: "Family Favorite",
      expiry: "2024-11-20",
      seats: 7,
      fuel: "Diesel",
      transmission: "Manual"
    },
    {
      id: 6,
      title: "Business Executive Deal",
      category: ["luxury"],
      originalPrice: 14999,
      discountedPrice: 10499,
      discount: 30,
      period: "5 Days",
      features: ["WiFi Hotspot", "Document Folder", "Priority Service"],
      vehicle: "BMW 3 Series",
      imageColor: "bg-blue-50",
      popular: true,
      tag: "Business Choice",
      expiry: "2024-12-10",
      seats: 5,
      fuel: "Petrol",
      transmission: "Automatic"
    },
    {
      id: 7,
      title: "Fuel Saver Special",
      category: ["economy"],
      originalPrice: 3999,
      discountedPrice: 2799,
      discount: 30,
      period: "4 Days",
      features: ["Fuel Efficient", "Low Deposit", "Free Navigation"],
      vehicle: "Hyundai i20",
      imageColor: "bg-teal-100",
      popular: false,
      tag: "Eco Friendly",
      expiry: "2024-11-30",
      seats: 5,
      fuel: "Petrol",
      transmission: "Manual"
    },
    {
      id: 8,
      title: "Extended Stay Package",
      category: ["long-term"],
      originalPrice: 59999,
      discountedPrice: 41999,
      discount: 30,
      period: "90 Days",
      features: ["Monthly Service", "Tyre Replacement", "Free Upgrades"],
      vehicle: "Honda City",
      imageColor: "bg-lightBlue-100",
      popular: true,
      tag: "Long Term Save",
      expiry: "2024-12-31",
      seats: 5,
      fuel: "Petrol",
      transmission: "Automatic"
    }
  ];

  const filteredDeals = specialDeals.filter(deal => {
    if (selectedFilter !== "all" && !deal.category.includes(selectedFilter)) {
      return false;
    }
    if (searchQuery && !deal.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !deal.vehicle.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });


  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!subscriberEmail) return;

    try {
      setIsSubscribing(true);
      setSubscribeMessage("");
      const res = await fetch("http://localhost:5001/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: subscriberEmail }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }
      
      setSubscribeMessage("Thank you! We'll send you our best deals.");
      setSubscriberEmail("");
    } catch (err) {
      console.error("Subscribe error:", err);
      setSubscribeMessage(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  };


  const sortDeals = (deals) => {
    switch(sortBy) {
      case "discount":
        return [...deals].sort((a, b) => b.discount - a.discount);
      case "price":
        return [...deals].sort((a, b) => a.discountedPrice - b.discountedPrice);
      case "popularity":
        return [...deals].sort((a, b) => b.popular - a.popular);
      default:
        return deals;
    }
  };

  const sortedDeals = sortDeals(filteredDeals);

  const DealCard = ({ deal }) => {
    const [expanded, setExpanded] = useState(false);

    return (
      <div className="col-12 col-md-6 col-lg-4 col-xl-3" >
        <div className="card border-0 shadow-sm h-100 hover-shadow-lg transition-all duration-300">
          {/* Deal Badge */}
          <div className="position-absolute top-0 end-0 m-3">
            <div className="badge bg-danger bg-opacity-90 text-white px-3 py-2">
              <Percent size={14} className="me-1" />
              {deal.discount}% OFF
            </div>
          </div>

          {/* Popular Tag */}
          {deal.popular && (
            <div className="position-absolute top-0 start-0 m-3">
              <div className="badge bg-warning text-dark px-3 py-2">
                <TrendingUp size={14} className="me-1" />
                {deal.tag}
              </div>
            </div>
          )}

          {/* Vehicle Image Placeholder */}
          <div className={`${deal.imageColor} p-5 text-center`}>
            <Car size={60} className="text-primary mb-3" />
            <h5 className="text-dark fw-bold mb-0">{deal.vehicle}</h5>
          </div>

          {/* Card Body */}
          <div className="card-body">
            <h5 className="card-title text-dark fw-bold mb-2">{deal.title}</h5>
            
            <div className="d-flex align-items-center mb-3">
              <Clock size={16} className="text-primary me-2" />
              <span className="text-muted small">{deal.period}</span>
            </div>

            {/* Price Section */}
            <div className="mb-3">
              <div className="d-flex align-items-end">
                <span className="h3 fw-bold text-primary">₹{deal.discountedPrice}</span>
                <span className="text-muted text-decoration-line-through ms-2">₹{deal.originalPrice}</span>
                <span className="ms-auto badge bg-success bg-opacity-10 text-success">
                  Save ₹{deal.originalPrice - deal.discountedPrice}
                </span>
              </div>
              <div className="text-muted small">All taxes included</div>
            </div>

            {/* Features */}
            <div className="mb-3">
              {deal.features.slice(0, expanded ? deal.features.length : 2).map((feature, index) => (
                <div key={index} className="d-flex align-items-center mb-2">
                  <CheckCircle size={14} className="text-success me-2" />
                  <span className="small">{feature}</span>
                </div>
              ))}
              
              {deal.features.length > 2 && (
                <button 
                  className="btn btn-link p-0 text-primary small text-decoration-none"
                  onClick={() => setExpanded(!expanded)}
                >
                  {expanded ? 'Show less' : `+${deal.features.length - 2} more features`}
                  {expanded ? <ChevronDown size={14} className="ms-1" /> : <ChevronRight size={14} className="ms-1" />}
                </button>
              )}
            </div>

            {/* Car Details */}
            <div className="row g-2 mb-4">
              <div className="col-4">
                <div className="text-center border rounded p-2">
                  <Users size={16} className="text-primary mb-1" />
                  <div className="small">{deal.seats} Seats</div>
                </div>
              </div>
              <div className="col-4">
                <div className="text-center border rounded p-2">
                  <Fuel size={16} className="text-primary mb-1" />
                  <div className="small">{deal.fuel}</div>
                </div>
              </div>
              <div className="col-4">
                <div className="text-center border rounded p-2">
                  <Zap size={16} className="text-primary mb-1" />
                  <div className="small">{deal.transmission}</div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button className="btn btn-primary w-100">
              Book Now <ArrowRight size={16} className="ms-2" />
            </button>

            {/* Expiry */}
            <div className="text-center mt-3">
              <div className="d-inline-flex align-items-center bg-danger bg-opacity-10 text-danger rounded-pill px-3 py-1">
                <Timer size={12} className="me-1" />
                <span className="small">Expires: {new Date(deal.expiry).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white text-dark min-vh-100">
      {/* Hero Banner */}
<div 
  className="text-white py-5"
  style={{
    background: 'linear-gradient(135deg,rgb(14, 6, 123) 0%,rgb(11, 35, 188) 100%)'
  }}
>        <div className="container" style={{marginTop:'70px'}}>
          <div className="row align-items-center">
            <div className="col-12 col-lg-8">
              <h1 className="display-5 fw-bold mb-3">
                <Tag className="me-3" size={48} />
                Special Deals & Offers
              </h1>
              <p className="lead mb-4" style={{ opacity: '0.9' }}>
                Exclusive discounts and packages tailored for your perfect journey. 
                Limited time offers with maximum savings.
              </p>
              <div className="d-flex align-items-center">
                <div className="me-4">
                  <div className="d-flex align-items-center">
                    <Award size={20} className="me-2" />
                    <span>Best Price Guarantee</span>
                  </div>
                </div>
                <div className="me-4">
                  <div className="d-flex align-items-center">
                    <Shield size={20} className="me-2" />
                    <span>Trusted Service</span>
                  </div>
                </div>
                <div>
                  <div className="d-flex align-items-center">
                    <Zap size={20} className="me-2" />
                    <span>Instant Confirmation</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-4 mt-4 mt-lg-0">
              <div className="card bg-white bg-opacity-10 border-0">
                <div className="card-body text-center">
                  <div className="display-6 fw-bold mb-2" style={{color:'white'}}>30-50% OFF</div>
                  <p className="mb-0" style={{color:'white'}}>On Selected Packages</p>
                  <div className="mt-3" style={{color:'white'}}>
                    <Timer size={24} className="mb-2" />
                    <div className="small" style={{color:'white'}}>Limited Time Offer</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls & Filters */}
      <div className="bg-light py-4">
        <div className="container">
          <div className="row g-3">
            {/* Search */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <Search size={18} className="text-primary" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search deals or vehicles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Category Filters */}
            <div className="col-12 col-md-6 col-lg-5">
              <div className="d-flex flex-wrap gap-2">
                {dealCategories.map(category => (
                  <button
                    key={category.id}
                    className={`btn btn-sm ${selectedFilter === category.id ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setSelectedFilter(category.id)}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="col-12 col-lg-3">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <Filter size={18} className="text-primary" />
                </span>
                <select 
                  className="form-select border-start-0"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="popularity">Most Popular</option>
                  <option value="discount">Highest Discount</option>
                  <option value="price">Lowest Price</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="container py-5">
        {/* Results Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="h3 text-dark mb-1">Available Deals</h2>
                <p className="text-muted mb-0">
                  {sortedDeals.length} offers found {selectedFilter !== "all" && `in ${dealCategories.find(c => c.id === selectedFilter)?.label}`}
                </p>
              </div>
              <div className="text-end">
                <div className="badge bg-primary bg-opacity-10 text-primary px-3 py-2">
                  <Star size={14} className="me-1" />
                  Best Deals Guaranteed
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Deals */}
        {sortedDeals.length > 0 ? (
          <div className="row">
            {sortedDeals.map(deal => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <div className="display-1 text-muted mb-4">
              <Tag size={80} />
            </div>
            <h3 className="h4 text-dark mb-3">No deals found</h3>
            <p className="text-muted mb-4">
              Try adjusting your filters or check back later for new offers.
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => {
                setSelectedFilter("all");
                setSearchQuery("");
              }}
            >
              View All Deals
            </button>
          </div>
        )}

      {/* Newsletter Section */}
<div className="row mt-5 pt-5">
  <div className="col-12">
    <div
      className="card border-0 text-white overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #02287c 0%, #0d6efd 100%)",
        borderRadius: "15px",
      }}
    >
      <div className="row g-0 align-items-center">
        <div className="col-12 col-lg-8 p-4 p-lg-5">
          <h3 className="h2 fw-bold mb-3">Don't Miss Our Best Deals!</h3>
          <p className="mb-4" style={{ opacity: "0.9" }}>
            Subscribe to get exclusive offers, early access to sales, and personalized deals.
          </p>

          <form className="row g-2" onSubmit={handleSubscribe}>
            <div className="col-12 col-md-8">
              <input
                type="email"
                className="form-control form-control-lg"
                placeholder="Enter your email address"
                value={subscriberEmail}
                onChange={(e) => setSubscriberEmail(e.target.value)}
                required
              />
            </div>
            <div className="col-12 col-md-4">
              <button
                type="submit"
                className="btn btn-light text-primary btn-lg w-100 fw-bold"
                disabled={isSubscribing}
              >
                {isSubscribing ? "Subscribing..." : "Subscribe"}
              </button>
            </div>
          </form>

          {subscribeMessage && (
            <div className="form-text mt-2" style={{ color: "white" }}>
              {subscribeMessage}
            </div>
          )}

          <div className="form-text text-white-50 mt-2">
            By subscribing, you agree to our Privacy Policy
          </div>
        </div>
        {/* right column unchanged */}
      </div>
    </div>
  </div>
</div>

        {/* FAQ Section */}
        <div className="row mt-5">
          <div className="col-12">
            <h3 className="h4 text-dark mb-4">Deal FAQs</h3>
            <div className="accordion" id="dealFaq">
              <div className="accordion-item border-0 mb-2">
                <h2 className="accordion-header">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                    Can I combine multiple offers?
                  </button>
                </h2>
                <div id="faq1" className="accordion-collapse collapse">
                  <div className="accordion-body">
                    Only one offer can be applied per booking. The system will automatically apply the best available offer for your selection.
                  </div>
                </div>
              </div>
              <div className="accordion-item border-0 mb-2">
                <h2 className="accordion-header">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                    Are there any hidden charges?
                  </button>
                </h2>
                <div id="faq2" className="accordion-collapse collapse">
                  <div className="accordion-body">
                    All prices displayed include taxes and mandatory charges. Additional costs may apply for extras like GPS, child seats, or additional drivers.
                  </div>
                </div>
              </div>
              <div className="accordion-item border-0">
                <h2 className="accordion-header">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                    How long are these deals valid?
                  </button>
                </h2>
                <div id="faq3" className="accordion-collapse collapse">
                  <div className="accordion-body">
                    Each deal has its own expiry date mentioned on the card. Most deals are valid until the end of the month or as specified.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="bg-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12 col-lg-8">
              <h3 className="h2 fw-bold mb-3">Need Help Choosing?</h3>
              <p className="mb-0" style={{ opacity: '0.9' }}>
                Our rental experts are available 24/7 to help you pick the perfect deal.
              </p>
            </div>
            <div className="col-12 col-lg-4 text-lg-end mt-3 mt-lg-0">
              <a href="tel:+918682844516" className="btn btn-light text-primary btn-lg px-4">
                <Phone size={18} className="me-2" />
                Call Now: +91 8682844516
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialDeals;