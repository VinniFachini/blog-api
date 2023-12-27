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

        // Function to recursively fetch comments, replies, and associated user info
        const fetchCommentsAndReplies = async (parentId = null) => {
            const results = await queryAsync(`
                SELECT 
                    c.id, 
                    c.content, 
                    u.name AS user_name, 
                    u.user_image, 
                    u.username, 
                    c.created_at
                FROM comments c
                JOIN users u ON c.user_id = u.id
                WHERE c.post_id = ? AND c.approved = true AND c.parent_comment_id ${parentId ? '= ?' : 'IS NULL'}
            `, parentId ? [postId, parentId] : [postId]);

            const comments = [];

            for (const comment of results) {
                const replies = await fetchCommentsAndReplies(comment.id);
                comments.push({
                    id: comment.id,
                    content: comment.content,
                    user: {
                        name: comment.user_name,
                        user_image: comment.user_image,
                        username: comment.username
                    },
                    created_at: comment.created_at,
                    replies: replies
                });
            }

            return comments;
        };

        // Fetch top-level comments (comments without a parent)
        const topLevelComments = await fetchCommentsAndReplies();

        res.status(200).json(topLevelComments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
};

const getUnapprovedComments = async (req, res) => {
    try {
        const unapprovedComments = await queryAsync(`
            SELECT 
                c.id, 
                c.content, 
                c.post_id,
                u.username AS username,
                pc.id AS parent_comment_id
            FROM comments c
            JOIN users u ON c.user_id = u.id
            LEFT JOIN comments pc ON c.parent_comment_id = pc.id
            WHERE c.approved = false
        `);

        res.status(200).json(unapprovedComments);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
};

const getUnapprovedCommentById = async (req, res) => {
    try {
        const commentId = req.params.commentId;

        const comment = await queryAsync(`
            SELECT 
                c.id, 
                c.content, 
                c.post_id,
                u.username AS username,
                pc.id AS parent_comment_id
            FROM comments c
            JOIN users u ON c.user_id = u.id
            LEFT JOIN comments pc ON c.parent_comment_id = pc.id
            WHERE c.id = ? AND c.approved = false
        `, [commentId]);

        if (comment.length === 0) {
            return res.status(404).json({ error: 'Unapproved comment not found' });
        }

        res.status(200).json(comment[0]);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
};

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

const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.commentId;

        // Recursively delete child comments
        const deleteCommentsRecursively = async (commentId) => {
            const childComments = await queryAsync('SELECT id FROM comments WHERE parent_comment_id = ?', [commentId]);
            for (const childComment of childComments) {
                await deleteCommentsRecursively(childComment.id);
            }
            await queryAsync('DELETE FROM comments WHERE id = ?', [commentId]);
        };

        // Start the recursive deletion
        await deleteCommentsRecursively(commentId);

        res.status(200).json({ message: 'Comentário e todos os seus filhos excluídos com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno no servidor ao excluir comentário' });
    }
};

module.exports = { createComment, getCommentsByPost, getUnapprovedComments, getUnapprovedCommentById, approveComment, deleteComment };
