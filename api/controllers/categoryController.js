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


const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;

        // Exclui a categoria do banco de dados
        await queryAsync('DELETE FROM categories WHERE id = ?', [categoryId]);

        res.status(200).json({ message: 'Categoria excluída com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
};

module.exports = { getCategories, getCategoryById, createCategory, deleteCategory };
