// commentRoutes.js
const express = require('express');
const { getUnapprovedComments, getUnapprovedCommentById, approveComment, deleteComment } = require('../controllers/commentController');
const { verifyToken } = require('../middlewares/authentication');
const { authorize } = require('../middlewares/authorization');


const router = express.Router();

// Buscar comentários não aprovados
router.get('/', verifyToken, authorize, getUnapprovedComments);
router.get('/:commentId', verifyToken, authorize, getUnapprovedCommentById);
router.delete('/:commentId', verifyToken, authorize, deleteComment);
router.patch('/:commentId/approve', verifyToken, authorize, approveComment)

module.exports = router;
