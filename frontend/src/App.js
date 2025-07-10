// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Projects from './components/Projects';
import QualityControl from './components/QualityControl';
import './App.css';
import './components/Dashboard.css';
import './components/Projects.css';
import './components/QualityControl.css';

function App() {
  return (
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
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/quality" element={<QualityControl />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
