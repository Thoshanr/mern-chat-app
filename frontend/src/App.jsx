import React from 'react';
import './App.css';
import Home from './hooks/pages/home/Home.jsx';
import Login from './hooks/pages/login/Login.jsx';
import SignUp from './hooks/pages/signup/SignUp.jsx';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthContext } from './context/AuthContext.jsx';

function App() {
  const { authUser } = useAuthContext();

  return (
    <main className="app-viewport">
      <Routes>
        <Route path="/" element={authUser ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={authUser ? <Navigate to="/" /> : <Login />} />
        <Route path="/signup" element={authUser ? <Navigate to="/" /> : <SignUp />} />
      </Routes>
      <Toaster position="top-center" toastOptions={{ style: { background: '#17172d', color: '#fff', border: '1px solid rgba(192,132,252,.4)' } }} />
    </main>
  );
}

export default App;
