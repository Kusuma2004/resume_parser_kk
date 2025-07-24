import React, { useState } from 'react';
import ResumeAnalysis from './components/ResumeAnalysis';
import HistoricalViewer from './components/HistoricalViewer';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('analysis');

  return (
    <div className="App">
      <header className="App-header">
        <h1>Resume Analyzer</h1>
        <p>AI-powered resume analysis and improvement suggestions</p>
      </header>

      <nav className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'analysis' ? 'active' : ''}`}
          onClick={() => setActiveTab('analysis')}
        >
          Resume Analysis
        </button>
        <button
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Historical Viewer
        </button>
      </nav>

      <main className="main-content">
        {activeTab === 'analysis' && <ResumeAnalysis />}
        {activeTab === 'history' && <HistoricalViewer />}
      </main>

      <footer className="App-footer">
        <p>&copy; 2024 Resume Analyzer. Powered by Google Gemini AI.</p>
      </footer>
    </div>
  );
}

export default App;