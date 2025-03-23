const { upload } = require('../services/imageService');

async function handleImageUpload(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No image file provided'
      });
    }

    // Cloudinary provides the URL in req.file.path
    res.json({
      message: 'Image uploaded successfully',
      imageUrl: req.file.path
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({
      error: 'Failed to upload image',
      message: error.message
    });
  }
}

module.exports = {
  handleImageUpload
}; 