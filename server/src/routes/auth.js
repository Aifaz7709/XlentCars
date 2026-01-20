// src/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const supabase = require('../../supabaseClient'); // Your existing client

router.post('/register', async (req, res) => {
  try {
    const {
      customer_name,
      email,
      password,
      phone_number,
      vehicle_reg_number
    } = req.body;

    if (!email || !password || !customer_name) {
      return res.status(400).json({ 
        error: 'Email, password, and customer name are required' 
      });
    }

    // Use admin.createUser
    const { data: authData, error: authError } = 
      await supabase.auth.admin.createUser({
        email: email.trim().toLowerCase(),
        password,
        email_confirm: true, // ✅ Auto-confirm
        user_metadata: {
          customer_name,
          phone_number,
          vehicle_reg_number
        }
      });

    if (authError) {
      console.error('Registration error:', authError);
      return res.status(400).json({ error: authError.message });
    }

    const userId = authData.user.id;

    // Create profile
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await supabase
      .from('profiles')
      .insert([{
        id: userId,
        customer_name,
        email: email.trim().toLowerCase(),
        phone_number,
        vehicle_reg_number,
        password_hash: hashedPassword,
        created_at: new Date().toISOString()
      }]);

    return res.status(201).json({
      message: 'User registered successfully!',
      user_id: userId,
      email: authData.user.email
    });

  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// LOGIN - Using signInWithPassword with service role key
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    // This works with service role key too
    const { data: authData, error: authError } = 
      await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      });

    if (authError) {
      console.error('Login error:', authError);
      
      if (authError.message.includes('Invalid login credentials')) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      
      return res.status(401).json({ message: authError.message });
    }

    // Get profile
    const userId = authData.user.id;
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    return res.status(200).json({
      message: 'Login successful',
      token: authData.session.access_token,
      refresh_token: authData.session.refresh_token,
      expires_at: authData.session.expires_at,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        customer_name: profile?.customer_name || authData.user.user_metadata?.customer_name,
        phone_number: profile?.phone_number,
        vehicle_reg_number: profile?.vehicle_reg_number
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;