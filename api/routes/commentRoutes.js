// commentRoutes.js
const express = require('express');
const { getUnapprovedComments, getUnnaprovedCommentById, approveComment } = require('../controllers/commentController');
const { verifyToken } = require('../middlewares/authentication');
const { authorize } = require('../middlewares/authorization');


const router = express.Router();

// Buscar comentários não aprovados
router.get('/', verifyToken, authorize, getUnapprovedComments);
router.get('/:commentId', verifyToken, authorize, getUnnaprovedCommentById);
router.patch('/:commentId/approve', verifyToken, authorize, approveComment)

module.exports = router;
