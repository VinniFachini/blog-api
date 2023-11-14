// middlewares/authorization.js
const { queryAsync } = require('../db');

const authorize = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Consulta o banco de dados para obter as permissões do usuário
        const userPermissions = await queryAsync('SELECT role FROM users WHERE id = ?', [userId]);

        if (userPermissions.length === 0) {
            return res.status(403).json({ error: 'Usuário não encontrado' });
        }

        // Verifica se o usuário tem a permissão necessária
        if (userPermissions[0].role !== 'Admin') {
            return res.status(403).json({ error: 'Acesso não autorizado' });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
};

module.exports = { authorize };
