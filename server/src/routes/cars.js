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
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

const uploadMiddleware = upload.any();

// ========== CREATE CAR (WITH AUTH REQUIRED) ==========
router.post('/', uploadMiddleware, async (req, res) => {
  try {
    // Get auth token from Authorization header
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    // Create Supabase client with token
    const userSupabase = supabase.auth.setAuth(token);

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error('Auth error:', authError);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Get form data
    const car_model = req.body.car_model?.trim() || '';
    const car_number = req.body.car_number?.trim() || '';
    const car_location = req.body.car_location?.trim() || '';
    const photosArray = (req.files || []).filter(file => file.fieldname === 'photos');

    // Validation
    if (!car_model) {
      return res.status(400).json({ error: 'Car model is required' });
    }
    if (!car_number) {
      return res.status(400).json({ error: 'Car number is required' });
    }
    if (!car_location) {
      return res.status(400).json({ error: 'Car location is required' });
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
      } else {
        console.error('Photo upload error:', uploadError);
      }
    }

    // Insert car WITH user_id
    const { data, error: insertError } = await userSupabase
      .from('cars')
      .insert([{
        car_model,
        car_number,
        car_location,
        photos: photoUrls,
        user_id: user.id, // Add user_id
        created_at: new Date().toISOString()
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
module.exports = router;