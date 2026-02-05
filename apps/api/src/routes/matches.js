const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticateToken, isReporter } = require('../middleware/auth');

// Get all matches
router.get('/', async (req, res) => {
  const matches = await prisma.match.findMany({
    orderBy: { startTime: 'desc' }
  });
  res.json(matches);
});

// Create/Update match (Reporter/Admin)
router.post('/', authenticateToken, isReporter, async (req, res) => {
  const { title, teamA, teamB, startTime, participants } = req.body;
  const match = await prisma.match.create({
    data: {
      title,
      teamA,
      teamB,
      startTime: new Date(startTime),
      participants
    }
  });
  res.status(201).json(match);
});

router.patch('/:id', authenticateToken, isReporter, async (req, res) => {
  const { scoreA, scoreB, status } = req.body;
  const match = await prisma.match.update({
    where: { id: parseInt(req.params.id) },
    data: { scoreA, scoreB, status }
  });

  // Emit update via socket
  const io = req.app.get('io');
  io.emit('match_update', match);

  res.json(match);
});

module.exports = router;
