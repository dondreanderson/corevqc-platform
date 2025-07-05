import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Theme Provider
import { ThemeProvider } from './contexts/ThemeContext';

// Components
import MobileNavigation from './components/MobileNavigation';
import QualityControlDashboard from './pages/QualityControlDashboard';

// Import your pages
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetail';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          {/* Mobile Navigation */}
          <MobileNavigation />
          
          {/* Main Content */}
          <main className="lg:ml-0 page-transition">
            <Routes>
              {/* Default route - redirect to projects */}
              <Route path="/" element={<Navigate to="/projects" replace />} />
              
              {/* Main routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetails />} />
              <Route path="/quality" element={<QualityControlDashboard />} />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/projects" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
