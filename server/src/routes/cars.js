const express = require('express');
const router = express.Router();
const supabase = require('../../supabaseClient');
const multer = require('multer');
const path = require('path');

// ========== MULTER SETUP ==========
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 5
  },
  fileFilter: (req, file, cb) => {
    // 1. Define allowed types
    const allowedExtensions = ['.jpeg', '.jpg', '.png', '.gif', '.webp'];
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    // 2. Extract values
    const extension = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype.toLowerCase();

    // 3. Debugging log - this will show in your terminal
    console.log(`Checking file: Name: ${file.originalname}, Ext: ${extension}, Mime: ${mimetype}`);

    // 4. Validate
    if (allowedExtensions.includes(extension) || allowedMimeTypes.includes(mimetype)) {
      cb(null, true);
    } else {
      // If the browser sends a blob without an extension, we check if mimetype starts with image/
      if (mimetype.startsWith('image/')) {
        return cb(null, true);
      }
      cb(new Error(`Only image files are allowed. Received: ${extension} / ${mimetype}`));
    }
  }
});

// Replace upload.any() with this:
const uploadMiddleware = upload.array('photos', 5);
// ========== CREATE CAR (NO AUTH REQUIRED) ==========
router.post('/', uploadMiddleware, async (req, res) => {
  try {
    // Get form data
    const car_model = req.body.car_model?.trim() || '';
    const car_number = req.body.car_number?.trim() || '';
    const car_location = req.body.car_location?.trim() || '';
    const photosArray = req.files || [];
    // Validation
    if (!car_model) {
      return res.status(400).json({ error: 'Car model is required' });
    }
    if (!car_number) {
      return res.status(400).json({ error: 'Car number is required' });
    }
    if (!car_location) {
      return res.status(400).json({ error: 'Car location is required' }); // ADD THIS
    }


    // Check for duplicate car number
    const { data: existingCar } = await supabase
      .from('cars')
      .select('id')
      .eq('car_number', car_number)
      .single();

    if (existingCar) {
      return res.status(400).json({ error: 'Car number already exists' });
    }

    // Upload photos
    const photoUrls = [];
    for (const file of photosArray) {
      const fileExt = path.extname(file.originalname);
      const fileName = `cars/${Date.now()}_${Math.random().toString(36).substr(2, 9)}${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('car-photos')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: true
        });

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from('car-photos')
          .getPublicUrl(fileName);
        photoUrls.push(publicUrl);
      }
    }

    // Insert car (WITHOUT user_id for now)
    const { data, error: insertError } = await supabase
      .from('cars')
      .insert([{
        car_model,  // Just car details, no user_id
        car_number,
        car_location: req.body.car_location?.trim() || null,
        photos: photoUrls,
        created_at: new Date().toISOString(),

      }])
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return res.status(400).json({ error: insertError.message });
    }

    res.status(201).json({
      message: 'Car added successfully',
      car: data
    });

  } catch (err) {
    console.error('Add car error:', err);
    
    // Handle multer errors
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large. Max 5MB per file' });
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({ error: 'Maximum 5 photos allowed' });
      }
      return res.status(400).json({ error: `File upload error: ${err.message}` });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ========== GET ALL CARS ==========
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/cars - Fetching all cars');
    
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return res.status(400).json({ error: error.message });
    }

    console.log(`Found ${data?.length || 0} cars`);
    res.json({ cars: data || [] });
    
  } catch (err) {
    console.error('GET /api/cars error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ========== GET SINGLE CAR (NO AUTH REQUIRED) ==========
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`GET /api/cars/${id} - Fetching single car`);
    
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Car not found:', error);
      return res.status(404).json({ error: 'Car not found' });
    }

    res.json(data);
    
  } catch (err) {
    console.error('GET /api/cars/:id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ========== DELETE CAR (NO AUTH REQUIRED) ==========
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`DELETE /api/cars/${id} - Deleting car`);

    // Get car to delete photos
    const { data: car } = await supabase
      .from('cars')
      .select('photos')
      .eq('id', id)
      .single();

    // Delete photos from storage
    if (car?.photos) {
      for (const photoUrl of car.photos) {
        const filePath = photoUrl.split('/car-photos/')[1];
        if (filePath) {
          await supabase.storage
            .from('car-photos')
            .remove([filePath]);
        }
      }
    }

    // Delete from database
    const { error } = await supabase
      .from('cars')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(404).json({ error: 'Car not found' });
    }

    res.json({ message: 'Car deleted successfully' });
    
  } catch (err) {
    console.error('DELETE /api/cars/:id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// ========== UPDATE CAR (NO AUTH REQUIRED) ==========
// ========== UPDATE CAR ==========
router.put('/:id', uploadMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const car_model = req.body.car_model?.trim();
    const car_number = req.body.car_number?.trim();
    const car_location = req.body.car_location?.trim();
    const newPhotos = req.files || [];

    // 1. Check for duplicate car number (excluding current car)
    const { data: duplicateCar } = await supabase
      .from('cars')
      .select('id')
      .eq('car_number', car_number)
      .neq('id', id)
      .maybeSingle();

    if (duplicateCar) {
      return res.status(400).json({ error: 'Car number already exists for another vehicle' });
    }

    // 2. Fetch current car data
    const { data: currentCar, error: fetchError } = await supabase
      .from('cars')
      .select('photos')
      .eq('id', id)
      .single();

    if (fetchError || !currentCar) {
      return res.status(404).json({ error: 'Car not found' });
    }

    // 3. Upload new photos (if any)
    const newPhotoUrls = [];
    for (const file of newPhotos) {
      const fileExt = path.extname(file.originalname);
      const fileName = `cars/${Date.now()}_${Math.random().toString(36).substr(2, 9)}${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('car-photos')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: true
        });

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from('car-photos')
          .getPublicUrl(fileName);
        newPhotoUrls.push(publicUrl);
      }
    }

    // 4. Combine old photos with new photos safely
    // Start with existing photos
    let updatedPhotos = Array.isArray(currentCar.photos) ? [...currentCar.photos] : [];
    
    // Add new photos
    updatedPhotos = [...updatedPhotos, ...newPhotoUrls];
    
    // Limit to 5 photos total (matches your Multer limit)
    updatedPhotos = updatedPhotos.slice(0, 5);

    // 5. Update Database
    const updateData = {};
    
    // Only add fields if they're provided
    if (car_model) updateData.car_model = car_model;
    if (car_number) updateData.car_number = car_number;
    if (car_location) updateData.car_location = car_location;
    updateData.photos = updatedPhotos;
    updateData.updated_at = new Date().toISOString();

    const { data, error: updateError } = await supabase
      .from('cars')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      return res.status(400).json({ error: updateError.message });
    }

    res.json({
      message: 'Car updated successfully',
      car: data
    });

  } catch (err) {
    console.error('Update car error:', err);
    
    // Handle multer errors
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large. Max 5MB per file' });
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({ error: 'Maximum 5 photos allowed' });
      }
      return res.status(400).json({ error: `File upload error: ${err.message}` });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});
module.exports = router;