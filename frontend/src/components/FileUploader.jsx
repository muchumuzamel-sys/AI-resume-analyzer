import React, { useState, useRef } from 'react';
import { UploadCloud, Folder, ChevronDown, ChevronUp, Loader2, FileCheck, AlertCircle } from 'lucide-react';

const FileUploader = ({ onAnalyze, isAnalyzing, uploadProgress }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showJdFields, setShowJdFields] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (file) => {
    setErrorMsg('');
    if (!file) return;

    // Check size (< 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('File size exceeds 5MB limit. Please upload a smaller file.');
      return;
    }

    const name = file.name.toLowerCase();
    if (!name.endsWith('.pdf') && !name.endsWith('.docx') && !name.endsWith('.doc')) {
      setErrorMsg('Only PDF and DOCX files are supported.');
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.stopPropagation();
    if (!selectedFile) {
      setErrorMsg('Please select a resume file first.');
      return;
    }
    onAnalyze(selectedFile, jobTitle, jobDescription);
  };

  return (
    <div className="upload-card-container">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.doc"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <div
        className={`upload-dropzone ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="upload-cloud-icon-wrap">
          <UploadCloud size={60} strokeWidth={1.8} />
        </div>

        <h3 className="upload-card-title">Upload Your Resume</h3>
        <p className="upload-card-sub">Drag & drop your file here or click to browse</p>
        <p className="upload-card-specs">Supports: PDF, DOC, DOCX • Max size: 5MB</p>

        {selectedFile ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '10px'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#ede9fe',
              color: '#5b46e8',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 700
            }}>
              <FileCheck size={16} />
              {selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)} KB)
            </div>

            <button
              type="button"
              className="btn-choose-file"
              disabled={isAnalyzing}
              onClick={handleSubmit}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 size={16} className="spin" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <Folder size={16} />
                  Analyze Now
                </>
              )}
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="btn-choose-file"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            <Folder size={17} />
            Choose File
          </button>
        )}

        {errorMsg && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#ef4444',
            fontSize: '0.8rem',
            fontWeight: 600,
            marginTop: '12px'
          }}>
            <AlertCircle size={15} />
            {errorMsg}
          </div>
        )}

        {isAnalyzing && (
          <div style={{ width: '100%', marginTop: '14px' }}>
            <div style={{ height: '5px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                background: 'linear-gradient(90deg, #6366f1, #a855f7)',
                width: `${uploadProgress || 80}%`,
                transition: 'width 0.4s ease'
              }}></div>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#6366f1', marginTop: '6px', fontWeight: 600 }}>
              AI engine extracting text, calculating ATS scores & matching skills...
            </p>
          </div>
        )}
      </div>

      {/* Target Job Description toggle for full SRS compliance */}
      <div className="jd-toggle-area">
        <button
          type="button"
          className="jd-toggle-btn"
          onClick={() => setShowJdFields(!showJdFields)}
        >
          {showJdFields ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          <span>{showJdFields ? 'Hide Target Job Description' : '+ Add Target Job Description (Optional)'}</span>
        </button>

        {showJdFields && (
          <div className="jd-inputs-box">
            <input
              type="text"
              className="input-field"
              placeholder="Target Job Role (e.g., Senior Full Stack Developer)"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
            <textarea
              className="textarea-field"
              rows={3}
              placeholder="Paste Job Description text here for automated keyword gap analysis..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
