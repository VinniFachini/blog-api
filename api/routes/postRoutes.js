// postRoutes.js
const express = require('express');
const router = express.Router();
const { getPosts, getPostById, createPost, updatePost, deletePost, getPostAuthorById } = require('../controllers/postController');
const { createComment, getCommentsByPost } = require('../controllers/commentController');
const { verifyToken, getUserIdMiddleware  } = require('../middlewares/authentication');
const { authorize } = require('../middlewares/authorization');

router.get('/', getPosts);
router.get('/:postId', getPostById);
router.get('/:postId/author', getPostAuthorById);
router.post('/', verifyToken, authorize, createPost);
router.patch('/:postId', verifyToken, authorize, updatePost);
router.delete('/:postId', verifyToken, authorize, deletePost);

router.post('/:postId/comments', getUserIdMiddleware, createComment);
router.get('/:postId/comments', getCommentsByPost);

module.exports = router;
