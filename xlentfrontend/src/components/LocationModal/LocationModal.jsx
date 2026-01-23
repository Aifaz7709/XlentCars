import React, { useState, useEffect } from 'react';
import { Search, MapPin, X, Navigation, ChevronRight, Star } from 'lucide-react';

const LocationModal = ({ isOpen, onClose, onSelectLocation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentLocations, setRecentLocations] = useState([]);
  const [useGeolocation, setUseGeolocation] = useState(false);

  // Sample cities data
  const cities = [
    { id: 1, name: "Chandrapur", code: "CHD", state: "Maharashtra", airport: false, popular: false },
    { id: 2, name: "Hyderabad", code: "HYD", state: "Telangana", airport: true, popular: true },
    { id: 3, name: "Bengaluru", code: "BLR", state: "Karnataka", airport: true, popular: true },
    { id: 4, name: "Chennai", code: "CHE", state: "Tamil Nadu", airport: true, popular: true },
    { id: 5, name: "Nagpur", code: "NAG", state: "Maharashtra", airport: true, popular: false },
    { id: 6, name: "Pune", code: "PUN", state: "Maharashtra", airport: true, popular: true },
    { id: 7, name: "Goa", code: "GOA", state: "Goa", airport: true, popular: true },
    { id: 9, name: "Chandrapur", code: "CND", state: "Maharashtra", airport: false, popular: true },
    { id: 10, name: "Kolkata", code: "CCU", state: "West Bengal", airport: true, popular: false },
    { id: 11, name: "Jaipur", code: "JAI", state: "Rajasthan", airport: true, popular: false },
    { id: 12, name: "Ahmedabad", code: "AMD", state: "Gujarat", airport: true, popular: false }
  ];

  // Filter cities based on search
  const filteredCities = searchQuery
    ? cities.filter(city =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.state.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : cities;

  // Popular cities (for quick selection)
  const popularCities = cities.filter(city => city.popular);

  // Load recent locations from localStorage
  useEffect(() => {
    const savedLocations = localStorage.getItem('xlent_recent_locations');
    if (savedLocations) {
      try {
        setRecentLocations(JSON.parse(savedLocations));
      } catch (error) {
        console.error('Error loading recent locations:', error);
      }
    }
  }, []);

  // Handle city selection
  const handleCitySelect = (city) => {
    // Save to recent locations
    const updatedRecent = [
      city,
      ...recentLocations.filter(loc => loc.id !== city.id).slice(0, 4)
    ];
    setRecentLocations(updatedRecent);
    localStorage.setItem('xlent_recent_locations', JSON.stringify(updatedRecent));

    // Call the onSelectLocation callback
    if (onSelectLocation) {
      onSelectLocation(city);
    }

    // Close modal
    onClose();
  };

  // Get current location
  const handleGetCurrentLocation = () => {
    setUseGeolocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Here you would typically reverse geocode to get city name
          // For now, we'll show a message and find the nearest city
          const nearestCity = findNearestCity(latitude, longitude);
          
          if (nearestCity) {
            handleCitySelect(nearestCity);
          } else {
            alert("We don't service your current location yet. Please select from available cities.");
          }
          
          setUseGeolocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please enable location services.');
          setUseGeolocation(false);
        },
        { timeout: 10000 }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
      setUseGeolocation(false);
    }
  };

  // Mock function to find nearest city (in real app, use geocoding API)
  const findNearestCity = (lat, lng) => {
    // This is a simplified version - in production, use a proper geocoding service
    return cities[Math.floor(Math.random() * cities.length)];
  };

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div className="location-modal-overlay" onClick={onClose}>
      <div className="location-modal-container" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="location-modal-header">
          <div className="header-content1">
            <div className="header-icon">
              <MapPin size={20} />
            </div>
            <div>
              <h3>Select Location</h3>
              <p>Choose your city </p>
            </div>
          </div>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search city or airport code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            autoFocus
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery('')}>
              <X size={16} />
            </button>
          )}
        </div>

        {/* Scrollable Content Area */}
        <div className="modal-scrollable-content">
          {/* Current Location Button */}
          <div className="current-location-section">
            <button 
              className="current-location-btn"
              onClick={handleGetCurrentLocation}
              disabled={useGeolocation}
            >
              <Navigation size={18} />
              <span>{useGeolocation ? 'Detecting location...' : 'Use my current location'}</span>
            </button>
          </div>

         
          {/* Popular Cities */}
          {!searchQuery && (
            <div className="section">
              <h3 className="section-title">Popular Cities</h3>
              <div className="popular-cities-grid">
                {popularCities.map((city) => (
                  <div
                    key={city.id}
                    className="popular-city-card"
                    onClick={() => handleCitySelect(city)}
                  >
                    <div className="popular-city-header">
                      <div className="city-code">{city.code}</div>
                      {city.airport && (
                        <span className="airport-tag">
                          <Star size={12} />
                          Airport
                        </span>
                      )}
                    </div>
                    <div className="city-name">{city.name}</div>
                    <div className="city-state">{city.state}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Cities */}
      
        </div>
      </div>

      <style jsx>{`
        /* Modal Overlay */
        .location-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          padding: 20px;
          animation: fadeIn 0.3s ease;
        }

        /* Modal Container */
        .location-modal-container {
          background: white;
          border-radius: 24px;
          width: 100%;
          max-width: 480px;
          max-height: 90vh;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(2, 40, 124, 0.3);
          animation: slideUp 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        /* Header - Fixed at top */
        .location-modal-header {
          background: linear-gradient(135deg, #02287c 0%, #1e3a8a 100%);
          color: white;
          padding: 18px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-shrink: 0; /* Prevent shrinking */
        }

        .header-content1 {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .header-icon {
          background: rgba(255, 255, 255, 0.2);
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .location-modal-header h2 {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
        }

        .location-modal-header p {
          margin: 4px 0 0 0;
          opacity: 0.9;
          font-size: 14px;
        }

        .close-button {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .close-button:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: rotate(90deg);
        }

        /* Search - Fixed below header */
        .search-container {
          position: relative;
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
          flex-shrink: 0; /* Prevent shrinking */
        }

        .search-icon {
          position: absolute;
          left: 40px;
          top: 36px;
          color: #6b7280 !important;
        }

        .search-input {
          width: 100%;
          padding: 16px 20px 16px 48px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 16px;
          transition: all 0.2s ease;
          outline: none;
          background: white !important;
          color: #02287c !important;
        }

        .search-input::placeholder {
          color: #6b7280 !important;
          opacity: 0.8;
        }

        .search-input:focus {
          border-color: #02287c !important;
          box-shadow: 0 0 0 3px rgba(2, 40, 124, 0.1) !important;
        }

        .clear-search {
          position: absolute;
          right: 40px;
          top: 36px;
          background: none;
          border: none;
          color: #6b7280 !important;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .clear-search:hover {
          color: #02287c !important;
          background: #e0e7ff !important;
        }

        /* Scrollable Content Area - This is where scrolling happens */
        .modal-scrollable-content {
          flex: 1;
          overflow-y: auto;
          min-height: 0; /* Important for flexbox scrolling */
        }

        /* Current Location */
        .current-location-section {
          padding: 16px 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .current-location-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 14px 20px;
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          color: #02287c;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .current-location-btn:hover:not(:disabled) {
          background: #f1f5f9;
          border-color: #cbd5e1;
          transform: translateY(-1px);
        }

        .current-location-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Sections */
        .section {
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .section:last-child {
          border-bottom: none;
        }

        .section-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }

        .count-badge {
          background: #e0e7ff;
          color: #02287c;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        /* Recent Locations */
        .recent-locations {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .recent-location-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          width: 100%;
          text-align: left;
        }

        .recent-location-item:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
          transform: translateX(2px);
        }

        .city-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .city-name {
          font-weight: 600;
          color: #1f2937;
          font-size: 15px;
        }

        .city-state {
          font-size: 13px;
          color: #6b7280;
          margin-top: 2px;
        }

        /* Popular Cities Grid */
        .popular-cities-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .popular-city-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }

        .popular-city-card:hover {
          background: #f1f5f9;
          border-color: #02287c;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(2, 40, 124, 0.1);
        }

        .popular-city-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .city-code {
          background: #02287c;
          color: white;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .airport-tag {
          display: flex;
          align-items: center;
          gap: 4px;
          background: #fef3c7;
          color: #92400e;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
        }

        .popular-city-card .city-name {
          font-size: 16px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 4px;
        }

        /* Cities List */
        .cities-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 400px;
          overflow-y: auto;
          padding-right: 8px;
        }

        .city-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .city-item:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
          transform: translateX(4px);
        }

        .city-icon {
          background: #e0e7ff;
          color: #02287c;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .city-details {
          flex: 1;
          min-width: 0;
        }

        .city-main {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        .city-name {
          font-weight: 600;
          color: #1f2937;
          font-size: 15px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .airport-indicator {
          font-size: 14px;
        }

        .city-secondary {
          display: flex;
          gap: 12px;
          font-size: 13px;
          color: #6b7280;
        }

        .city-code {
          font-weight: 600;
          color: #02287c;
          background: transparent;
          padding: 0;
        }

        .city-arrow {
          color: #9ca3af;
          flex-shrink: 0;
        }

        /* No Results */
        .no-results {
          text-align: center;
          padding: 40px 20px;
        }

        .no-results-icon {
          color: #9ca3af;
          margin-bottom: 16px;
        }

        .no-results h4 {
          margin: 0 0 8px 0;
          color: #1f2937;
        }

        .no-results p {
          margin: 0;
          color: #6b7280;
          font-size: 14px;
        }

        /* Scrollbar Styling */
        .modal-scrollable-content::-webkit-scrollbar {
          width: 6px;
        }

        .modal-scrollable-content::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .modal-scrollable-content::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }

        .modal-scrollable-content::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }

        .cities-list::-webkit-scrollbar {
          width: 6px;
        }

        .cities-list::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .cities-list::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }

        .cities-list::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }

        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Responsive */
        @media (max-width: 640px) {
          .location-modal-container {
            max-height: 85vh;
            margin: 0;
          }
          
          .popular-cities-grid {
            grid-template-columns: 1fr;
          }
          
          .location-modal-header {
            padding: 20px;
          }
          
          .section {
            padding: 16px 20px;
          }
          
          .search-container {
            padding: 16px 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default LocationModal;