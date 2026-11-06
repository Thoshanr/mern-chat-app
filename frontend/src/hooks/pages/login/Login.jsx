import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useLogin from '../../useLogin.js';
import { primeChatAudio } from '../../../utils/chatSounds.js';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { loading, login } = useLogin();
  useEffect(() => { document.body.dataset.theme = localStorage.getItem('chat-theme') || 'dark'; }, []);
  const handleSubmit = async (event) => { event.preventDefault(); primeChatAudio(); await login(username, password); };

  return (
    <section className="auth-screen">
      <div className="auth-card">
        <div className="brand-mark shrine-mark" style={{ margin: '0 auto 17px' }}>⛩</div>
        <p className="auth-app-name">SHRINE <span>TECH</span></p>
        <h1 className="auth-brand">Welcome back</h1>
        <p className="auth-subtitle">Your conversations are right where you left them.</p>
        <form onSubmit={handleSubmit}>
          <label className="auth-label" htmlFor="login-username">Username</label>
          <input id="login-username" type="text" autoComplete="username" placeholder="Your username" className="auth-input" value={username} onChange={(event) => setUsername(event.target.value)} />
          <label className="auth-label" htmlFor="login-password">Password</label>
          <input id="login-password" type="password" autoComplete="current-password" placeholder="Your password" className="auth-input" value={password} onChange={(event) => setPassword(event.target.value)} />
          <button className="auth-submit" disabled={loading}>{loading ? 'Signing you in…' : 'Sign in'}</button>
        </form>
        <Link to="/signup" className="auth-link">New here? Create an account →</Link>
      </div>
    </section>
  );
};
export default Login;

