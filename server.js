require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/phat-and-fit', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  records: [{
    date: Date,
    weight: Number,
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    exercises: [{
      name: String,
      sets: Number,
      reps: Number,
      weight: Number
    }]
  }]
});

const User = mongoose.model('User', userSchema);

// Authentication middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findOne({ _id: decoded._id });
    
    if (!user) {
      throw new Error();
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

// Routes
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 8);
    
    const user = new User({
      email,
      password: hashedPassword,
      name
    });
    
    await user.save();
    
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || 'your-secret-key');
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      throw new Error('Invalid login credentials');
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid login credentials');
    }
    
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || 'your-secret-key');
    res.send({ user, token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Protected routes
app.get('/api/records', auth, async (req, res) => {
  try {
    res.send(req.user.records);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/api/records', auth, async (req, res) => {
  try {
    req.user.records.push(req.body);
    await req.user.save();
    res.status(201).send(req.user.records);
  } catch (error) {
    res.status(400).send(error);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 