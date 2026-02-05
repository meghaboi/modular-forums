const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticateToken } = require('../middleware/auth');

// Get all threads
router.get('/', async (req, res) => {
  const { type, flair } = req.query;
  const where = {};
  if (type) where.type = type;
  if (flair) where.flair = flair;

  const posts = await prisma.post.findMany({
    where,
    include: {
      author: { select: { username: true } },
      _count: { select: { comments: true, votes: true } },
      votes: true
    },
    orderBy: { createdAt: 'desc' }
  });

  // Calculate net votes
  const postsWithVotes = posts.map(post => {
    const netVotes = post.votes.reduce((acc, vote) => acc + vote.value, 0);
    const { votes, ...rest } = post;
    return { ...rest, netVotes };
  });

  res.json(postsWithVotes);
});

// Create a thread
router.post('/', authenticateToken, async (req, res) => {
  const { title, content, type, flair } = req.body;
  const post = await prisma.post.create({
    data: {
      title,
      content,
      type: type || 'FORUM',
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
      votes: true,
      comments: {
        include: {
          author: { select: { username: true } },
          votes: true
        }
      }
    }
  });

  if (!post) return res.status(404).json({ error: 'Post not found' });

  // Calculate net votes for post
  const netVotes = post.votes.reduce((acc, vote) => acc + vote.value, 0);

  // Build comment tree
  const commentMap = {};
  post.comments.forEach(comment => {
    const cv = comment.votes.reduce((acc, v) => acc + v.value, 0);
    commentMap[comment.id] = { ...comment, netVotes: cv, replies: [] };
  });

  const rootComments = [];
  post.comments.forEach(comment => {
    if (comment.parentId) {
      if (commentMap[comment.parentId]) {
        commentMap[comment.parentId].replies.push(commentMap[comment.id]);
      }
    } else {
      rootComments.push(commentMap[comment.id]);
    }
  });

  const { votes, comments, ...postData } = post;
  res.json({ ...postData, netVotes, comments: rootComments });
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
    },
    include: {
      author: { select: { username: true } }
    }
  });

  const io = req.app.get('io');
  io.to(`post_${req.params.id}`).emit('new_comment', comment);

  res.status(201).json(comment);
});

// Vote on a post
router.post('/:id/vote', authenticateToken, async (req, res) => {
  const { value } = req.body; // 1 or -1
  const postId = parseInt(req.params.id);

  try {
    await prisma.vote.upsert({
      where: {
        userId_postId: {
          userId: req.user.id,
          postId: postId
        }
      },
      update: { value },
      create: {
        value,
        userId: req.user.id,
        postId: postId
      }
    });
    res.json({ message: 'Vote recorded' });
  } catch (err) {
    res.status(400).json({ error: 'Could not record vote' });
  }
});

module.exports = router;
