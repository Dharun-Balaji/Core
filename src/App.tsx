import React from 'react';
import { useDispatch } from 'react-redux';
import { Plus, Search, Filter } from 'lucide-react';
import { Board } from './components/Board';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { addColumn } from './store/boardSlice';
import { useAuth } from './context/AuthContext';

import { Button } from './components/ui/Button';

const AuthenticatedApp: React.FC = () => {
  const dispatch = useDispatch();

  const handleAddColumn = () => {
    const title = prompt('Enter column title:');
    if (title && title.trim()) {
      dispatch(addColumn(title.trim()));
    }
  };

  return (
    <Layout>
      <header className="header" style={{ background: 'transparent', borderBottom: '1px solid var(--bg-card)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Core</h2>
          <div className="search-bar" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              background: 'var(--bg-secondary)', 
              padding: '6px 12px', 
              borderRadius: '8px',
              border: '1px solid var(--bg-card)',
              width: '300px'
          }}>
            <Search size={16} color="var(--text-secondary)" />
            <input 
                type="text" 
                placeholder="Search tasks..." 
                style={{ 
                    background: 'transparent', 
                    border: 'none', 
                    padding: '0 8px', 
                    width: '100%',
                    outline: 'none'
                }} 
            />
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
            <Button variant="secondary" icon={<Filter size={16} />}>
                Filter
            </Button>
            <Button onClick={handleAddColumn} icon={<Plus size={18} />}>
                Add Column
            </Button>
        </div>
      </header>
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Board />
      </div>
    </Layout>
  );
};

function App() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <AuthenticatedApp /> : <LoginPage />;
}

export default App;
