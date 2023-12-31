// postController.js
const { queryAsync } = require('../db');
const fs = require('fs');
const path = require('path'); // To handle file paths

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

const editUserById = async (req, res) => {
    const userId = req.params.userId;
    const { name, username, email, role } = req.body;
    let userImage = req.body.imagePath; // Use the updated imagePath

    try {
        // Step 1: Check if user exists
        const checkUserQuery = `SELECT * FROM users WHERE id = ?`;
        const user = await queryAsync(checkUserQuery, [userId]);

        if (user.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Step 2: Handle image upload if provided
        if (userImage) {
            userImage = req.body.imagePath; // Update userImage with the new imagePath from handleImageUpload

            // If the user had an old image, remove it
            if (user[0].user_image) {
                const oldImagePath = path.join(__dirname, '..', 'uploads', user[0].user_image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
        }

        // Step 3: Update user details in the database
        const updateUserQuery = `
            UPDATE users 
            SET name = ?, username = ?, email = ?, role = ?, user_image = ?
            WHERE id = ?
        `;

        if (userImage) {
            const updateUserQuery = `
            UPDATE users 
            SET name = ?, username = ?, email = ?, role = ?, user_image = ?
            WHERE id = ?
        `;
            await queryAsync(updateUserQuery, [name, username, email, role, userImage, userId]);
        } else {
            const updateUserQuery = `
            UPDATE users 
            SET name = ?, username = ?, email = ?, role = ?
            WHERE id = ?
        `;
            await queryAsync(updateUserQuery, [name, username, email, role, userId]);
        }


        res.status(200).json({ message: 'Usuário atualizado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
};


const deleteUserById = async (req, res) => {
    const userId = req.params.userId;

    try {
        // Step 1: Delete associated comments
        const deleteCommentsQuery = `
            DELETE FROM comments WHERE user_id = ?
        `;
        await queryAsync(deleteCommentsQuery, [userId]);

        // Step 2: Delete associated post categories
        const deletePostCategoriesQuery = `
            DELETE FROM post_categories 
            WHERE post_id IN (SELECT id FROM posts WHERE author_id = ?)
        `;
        await queryAsync(deletePostCategoriesQuery, [userId]);

        // Step 3: Delete associated posts
        const deletePostsQuery = `
            DELETE FROM posts WHERE author_id = ?
        `;
        await queryAsync(deletePostsQuery, [userId]);

        // Step 4: Get the user's image filename
        const getUserImageQuery = `
            SELECT user_image FROM users WHERE id = ?
        `;
        const user = await queryAsync(getUserImageQuery, [userId]);

        if (user.length > 0 && user[0].user_image) {
            const imagePath = path.join(__dirname, '..', 'uploads', user[0].user_image);

            // Step 5: Delete the user's image from the uploads folder
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        // Step 6: Delete the user
        const deleteUserQuery = `
            DELETE FROM users WHERE id = ?
        `;
        const result = await queryAsync(deleteUserQuery, [userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado ou já deletado' });
        }

        res.status(200).json({ message: 'Usuário deletado com sucesso' });
    } catch (error) {
        console.error(error);

        // Handle specific database constraint errors or other errors as needed
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ error: 'Não é possível deletar o usuário porque existem registros relacionados.' });
        }

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

module.exports = { getUsers, getUserById, deleteUserById, editUserById };
