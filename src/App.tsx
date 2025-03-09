import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import EnrollTOTP from './pages/EnrollTOTP'
import Dashboard from './pages/Dashboard';
import Contact from './pages/ContactUs';
import About from './pages/AboutUs';
import AdminDashboard from './pages/AdminDashboard'
import { AuthProvider, useAuth } from './contexts/AuthContext';
import HomePage from './pages/Homepage';
const CheckAdmin = () => {
  const { session, profile } = useAuth();
  // if(!session)
  //   return <Navigate to="/login"/>
  return profile?.isAdmin ? <AdminDashboard /> : <Dashboard />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login/>} />
            <Route path="/signup" element={<Signup />} />
            <Route path='/setup' element={<EnrollTOTP/>} />
            <Route path="/dashboard" element={<CheckAdmin/> } />
            <Route path="/contact" element={<Contact/> } />
            <Route path="/about" element={<About/> } />
            <Route path="/" element={<HomePage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;