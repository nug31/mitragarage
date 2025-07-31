const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  avatar: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['user', 'technician', 'admin'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  lastLogin: {
    type: Date,
    default: Date.now
  },
  preferences: {
    language: {
      type: String,
      enum: ['id', 'en', 'jv', 'su'],
      default: 'id'
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'dark'
    }
  },
  learningProgress: {
    totalLessons: { type: Number, default: 0 },
    completedLessons: { type: Number, default: 0 },
    totalHours: { type: Number, default: 0 },
    studyStreak: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    achievements: [{ type: String }],
    lastStudyDate: { type: Date }
  },
  diagnosisHistory: [{
    date: { type: Date, default: Date.now },
    symptoms: [String],
    diagnosis: String,
    recommendations: [String],
    estimatedCost: String,
    accuracy: Number
  }],
  vehicleInfo: {
    make: String,
    model: String,
    year: Number,
    engineType: String,
    mileage: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { 
      userId: this._id, 
      email: this.email, 
      role: this.role 
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
};

// Update learning progress
userSchema.methods.updateLearningProgress = function(lessonData) {
  this.learningProgress.totalLessons += 1;
  this.learningProgress.completedLessons += 1;
  this.learningProgress.totalHours += lessonData.duration || 0;
  this.learningProgress.averageScore = (
    (this.learningProgress.averageScore * (this.learningProgress.completedLessons - 1) + lessonData.score) / 
    this.learningProgress.completedLessons
  );
  this.learningProgress.lastStudyDate = new Date();
  
  // Update study streak
  const today = new Date();
  const lastStudy = this.learningProgress.lastStudyDate;
  const daysDiff = Math.floor((today - lastStudy) / (1000 * 60 * 60 * 24));
  
  if (daysDiff <= 1) {
    this.learningProgress.studyStreak += 1;
  } else {
    this.learningProgress.studyStreak = 1;
  }
  
  return this.save();
};

// Add diagnosis to history
userSchema.methods.addDiagnosis = function(diagnosisData) {
  this.diagnosisHistory.push({
    symptoms: diagnosisData.symptoms,
    diagnosis: diagnosisData.diagnosis,
    recommendations: diagnosisData.recommendations,
    estimatedCost: diagnosisData.estimatedCost,
    accuracy: diagnosisData.accuracy
  });
  
  return this.save();
};

// Get user statistics
userSchema.methods.getStatistics = function() {
  return {
    totalLessons: this.learningProgress.totalLessons,
    completedLessons: this.learningProgress.completedLessons,
    totalHours: this.learningProgress.totalHours,
    studyStreak: this.learningProgress.studyStreak,
    averageScore: this.learningProgress.averageScore,
    achievements: this.learningProgress.achievements.length,
    diagnosisCount: this.diagnosisHistory.length
  };
};

// Virtual for progress percentage
userSchema.virtual('progressPercentage').get(function() {
  if (this.learningProgress.totalLessons === 0) return 0;
  return Math.round((this.learningProgress.completedLessons / this.learningProgress.totalLessons) * 100);
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.password;
    delete ret.verificationToken;
    delete ret.resetPasswordToken;
    delete ret.resetPasswordExpires;
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema); 