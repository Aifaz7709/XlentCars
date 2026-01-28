import React, { useState, useEffect } from 'react';
import { Upload, Plus, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addCar, removeCar, setCars } from '../Redux/Slices/carSlice';
import './AddCar.css';

const AddCar = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    car_model: '',
    car_number: ''
  });
  const [photoFiles, setPhotoFiles] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [cars, setLocalCars] = useState([]);
  const [loadingCars, setLoadingCars] = useState(false);

  const fetchCars = async () => {
    try {
      setLoadingCars(true);
      const token = localStorage.getItem('xlent_token');
      const apiUrl = process.env.REACT_APP_API_BASE_URL 
        ? `${process.env.REACT_APP_API_BASE_URL}/api/cars`
        : 'http://localhost:8080/api/cars';
      
      const res = await fetch(apiUrl, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch cars: ${res.status} - ${errorText}`);
      }
      
      const data = await res.json();
      const fetchedCars = data.cars || data || [];
      setLocalCars(fetchedCars);
      dispatch(setCars(fetchedCars));
      
    } catch (err) {
      console.error('fetchCars error:', err);
      setMessage({ type: 'error', text: 'Failed to load cars. Please try again.' });
    } finally {
      setLoadingCars(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [dispatch]);

  // Add this function to refresh the token
const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('xlent_refresh_token');
    const apiUrl = process.env.REACT_APP_API_BASE_URL 
      ? `${process.env.REACT_APP_API_BASE_URL}/api/auth/refresh`
      : 'http://localhost:8080/api/auth/refresh';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken })
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    localStorage.setItem('xlent_token', data.access_token);
    if (data.refresh_token) {
      localStorage.setItem('xlent_refresh_token', data.refresh_token);
    }
    return data.access_token;
  } catch (err) {
    console.error('Token refresh failed:', err);
    // Redirect to login or show login modal
    localStorage.removeItem('xlent_token');
    localStorage.removeItem('xlent_refresh_token');
    window.location.href = '/login';
    throw err;
  }
};
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 5 * 1024 * 1024; // 5MB per file

    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        setMessage({ type: 'error', text: `${file.name} is too large (max 5MB)` });
        return false;
      }
      return true;
    });

    if (validFiles.length + photoFiles.length > 5) {
      setMessage({ type: 'error', text: 'Maximum 5 photos allowed' });
      return;
    }

    // Store files
    setPhotoFiles(prev => [...prev, ...validFiles]);

    // Create previews
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setPhotoPreviews(prev => [...prev, ...newPreviews]);
  };

  const removePhoto = (index) => {
    URL.revokeObjectURL(photoPreviews[index]);
    setPhotoFiles(prev => prev.filter((_, i) => i !== index));
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const trimmedModel = formData.car_model.trim();
    const trimmedNumber = formData.car_number.trim();
  
    if (!trimmedModel || !trimmedNumber) {
      setMessage({ type: 'error', text: 'Please fill in car model and car number' });
      return;
    }
  
    setIsLoading(true);
    setMessage({ type: '', text: '' });
  
    try {
      let token = localStorage.getItem('xlent_token');
      if (!token) {
        throw new Error('Please log in to add a car');
      }
  
      const apiUrl = process.env.REACT_APP_API_BASE_URL 
        ? `${process.env.REACT_APP_API_BASE_URL}/api/cars`
        : 'http://localhost:8080/api/cars';
  
      const sendRequest = async (currentToken) => {
        const formDataToSend = new FormData();
        formDataToSend.append('car_model', trimmedModel);
        formDataToSend.append('car_number', trimmedNumber);
        
        photoFiles.forEach((file) => {
          formDataToSend.append('photos', file);
        });
  
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${currentToken}`
          },
          body: formDataToSend
        });
  
        // If token expired, try to refresh it
        if (response.status === 401) {
          const errorData = await response.json().catch(() => ({}));
          if (errorData.error?.includes('token') || errorData.error?.includes('expired')) {
            console.log('Token expired, attempting refresh...');
            const newToken = await refreshToken();
            // Retry with new token
            return sendRequest(newToken);
          }
        }
  
        return response;
      };
  
      const response = await sendRequest(token);
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || data.message || `Failed to add car: ${response.status}`);
      }
  
      // Success
      setMessage({ type: 'success', text: data.message || 'Car added successfully!' });
      
      if (data.car) {
        setLocalCars(prev => [data.car, ...prev]);
        dispatch(addCar(data.car));
      } else {
        fetchCars();
      }
  
      // Reset form
      setFormData({ car_model: '', car_number: '' });
      setPhotoFiles([]);
      setPhotoPreviews([]);
      
    } catch (err) {
      console.error('Error adding car:', err);
      setMessage({ 
        type: 'error', 
        text: err.message || 'Error adding car. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };  

  const deleteCar = async (carId) => {
    if (!window.confirm('Are you sure you want to delete this car?')) return;

    try {
      const token = localStorage.getItem('xlent_token');
      const apiUrl = process.env.REACT_APP_API_BASE_URL 
        ? `${process.env.REACT_APP_API_BASE_URL}/api/cars/${carId}`
        : `http://localhost:8080/api/cars/${carId}`;

      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete car');
      }

      // Update local state
      setLocalCars(prev => prev.filter(car => car.id !== carId));
      dispatch(removeCar(carId));
      setMessage({ type: 'success', text: data.message || 'Car deleted successfully' });
      
    } catch (err) {
      console.error('Error deleting car:', err);
      setMessage({ type: 'error', text: err.message || 'Error deleting car' });
    }
  };
  return (
    <div className="min-vh-100 py-5 add-car-container fade-in" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="container">
        <div className="row">
          {/* Add Car Form */}
          <div className="col-12 col-lg-6 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <h3 className="card-title fw-bold mb-4 d-flex align-items-center">
                  <Plus size={24} className="me-2 text-primary" />
                  Add New Car
                </h3>

                {message.text && (
                  <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} d-flex align-items-center mb-4`} role="alert">
                    {message.type === 'success' ? (
                      <CheckCircle size={18} className="me-2" />
                    ) : (
                      <AlertCircle size={18} className="me-2" />
                    )}
                    {message.text}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Car Model */}
                  <div className="mb-3">
                    <label htmlFor="car_model" className="form-label fw-semibold">
                      Car Model *
                    </label>
                    <input
                      type="text"
                      id="car_model"
                      name="car_model"
                      className="form-control"
                      placeholder="e.g., Honda City 2022"
                      value={formData.car_model}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Car Number */}
                  <div className="mb-3">
                    <label htmlFor="car_number" className="form-label fw-semibold">
                      Car Number *
                    </label>
                    <input
                      type="text"
                      id="car_number"
                      name="car_number"
                      className="form-control"
                      placeholder="e.g., MH12AB1234"
                      value={formData.car_number}
                      onChange={handleInputChange}
                      required
                    />
                    <small className="text-muted">Vehicle registration number</small>
                  </div>

                  {/* Photo Upload */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      Car Photos (Max 5)
                    </label>
                    <div className="photo-drop-zone border-2 border-dashed rounded p-4 text-center slide-up"
                      style={{
                        borderColor: '#dee2e6',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.currentTarget.style.borderColor = 'rgb(2, 40, 124)';
                        e.currentTarget.style.backgroundColor = 'rgba(2, 40, 124, 0.05)';
                      }}
                      onDragLeave={(e) => {
                        e.currentTarget.style.borderColor = '#dee2e6';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.currentTarget.style.borderColor = '#dee2e6';
                        handlePhotoUpload({ target: { files: e.dataTransfer.files } });
                      }}
                    >
                      <Upload size={32} className="text-primary mb-2 mx-auto" style={{ display: 'block' }} />
                      <p className="mb-1 upload-hint">Drag & drop photos here</p>
                      <p className="small text-muted upload-hint">or click to select (max 5, 5MB each)</p>
                      <input
                        type="file"
                        id="photos"
                        multiple
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="photos" className="btn btn-sm btn-outline-primary mt-2" style={{ cursor: 'pointer' }}>
                        Select Photos
                      </label>
                    </div>

                    {/* Photo Previews */}
                    {photoPreviews.length > 0 && (
                      <div className="mt-3">
                        <p className="text-muted small mb-2">{photoPreviews.length}/5 photos selected</p>
                        <div className="d-flex gap-2 flex-wrap">
                          {photoPreviews.map((photo, index) => (
                            <div key={index} className="position-relative" style={{ width: '80px', height: '80px' }}>
                              <img 
                                src={photo} 
                                alt={`Preview ${index}`}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                              />
                              <button
                                type="button"
                                className="btn btn-sm btn-danger position-absolute top-0 end-0 p-0"
                                style={{ transform: 'translate(4px, -4px)' }}
                                onClick={() => removePhoto(index)}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 fw-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Adding Car...
                      </>
                    ) : (
                      <>
                        <Plus size={18} className="me-2" />
                        Add Car
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* My Cars List */}
          <div className="col-12 col-lg-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <h3 className="card-title fw-bold mb-4">My Cars ({cars.length})</h3>

                {loadingCars ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : cars.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <p className="mb-0">No cars added yet</p>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {cars.map(car => (
                      <div key={car.id} className="border rounded p-3 position-relative">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h5 className="fw-bold mb-0">{car.car_model}</h5>
                          <span className="badge bg-primary">
                            {car.car_number}
                          </span>
                        </div>
                        
                        <p className="text-muted small mb-3">
                          Added on: {new Date(car.created_at).toLocaleDateString()}
                        </p>
                        
                        {/* Display Photos */}
                        {car.photos && car.photos.length > 0 && (
                          <div className="mb-3">
                            <p className="small text-muted mb-2">Photos:</p>
                            <div className="d-flex gap-2 flex-wrap">
                              {car.photos.slice(0, 3).map((photo, idx) => (
                                <img
                                  key={idx}
                                  src={photo}
                                  alt={`Car ${idx + 1}`}
                                  style={{
                                    width: '60px',
                                    height: '60px',
                                    objectFit: 'cover',
                                    borderRadius: '6px'
                                  }}
                                />
                              ))}
                              {car.photos.length > 3 && (
                                <div 
                                  className="d-flex align-items-center justify-content-center"
                                  style={{
                                    width: '60px',
                                    height: '60px',
                                    backgroundColor: '#f0f0f0',
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                  }}
                                >
                                  +{car.photos.length - 3}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteCar(car.id)}
                        >
                          <Trash2 size={14} className="me-1" />
                          Delete Car
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCar;