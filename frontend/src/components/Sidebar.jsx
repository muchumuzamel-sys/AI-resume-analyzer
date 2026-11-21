import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Clock, 
  Info, 
  Settings, 
  FileSearch,
  Sparkles,
  Cpu
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/analyze', icon: Home },
    { label: 'History', path: '/history', icon: Clock },
    { label: 'About', path: '/about', icon: Info },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="app-sidebar">
      <div>
        {/* Logo Section */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <FileSearch size={24} strokeWidth={2.2} />
          </div>
          <div className="sidebar-logo-text">
            <div>AI Resume</div>
            <div>Analyzer</div>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
              (item.path === '/analyze' && (location.pathname === '/' || location.pathname.startsWith('/results')));

            return (
              <NavLink
                key={item.label}
                to={item.path}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={19} strokeWidth={isActive ? 2.3 : 1.8} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom 3D Graphic & Callout Card */}
      <div className="sidebar-footer-card">
        <div className="sidebar-card-art">
          {/* Document Sheet */}
          <div className="sidebar-card-resume">
            <div className="sidebar-resume-avatar"></div>
            <div className="sidebar-resume-line" style={{ width: '85%' }}></div>
            <div className="sidebar-resume-line" style={{ width: '60%' }}></div>
            <div className="sidebar-resume-line" style={{ width: '75%' }}></div>
            <div className="sidebar-resume-line" style={{ width: '40%' }}></div>
          </div>
          {/* AI Chip Badge */}
          <div className="sidebar-card-ai-badge">
            AI
          </div>
        </div>
        <div className="sidebar-footer-title">
          Build a Better<br />
          Resume with AI <span>✨</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
