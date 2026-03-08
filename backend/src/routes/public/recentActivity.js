const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Public endpoint - no authentication required
router.get("/", async (req, res) => {
  try {
    const reports = await prisma.garbageReport.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        address: true,
        status: true,
        createdAt: true
      }
    });

    res.json(reports);
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({ error: 'Failed to fetch recent activity' });
  }
});

module.exports = router;
