import api from './api';

export const resumeService = {
  async analyzeResume(file, jobTitle = '', jobDescription = '', onUploadProgress) {
    const formData = new FormData();
    formData.append('file', file);
    if (jobTitle) formData.append('job_title', jobTitle);
    if (jobDescription) formData.append('job_description', jobDescription);

    const res = await api.post('/resumes/analyze/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
    return res.data;
  },

  async getHistory() {
    const res = await api.get('/resumes/');
    return res.data;
  },

  async getAnalysis(id) {
    const res = await api.get(`/resumes/${id}/`);
    return res.data;
  },

  async deleteAnalysis(id) {
    const res = await api.delete(`/resumes/${id}/`);
    return res.data;
  },

  async downloadReport(id, filename = 'Resume_Report.pdf') {
    const res = await api.get(`/resumes/${id}/report/`, {
      responseType: 'blob',
    });
    const blob = new Blob([res.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};
