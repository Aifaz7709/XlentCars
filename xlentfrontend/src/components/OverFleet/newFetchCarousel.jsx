import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCars as setCarsRedux, setLoading as setLoadingRedux } from "../Redux/Slices/carSlice";
import "./NewPropertyCard.css";

const NewPropertyCard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reduxCars = useSelector((state) => state.cars.cars);
  const reduxLoading = useSelector((state) => state.cars.loading);

  const [localCars, setLocalCars] = useState([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [favorites, setFavorites] = useState(() =>
    JSON.parse(localStorage.getItem("favorites")) || []
  );

  function formatINR(value) {
    if (!value) return "-";
    return Number(value).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });
  }

  // Fetch ALL cars from your backend API
  const fetchAllCarsFromAPI = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_BASE_URL 
        ? `${process.env.REACT_APP_API_BASE_URL}/api/cars`
        : 'http://localhost:8080/api/cars';
      
      console.log('Fetching cars from:', apiUrl);
      
      const res = await fetch(apiUrl, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Failed to fetch cars:', errorText);
        return [];
      }
      
      const data = await res.json();
      console.log('API Response:', data);
      
      // Handle both response formats
      if (data.cars && Array.isArray(data.cars)) {
        return data.cars; // { cars: [...] } format
      } else if (Array.isArray(data)) {
        return data; // Direct array format
      } else {
        console.error('Unexpected response format:', data);
        return [];
      }
    } catch (err) {
      console.error("Error fetching cars:", err);
      return [];
    }
  };

  // Transform API car data to match your UI format
  const transformCarData = (apiCars) => {
    const carTypes = ["Sedan", "SUV", "Hatchback", "Luxury", "Compact", "MUV"];
    const locations = ["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Kolkata"];
    const fuelTypes = ["Petrol", "Diesel", "CNG", "Electric"];

    return apiCars.map((car, index) => ({
      id: car.id || index,
      // Use actual data from your database
      name: car.car_model ? car.car_model.split(' ')[0] : "Car", // Extract brand from car_model
      model: car.car_model ? car.car_model.split(' ').slice(1).join(' ') : "Model", // Extract model
      car_number: car.car_number || "N/A",
      car_model: car.car_model || "Unknown Model",
      photos: car.photos || [],
      type: carTypes[index % carTypes.length],
      dailyRate: 1500 + (Math.random() * 1500), // Random price for now
      location: locations[index % locations.length],
      seats: 4 + Math.floor(Math.random() * 3),
      luggage: Math.floor(Math.random() * 3) + 1,
      transmission: ["Automatic", "Manual"][Math.floor(Math.random() * 2)],
      fuelType: fuelTypes[Math.floor(Math.random() * fuelTypes.length)],
      available: true,
      mileage: `${Math.floor(Math.random() * 10) + 15} kmpl`,
      features: ["AC", "Bluetooth", "GPS", "Backup Camera", "Airbags", "Power Windows"].slice(0, 3 + Math.floor(Math.random() * 3)),
      created_at: car.created_at || new Date().toISOString(),
    }));
  };

  // Fallback data if API fails
  const generateFallbackData = () => {
    const indianCarMakes = [
      { id: 1, name: "Maruti Suzuki", model: "Swift Dzire" },
      { id: 2, name: "Hyundai", model: "Creta" },
      { id: 3, name: "Tata Motors", model: "Nexon" },
      { id: 4, name: "Mahindra", model: "Scorpio" },
      { id: 5, name: "Honda", model: "City" },
      { id: 6, name: "Toyota", model: "Innova" },
    ];
    const carTypes = ["Sedan", "SUV", "Hatchback", "Luxury", "Compact", "MUV"];
    const locations = ["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Kolkata"];
    const fuelTypes = ["Petrol", "Diesel", "CNG", "Electric"];

    return indianCarMakes.map((make, index) => ({
      id: make.id,
      name: make.name,
      model: make.model,
      type: carTypes[index % carTypes.length],
      dailyRate: Math.floor(Math.random() * 3000) + 800,
      location: locations[index % locations.length],
      seats: Math.floor(Math.random() * 4) + 4,
      luggage: Math.floor(Math.random() * 3) + 1,
      transmission: ["Automatic", "Manual"][Math.floor(Math.random() * 2)],
      fuelType: fuelTypes[Math.floor(Math.random() * fuelTypes.length)],
      available: true,
      mileage: `${Math.floor(Math.random() * 10) + 15} kmpl`,
      features: ["AC", "Bluetooth", "GPS", "Backup Camera", "Airbags", "Power Windows"].slice(0, 3 + Math.floor(Math.random() * 3)),
    }));
  };

  // Fetch cars on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(setLoadingRedux(true));
        const apiCars = await fetchAllCarsFromAPI();
        
        if (apiCars.length > 0) {
          console.log(`Successfully fetched ${apiCars.length} cars`);
          const transformed = transformCarData(apiCars);
          setLocalCars(transformed);
          dispatch(setCarsRedux(apiCars)); // Store raw data in Redux
        } else {
          console.log('No cars from API, using fallback data');
          const fallback = generateFallbackData();
          setLocalCars(fallback);
          dispatch(setCarsRedux([]));
        }
      } catch (err) {
        console.error('Error in fetchData:', err);
        const fallback = generateFallbackData();
        setLocalCars(fallback);
        dispatch(setCarsRedux([]));
      } finally {
        dispatch(setLoadingRedux(false));
        setHasFetched(true);
      }
    };

    // Only fetch if we haven't already fetched or if Redux is empty
    if (!hasFetched || reduxCars.length === 0) {
      fetchData();
    } else if (reduxCars.length > 0 && localCars.length === 0) {
      // If Redux has data but local doesn't, transform it
      const transformed = transformCarData(reduxCars);
      setLocalCars(transformed);
    }
  }, [dispatch, hasFetched, reduxCars.length, localCars.length]);

  // Auto-refresh every 30 seconds to get new cars
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log('Auto-refreshing car list...');
      const fetchData = async () => {
        const apiCars = await fetchAllCarsFromAPI();
        if (apiCars.length > 0) {
          const transformed = transformCarData(apiCars);
          setLocalCars(transformed);
          dispatch(setCarsRedux(apiCars));
        }
      };
      fetchData();
    }, 30000); // 30 seconds

    return () => clearInterval(intervalId);
  }, [dispatch]);

  function toggleFavorite(id) {
    const updated = favorites.includes(id) ? favorites.filter((f) => f !== id) : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  }

  // Show car photos if available
  const renderCarImage = (car) => {
    if (car.photos && car.photos.length > 0) {
      return (
        <div className="car-photo-container">
          <img 
            src={car.photos[0]} 
            alt={`${car.car_model || car.name}`}
            className="car-photo"
            style={{
              width: '100%',
              height: '180px',
              objectFit: 'cover',
              borderTopLeftRadius: '8px',
              borderTopRightRadius: '8px'
            }}
          />
        </div>
      );
    } else {
      return (
        <div className="dummy-car-ui">
          <div className="dummy-car-icon">🚗</div>
          <div className="dummy-car-text">{car.name} {car.model}</div>
          <small className="text-muted">{car.car_number || "Car Number"}</small>
        </div>
      );
    }
  };

  if (reduxLoading && localCars.length === 0) {
    return (
      <div className="container py-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading cars...</p>
      </div>
    );
  }

  return (
    <div className="container1 py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="display-6 mb-0" data-aos="fade-down" style={{ 
          cursor: 'pointer',
          color: 'rgb(2, 40, 124)',
          marginRight: '1.5rem',
          fontWeight: '600'
        }}> 
          Our Fleet ({localCars.length} cars available)
        </h2>
        <div className="d-flex align-items-center">
          <span className="text-muted small me-3">❤️ Favorites: {favorites.length}</span>
          <button 
            className="btn btn-sm btn-outline-primary"
            onClick={() => {
              const fetchData = async () => {
                dispatch(setLoadingRedux(true));
                const apiCars = await fetchAllCarsFromAPI();
                if (apiCars.length > 0) {
                  const transformed = transformCarData(apiCars);
                  setLocalCars(transformed);
                  dispatch(setCarsRedux(apiCars));
                }
                dispatch(setLoadingRedux(false));
              };
              fetchData();
            }}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {localCars.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">No cars available yet.</p>
          <p className="small text-muted">Be the first to add a car!</p>
        </div>
      ) : (
        <div className="row g-3">
          {localCars.map((car) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={car.id}>
              <div
                className="property-card shadow-sm position-relative"
                onClick={() => navigate(`/book/${car.id}`, { 
                  state: { 
                    car: {
                      ...car,
                      // Pass the original car data for booking
                      originalData: reduxCars.find(c => c.id === car.id) || car
                    }
                  } 
                })}
                style={{ cursor: "pointer" }}
              >
                {/* Favorite Button */}
                <div
                  className="favorite-btn position-absolute top-0 end-0 p-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(car.id);
                  }}
                  style={{ cursor: "pointer", zIndex: 1 }}
                >
                  {favorites.includes(car.id) ? "❤️" : "🤍"}
                </div>

                {/* Car Image or Dummy UI */}
                {renderCarImage(car)}

                {/* Car Details */}
                <div className="p-3">
                  <p className="small text-primary fw-semibold mb-1">{car.type}</p>
                  <h6 className="fw-bold mb-1">{car.car_model || `${car.name} ${car.model}`}</h6>
                  <p className="small text-muted mb-1">{car.car_number || "N/A"}</p>
                  <p className="fw-semibold mb-1">{formatINR(car.dailyRate)}/day</p>
                  
                  <div className="car-specs mb-2">
                    <span className="text-muted small me-2">👥 {car.seats} seats</span>
                    <span className="text-muted small me-2">🎒 {car.luggage} luggage</span>
                    <span className="text-muted small">⛽ {car.mileage}</span>
                  </div>

                  <div className="mb-2">
                    <span className="badge-chip bg-success text-white me-1">
                      Available
                    </span>
                    <span className="badge-chip bg-info text-dark me-1">{car.fuelType}</span>
                    <span className="badge-chip bg-warning text-dark me-1">{car.transmission}</span>
                  </div>

                  <div className="features-list">
                    {car.features.slice(0, 3).map((feature, index) => (
                      <span key={index} className="feature-tag small">{feature}</span>
                    ))}
                    {car.features.length > 3 && (
                      <span className="feature-tag small">+{car.features.length - 3} more</span>
                    )}
                  </div>
                  
                  {/* Show photo count if available */}
                  {car.photos && car.photos.length > 0 && (
                    <div className="mt-2 small text-muted">
                      📸 {car.photos.length} photo{car.photos.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewPropertyCard; 