import React, { useState, useEffect } from 'react';
import { resumeAPI } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const AnalysisModal = ({ resumeId, onClose }) => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResumeDetails();
  }, [resumeId]);

  const fetchResumeDetails = async () => {
    try {
      setLoading(true);
      const data = await resumeAPI.getResumeById(resumeId);
      setResume(data);
    } catch (err) {
      setError('Failed to fetch resume details');
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const renderResumeDetails = () => {
    if (!resume) return null;

    const contactInfo = typeof resume.contact_info === 'string' 
      ? JSON.parse(resume.contact_info) 
      : resume.contact_info;
    
    const workExperience = typeof resume.work_experience === 'string'
      ? JSON.parse(resume.work_experience)
      : resume.work_experience;
    
    const education = typeof resume.education === 'string'
      ? JSON.parse(resume.education)
      : resume.education;

    return (
      <div className="modal-content">
        <div className="modal-header">
          <h2>Resume Analysis Details</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="analysis-section">
            <h3>File Information</h3>
            <p><strong>Filename:</strong> {resume.filename}</p>
            <p><strong>Upload Date:</strong> {new Date(resume.upload_date).toLocaleString()}</p>
            <p><strong>Overall Rating:</strong> {resume.rating}/10</p>
            <div className="rating-bar">
              <div 
                className="rating-fill" 
                style={{ width: `${(resume.rating / 10) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="analysis-section">
            <h3>Contact Information</h3>
            <div className="contact-info">
              <p><strong>Name:</strong> {contactInfo?.name || 'Not found'}</p>
              <p><strong>Email:</strong> {contactInfo?.email || 'Not found'}</p>
              <p><strong>Phone:</strong> {contactInfo?.phone || 'Not found'}</p>
              <p><strong>Location:</strong> {contactInfo?.location || 'Not found'}</p>
              {contactInfo?.linkedin && (
                <p><strong>LinkedIn:</strong> {contactInfo.linkedin}</p>
              )}
            </div>
          </div>

          <div className="analysis-section">
            <h3>Skills ({resume.skills?.length || 0})</h3>
            <div className="skills-list">
              {resume.skills?.map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>

          <div className="analysis-section">
            <h3>Work Experience</h3>
            {workExperience?.map((job, index) => (
              <div key={index} className="job-entry">
                <h4>{job.position} at {job.company}</h4>
                <p className="duration">{job.duration}</p>
                <p className="description">{job.description}</p>
              </div>
            ))}
          </div>

          <div className="analysis-section">
            <h3>Education</h3>
            {education?.map((edu, index) => (
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
              {resume.improvement_areas?.map((area, index) => (
                <li key={index}>{area}</li>
              ))}
            </ul>
          </div>

          <div className="analysis-section">
            <h3>Suggested Skills</h3>
            <div className="skills-list">
              {resume.suggested_skills?.map((skill, index) => (
                <span key={index} className="skill-tag suggested">{skill}</span>
              ))}
            </div>
          </div>

          <div className="analysis-section">
            <h3>Analysis Summary</h3>
            <p className="summary">{resume.analysis_summary}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="animated-shapes">
        <div className="shape shape1"></div>
        <div className="shape shape2"></div>
        <div className="shape shape3"></div>
        <div className="shape shape4"></div>
        <div className="shape shape5"></div>
        <div className="shape shape6"></div>
        <div className="shape shape7"></div>
      </div>
      <div className="modal-container">
        {loading && <LoadingSpinner message="Loading resume details..." />}
        {error && <div className="error-message">{error}</div>}
        {!loading && !error && renderResumeDetails()}
      </div>
      <style>{`
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0); }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
        }

        .animated-shapes .shape {
          position: absolute;
          border-radius: 50%;
          opacity: 0.6;
          animation: float 6s ease-in-out infinite;
        }

        .shape1 { width: 80px; height: 80px; background: #6b21a8; top: 10%; left: 20%; }
        .shape2 { width: 100px; height: 100px; background: #9333ea; top: 30%; left: 70%; }
        .shape3 { width: 60px; height: 60px; background: #c026d3; top: 60%; left: 40%; }
        .shape4 { width: 90px; height: 90px; background: #7e22ce; top: 80%; left: 80%; }
        .shape5 { width: 120px; height: 120px; background: #d946ef; top: 50%; left: 10%; }
        .shape6 { width: 70px; height: 70px; background: #a855f7; top: 20%; left: 50%; }
        .shape7 { width: 50px; height: 50px; background: #22d3ee; top: 70%; left: 60%; }

        .modal-container {
          background: #1f1f1f;
          border-radius: 1rem;
          padding: 2rem;
          width: 90%;
          max-width: 600px;
          position: relative;
          box-shadow: 0 0 20px rgba(0,0,0,0.5);
          color: white;
          z-index: 60;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .modal-header h2 {
          font-size: 1.5rem;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: white;
        }

        .modal-body {
          max-height: 60vh;
          overflow-y: auto;
        }

        .analysis-section {
          margin-bottom: 1.5rem;
        }

        .analysis-section h3 {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
          color: #c084fc;
        }

        .skill-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .skill-tag {
          background: linear-gradient(45deg, #a855f7, #ec4899);
          padding: 0.4rem 0.8rem;
          border-radius: 9999px;
          font-size: 0.9rem;
          color: white;
        }

        .error-message {
          color: #f87171;
          text-align: center;
          margin-top: 1rem;
        }
      `}</style>
    </div>
  );
};

export default AnalysisModal;



