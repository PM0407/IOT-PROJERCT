
// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import Signup from './components/Signup';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProjectManagement from './components/ProjectManagement';
import AddWidgets from './components/AddWidgets'; // Import AddWidgets component
import PreviousProjects from './components/PreviousProjects';



const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<ProjectManagement />} />
          <Route path="/add-widgets/:projectId" element={<AddWidgets />} /> {/* Route for adding widgets */}
          <Route path="/previous-projects/:projectId" element={<PreviousProjects />} />
        
        </Routes>
      </div>
    </Router>
  );
};

export default App;
