const express = require('express');
const recentActivityRouter = require('./recentActivity');
const statisticsRouter = require('./statistics');

const router = express.Router();

// Mount public routes
router.use('/recent-activity', recentActivityRouter);
router.use('/statistics', statisticsRouter);

module.exports = router;
