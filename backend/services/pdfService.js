const pdf = require('pdf-parse');

class PDFService {
  static async extractText(buffer) {
    try {
      const data = await pdf(buffer);
      return data.text;
    } catch (error) {
      console.error('Error extracting PDF text:', error);
      throw new Error('Failed to extract text from PDF');
    }
  }
}

module.exports = PDFService;