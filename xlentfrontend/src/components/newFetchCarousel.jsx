import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCars as setCarsRedux, setLoading as setLoadingRedux } from "./Redux/Slices/carSlice";
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

  // Transform API data
  const transformCarData = (apiCars) => {
    const carTypes = ["Sedan", "SUV", "Hatchback", "Luxury", "Compact", "MUV"];
    const locations = ["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Kolkata"];
    const fuelTypes = ["Petrol", "Diesel", "CNG", "Electric"];

    return apiCars.map((car, index) => ({
      id: car.id || index,
      name: car.make || "Car",
      model: car.model || "Model",
      type: carTypes[index % carTypes.length],
      dailyRate: car.price_per_day || Math.floor(Math.random() * 3000) + 800,
      location: locations[index % locations.length],
      seats: car.seats || Math.floor(Math.random() * 4) + 4,
      luggage: Math.floor(Math.random() * 3) + 1,
      transmission: car.transmission || "Automatic",
      fuelType: car.fuel_type || fuelTypes[Math.floor(Math.random() * fuelTypes.length)],
      available: car.available !== false,
      mileage: car.mileage ? `${car.mileage} km` : `${Math.floor(Math.random() * 10) + 15} kmpl`,
      features: ["AC", "Bluetooth", "GPS", "Backup Camera", "Airbags", "Power Windows"].slice(0, 3 + Math.floor(Math.random() * 3)),
    }));
  };

  // Fallback data
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

  // Fetch from API
  const fetchCarsFromAPI = async () => {
    try {
      const apiBase = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
      const res = await fetch(`${apiBase}/api/cars`);
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error("Error fetching cars:", err);
      return [];
    }
  };

  useEffect(() => {
    if (!hasFetched && reduxCars.length === 0 && !reduxLoading) {
      setHasFetched(true);

      const fetchData = async () => {
        try {
          dispatch(setLoadingRedux(true));
          const apiCars = await fetchCarsFromAPI();
          if (apiCars.length > 0) {
            const transformed = transformCarData(apiCars);
            setLocalCars(transformed);
            dispatch(setCarsRedux(apiCars));
          } else {
            const fallback = generateFallbackData();
            setLocalCars(fallback);
            dispatch(setCarsRedux([]));
          }
        } catch (err) {
          console.error(err);
          const fallback = generateFallbackData();
          setLocalCars(fallback);
          dispatch(setCarsRedux([]));
        } finally {
          dispatch(setLoadingRedux(false));
        }
      };

      fetchData();
    }

    if (reduxCars.length > 0 && localCars.length === 0) {
      const transformed = transformCarData(reduxCars);
      setLocalCars(transformed);
    }
  }, [reduxCars, reduxLoading, hasFetched, dispatch, localCars.length]);

  function toggleFavorite(id) {
    const updated = favorites.includes(id) ? favorites.filter((f) => f !== id) : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  }

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
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold">Our Fleet</h4>
        <span className="text-muted small">❤️ Favorites: {favorites.length}</span>
      </div>

      <div className="row g-3">
        {localCars.map((car) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={car.id}>
            <div
              className="property-card shadow-sm position-relative"
              // onClick={() => navigate(`/car/${car.id}`)}
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

              {/* Availability Badge */}
              {!car.available && (
                <div className="availability-badge position-absolute top-0 start-0 m-2">
                  <span className="badge bg-danger">Not Available</span>
                </div>
              )}

              {/* Dummy Car UI */}
              <div className="dummy-car-ui">
                <div className="dummy-car-icon">🚗</div>
                <div className="dummy-car-text">{car.name} {car.model}</div>
              </div>

              {/* Car Details */}
              <div className="p-3">
                <p className="small text-primary fw-semibold mb-1">{car.type}</p>
                <p className="fw-semibold mb-1">{formatINR(car.dailyRate)}/day</p>
                <div className="car-specs mb-2">
                  <span className="text-muted small me-2">👥 {car.seats} seats</span>
                  <span className="text-muted small me-2">🎒 {car.luggage} luggage</span>
                  <span className="text-muted small">⛽ {car.mileage}</span>
                </div>

                <div className="mb-2">
                  <span
                    className={`badge-chip ${
                      car.available ? "bg-success" : "bg-secondary"
                    } text-white me-1`}
                  >
                    {car.available ? "Available" : "Booked"}
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
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewPropertyCard;
