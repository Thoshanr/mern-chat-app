import React, { useEffect, useState } from 'react';
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
  const [imageData, setImageData] = useState('');
  const [adminImage, setAdminImage] = useState(null);
  const [adminImageOpen, setAdminImageOpen] = useState(false);
  const [adminBusy, setAdminBusy] = useState(false);

  useEffect(() => {
    if (!settingsOpen) return undefined;
    const controller = new AbortController();
    fetch('/api/admin/showcase-image', { signal: controller.signal })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Could not check the admin image.');
        setAdminImage(data.imageData ? data : null);
      })
      .catch((error) => { if (error.name !== 'AbortError') toast.error(error.message); });
    return () => controller.abort();
  }, [settingsOpen]);

  useEffect(() => {
    document.body.dataset.theme = theme;
    document.body.style.setProperty('--sent-color', sentColor);
    document.body.style.setProperty('--received-color', receivedColor);
    localStorage.setItem('chat-theme', theme);
    localStorage.setItem('chat-sent-color', sentColor);
    localStorage.setItem('chat-received-color', receivedColor);
  }, [theme, sentColor, receivedColor]);

  const selectAdminImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(file.type) || file.size > 1_200_000) {
      toast.error('Choose a PNG, JPG, WEBP, or GIF smaller than 1.2 MB.');
      event.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImageData(String(reader.result));
    reader.onerror = () => toast.error('This image could not be read.');
    reader.readAsDataURL(file);
  };

  const saveAdminImage = async (event) => {
    event.preventDefault();
    if (!imageData || !adminPassword) {
      toast.error('Choose an image and enter the administrator password.');
      return;
    }
    const form = event.currentTarget;
    setAdminBusy(true);
    try {
      const response = await fetch('/api/admin/showcase-image', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminPassword, imageData }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not save the image.');
      setAdminImage(data);
      setAdminPassword('');
      setImageData('');
      form.reset();
      toast.success('Admin image updated for everyone.');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setAdminBusy(false);
    }
  };

  return (
    <aside className="app-sidebar">
      <div className="brand-row">
        <div className="brand-mark" aria-hidden="true">✦</div>
        <div><p className="brand-title">ChatApp</p><p className="brand-caption">Your people, in sync</p></div>
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
          <p className="settings-caption">Admin showcase</p>
          {adminImage?.imageData && <button type="button" className="theme-choice admin-view-button" onClick={() => setAdminImageOpen(true)}>✦ View the showcase image</button>}
          <form className="admin-image-form" onSubmit={saveAdminImage}>
            <label className="admin-image-label" htmlFor="admin-showcase-upload">Upload or replace image</label>
            <input id="admin-showcase-upload" className="admin-image-file" type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={selectAdminImage} />
            <input className="admin-password-field" type="password" autoComplete="new-password" minLength={20} placeholder="Admin password (20+ characters)" value={adminPassword} onChange={(event) => setAdminPassword(event.target.value)} />
            <button className="theme-choice admin-save-button" type="submit" disabled={adminBusy || !imageData || adminPassword.length < 20}>{adminBusy ? 'Saving…' : 'Save for everyone'}</button>
            <p className="admin-image-hint">The password stays on the server. Configure it as ADMIN_PASSWORD before using this feature.</p>
          </form>
        </section>
      )}
      {adminImageOpen && adminImage?.imageData && (
        <div className="admin-image-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setAdminImageOpen(false); }}>
          <section className="admin-image-dialog" role="dialog" aria-modal="true" aria-label="Admin showcase image">
            <button type="button" className="admin-image-close" aria-label="Close image" onClick={() => setAdminImageOpen(false)}>×</button>
            <img src={adminImage.imageData} alt="Administrator showcase" />
          </section>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
