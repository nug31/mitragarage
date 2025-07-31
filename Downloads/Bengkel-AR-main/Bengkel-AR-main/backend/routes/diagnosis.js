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

// @route   POST /api/diagnosis/add
// @desc    Add new diagnosis to user history
// @access  Private
router.post('/add', auth, [
  body('symptoms')
    .isArray()
    .withMessage('Symptoms must be an array'),
  body('diagnosis')
    .notEmpty()
    .withMessage('Diagnosis is required'),
  body('recommendations')
    .isArray()
    .withMessage('Recommendations must be an array'),
  body('estimatedCost')
    .notEmpty()
    .withMessage('Estimated cost is required'),
  body('accuracy')
    .isNumeric()
    .withMessage('Accuracy must be a number')
], validateRequest, async (req, res) => {
  try {
    const { symptoms, diagnosis, recommendations, estimatedCost, accuracy } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Add diagnosis to history
    await user.addDiagnosis({
      symptoms,
      diagnosis,
      recommendations,
      estimatedCost,
      accuracy
    });

    res.json({
      success: true,
      message: 'Diagnosis added to history',
      data: {
        diagnosisCount: user.diagnosisHistory.length
      }
    });

  } catch (error) {
    console.error('Add diagnosis error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during diagnosis addition'
    });
  }
});

// @route   GET /api/diagnosis/history
// @desc    Get user diagnosis history
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'date' } = req.query;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let history = [...user.diagnosisHistory];

    // Sort history
    if (sort === 'date') {
      history.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sort === 'accuracy') {
      history.sort((a, b) => b.accuracy - a.accuracy);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedHistory = history.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        history: paginatedHistory,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(history.length / limit),
          totalItems: history.length,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get diagnosis history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/diagnosis/statistics
// @desc    Get diagnosis statistics
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

    const history = user.diagnosisHistory;
    
    // Calculate statistics
    const totalDiagnoses = history.length;
    const averageAccuracy = history.length > 0 
      ? history.reduce((sum, item) => sum + item.accuracy, 0) / history.length 
      : 0;
    
    const accuracyRanges = {
      high: history.filter(item => item.accuracy >= 0.8).length,
      medium: history.filter(item => item.accuracy >= 0.6 && item.accuracy < 0.8).length,
      low: history.filter(item => item.accuracy < 0.6).length
    };

    // Most common symptoms
    const symptomCounts = {};
    history.forEach(item => {
      item.symptoms.forEach(symptom => {
        symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
      });
    });

    const topSymptoms = Object.entries(symptomCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([symptom, count]) => ({ symptom, count }));

    // Monthly trend
    const monthlyTrend = {};
    history.forEach(item => {
      const month = new Date(item.date).toISOString().slice(0, 7); // YYYY-MM
      monthlyTrend[month] = (monthlyTrend[month] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        totalDiagnoses,
        averageAccuracy: Math.round(averageAccuracy * 100) / 100,
        accuracyRanges,
        topSymptoms,
        monthlyTrend,
        recentDiagnoses: history.slice(0, 5)
      }
    });

  } catch (error) {
    console.error('Get diagnosis statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/diagnosis/:id
// @desc    Delete specific diagnosis from history
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Find and remove diagnosis
    const diagnosisIndex = user.diagnosisHistory.findIndex(
      diagnosis => diagnosis._id.toString() === id
    );

    if (diagnosisIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Diagnosis not found'
      });
    }

    user.diagnosisHistory.splice(diagnosisIndex, 1);
    await user.save();

    res.json({
      success: true,
      message: 'Diagnosis deleted successfully',
      data: {
        remainingCount: user.diagnosisHistory.length
      }
    });

  } catch (error) {
    console.error('Delete diagnosis error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during diagnosis deletion'
    });
  }
});

// @route   GET /api/diagnosis/search
// @desc    Search diagnosis history
// @access  Private
router.get('/search', auth, async (req, res) => {
  try {
    const { query, dateFrom, dateTo } = req.query;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let filteredHistory = [...user.diagnosisHistory];

    // Search by query
    if (query) {
      const searchQuery = query.toLowerCase();
      filteredHistory = filteredHistory.filter(item => 
        item.diagnosis.toLowerCase().includes(searchQuery) ||
        item.symptoms.some(symptom => symptom.toLowerCase().includes(searchQuery))
      );
    }

    // Filter by date range
    if (dateFrom || dateTo) {
      filteredHistory = filteredHistory.filter(item => {
        const itemDate = new Date(item.date);
        const fromDate = dateFrom ? new Date(dateFrom) : null;
        const toDate = dateTo ? new Date(dateTo) : null;

        if (fromDate && toDate) {
          return itemDate >= fromDate && itemDate <= toDate;
        } else if (fromDate) {
          return itemDate >= fromDate;
        } else if (toDate) {
          return itemDate <= toDate;
        }
        return true;
      });
    }

    // Sort by date (newest first)
    filteredHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      success: true,
      data: {
        results: filteredHistory,
        totalResults: filteredHistory.length
      }
    });

  } catch (error) {
    console.error('Search diagnosis error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/diagnosis/export
// @desc    Export diagnosis history (CSV format)
// @access  Private
router.get('/export', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create CSV content
    const csvHeader = 'Date,Diagnosis,Symptoms,Recommendations,Estimated Cost,Accuracy\n';
    const csvRows = user.diagnosisHistory.map(item => {
      const date = new Date(item.date).toISOString().split('T')[0];
      const symptoms = item.symptoms.join('; ');
      const recommendations = item.recommendations.join('; ');
      
      return `${date},"${item.diagnosis}","${symptoms}","${recommendations}","${item.estimatedCost}",${item.accuracy}`;
    }).join('\n');

    const csvContent = csvHeader + csvRows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="diagnosis-history-${Date.now()}.csv"`);
    res.send(csvContent);

  } catch (error) {
    console.error('Export diagnosis error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during export'
    });
  }
});

module.exports = router; 