import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, ChevronDown, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="top-header">
      <div className="welcome-box">
        <h2>Welcome Back! 👋</h2>
        <p>Analyze your resume and get instant feedback</p>
      </div>

      <div className="user-profile-menu">
        <div 
          className="user-avatar-btn" 
          onClick={() => setDropdownOpen(!dropdownOpen)}
          title={user?.name || "User Profile"}
        >
          <User size={22} />
        </div>
        <ChevronDown 
          size={16} 
          color="#64748b" 
          onClick={() => setDropdownOpen(!dropdownOpen)}
          style={{ cursor: 'pointer' }}
        />

        {dropdownOpen && (
          <div style={{
            position: 'absolute',
            right: 0,
            top: '52px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0',
            padding: '12px',
            minWidth: '200px',
            zIndex: 50
          }}>
            <div style={{ paddingBottom: '8px', borderBottom: '1px solid #f1f5f9', marginBottom: '8px' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>
                {user?.name || 'Guest Candidate'}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                {user?.email || 'demo@example.com'}
              </div>
            </div>

            <button 
              onClick={() => { setDropdownOpen(false); navigate('/settings'); }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px',
                borderRadius: '6px',
                background: 'none',
                color: '#475569',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
              onMouseEnter={(e) => e.target.style.background = '#f8fafc'}
              onMouseLeave={(e) => e.target.style.background = 'none'}
            >
              <SettingsIcon size={16} /> Account Settings
            </button>

            <button 
              onClick={handleLogout}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px',
                borderRadius: '6px',
                background: 'none',
                color: '#ef4444',
                fontSize: '0.85rem',
                fontWeight: 600,
                marginTop: '4px'
              }}
              onMouseEnter={(e) => e.target.style.background = '#fef2f2'}
              onMouseLeave={(e) => e.target.style.background = 'none'}
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
