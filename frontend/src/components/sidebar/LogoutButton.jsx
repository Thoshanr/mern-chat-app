import React, { useState } from 'react';
import { BiLogOut } from 'react-icons/bi';
import useLogout from '../../hooks/useLogout.js';
import { primeChatAudio } from '../../utils/chatSounds.js';

const LogoutButton = () => {
  const { loading, logout } = useLogout();
  const [confirming, setConfirming] = useState(false);
  return (
    <>
      <button type="button" className="logout-trigger" aria-label="Log out" onClick={() => setConfirming(true)} disabled={loading}>
        {loading ? <span className="loading loading-spinner" /> : <BiLogOut />}
      </button>
      {confirming && (
        <div className="logout-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setConfirming(false); }}>
          <section className="logout-dialog" role="dialog" aria-modal="true" aria-labelledby="logout-title">
            <div className="empty-state-icon" aria-hidden="true">↗</div>
            <h2 id="logout-title">Leaving so soon?</h2>
            <p>You can sign back in whenever you’re ready.</p>
            <div className="logout-actions">
              <button type="button" className="theme-choice" onClick={() => setConfirming(false)}>Stay here</button>
              <button type="button" className="confirm-logout" onClick={() => { primeChatAudio(); void logout(); }} disabled={loading}>{loading ? 'Signing out…' : 'Log out'}</button>
            </div>
          </section>
        </div>
      )}
    </>
  );
};
export default LogoutButton;
