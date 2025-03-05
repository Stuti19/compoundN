import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import emailjs from '@emailjs/browser';
import './App.css';

// Initialize EmailJS
console.log('Starting EmailJS initialization...');
try {
  emailjs.init(process.env.REACT_APP_EMAILJS_PUBLIC_KEY);
  console.log('EmailJS initialized successfully');
} catch (error) {
  console.error('EmailJS initialization failed:', error);
}

function App() {
  return (
    <Router>
      <div className="App">
        <div className="background-boxes"></div>
        <div className="decorative-shapes"></div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
