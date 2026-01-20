// src/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const supabase = require('../../supabaseClient'); // adjust path if needed

// Registration endpoint - UPDATED FOR YOUR ENV VARS
router.post('/register', async (req, res) => {
  try {
    const {
      customer_name,
      email,
      password,
      phone_number,
      vehicle_reg_number
    } = req.body;

    // Validate required fields
    if (!email || !password || !customer_name) {
      return res.status(400).json({ 
        error: 'Email, password, and customer name are required' 
      });
    }

    // Use regular Supabase signUp (not admin)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          customer_name,
          phone_number,
          vehicle_reg_number
        }
      }
    });

    if (authError) {
      console.error('Registration auth error:', authError);
      return res.status(400).json({ error: authError.message });
    }

    const userId = authData.user.id;

    // Hash password for profiles table
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert profile
    const { data, error } = await supabase
      .from('profiles')
      .insert([{
        id: userId,
        customer_name,
        email,
        phone_number,
        vehicle_reg_number,
        password_hash: hashedPassword,
        created_at: new Date().toISOString()
      }]);

    if (error) {
      console.error('Profile creation error:', error);
      // Don't fail registration if profile insert fails
    }

    const needsEmailConfirmation = !authData.session;

    return res.status(201).json({
      message: needsEmailConfirmation 
        ? 'User registered successfully! Please check your email to confirm.'
        : 'User registered successfully!',
      user_id: userId,
      needs_email_confirmation: needsEmailConfirmation
    });

  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// LOGIN endpoint - UPDATED FOR YOUR ENV VARS
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body; // Use 'email' field (not 'username')

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Authenticate with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password
    });

    if (authError) {
      console.error('Login auth error:', authError);
      
      // User-friendly error messages
      if (authError.message.includes('Invalid login credentials')) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      if (authError.message.includes('Email not confirmed')) {
        return res.status(401).json({ 
          message: 'Please confirm your email address first' 
        });
      }
      
      return res.status(401).json({ message: authError.message });
    }

    // Check if profile exists
    const userId = authData.user.id;
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    // Create profile if missing
    if (profileError || !profile) {
      const hashedPassword = await bcrypt.hash(password, 10);
      
      await supabase
        .from('profiles')
        .insert([{
          id: userId,
          customer_name: authData.user.user_metadata?.customer_name || email.split('@')[0],
          email: authData.user.email,
          password_hash: hashedPassword,
          created_at: new Date().toISOString()
        }]);
    }

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

// Additional endpoints

// Check auth status
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ authenticated: false });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ authenticated: false });
    }

    // Get profile data
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return res.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        ...profile
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout
router.post('/logout', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      await supabase.auth.signOut(token);
    }
    
    return res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;