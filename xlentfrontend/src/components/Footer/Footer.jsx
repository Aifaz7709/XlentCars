import React from "react";

const Footer = () => {
  return (
    <footer className="bg-dark text-light">
      <div className="container small border-top border-secondary">
        <div className="row py-4">
          {/* Company Info */}
          <div className="col-12 col-lg-4 col-xl-3 border-end border-secondary p-4">
            <div className="d-flex align-items-center mb-3">
              <img src="/LogoTranWhite.png" alt="Xlentcar" width="40" height="35" />
              <span className="ms-2 fw-bold fs-5">Xlentcar</span>
            </div>
            <address className="text-light mt-3" style={{ opacity: '0.8' }}>
              <strong>Xlentcar Rentals</strong><br/>
             Chennai, Tamil Nadu<br/>
            <br/>
              <abbr>Support </abbr> (+91) 8682844516 
            </address>
          </div>

          <FooterLinks />
        </div>

        <div className="container text-center py-3 small" style={{ opacity: '0.7' }}>
          © 2025 Xlentcar — Your Journey, Your Way.
        </div>
      </div>
    </footer>
  );
};

const FooterLinks = () => (
  <>
    {/* Our Services */}
    <div className="col-12 col-lg-4 col-xl-3 border-end border-secondary p-4">
      <h3 className="h6 mb-3">Our Services</h3>
      <ul className="nav flex-column">
        <li className="nav-item"><a className="nav-link text-light ps-0" href="#fleet" style={{ opacity: '0.8' }}>Car Fleet</a></li>
        <li className="nav-item"><a className="nav-link text-light ps-0" href="#business" style={{ opacity: '0.8' }}>Business Rental</a></li>
        <li className="nav-item"><a className="nav-link text-light ps-0" href="#airport" style={{ opacity: '0.8' }}>Airport Pickup</a></li>
        <li className="nav-item"><a className="nav-link text-light ps-0" href="#long-term" style={{ opacity: '0.8' }}>Long Term Rental</a></li>
      </ul>
    </div>

    {/* Support */}
    <div className="col-12 col-lg-4 col-xl-3 border-end border-secondary p-4">
      <h3 className="h6 mb-3">Support</h3>
      <ul className="nav flex-column">
        <li className="nav-item"><a className="nav-link text-light ps-0" href="#help" style={{ opacity: '0.8' }}>Help Center</a></li>
        <li className="nav-item"><a className="nav-link text-light ps-0" href="#faq" style={{ opacity: '0.8' }}>FAQs</a></li>
        <li className="nav-item"><a className="nav-link text-light ps-0" href="#roadside" style={{ opacity: '0.8' }}>Roadside Assistance</a></li>
        <li className="nav-item"><a className="nav-link text-light ps-0" href="#locations" style={{ opacity: '0.8' }}>Find Locations</a></li>
      </ul>
    </div>

    {/* Company */}
    <div className="col-12 col-lg-4 col-xl-3 p-4">
      <h3 className="h6 mb-3">Company</h3>
      <ul className="nav flex-column">
        <li className="nav-item"><a className="nav-link text-light ps-0" href="#about" style={{ opacity: '0.8' }}>About Us</a></li>
        <li className="nav-item"><a className="nav-link text-light ps-0" href="#terms" style={{ opacity: '0.8' }}>Terms & Conditions</a></li>
      </ul>
    </div>
  </>
);

export default Footer;  