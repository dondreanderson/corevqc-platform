import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { ThemeProvider } from './contexts/ThemeContext';
import MobileNavigation from './components/MobileNavigation';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Login from './pages/Login';
import Register from './pages/Register';
import EnhancedQualityControlDashboard from './pages/EnhancedQualityControlDashboard';

function App() {
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/projects', label: 'Projects', icon: '🏗️' },
    { path: '/quality', label: 'Quality', icon: '🔍' }
  ];

  return (
    <ThemeProvider>
      <Router>
        <div className="App min-h-screen bg-gray-50">
          <MobileNavigation navItems={navItems} />
          <main className="p-4">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/quality" element={<EnhancedQualityControlDashboard />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
