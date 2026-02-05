const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticateToken } = require('../middleware/auth');

// Get all threads
router.get('/', async (req, res) => {
  const posts = await prisma.post.findMany({
    include: {
      author: { select: { username: true } },
      _count: { select: { comments: true, votes: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
  res.json(posts);
});

// Create a thread
router.post('/', authenticateToken, async (req, res) => {
  const { title, content, type, flair } = req.body;
  const post = await prisma.post.create({
    data: {
      title,
      content,
      type,
      flair,
      authorId: req.user.id
    }
  });
  res.status(201).json(post);
});

// Get a single thread with nested comments
router.get('/:id', async (req, res) => {
  const post = await prisma.post.findUnique({
    where: { id: parseInt(req.params.id) },
    include: {
      author: { select: { username: true } },
      comments: {
        where: { parentId: null },
        include: {
          author: { select: { username: true } },
          replies: {
            include: {
              author: { select: { username: true } },
              replies: true // This only goes 2 levels deep in one query
            }
          }
        }
      }
    }
  });
  res.json(post);
});

// Post a comment
router.post('/:id/comments', authenticateToken, async (req, res) => {
  const { content, parentId } = req.body;
  const comment = await prisma.comment.create({
    data: {
      content,
      postId: parseInt(req.params.id),
      authorId: req.user.id,
      parentId: parentId ? parseInt(parentId) : null
    }
  });
  res.status(201).json(comment);
});

module.exports = router;
