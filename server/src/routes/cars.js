// src/routes/cars.js
const express = require('express');
const router = express.Router();
const supabase = require('../../supabaseClient'); // Adjust path based on your structure

// GET all cars
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(400).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET single car by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Car not found' });
      }
      return res.status(400).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST create new car
router.post('/', async (req, res) => {
  try {
    const { 
      make, 
      model, 
      year, 
      color, 
      mileage, 
      price_per_day, 
      transmission, 
      fuel_type, 
      seats, 
      image_url,
      available
    } = req.body;

    // Validate required fields
    if (!make || !model || !year || !price_per_day) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await supabase
      .from('cars')
      .insert([{
        make,
        model,
        year,
        color,
        mileage: mileage || 0,
        price_per_day,
        transmission: transmission || 'Automatic',
        fuel_type: fuel_type || 'Petrol',
        seats: seats || 5,
        image_url: image_url || null,
        available: available !== undefined ? available : true,
        created_at: new Date()
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json({
      message: 'Car created successfully',
      car: data
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update car
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const { data, error } = await supabase
      .from('cars')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Car not found' });
      }
      return res.status(400).json({ error: error.message });
    }

    return res.json({
      message: 'Car updated successfully',
      car: data
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE car
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('cars')
      .delete()
      .eq('id', id);

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Car not found' });
      }
      return res.status(400).json({ error: error.message });
    }

    return res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Search/filter cars
router.get('/search/filter', async (req, res) => {
  try {
    const { 
      make, 
      model, 
      minYear, 
      maxYear, 
      minPrice, 
      maxPrice,
      fuelType,
      transmission,
      available
    } = req.query;

    let query = supabase.from('cars').select('*');

    // Apply filters
    if (make) query = query.ilike('make', `%${make}%`);
    if (model) query = query.ilike('model', `%${model}%`);
    if (minYear) query = query.gte('year', parseInt(minYear));
    if (maxYear) query = query.lte('year', parseInt(maxYear));
    if (minPrice) query = query.gte('price_per_day', parseFloat(minPrice));
    if (maxPrice) query = query.lte('price_per_day', parseFloat(maxPrice));
    if (fuelType) query = query.eq('fuel_type', fuelType);
    if (transmission) query = query.eq('transmission', transmission);
    if (available !== undefined) query = query.eq('available', available === 'true');

    const { data, error } = await query.order('price_per_day', { ascending: true });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;