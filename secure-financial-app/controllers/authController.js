// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Input validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Hash the password
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ 
      name, 
      email, 
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({ 
    message: 'User registered successfully',
    token, 
    user: { 
    id:user._id,
    name:user.name,
    email : user.email,
  } 
});
  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: 'Server error, please try again later.' });
  }

  console.log(req.body);
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  // Input validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    console.log(user);
  if (user && (await bcrypt.compare(password, user.password))) {
    // Generate a JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // Return the token and user data
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, please try again later.' });
  }
};
