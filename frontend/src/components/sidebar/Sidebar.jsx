import React, { useEffect, useRef, useState } from 'react';
import { IoSettingsOutline } from 'react-icons/io5';
import SearchInput from './SearchInput.jsx';
import Conversations from './Conversations.jsx';
import LogoutButton from './LogoutButton.jsx';
import toast from 'react-hot-toast';

const sentColors = [
  { name: 'Violet', value: '#a78bfa' },
  { name: 'Pink', value: '#f472b6' },
  { name: 'Blue', value: '#60a5fa' },
  { name: 'Lime', value: '#a3e635' },
];
const receivedColors = [
  { name: 'Cyan', value: '#22d3ee' },
  { name: 'Mint', value: '#34d399' },
  { name: 'Rose', value: '#fb7185' },
  { name: 'Amber', value: '#fbbf24' },
];

const Sidebar = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('chat-theme') || 'dark');
  const [sentColor, setSentColor] = useState(() => localStorage.getItem('chat-sent-color') || sentColors[0].value);
  const [receivedColor, setReceivedColor] = useState(() => localStorage.getItem('chat-received-color') || receivedColors[0].value);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminPasswordOpen, setAdminPasswordOpen] = useState(false);
  const [adminQrOpen, setAdminQrOpen] = useState(false);
  const [adminQrState, setAdminQrState] = useState('idle');
  const [adminQrUrl, setAdminQrUrl] = useState('');
  const [adminBusy, setAdminBusy] = useState(false);
  const adminTapCount = useRef(0);
  const adminTapTimer = useRef(null);

  useEffect(() => () => window.clearTimeout(adminTapTimer.current), []);

  useEffect(() => {
    document.body.dataset.theme = theme;
    document.body.style.setProperty('--sent-color', sentColor);
    document.body.style.setProperty('--received-color', receivedColor);
    localStorage.setItem('chat-theme', theme);
    localStorage.setItem('chat-sent-color', sentColor);
    localStorage.setItem('chat-received-color', receivedColor);
  }, [theme, sentColor, receivedColor]);

  const handleAdminTap = () => {
    adminTapCount.current += 1;
    window.clearTimeout(adminTapTimer.current);
    adminTapTimer.current = window.setTimeout(() => { adminTapCount.current = 0; }, 5000);
    if (adminTapCount.current >= 10) {
      adminTapCount.current = 0;
      window.clearTimeout(adminTapTimer.current);
      setAdminPassword('');
      setAdminPasswordOpen(true);
    }
  };

  const unlockAdmin = async (event) => {
    event.preventDefault();
    setAdminBusy(true);
    try {
      const response = await fetch('/api/admin/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not verify the admin password.');
      setAdminPassword('');
      setAdminPasswordOpen(false);
      setAdminQrOpen(true);
      setAdminQrState('loading');
      const qrResponse = await fetch('/api/admin/qr');
      if (qrResponse.ok) {
        setAdminQrUrl(URL.createObjectURL(await qrResponse.blob()));
        setAdminQrState('available');
      } else {
        const qrError = await qrResponse.json();
        setAdminQrState(qrResponse.status === 404 ? 'missing' : 'error');
        if (qrResponse.status !== 404) toast.error(qrError.error || 'Could not load the admin QR.');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setAdminBusy(false);
    }
  };

  const closeAdminQr = () => {
    if (adminQrUrl) URL.revokeObjectURL(adminQrUrl);
    setAdminQrUrl('');
    setAdminQrOpen(false);
  };

  return (
    <aside className="app-sidebar">
      <div className="brand-row">
        <div className="brand-mark shrine-mark" aria-hidden="true">⛩</div>
        <div><p className="brand-title">SHRINE <span>TECH</span></p><p className="brand-caption">Your people, in sync</p></div>
      </div>
      <SearchInput />
      <p className="section-label">Contacts</p>
      <Conversations />
      <div className="sidebar-footer">
        <button type="button" className="settings-trigger" aria-label="Appearance settings" aria-expanded={settingsOpen} onClick={() => setSettingsOpen((open) => !open)}>
          <IoSettingsOutline />
        </button>
        <span className="brand-caption">Appearance</span>
        <LogoutButton />
      </div>
      {settingsOpen && (
        <section className="settings-panel" aria-label="Appearance settings">
          <p className="settings-title">Make it yours</p>
          <p className="settings-caption">Display</p>
          <div className="settings-options">
            <button type="button" className="theme-choice" aria-pressed={theme === 'dark'} onClick={() => setTheme('dark')}>🌙 Dark</button>
            <button type="button" className="theme-choice" aria-pressed={theme === 'light'} onClick={() => setTheme('light')}>☀️ Bright</button>
          </div>
          <p className="settings-caption">Sent messages</p>
          <div className="settings-options">
            {sentColors.map((color) => <button key={color.name} type="button" className="swatch-button" title={color.name} aria-label={`Sent message color: ${color.name}`} aria-pressed={sentColor === color.value} style={{ background: color.value }} onClick={() => setSentColor(color.value)} />)}
          </div>
          <p className="settings-caption">Received messages</p>
          <div className="settings-options">
            {receivedColors.map((color) => <button key={color.name} type="button" className="swatch-button" title={color.name} aria-label={`Received message color: ${color.name}`} aria-pressed={receivedColor === color.value} style={{ background: color.value }} onClick={() => setReceivedColor(color.value)} />)}
          </div>
          <button type="button" className="theme-choice admin-trigger" onClick={handleAdminTap}>Admin</button>
        </section>
      )}
      {adminPasswordOpen && (
        <div className="admin-image-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setAdminPasswordOpen(false); }}>
          <section className="admin-access-dialog" role="dialog" aria-modal="true" aria-labelledby="admin-access-title">
            <button type="button" className="admin-image-close" aria-label="Close admin prompt" onClick={() => setAdminPasswordOpen(false)}>×</button>
            <div className="admin-access-symbol">⛩</div>
            <h2 id="admin-access-title">Shrine Tech Admin</h2>
            <p>Enter the private admin password to continue.</p>
            <form className="admin-access-form" onSubmit={unlockAdmin}>
              <input autoFocus className="admin-password-field" type="password" autoComplete="current-password" value={adminPassword} onChange={(event) => setAdminPassword(event.target.value)} placeholder="Admin password" aria-label="Admin password" />
              <button className="auth-submit" type="submit" disabled={adminBusy || !adminPassword}>{adminBusy ? 'Checking…' : 'Unlock QR'}</button>
            </form>
          </section>
        </div>
      )}
      {adminQrOpen && (
        <div className="admin-image-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeAdminQr(); }}>
          <section className="admin-image-dialog admin-qr-dialog" role="dialog" aria-modal="true" aria-labelledby="admin-qr-title">
            <button type="button" className="admin-image-close" aria-label="Close QR popup" onClick={closeAdminQr}>×</button>
            <h2 id="admin-qr-title">Shrine Tech • Admin QR</h2>
            {adminQrState === 'loading' && <p className="admin-qr-message">Loading your private QR…</p>}
            {adminQrState === 'available' && <img src={adminQrUrl} alt="Private Shrine Tech admin QR code" />}
            {adminQrState === 'missing' && <p className="admin-qr-message">Admin access verified. The QR isn’t added yet. Send me the QR image when you’re ready, and I’ll add it privately to the app.</p>}
            {adminQrState === 'error' && <p className="admin-qr-message">The QR couldn’t be loaded. Please unlock again in a moment.</p>}
          </section>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
