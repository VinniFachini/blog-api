// postRoutes.js
const express = require('express');
const router = express.Router();
const { getUsers, getUserById, deleteUserById, editUserById } = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authentication');
const { authorize } = require('../middlewares/authorization');
const { handleImageUpload } = require('../middlewares/uploadsMiddleware')

router.get('/', verifyToken, authorize, getUsers);
router.get('/:userId', verifyToken, authorize, getUserById);
router.delete('/:userId', verifyToken, authorize, deleteUserById)
router.patch('/:userId', verifyToken, authorize, handleImageUpload, editUserById)

module.exports = router;
