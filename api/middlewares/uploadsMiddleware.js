const { v4: uuidv4 } = require('uuid'); // Import uuid v4
const fs = require('fs')

// req.body.imagePath = filePath; // Attach the file path to the request body for further processing
// next();

const filePath = `./uploads/${uuidv4()}`

function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    var response = {};

    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = Buffer.from(matches[2], 'base64');

    return response;
}

const handleImageUpload = (req, res, next) => {
    try {
        if(req.body.image != null) {
            imageBuffer = decodeBase64Image(req.body.image)
            imageTypeDetected = imageBuffer.type.match(/\/(.*?)$/)
    
            let finalPath = filePath + '.' + imageTypeDetected[1]
            
            req.body.imagePath = finalPath.replace('./uploads/', '')
    
            fs.writeFileSync(finalPath, imageBuffer.data, function () {})
            console.log('Not null!')
            console.log(req.body.imagePath)
            console.log(finalPath)
            next()
        } else {
            console.log('Null!')
            console.log(req.body.imagePath)
            next()
        }
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: 'Erro interno no servidor' })
    }
}

module.exports = {
    handleImageUpload
};