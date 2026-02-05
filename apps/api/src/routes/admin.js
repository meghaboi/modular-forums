const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Delete post
router.delete('/posts/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    await prisma.post.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Could not delete post' });
  }
});

// Update match (Score/Status)
router.patch('/matches/:id', authenticateToken, isAdmin, async (req, res) => {
  const { scoreA, scoreB, status } = req.body;
  try {
    const match = await prisma.match.update({
      where: { id: parseInt(req.params.id) },
      data: { scoreA, scoreB, status }
    });

    const io = req.app.get('io');
    io.emit('match_update', match);

    res.json(match);
  } catch (err) {
    res.status(400).json({ error: 'Could not update match' });
  }
});

module.exports = router;
