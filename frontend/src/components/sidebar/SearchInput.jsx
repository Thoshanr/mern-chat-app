import React, { useState } from 'react';
import { IoSearchSharp } from 'react-icons/io5';
import useConversation from '../../zustand/useConversation.js';
import useGetConversations from '../../hooks/useGetConversations.js';
import toast from 'react-hot-toast';

const SearchInput = () => {
  const [search, setSearch] = useState('');
  const { setSelectedConversation } = useConversation();
  const { conversations } = useGetConversations();
  const handleSubmit = (event) => {
    event.preventDefault();
    const term = search.trim().toLowerCase();
    if (!term) return;
    if (term.length < 2) return toast.error('Type at least 2 letters to search contacts.');
    const conversation = conversations.find((contact) => contact.fullName.toLowerCase().includes(term) || contact.username?.toLowerCase().includes(term));
    if (conversation) { setSelectedConversation(conversation); setSearch(''); }
    else toast.error('No contact found with that name.');
  };
  return (
    <form onSubmit={handleSubmit} className="search-form" role="search">
      <input type="search" aria-label="Search contacts" placeholder="Find a contact" className="search-field" value={search} onChange={(event) => setSearch(event.target.value)} />
      <button type="submit" className="icon-button" aria-label="Search"><IoSearchSharp /></button>
    </form>
  );
};
export default SearchInput;
