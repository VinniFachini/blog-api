// postController.js
const { queryAsync } = require('../db');

const getPosts = async (req, res) => {
    try {
        const query = `
            SELECT posts.*, GROUP_CONCAT(categories.name) AS categoryNames
            FROM posts
            LEFT JOIN post_categories ON posts.id = post_categories.post_id
            LEFT JOIN categories ON post_categories.category_id = categories.id
            GROUP BY posts.id
        `;

        const posts = await queryAsync(query);

        // Transform categoryNames into an array
        posts.forEach(post => {
            post.categories = post.categoryNames ? post.categoryNames.split(',') : [];
            delete post.categoryNames;
        });

        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
};

const getPostById = async (req, res) => {
    try {
        const postId = req.params.postId;

        const query = `
            SELECT posts.*, GROUP_CONCAT(categories.name) AS categoryNames
            FROM posts
            LEFT JOIN post_categories ON posts.id = post_categories.post_id
            LEFT JOIN categories ON post_categories.category_id = categories.id
            WHERE posts.id = ?
            GROUP BY posts.id
        `;

        const post = await queryAsync(query, [postId]);

        if (post.length === 0) {
            return res.status(404).json({ error: 'Post não encontrado' });
        }

        // Transform categoryNames into an array
        post[0].categories = post[0].categoryNames ? post[0].categoryNames.split(',') : [];
        delete post[0].categoryNames;

        res.status(200).json(post[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
};

const createPost = async (req, res) => {
    try {
        const { title, content, categoryIds } = req.body;
        const authorId = req.user.id;

        // Insere o post no banco de dados
        const result = await queryAsync('INSERT INTO posts (title, content, author_id) VALUES (?, ?, ?)', [title, content, authorId]);
        const postId = result.insertId;

        // Associa as categorias ao post na tabela de relacionamento
        if (categoryIds && categoryIds.length > 0) {
            const categoryValues = categoryIds.map(categoryId => `(${postId}, ${categoryId})`).join(',');
            await queryAsync(`INSERT INTO post_categories (post_id, category_id) VALUES ${categoryValues}`);
        }

        res.status(201).json({ message: 'Post criado com sucesso', postId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
};

const updatePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const { title, content, categories } = req.body;

        // Verifica se o post existe antes de tentar atualizar
        const existingPost = await queryAsync('SELECT * FROM posts WHERE id = ?', [postId]);

        if (existingPost.length === 0) {
            return res.status(404).json({ error: 'Post não encontrado' });
        }

        // Atualiza apenas os campos fornecidos na requisição PATCH
        const updatedFields = [];
        const updateParams = [];

        if (title) {
            updatedFields.push('title = ?');
            updateParams.push(title);
        }

        if (content) {
            updatedFields.push('content = ?');
            updateParams.push(content);
        }

        // Atualiza o post apenas se houver campos para atualizar
        if (updatedFields.length > 0) {
            const updateQuery = `UPDATE posts SET ${updatedFields.join(', ')} WHERE id = ?`;
            updateParams.push(postId);

            await queryAsync(updateQuery, updateParams);
        }

        // Atualiza as categorias do post
        if (categories) {
            // Remove as categorias antigas
            await queryAsync('DELETE FROM post_categories WHERE post_id = ?', [postId]);

            // Adiciona as novas categorias
            const insertCategoryQuery = 'INSERT INTO post_categories (post_id, category_id) VALUES (?, ?)';
            for (const categoryId of categories) {
                await queryAsync(insertCategoryQuery, [postId, categoryId]);
            }
        }

        res.status(200).json({ message: 'Post atualizado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
};


const deletePost = async (req, res) => {
    try {
        const postId = req.params.postId;

        // Remove all references in the 'post_categories' table
        await queryAsync('DELETE FROM post_categories WHERE post_id = ?', [postId]);

        // Retrieve all comments associated with the post
        const commentsToDelete = await queryAsync('SELECT id FROM comments WHERE post_id = ?', [postId]);

        // Recursively delete child comments
        const deleteCommentsRecursively = async (commentId) => {
            const childComments = await queryAsync('SELECT id FROM comments WHERE parent_comment_id = ?', [commentId]);
            for (const childComment of childComments) {
                await deleteCommentsRecursively(childComment.id);
            }
            await queryAsync('DELETE FROM comments WHERE id = ?', [commentId]);
        };

        // Delete comments recursively
        for (const comment of commentsToDelete) {
            await deleteCommentsRecursively(comment.id);
        }

        // Physically delete the post from the 'posts' table
        await queryAsync('DELETE FROM posts WHERE id = ?', [postId]);

        res.status(200).json({ message: 'Post excluído com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
};

module.exports = { getPosts, getPostById, createPost, updatePost, deletePost };
