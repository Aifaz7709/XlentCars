import React, { createContext, useContext, useEffect, useState } from "react";

const CarContext = createContext(null);

export const useCars = () => {
  const ctx = useContext(CarContext);
  if (!ctx) {
    throw new Error("useCars must be used inside CarProvider");
  }
  return ctx;
};

export const CarProvider = ({ children }) => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_BASE_URL
        ? `${process.env.REACT_APP_API_BASE_URL}/api/cars`
        : "http://localhost:5000/api/cars";

      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error("Failed to fetch cars");

      const data = await res.json();
      setCars(data.cars || []);
    } catch (err) {
      console.error("Car fetch failed:", err);
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  return (
    <CarContext.Provider value={{ cars, setCars, fetchCars, loading }}>
      {children}
    </CarContext.Provider>
  );
};
