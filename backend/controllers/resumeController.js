const Resume = require('../models/Resume');
const PDFService = require('../services/pdfService');
const GeminiService = require('../services/geminiService');
const geminiService = new GeminiService();

class ResumeController {
  static async uploadAndAnalyze(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const rawText = await PDFService.extractText(req.file.buffer);
      const analysis = await geminiService.analyzeResume(rawText);

      const resumeData = {
        filename: req.file.originalname,
        contactInfo: analysis.contactInfo,
        skills: analysis.skills,
        workExperience: analysis.workExperience,
        education: analysis.education,
        rating: analysis.rating,
        improvementAreas: analysis.improvementAreas,
        suggestedSkills: analysis.suggestedSkills,
        rawText: rawText,
        analysisSummary: analysis.analysisSummary
      };

      const savedResume = await Resume.save(resumeData);

      res.json({
        id: savedResume.id,
        ...analysis,
        uploadDate: savedResume.upload_date
      });
    } catch (error) {
      console.error('Error in uploadAndAnalyze:', error);
      res.status(500).json({ error: 'Failed to analyze resume' });
    }
  }

  static async getHistory(req, res) {
    try {
      const resumes = await Resume.findAll();
      res.json(resumes);
    } catch (error) {
      console.error('Error in getHistory:', error);
      res.status(500).json({ error: 'Failed to fetch resume history' });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const resume = await Resume.findById(id);

      if (!resume) {
        return res.status(404).json({ error: 'Resume not found' });
      }

      res.json(resume);
    } catch (error) {
      console.error('Error in getById:', error);
      res.status(500).json({ error: 'Failed to fetch resume details' });
    }
  }

  static async deleteById(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Resume.deleteById(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Resume not found or already deleted' });
      }

      res.json({ message: 'Resume deleted successfully' });
    } catch (error) {
      console.error('Error in deleteById:', error);
      res.status(500).json({ error: 'Failed to delete resume' });
    }
  }
}

module.exports = ResumeController;
