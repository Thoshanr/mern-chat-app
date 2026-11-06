import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import GenderCheckbox from './GenderCheckbox.jsx';
import useSignup from '../../useSignup.js';

const SignUp = () => {
  const [inputs, setInputs] = useState({ fullName: '', username: '', password: '', confirmPassword: '', gender: '' });
  const { loading, signup } = useSignup();
  useEffect(() => { document.body.dataset.theme = localStorage.getItem('chat-theme') || 'dark'; }, []);
  const update = (key) => (event) => setInputs((previous) => ({ ...previous, [key]: event.target.value }));
  const handleSubmit = async (event) => { event.preventDefault(); await signup(inputs); };

  return (
    <section className="auth-screen">
      <div className="auth-card">
        <div className="brand-mark shrine-mark" style={{ margin: '0 auto 17px' }}>⛩</div>
        <p className="auth-app-name">SHRINE <span>TECH</span></p>
        <h1 className="auth-brand">Join the conversation</h1>
        <p className="auth-subtitle">A little closer, wherever you are.</p>
        <form onSubmit={handleSubmit}>
          <label className="auth-label" htmlFor="signup-name">Full name</label>
          <input id="signup-name" autoComplete="name" placeholder="How should we call you?" className="auth-input" value={inputs.fullName} onChange={update('fullName')} />
          <label className="auth-label" htmlFor="signup-user">Username</label>
          <input id="signup-user" autoComplete="username" placeholder="Choose a username" className="auth-input" value={inputs.username} onChange={update('username')} />
          <label className="auth-label" htmlFor="signup-password">Password</label>
          <input id="signup-password" type="password" autoComplete="new-password" placeholder="At least 6 characters" className="auth-input" value={inputs.password} onChange={update('password')} />
          <label className="auth-label" htmlFor="signup-confirm">Confirm password</label>
          <input id="signup-confirm" type="password" autoComplete="new-password" placeholder="Type it once more" className="auth-input" value={inputs.confirmPassword} onChange={update('confirmPassword')} />
          <div className="auth-label">Gender</div>
          <GenderCheckbox onCheckboxChange={(gender) => setInputs((previous) => ({ ...previous, gender }))} selectedGender={inputs.gender} />
          <button className="auth-submit" disabled={loading}>{loading ? 'Creating your account…' : 'Create account'}</button>
        </form>
        <Link to="/login" className="auth-link">Already have an account? Sign in →</Link>
      </div>
    </section>
  );
};
export default SignUp;
