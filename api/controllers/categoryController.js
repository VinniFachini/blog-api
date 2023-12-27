// categoryController.js
const { queryAsync } = require('../db');

const getCategories = async (req, res) => {
    try {
        // Busca todas as categorias
        const categories = await queryAsync('SELECT * FROM categories');

        res.status(200).json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
};

const getCategoryById = async (req, res) => {
    try {
        const categoryId = req.params.id;

        // Busca a categoria pelo ID
        const category = await queryAsync('SELECT * FROM categories WHERE id = ?', [categoryId]);

        if (category.length === 0) {
            return res.status(404).json({ error: 'Categoria não encontrada' });
        }

        res.status(200).json(category[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
};

const createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        // Verifica se a categoria já existe
        const categoryExists = await queryAsync('SELECT * FROM categories WHERE name = ?', [name]);

        if (categoryExists.length > 0) {
            return res.status(400).json({ error: 'Categoria já existe' });
        }

        // Insere a categoria no banco de dados
        await queryAsync('INSERT INTO categories (name) VALUES (?)', [name]);

        res.status(201).json({ message: 'Categoria criada com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
};

const getRelatedPostsByCategoryId = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await queryAsync('SELECT * FROM categories WHERE id = ?', [categoryId]);

        if (category.length === 0) {
            return res.status(404).json({ error: 'Categoria não encontrada' });
        }

        const relatedPosts = await queryAsync(`
            SELECT p.*, 
                   GROUP_CONCAT(c.name) AS categoryNames,
                   u.username AS author
            FROM posts p
            JOIN post_categories pc ON p.id = pc.post_id
            JOIN categories c ON pc.category_id = c.id
            LEFT JOIN users u ON p.author_id = u.id
            WHERE pc.category_id = ?
            GROUP BY p.id
        `, [categoryId]);

        relatedPosts.forEach(post => {
            post.categories = post.categoryNames ? post.categoryNames.split(',') : [];
            delete post.categoryNames;
            delete post.author_id;  // Removing the author_id from the response
        });

        res.status(200).json(relatedPosts);
    } catch (error) {
        console.error('Error encountered:', error.message);
        console.error('SQL Query:', `
            SELECT p.*, 
                   GROUP_CONCAT(c.name) AS categoryNames,
                   u.username AS author
            FROM posts p
            JOIN post_categories pc ON p.id = pc.post_id
            JOIN categories c ON pc.category_id = c.id
            LEFT JOIN users u ON p.author_id = u.id
            WHERE pc.category_id = ?
            GROUP BY p.id
        `);
        console.error('Error Stack Trace:', error.stack);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
};


const updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const { name } = req.body;

        // Check if the category exists
        const category = await queryAsync('SELECT * FROM categories WHERE id = ?', [categoryId]);

        if (category.length === 0) {
            return res.status(404).json({ error: 'Categoria não encontrada' });
        }

        // Update the category name in the categories table
        await queryAsync('UPDATE categories SET name = ? WHERE id = ?', [name, categoryId]);

        res.status(200).json({ message: 'Categoria atualizada com sucesso' });

    } catch (error) {
        console.error('Error encountered:', error.message);
        console.error('SQL Query:', 'UPDATE categories');
        console.error('Error Stack Trace:', error.stack);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
};


const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;

        // Remove related records from the post_categories table
        await queryAsync('DELETE FROM post_categories WHERE category_id = ?', [categoryId]);

        // Delete the category from the categories table
        await queryAsync('DELETE FROM categories WHERE id = ?', [categoryId]);

        res.status(200).json({ message: 'Categoria excluída com sucesso' });
    } catch (error) {
        console.error('Error encountered:', error.message);
        console.error('SQL Query:', 'DELETE operations');
        console.error('Error Stack Trace:', error.stack);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
};

module.exports = { getCategories, getCategoryById, createCategory, deleteCategory, getRelatedPostsByCategoryId, updateCategory };
