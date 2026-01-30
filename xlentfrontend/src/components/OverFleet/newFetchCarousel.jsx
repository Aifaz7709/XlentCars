import React, { useEffect, useState, useRef, useCallback } from "react";
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [itemsPerSlide, setItemsPerSlide] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  
  const carouselRef = useRef(null);
  const autoPlayTimerRef = useRef(null);
  const resizeTimerRef = useRef(null);

  const minSwipeDistance = 50;

  // Fetch cars from API
  const fetchAllCarsFromAPI = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_BASE_URL 
        ? `${process.env.REACT_APP_API_BASE_URL}/api/cars`
        : 'https://xlent-production.up.railway.app/api/cars';
      
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
      
      if (data.cars && Array.isArray(data.cars)) {
        return data.cars;
      } else if (Array.isArray(data)) {
        return data;
      } else {
        console.error('Unexpected response format:', data);
        return [];
      }
    } catch (err) {
      console.error("Error fetching cars:", err);
      return [];
    }
  };

  const transformCarData = (apiCars) => {
    return apiCars.map((car) => ({
      id: car.id,
      name: car.car_model || "Car",
      location: car.car_location || "Location not specified",
      photos: car.photos || [],
      car_model: car.car_model || "Unknown Model",
      car_number: car.car_number || "N/A",
      // price: car.price || Math.floor(Math.random() * 200) + 50,
      // fuel_type: car.fuel_type || "Petrol",
      // transmission: car.transmission || "Automatic",
      // seats: car.seats || 5,
      // year: car.year ,
      // rating: car.rating || (4 + Math.random()).toFixed(1),
      // mileage: car.mileage || `${Math.floor(Math.random() * 50) + 10} km/l`
    }));
  };

  // Handle responsive items per slide
  const updateItemsPerSlide = useCallback(() => {
    const width = window.innerWidth;
    setIsMobile(width < 768);
    
    if (width < 480) {
      setItemsPerSlide(1);
    } else if (width < 768) {
      setItemsPerSlide(2);
    } else if (width < 1024) {
      setItemsPerSlide(3);
    } else {
      setItemsPerSlide(4);
    }
  }, []);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(setLoadingRedux(true));
        const apiCars = await fetchAllCarsFromAPI();
        
        if (apiCars.length > 0) {
          const transformed = transformCarData(apiCars);
          setLocalCars(transformed);
          dispatch(setCarsRedux(apiCars));
        } else {
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

    if (!hasFetched || reduxCars.length === 0) {
      fetchData();
    } else if (reduxCars.length > 0 && localCars.length === 0) {
      const transformed = transformCarData(reduxCars);
      setLocalCars(transformed);
    }

    // Setup responsive handling
    updateItemsPerSlide();
    window.addEventListener('resize', updateItemsPerSlide);

    return () => {
      window.removeEventListener('resize', updateItemsPerSlide);
    };
  }, [dispatch, hasFetched, reduxCars.length, localCars.length, updateItemsPerSlide]);

  const totalSlides = Math.max(1, Math.ceil(localCars.length / itemsPerSlide));

  // Carousel navigation functions
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => {
      if (prev >= totalSlides - 1) {
        // If at last slide, go back to first with smooth transition
        setTimeout(() => {
          setCurrentSlide(0);
        }, 50);
        return 0;
      }
      return prev + 1;
    });
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => {
      if (prev <= 0) {
        // If at first slide, go to last
        return totalSlides - 1;
      }
      return prev - 1;
    });
  }, [totalSlides]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || localCars.length === 0) return;

    autoPlayTimerRef.current = setInterval(() => {
      nextSlide();
    }, 4000); // 4 seconds for auto-play

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [isAutoPlaying, nextSlide, localCars.length]);

  // Toggle auto-play
  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  // Touch events for mobile swipe
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  // Pause auto-play on hover for desktop
  const handleMouseEnter = () => {
    if (isAutoPlaying && !isMobile) {
      setIsAutoPlaying(false);
    }
  };

  const handleMouseLeave = () => {
    if (!isAutoPlaying && !isMobile) {
      setIsAutoPlaying(true);
    }
  };

  // Toggle favorite
  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    const updated = favorites.includes(id) 
      ? favorites.filter((f) => f !== id) 
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const renderCarImage = (car) => {
    if (car.photos && car.photos.length > 0) {
      return (
        <div className="car-image-container">
          <img 
            src={car.photos[0]} 
            alt={`${car.car_model || car.name}`}
            className="car-image"
            loading="lazy"
          />
          <div className="car-badge">{car.year}</div>
        </div>
      );
    } else {
      return (
        <div className="car-image-placeholder">
          <div className="car-icon">🚗</div>
          <div className="car-model">{car.car_model || car.name}</div>
        </div>
      );
    }
  };

  if (reduxLoading && localCars.length === 0) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading cars...</p>
      </div>
    );
  }

  return (
    <div className="carousel-container1">
      <div className="carousel-header">
        <div>
          <h2 className="carousel-title">Our Premium Fleet</h2>
          <p className="carousel-subtitle">Explore our curated collection of vehicles</p>
        </div>
        <div className="carousel-controls-group">

          <div className="carousel-controls">
            <button 
              className="carousel-btn prev-btn"
              onClick={prevSlide}
              aria-label="Previous slide"
            >
              ←
            </button>
            <button 
              className="carousel-btn next-btn"
              onClick={nextSlide}
              aria-label="Next slide"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {localCars.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🚗</div>
          <h3>No cars available</h3>
          <p>Check back later for new additions to our fleet</p>
        </div>
      ) : (
        <>
          <div 
            className="carousel-wrapper"
            ref={carouselRef}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div 
              className="carousel-track"
              style={{
                transform: `translateX(-${currentSlide * (100 / itemsPerSlide)}%)`,
             
              }}
            >
              {localCars.map((car) => (
                <div 
                  key={car.id}
                  className="car-card"
                  style={{
                    width: `${100 / itemsPerSlide}%`
                  }}
                  onClick={() => navigate(`/book/${car.id}`, { 
                    state: { 
                      car: {
                        ...car,
                         originalData: reduxCars.find(c => c.id === car.id) || car
                      }
                    } 
                  })}
                >
                  <div className="card-inner">
                    <button 
                      className={`favorite-btn ${favorites.includes(car.id) ? 'active' : ''}`}
                      onClick={(e) => toggleFavorite(car.id, e)}
                      aria-label={favorites.includes(car.id) ? "Remove from favorites" : "Add to favorites"}
                    >
                      {favorites.includes(car.id) ? '❤️' : '🤍'}
                    </button>

                    {renderCarImage(car)}

                    <div className="car-details">
                      <div className="car-header">
                        <h3 className="car-name">{car.car_model || car.name}</h3>
                        {/* <div className="car-price">${car.price}<span>/day</span></div> */}
                      </div>
                      
                      {/* <div className="car-rating">
                        <span className="stars">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={i < Math.floor(car.rating) ? 'star-filled' : 'star-empty'}>
                              ★
                            </span>
                          ))}
                        </span>
                        <span className="rating-text">{car.rating}</span>
                      </div> */}

                 

                      <div className="car-location">
                        <span className="location-icon">📍</span>
                        <span className="location-text">{car.location}</span>
                      </div>

                      {/* <div className="car-mileage">
                        <span className="mileage-text">Mileage: {car.mileage}</span>
                      </div> */}

                      <button className="book-btn">
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

       

       
        </>
      )}
    </div>
  );
};

export default NewPropertyCard;