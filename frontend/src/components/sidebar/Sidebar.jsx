import React, { useEffect, useState } from 'react';
import { IoSettingsOutline } from 'react-icons/io5';
import SearchInput from './SearchInput.jsx';
import Conversations from './Conversations.jsx';
import LogoutButton from './LogoutButton.jsx';

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

  useEffect(() => {
    document.body.dataset.theme = theme;
    document.body.style.setProperty('--sent-color', sentColor);
    document.body.style.setProperty('--received-color', receivedColor);
    localStorage.setItem('chat-theme', theme);
    localStorage.setItem('chat-sent-color', sentColor);
    localStorage.setItem('chat-received-color', receivedColor);
  }, [theme, sentColor, receivedColor]);

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
        </section>
      )}
    </aside>
  );
};

export default Sidebar;
