// categoryRoutes.js
const express = require('express');
const router = express.Router();
const { getCategories, getCategoryById, createCategory, deleteCategory, getRelatedPostsByCategoryId, updateCategory } = require('../controllers/categoryController');
const { verifyToken } = require('../middlewares/authentication');
const { authorize } = require('../middlewares/authorization');

router.get('/', getCategories);
router.get('/:id/posts', getRelatedPostsByCategoryId);
router.get('/:id', getCategoryById);
router.patch('/:id', updateCategory);
router.post('/', verifyToken, authorize, createCategory);
router.delete('/:id', verifyToken, authorize, deleteCategory);

module.exports = router;
