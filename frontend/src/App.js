import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Patient from './components/Patient';
import Doctor from './components/Doctors';
import Admin from './components/Admins';
import Technicien from './components/Technicien';
import Secretary from './components/Secretary';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route 
            path="/patient" 
            element={
              <ProtectedRoute>
                <Patient />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/doctor" 
            element={
              <ProtectedRoute allowedRoles={['MEDECIN']}>
                <Doctor />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Admin />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/technician" 
            element={
              <ProtectedRoute allowedRoles={['TECHNICIAN']}>
                <Technicien />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/secretary" 
            element={
              <ProtectedRoute allowedRoles={['SECRETARY']}>
                <Secretary />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;