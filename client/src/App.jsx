// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateEditPage from './pages/CreateEditPage';
import DashboardPage from './pages/DashboardPage';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
      <Route path="/" element={<CreateEditPage />} />
        <Route path="/learning-plans" element={<CreateEditPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </Router>
  );
}

export default App;
