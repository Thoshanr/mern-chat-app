import React from 'react';
import Sidebar from '../../../components/sidebar/Sidebar.jsx';
import MessageContainer from '../../../components/messages/MessageContainer.jsx';
import useListenMessages from '../../useListenMessages.js';

const Home = () => {
  useListenMessages();
  return (
    <section className="chat-shell" aria-label="Chat application">
      <Sidebar />
      <MessageContainer />
    </section>
  );
};

export default Home;

