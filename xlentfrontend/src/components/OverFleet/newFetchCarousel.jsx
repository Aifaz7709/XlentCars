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
    return apiCars.map((car) => ({
      id: car.id,
      name: car.car_model || "Car",
      location: car.car_location || "Location not specified",
      photos: car.photos || [],
      car_model: car.car_model || "Unknown Model",
      car_number: car.car_number || "N/A",
    }));
  };

  // Fetch cars on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(setLoadingRedux(true));
        const apiCars = await fetchAllCarsFromAPI();
        
        if (apiCars.length > 0) {
          console.log(`Successfully fetched ${apiCars.length} cars from Supabase`);
          const transformed = transformCarData(apiCars);
          setLocalCars(transformed);
          dispatch(setCarsRedux(apiCars)); // Store raw data in Redux
        } else {
          console.log('No cars found in Supabase');
          setLocalCars([]);
          dispatch(setCarsRedux([]));
        }
      } catch (err) {
        console.error('Error in fetchData:', err);
        setLocalCars([]);
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
      // Simple placeholder when no photo
      return (
        <div 
          className="dummy-car-ui"
          style={{
            width: '100%',
            height: '180px',
            backgroundColor: '#f8f9fa',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px'
          }}
        >
          <div style={{ fontSize: '48px' }}>🚗</div>
          <div style={{ marginTop: '8px', fontWeight: '500' }}>{car.car_model || car.name}</div>
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
        <p className="mt-2">Loading cars from Supabase...</p>
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
          Our Fleet 
        </h2>
        <span className="text-muted small">
          Showing {localCars.length} car{localCars.length !== 1 ? 's' : ''}
        </span>
      </div>

      {localCars.length === 0 ? (
        <div className="text-center py-5">
          <div className="mb-3" style={{ fontSize: '48px' }}>🚗</div>
          <h5 className="text-muted">No cars available yet</h5>
          <p className="small text-muted">Check back later or contact support</p>
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
                style={{ 
                  cursor: "pointer",
                  borderRadius: '8px',
                  overflow: 'hidden',
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {/* Favorite Button */}
                <div
                  className="favorite-btn position-absolute top-0 end-0 p-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(car.id);
                  }}
                  style={{ 
                    cursor: "pointer", 
                    zIndex: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '0 8px 0 8px'
                  }}
                >
                  {favorites.includes(car.id) ? "❤️" : "🤍"}
                </div>

                {/* Car Image */}
                {renderCarImage(car)}

                {/* Car Details - Only name and location */}
                <div className="p-3">
                  <h6 className="fw-bold mb-1" style={{ color: '#333' }}>
                    {car.car_model || car.name}
                  </h6>
                  <p className="text-muted mb-2" style={{ fontSize: '14px' }}>
                    📍 {car.location}
                  </p>
                  {car.car_number && (
                    <p className="small text-muted mb-0" style={{ fontSize: '12px' }}>
                      🚗 {car.car_number}
                    </p>
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