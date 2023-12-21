// authentication.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(403).json({ error: 'Token não fornecido' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Falha ao autenticar token' });
        }
        req.user = decoded;
        next();
    });
};


const getUserIdFromToken = (token) => {
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Use a variável de ambiente para obter o segredo
        const userId = decodedToken.id; // Substitua 'id' pela propriedade real do ID do usuário no payload
        return userId;
    } catch (error) {
        console.error('Erro ao verificar o token:', error);
    }
};

const getUserIdMiddleware = (req, res, next) => {
    const token = req.headers.authorization;

    try {
        if(getUserIdFromToken(token)) {
            const userId = getUserIdFromToken(token)
            if(userId) {
                req.userId = userId
            }
        }
        next();
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'Erro interno no servidor'})
        req.connection.destroy()
    }


};

module.exports = { verifyToken, getUserIdFromToken, getUserIdMiddleware };