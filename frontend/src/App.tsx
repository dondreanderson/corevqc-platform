import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components
import MobileNavigation from './components/MobileNavigation';

// Import your pages
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
        {/* Mobile Navigation */}
        <MobileNavigation />
        
        {/* Main Content */}
        <main className="lg:ml-0">
          <Routes>
            {/* Default route - redirect to projects */}
            <Route path="/" element={<Navigate to="/projects" replace />} />
            
            {/* Main routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/projects" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
