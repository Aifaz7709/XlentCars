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

// ========== AUTH MIDDLEWARE ==========
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({ error: 'Authentication failed' });
  }
};

// ========== ROUTES ==========

// CREATE CAR
router.post('/', uploadMiddleware, authenticate, async (req, res) => {
  try {
    // Get form fields from req.body (NOT from files)
    const car_model = req.body.car_model?.trim() || '';
    const car_number = req.body.car_number?.trim() || '';
    
    // Get uploaded photos from req.files
    const photosArray = (req.files || []).filter(file => file.fieldname === 'photos');

    // Validation
    if (!car_model) {
      return res.status(400).json({ error: 'Car model is required' });
    }
    if (!car_number) {
      return res.status(400).json({ error: 'Car number is required' });
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

    // Upload photos to storage
    const photoUrls = [];
    for (const file of photosArray) {
      const fileExt = path.extname(file.originalname);
      const fileName = `${req.user.id}/${Date.now()}_${Math.random().toString(36).substr(2, 9)}${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('car-photos')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype
        });

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from('car-photos')
          .getPublicUrl(fileName);
        photoUrls.push(publicUrl);
      }
    }

    // Insert car into database
    const { data, error: insertError } = await supabase
      .from('cars')
      .insert([{
        user_id: req.user.id,
        car_model,
        car_number,
        photos: photoUrls,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (insertError) {
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

// GET ALL CARS FOR USER
router.get('/', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ cars: data || [] });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET SINGLE CAR
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Car not found' });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE CAR
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    // Get car to delete photos
    const { data: car } = await supabase
      .from('cars')
      .select('photos')
      .eq('id', id)
      .eq('user_id', req.user.id)
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
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) {
      return res.status(404).json({ error: 'Car not found' });
    }

    res.json({ message: 'Car deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;