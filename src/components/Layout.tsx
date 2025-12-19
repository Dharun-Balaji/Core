import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Layout as LayoutIcon, Settings, LogOut, Kanban, Users, Bell } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="app-container" style={{ flexDirection: 'row' }}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon">
            <LayoutIcon size={20} color="white" />
          </div>
          <span className="logo-text">Core</span>
        </div>

        <nav className="sidebar-nav">
          <a href="#" className="nav-item active">
            <Kanban size={20} />
            <span>Boards</span>
          </a>
          <a href="#" className="nav-item">
            <Users size={20} />
            <span>Team</span>
          </a>
          <a href="#" className="nav-item">
            <Bell size={20} />
            <span>Updates</span>
            <span className="badge-count">3</span>
          </a>
          <a href="#" className="nav-item">
            <Settings size={20} />
            <span>Settings</span>
          </a>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <img src={user?.avatar} alt={user?.name} className="user-avatar" />
            <div className="user-info">
              <span className="user-name">{user?.name}</span>
              <span className="user-email">{user?.email}</span>
            </div>
          </div>
          <button onClick={logout} className="logout-btn" title="Sign Out">
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};
