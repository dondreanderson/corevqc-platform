import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard';
import Projects from './components/Projects';
import QualityControl from './components/QualityControl';
import DocumentManager from './components/DocumentManager';
import TeamDashboard from './components/TeamDashboard';
import ITPManager from './components/ITPManager';
import Login from './components/Login';
import Register from './components/Register';
import EnhancedNCRManager from './components/EnhancedNCRManager';
import './App.css';
import './components/Dashboard.css';
import './components/Projects.css';
import './components/QualityControl.css';
import './components/DocumentManager.css';
import './components/TeamDashboard.css';
import './components/ITPManager.css';
import './components/EnhancedNCRManager.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <nav className="navbar">
            <div className="nav-brand">
              <h2>🏗️ Vu-Qc Platform</h2>
            </div>
            <div className="nav-links">
              <Link to="/">Dashboard</Link>
              <Link to="/projects">Projects</Link>
              <Link to="/quality">Quality Control</Link>
              <Link to="/itps">ITPs</Link>
              <Link to="/documents">Documents</Link>
              <Link to="/team">Team</Link>
              <Link to="/enhanced-ncr">Enhanced NCR</Link>
            </div>
          </nav>

          <main className="main-content">
            <Routes>
              <Route path="/login" element={
                <ProtectedRoute requireAuth={false}>
                  <Login />
                </ProtectedRoute>
              } />
              <Route path="/register" element={
                <ProtectedRoute requireAuth={false}>
                  <Register />
                </ProtectedRoute>
              } />
              
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/projects" element={
                <ProtectedRoute>
                  <Projects />
                </ProtectedRoute>
              } />
              <Route path="/quality" element={
                <ProtectedRoute>
                  <QualityControl />
                </ProtectedRoute>
              } />
              <Route path="/itps" element={
                <ProtectedRoute>
                  <ITPManager />
                </ProtectedRoute>
              } />
              <Route path="/documents" element={
                <ProtectedRoute>
                  <DocumentManager />
                </ProtectedRoute>
              } />
              <Route path="/team" element={
                <ProtectedRoute>
                  <TeamDashboard />
                </ProtectedRoute>
              } />
              <Route path="/enhanced-ncr" element={
                <ProtectedRoute>
                  <EnhancedNCRManager />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;