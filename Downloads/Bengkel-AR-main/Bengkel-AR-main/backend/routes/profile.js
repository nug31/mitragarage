const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

// Middleware to validate request
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      message: 'Validation error',
      errors: errors.array() 
    });
  }
  next();
};

// @route   GET /api/profile
// @desc    Get user profile
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          phoneNumber: user.phoneNumber,
          avatar: user.avatar,
          role: user.role,
          isVerified: user.isVerified,
          preferences: user.preferences,
          vehicleInfo: user.vehicleInfo,
          statistics: user.getStatistics()
        }
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/profile
// @desc    Update user profile
// @access  Private
router.put('/', auth, [
  body('fullName')
    .optional()
    .notEmpty()
    .withMessage('Full name cannot be empty'),
  body('phoneNumber')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('avatar')
    .optional()
    .isURL()
    .withMessage('Avatar must be a valid URL')
], validateRequest, async (req, res) => {
  try {
    const { fullName, phoneNumber, avatar, vehicleInfo } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields
    if (fullName) user.fullName = fullName;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (avatar) user.avatar = avatar;
    if (vehicleInfo) user.vehicleInfo = vehicleInfo;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          phoneNumber: user.phoneNumber,
          avatar: user.avatar,
          vehicleInfo: user.vehicleInfo
        }
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during profile update'
    });
  }
});

// @route   PUT /api/profile/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', auth, [
  body('language')
    .optional()
    .isIn(['id', 'en', 'jv', 'su'])
    .withMessage('Invalid language selection'),
  body('theme')
    .optional()
    .isIn(['light', 'dark', 'auto'])
    .withMessage('Invalid theme selection')
], validateRequest, async (req, res) => {
  try {
    const { language, notifications, theme } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update preferences
    if (language) user.preferences.language = language;
    if (notifications) user.preferences.notifications = notifications;
    if (theme) user.preferences.theme = theme;

    await user.save();

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: {
        preferences: user.preferences
      }
    });

  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during preferences update'
    });
  }
});

// @route   PUT /api/profile/vehicle
// @desc    Update vehicle information
// @access  Private
router.put('/vehicle', auth, [
  body('make')
    .optional()
    .notEmpty()
    .withMessage('Make cannot be empty'),
  body('model')
    .optional()
    .notEmpty()
    .withMessage('Model cannot be empty'),
  body('year')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage('Invalid year'),
  body('mileage')
    .optional()
    .isNumeric()
    .withMessage('Mileage must be a number')
], validateRequest, async (req, res) => {
  try {
    const { make, model, year, engineType, mileage } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update vehicle info
    if (make) user.vehicleInfo.make = make;
    if (model) user.vehicleInfo.model = model;
    if (year) user.vehicleInfo.year = year;
    if (engineType) user.vehicleInfo.engineType = engineType;
    if (mileage) user.vehicleInfo.mileage = mileage;

    await user.save();

    res.json({
      success: true,
      message: 'Vehicle information updated successfully',
      data: {
        vehicleInfo: user.vehicleInfo
      }
    });

  } catch (error) {
    console.error('Update vehicle info error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during vehicle info update'
    });
  }
});

// @route   DELETE /api/profile
// @desc    Delete user account
// @access  Private
router.delete('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete user account
    await User.findByIdAndDelete(req.user.userId);

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during account deletion'
    });
  }
});

// @route   GET /api/profile/statistics
// @desc    Get detailed user statistics
// @access  Private
router.get('/statistics', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const stats = user.getStatistics();
    const history = user.diagnosisHistory;

    // Calculate additional statistics
    const recentActivity = {
      lastLogin: user.lastLogin,
      lastStudyDate: user.learningProgress.lastStudyDate,
      lastDiagnosis: history.length > 0 ? history[history.length - 1].date : null
    };

    const learningStats = {
      ...user.learningProgress,
      progressPercentage: user.progressPercentage,
      averageScore: Math.round(user.learningProgress.averageScore * 100) / 100
    };

    const diagnosisStats = {
      totalDiagnoses: history.length,
      averageAccuracy: history.length > 0 
        ? Math.round(history.reduce((sum, item) => sum + item.accuracy, 0) / history.length * 100) / 100
        : 0,
      recentDiagnoses: history.slice(-5).reverse()
    };

    res.json({
      success: true,
      data: {
        overview: stats,
        learning: learningStats,
        diagnosis: diagnosisStats,
        activity: recentActivity
      }
    });

  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/profile/avatar
// @desc    Upload user avatar (mock implementation)
// @access  Private
router.post('/avatar', auth, async (req, res) => {
  try {
    const { avatarUrl } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // In a real app, you'd handle file upload here
    user.avatar = avatarUrl || 'https://via.placeholder.com/150';
    await user.save();

    res.json({
      success: true,
      message: 'Avatar updated successfully',
      data: {
        avatar: user.avatar
      }
    });

  } catch (error) {
    console.error('Update avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during avatar update'
    });
  }
});

module.exports = router; 