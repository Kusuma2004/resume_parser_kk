import React, { useState, useEffect } from 'react';
import { resumeAPI } from '../services/api';
import AnalysisModal from './AnalysisModal';
import LoadingSpinner from './LoadingSpinner';

const HistoricalViewer = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedResumeId, setSelectedResumeId] = useState(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const data = await resumeAPI.getHistory();
      setResumes(data);
    } catch (err) {
      setError('Failed to fetch resume history');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewDetails = (resumeId) => {
    setSelectedResumeId(resumeId);
  };

  const closeModal = () => {
    setSelectedResumeId(null);
  };

  if (loading) {
    return <LoadingSpinner message="Loading resume history..." />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="historical-viewer">
      <h2>Resume History</h2>
      
      {resumes.length === 0 ? (
        <div className="no-resumes">
          <p>No resumes have been analyzed yet.</p>
          <p>Upload a resume in the "Resume Analysis" tab to get started!</p>
        </div>
      ) : (
        <div className="resume-table-container">
          <table className="resume-table">
            <thead>
              <tr>
                <th>Filename</th>
                <th>Upload Date</th>
                <th>Applicant Name</th>
                <th>Rating</th>
                <th>Skills Count</th>
                <th>Improvement Areas</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {resumes.map((resume) => (
                <tr key={resume.id}>
                  <td className="filename">{resume.filename}</td>
                  <td>{formatDate(resume.upload_date)}</td>
                  <td>
                    {resume.contact_info?.name || 'N/A'}
                  </td>
                  <td>
                    <span className={`rating-badge rating-${Math.floor(resume.rating / 2)}`}>
                      {resume.rating}/10
                    </span>
                  </td>
                  <td>{resume.skills_count || 0}</td>
                  <td>{resume.improvement_count || 0}</td>
                  <td>
                    <button
                      className="details-button"
                      onClick={() => handleViewDetails(resume.id)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedResumeId && (
        <AnalysisModal
          resumeId={selectedResumeId}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default HistoricalViewer;