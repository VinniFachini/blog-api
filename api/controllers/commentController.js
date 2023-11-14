// commentController.js
const { queryAsync } = require('../db');

// Criar um comentário
const createComment = async (req, res) => {
    try {
        const { content, parent_comment_id } = req.body;
        const postId = req.params.postId;

        // Verifica se o post existe antes de criar o comentário
        const existingPost = await queryAsync('SELECT * FROM posts WHERE id = ?', [postId]);

        if (existingPost.length === 0) {
            return res.status(404).json({ error: 'Post não encontrado' });
        }

        const userId = req.userId; // Obtém o ID do usuário autenticado do middleware

        // Insere o comentário no banco de dados
        await queryAsync(
            'INSERT INTO comments (content, post_id, user_id, parent_comment_id) VALUES (?, ?, ?, ?)',
            [content, postId, userId, parent_comment_id]
        );

        res.status(201).json({ message: 'Comentário criado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
};

// Obter comentários de um post
const getCommentsByPost = async (req, res) => {
    try {
        const postId = req.params.postId;

        // Busca os comentários relacionados a um post específico
        const comments = await queryAsync('SELECT * FROM comments WHERE post_id = ? AND approved = true', [postId]);

        res.status(200).json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
};

const getUnapprovedComments = async (req, res) => {
    try {
        const unnaprovedComments = await queryAsync('SELECT * FROM comments WHERE approved = false')
        res.status(200).json(unnaprovedComments)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Erro interno no servidor'})
    }
}

const getUnnaprovedCommentById = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const comment = await queryAsync('SELECT * FROM comments WHERE id = ? AND approved = false', [commentId])
        res.status(200).json(comment)
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'Erro interno no servidor'})
    }
}

const approveComment = async (req, res) => {
    try {
        const commentId = req.params.commentId;

        //check if comment exists
        const comment = await queryAsync('SELECT * FROM comments WHERE id = ? AND approved = false', [commentId])
        if (comment) {
            await queryAsync('UPDATE comments SET approved = true WHERE id = ?', [commentId])
            res.status(200).json(comment)
        } else {
            res.status(404).json({error: 'Comentário não encontrado'})
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'Erro interno no servidor'})
    }
}

module.exports = { createComment, getCommentsByPost, getUnapprovedComments, getUnnaprovedCommentById, approveComment };
