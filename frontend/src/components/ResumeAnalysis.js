import React, { useState } from 'react';
import { resumeAPI } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const ResumeAnalysis = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please select a valid PDF file');
      setFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const result = await resumeAPI.uploadResume(formData);
      setAnalysis(result);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze resume');
    } finally {
      setLoading(false);
    }
  };

  const renderAnalysis = () => {
    if (!analysis) return null;

    return (
      <div className="analysis-results">
        <h2>Resume Analysis Results</h2>
        
        <div className="analysis-section">
          <h3>Overall Rating: {analysis.rating}/10</h3>
          <div className="rating-bar">
            <div 
              className="rating-fill" 
              style={{ width: `${(analysis.rating / 10) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="analysis-section">
          <h3>Contact Information</h3>
          <div className="contact-info">
            <p><strong>Name:</strong> {analysis.contactInfo?.name || 'Not found'}</p>
            <p><strong>Email:</strong> {analysis.contactInfo?.email || 'Not found'}</p>
            <p><strong>Phone:</strong> {analysis.contactInfo?.phone || 'Not found'}</p>
            <p><strong>Location:</strong> {analysis.contactInfo?.location || 'Not found'}</p>
            {analysis.contactInfo?.linkedin && (
              <p><strong>LinkedIn:</strong> {analysis.contactInfo.linkedin}</p>
            )}
          </div>
        </div>

        <div className="analysis-section">
          <h3>Skills ({analysis.skills?.length || 0})</h3>
          <div className="skills-list">
            {analysis.skills?.map((skill, index) => (
              <span key={index} className="skill-tag">{skill}</span>
            ))}
          </div>
        </div>

        <div className="analysis-section">
          <h3>Work Experience</h3>
          {analysis.workExperience?.map((job, index) => (
            <div key={index} className="job-entry">
              <h4>{job.position} at {job.company}</h4>
              <p className="duration">{job.duration}</p>
              <p className="description">{job.description}</p>
            </div>
          ))}
        </div>

        <div className="analysis-section">
          <h3>Education</h3>
          {analysis.education?.map((edu, index) => (
            <div key={index} className="education-entry">
              <h4>{edu.degree}</h4>
              <p>{edu.institution} - {edu.year}</p>
              {edu.gpa && <p>GPA: {edu.gpa}</p>}
            </div>
          ))}
        </div>

        <div className="analysis-section">
          <h3>Areas for Improvement</h3>
          <ul>
            {analysis.improvementAreas?.map((area, index) => (
              <li key={index}>{area}</li>
            ))}
          </ul>
        </div>

        <div className="analysis-section">
          <h3>Suggested Skills</h3>
          <div className="skills-list">
            {analysis.suggestedSkills?.map((skill, index) => (
              <span key={index} className="skill-tag suggested">{skill}</span>
            ))}
          </div>
        </div>

        <div className="analysis-section">
          <h3>Analysis Summary</h3>
          <p className="summary">{analysis.analysisSummary}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="resume-analysis">
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="upload-section">
          <label htmlFor="resume-upload" className="upload-label">
            Select Resume (PDF only)
          </label>
          <input
            id="resume-upload"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="file-input"
          />
          {file && <p className="file-selected">Selected: {file.name}</p>}
        </div>
        
        <button 
          type="submit" 
          disabled={!file || loading}
          className="upload-button"
        >
          {loading ? 'Analyzing...' : 'Analyze Resume'}
        </button>
      </form>

      {loading && <LoadingSpinner message="Analyzing your resume..." />}
      {error && <div className="error-message">{error}</div>}
      {renderAnalysis()}
    </div>
  );
};

export default ResumeAnalysis;