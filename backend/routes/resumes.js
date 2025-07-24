const express = require('express');
const multer = require('multer');
const ResumeController = require('../controllers/resumeController');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Routes
router.post('/upload', upload.single('resume'), ResumeController.uploadAndAnalyze);
router.get('/history', ResumeController.getHistory);
router.get('/:id', ResumeController.getById);
router.delete('/:id', ResumeController.deleteById);

module.exports = router;