const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Public endpoint - no authentication required
router.get("/", async (req, res) => {
  try {
    const [totalReports, completedTasks, activeWorkers] = await Promise.all([
      prisma.garbageReport.count(),
      prisma.task.count({
        where: { status: "COMPLETED" }
      }),
      prisma.user.count({
        where: { role: "Worker" }
      })
    ]);

    res.json({
      reports: totalReports,
      completed: completedTasks,
      workers: activeWorkers
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

module.exports = router;
