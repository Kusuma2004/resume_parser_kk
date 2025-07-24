const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Create table if it doesn't exist
const createTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS resumes (
      id UUID PRIMARY KEY,
      filename VARCHAR(255) NOT NULL,
      upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      contact_info JSONB,
      skills TEXT[],
      work_experience JSONB,
      education JSONB,
      rating INTEGER,
      improvement_areas TEXT[],
      suggested_skills TEXT[],
      raw_text TEXT,
      analysis_summary TEXT
    );
  `;
  
  try {
    await pool.query(query);
    console.log('Database table created successfully');
  } catch (error) {
    console.error('Error creating table:', error);
  }
};

createTable();

module.exports = pool;