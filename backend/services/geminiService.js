const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });
  }

  async analyzeResume(resumeText) {
    const prompt = `
    Analyze the following resume and return a JSON object with the following structure:
    {
      "contactInfo": {
        "name": "string",
        "email": "string",
        "phone": "string",
        "location": "string",
        "linkedin": "string"
      },
      "skills": ["skill1", "skill2", ...],
      "workExperience": [
        {
          "company": "string",
          "position": "string",
          "duration": "string",
          "description": "string"
        }
      ],
      "education": [
        {
          "institution": "string",
          "degree": "string",
          "year": "string",
          "gpa": "string (if available)"
        }
      ],
      "rating": number (1-10),
      "improvementAreas": ["area1", "area2", ...],
      "suggestedSkills": ["skill1", "skill2", ...],
      "analysisSummary": "string - detailed analysis summary"
    }

    Please analyze this resume thoroughly and provide constructive feedback:

    ${resumeText}

    Return only valid JSON without any markdown formatting or additional text.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean the response to ensure it's valid JSON
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      return JSON.parse(cleanedText);
    } catch (error) {
      console.error('Error analyzing resume with Gemini:', error);
      throw new Error('Failed to analyze resume');
    }
  }
}

module.exports = GeminiService;