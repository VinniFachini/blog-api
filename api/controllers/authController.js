// authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { queryAsync } = require('../db');

const register = async (req, res) => {
    try {
        const { name, email, password, username, role } = req.body;

        // Verifica se o usuário já existe
        const userExists = await queryAsync('SELECT * FROM users WHERE username = ?', [username]);

        if (userExists.length > 0) {
            return res.status(400).json({ error: 'Nome de usuário já em uso' });
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insere o usuário no banco de dados
        await queryAsync('INSERT INTO users (name, email, password, username, role) VALUES (?, ?, ?, ?, ?)', [name, email, hashedPassword, username, role]);

        res.status(201).json({ message: 'Usuário registrado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Busca o usuário no banco de dados
        const results = await queryAsync('SELECT * FROM users WHERE username = ?', [username]);

        if (results.length > 0) {
            // Compara as senhas
            const match = await bcrypt.compare(password, results[0].password);

            if (match) {
                // Gera um token JWT válido por 1 hora
                const token = jwt.sign({ username: results[0].username, id: results[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                res.status(200).json({ token });
            } else {
                res.status(401).json({ error: 'Credenciais inválidas' });
            }
        } else {
            res.status(401).json({ error: 'Credenciais inválidas' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
};

module.exports = { register, login };