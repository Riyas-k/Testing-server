import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/User';
import { generateToken } from '../utils/jwt';

// Register a new user
export const register = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Create new user
    user = new User({
      name,
      email,
      password
    });

    await user.save();

    // Generate JWT
    const token = generateToken(user);

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
export const login = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    // Generate JWT
    const token : any = generateToken(user);

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get current user
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email
    });
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
