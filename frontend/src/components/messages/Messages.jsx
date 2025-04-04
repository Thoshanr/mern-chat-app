import React from 'react'
import Message from './Message.jsx'
import '../../../src/App.css'
const Messages = () => {
  return (
    <div className='px-4 flex-1 overflow-auto scrollbar-track-rounded'>
        <Message/>
        <Message/>
        <Message/>
        <Message/>
        <Message/>
        <Message/>
        <Message/>
        <Message/>
        <Message/>
        <Message/>
        <Message/>
        <Message/>
    </div>
  )
}

export default Messages;