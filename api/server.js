// server.js
const express = require('express');
const bodyParser = require('body-parser');
const { verifyToken } = require('./middlewares/authentication');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const commentRoutes = require('./routes/commentRoutes');

const app = express();
const port = 3001;

app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/posts', postRoutes);
app.use('/categories', categoryRoutes);
app.use('/comments', commentRoutes);

// Rota Protegida (Exemplo)
app.get('/protected', verifyToken, (req, res) => {
    res.json({ message: 'Rota protegida alcançada', user: req.user });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
