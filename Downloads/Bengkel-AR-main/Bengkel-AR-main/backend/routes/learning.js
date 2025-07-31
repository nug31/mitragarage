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

// @route   GET /api/learning/progress
// @desc    Get user learning progress
// @access  Private
router.get('/progress', auth, async (req, res) => {
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
        progress: user.learningProgress,
        statistics: user.getStatistics()
      }
    });

  } catch (error) {
    console.error('Get learning progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/learning/complete-lesson
// @desc    Mark lesson as completed and update progress
// @access  Private
router.post('/complete-lesson', auth, [
  body('lessonId')
    .notEmpty()
    .withMessage('Lesson ID is required'),
  body('lessonTitle')
    .notEmpty()
    .withMessage('Lesson title is required'),
  body('duration')
    .isNumeric()
    .withMessage('Duration must be a number'),
  body('score')
    .isNumeric()
    .withMessage('Score must be a number')
], validateRequest, async (req, res) => {
  try {
    const { lessonId, lessonTitle, duration, score, category } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update learning progress
    await user.updateLearningProgress({
      lessonId,
      lessonTitle,
      duration,
      score,
      category
    });

    // Check for achievements
    const achievements = [];
    const stats = user.getStatistics();

    if (stats.completedLessons === 5 && !user.learningProgress.achievements.includes('Pemula')) {
      achievements.push('Pemula');
      user.learningProgress.achievements.push('Pemula');
    }

    if (stats.completedLessons === 25 && !user.learningProgress.achievements.includes('Teknisi Muda')) {
      achievements.push('Teknisi Muda');
      user.learningProgress.achievements.push('Teknisi Muda');
    }

    if (stats.studyStreak >= 7 && !user.learningProgress.achievements.includes('Konsisten')) {
      achievements.push('Konsisten');
      user.learningProgress.achievements.push('Konsisten');
    }

    await user.save();

    res.json({
      success: true,
      message: 'Lesson completed successfully',
      data: {
        progress: user.learningProgress,
        statistics: user.getStatistics(),
        newAchievements: achievements
      }
    });

  } catch (error) {
    console.error('Complete lesson error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during lesson completion'
    });
  }
});

// @route   GET /api/learning/achievements
// @desc    Get user achievements
// @access  Private
router.get('/achievements', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const allAchievements = [
      { id: 'pemula', title: 'Pemula', description: 'Selesaikan 5 pelajaran', icon: '🎯' },
      { id: 'ahli_oli', title: 'Ahli Oli', description: 'Master perawatan dasar', icon: '🛢️' },
      { id: 'teknisi_muda', title: 'Teknisi Muda', description: 'Selesaikan 25 pelajaran', icon: '👨‍🔧' },
      { id: 'konsisten', title: 'Konsisten', description: 'Belajar 7 hari berturut-turut', icon: '🔥' },
      { id: 'master_bengkel', title: 'Master Bengkel', description: 'Selesaikan semua kategori', icon: '🏆' },
      { id: 'diagnostician', title: 'Diagnostician', description: 'Ahli diagnosis masalah', icon: '🔬' },
      { id: 'speed_demon', title: 'Speed Demon', description: 'Master modifikasi', icon: '🏎️' }
    ];

    const userAchievements = allAchievements.map(achievement => ({
      ...achievement,
      earned: user.learningProgress.achievements.includes(achievement.title)
    }));

    res.json({
      success: true,
      data: {
        achievements: userAchievements,
        totalEarned: user.learningProgress.achievements.length,
        totalAvailable: allAchievements.length
      }
    });

  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/learning/leaderboard
// @desc    Get learning leaderboard
// @access  Private
router.get('/leaderboard', auth, async (req, res) => {
  try {
    const users = await User.find({})
      .select('username fullName learningProgress')
      .sort({ 'learningProgress.completedLessons': -1 })
      .limit(10);

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      fullName: user.fullName,
      completedLessons: user.learningProgress.completedLessons,
      totalHours: user.learningProgress.totalHours,
      studyStreak: user.learningProgress.studyStreak,
      averageScore: user.learningProgress.averageScore
    }));

    res.json({
      success: true,
      data: {
        leaderboard,
        totalParticipants: await User.countDocuments()
      }
    });

  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/learning/reset-progress
// @desc    Reset user learning progress (for testing)
// @access  Private
router.post('/reset-progress', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Reset learning progress
    user.learningProgress = {
      totalLessons: 0,
      completedLessons: 0,
      totalHours: 0,
      studyStreak: 0,
      averageScore: 0,
      achievements: [],
      lastStudyDate: null
    };

    await user.save();

    res.json({
      success: true,
      message: 'Learning progress reset successfully',
      data: {
        progress: user.learningProgress
      }
    });

  } catch (error) {
    console.error('Reset progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during progress reset'
    });
  }
});

module.exports = router; 