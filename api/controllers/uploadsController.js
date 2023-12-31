const fs = require('fs');
const path = require('path');

const getImageById = (req, res) => {
    const imageId = req.params.id;
    const imagePath = `./uploads/${imageId}`;

    // Check if the file exists
    if (fs.existsSync(imagePath)) {
        const fileExtension = path.extname(imagePath).slice(1); // Get the file extension
        const mimeType = `image/${fileExtension}`;

        res.setHeader('Content-Type', mimeType);
        fs.createReadStream(imagePath).pipe(res);
    } else {
        res.status(404).json({ error: 'Image not found' });
    }
};

module.exports = {getImageById}