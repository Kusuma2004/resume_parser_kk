const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Resume {
  static async save(resumeData) {
    const id = uuidv4();
    const query = `
      INSERT INTO resumes (
        id, filename, contact_info, skills, work_experience, education,
        rating, improvement_areas, suggested_skills, raw_text, analysis_summary
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *;
    `;

    const values = [
      id,
      resumeData.filename,
      JSON.stringify(resumeData.contactInfo),
      resumeData.skills,
      JSON.stringify(resumeData.workExperience),
      JSON.stringify(resumeData.education),
      resumeData.rating,
      resumeData.improvementAreas,
      resumeData.suggestedSkills,
      resumeData.rawText,
      resumeData.analysisSummary
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error saving resume:', error);
      throw error;
    }
  }

  static async findAll() {
    const query = `
      SELECT 
        id, filename, upload_date, contact_info, rating,
        array_length(skills, 1) as skills_count,
        array_length(improvement_areas, 1) as improvement_count
      FROM resumes 
      ORDER BY upload_date DESC;
    `;

    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error fetching resumes:', error);
      throw error;
    }
  }

  static async findById(id) {
    const query = 'SELECT * FROM resumes WHERE id = $1;';
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error fetching resume by ID:', error);
      throw error;
    }
  }
}

module.exports = Resume;