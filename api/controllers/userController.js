// postController.js
const { queryAsync } = require('../db');

const getUsers = async (req, res) => {
    try {
        const query = `
            SELECT id, name, username, email, role, created_at, user_image FROM users
        `;

        const users = await queryAsync(query);

        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
};

const getUserById = async (req, res) => {
    try {
        const userId = req.params.userId;

        const query = `
            SELECT id, name, username, email, role, created_at, user_image FROM users WHERE id = ?
        `;

        const user = await queryAsync(query, [userId]);

        if (user.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        res.status(200).json(user[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
};

module.exports = { getUsers, getUserById };
