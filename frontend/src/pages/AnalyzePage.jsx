import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import FileUploader from '../components/FileUploader';
import ScoreCard from '../components/ScoreCard';
import HighlightsCard from '../components/HighlightsCard';
import ProTipBanner from '../components/ProTipBanner';
import { resumeService } from '../services/resumeService';
import { useAuth } from '../context/AuthContext';
import { ExternalLink, CheckCircle2, AlertTriangle } from 'lucide-react';

const AnalyzePage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [feedbackNotice, setFeedbackNotice] = useState(null);

  // If there's an existing latest analysis in history, load it; otherwise default preview matches screenshot!
  useEffect(() => {
    if (isAuthenticated) {
      resumeService.getHistory()
        .then((data) => {
          if (data && data.length > 0) {
            // Load the most recent one's full details
            resumeService.getAnalysis(data[0].id)
              .then((fullData) => {
                setCurrentAnalysis(fullData);
              })
              .catch(() => {});
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  const handleAnalyze = async (file, jobTitle, jobDescription) => {
    setIsAnalyzing(true);
    setUploadProgress(25);
    setFeedbackNotice(null);

    try {
      setUploadProgress(60);
      const result = await resumeService.analyzeResume(
        file,
        jobTitle,
        jobDescription,
        (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 90) / progressEvent.total);
            setUploadProgress(percent);
          }
        }
      );
      setUploadProgress(100);
      setCurrentAnalysis(result);
      setFeedbackNotice({
        type: 'success',
        message: `Successfully analyzed ${file.name}! Overall Score: ${result.overall_score}% (${result.rating_label})`
      });
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message || 'Failed to analyze resume.';
      setFeedbackNotice({
        type: 'error',
        message: errMsg
      });
    } finally {
      setIsAnalyzing(false);
      setUploadProgress(0);
    }
  };

  const handleDownloadReport = async () => {
    if (!currentAnalysis?.id) {
      // In default preview mode, generate mock or trigger notification
      setFeedbackNotice({
        type: 'info',
        message: 'Upload your resume to generate and download your personalized PDF report!'
      });
      return;
    }

    try {
      const filename = `Resume_Analysis_Report_${currentAnalysis.id}.pdf`;
      await resumeService.downloadReport(currentAnalysis.id, filename);
      setFeedbackNotice({
        type: 'success',
        message: 'PDF report downloaded successfully!'
      });
    } catch (err) {
      setFeedbackNotice({
        type: 'error',
        message: 'Could not download PDF report. Please try again.'
      });
    }
  };

  return (
    <div className="app-layout">
      {/* Dark Sidebar matching UI screenshot */}
      <Sidebar />

      {/* Main Viewport */}
      <main className="main-viewport">
        {/* Top Header bar */}
        <Header />

        {/* Hero banner with illustration */}
        <HeroBanner />

        {/* Feedback alert toast */}
        {feedbackNotice && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 18px',
            borderRadius: '12px',
            marginBottom: '18px',
            fontSize: '0.88rem',
            fontWeight: 600,
            background: feedbackNotice.type === 'error' ? '#fef2f2' : (feedbackNotice.type === 'success' ? '#ecfdf5' : '#eff6ff'),
            color: feedbackNotice.type === 'error' ? '#b91c1c' : (feedbackNotice.type === 'success' ? '#047857' : '#1d4ed8'),
            border: `1px solid ${feedbackNotice.type === 'error' ? '#fecaca' : (feedbackNotice.type === 'success' ? '#a7f3d0' : '#bfdbfe')}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {feedbackNotice.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
              <span>{feedbackNotice.message}</span>
            </div>
            {currentAnalysis && (
              <button
                onClick={() => navigate(`/results/${currentAnalysis.id}`)}
                style={{
                  background: 'none',
                  color: 'inherit',
                  textDecoration: 'underline',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                View Detailed Breakdown <ExternalLink size={14} />
              </button>
            )}
          </div>
        )}

        {/* Top Row: Upload Card (Left) & Results/Score Card (Right) */}
        <div className="top-cards-grid">
          <FileUploader
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
            uploadProgress={uploadProgress}
          />

          <ScoreCard
            analysis={currentAnalysis}
            onDownloadReport={handleDownloadReport}
          />
        </div>

        {/* Middle Row: Strengths (Left) & Areas for Improvement (Right) */}
        <HighlightsCard
          strengths={currentAnalysis?.strengths}
          areasForImprovement={currentAnalysis?.areas_for_improvement}
        />

        {/* Bottom Row: Pro Tips Banner */}
        <ProTipBanner text={currentAnalysis?.pro_tips} />

        {/* Detailed Breakdown CTA if an analysis exists */}
        {currentAnalysis && (
          <div style={{ textAlign: 'center', marginTop: '22px' }}>
            <button
              onClick={() => navigate(`/results/${currentAnalysis.id}`)}
              style={{
                background: '#ede9fe',
                color: '#5b46e8',
                padding: '10px 24px',
                borderRadius: '9999px',
                fontWeight: 700,
                fontSize: '0.88rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 8px rgba(91, 70, 232, 0.15)'
              }}
            >
              <span>Explore In-Depth Skills Gap & Keyword Match Analysis</span>
              <ExternalLink size={15} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default AnalyzePage;
