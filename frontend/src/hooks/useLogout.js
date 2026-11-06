import React, { useState } from'react';
import { useAuthContext } from '../context/AuthContext.jsx';
import toast from'react-hot-toast';
import { playChatSound } from '../utils/chatSounds.js';

const useLogout = () => {
    const [loading, setLoading] = useState(false);
    const {setAuthUser} = useAuthContext();

    const logout = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
            });
            const data = await res.json();
            if(data.error) {
                throw new Error(data.error);
            }

            localStorage.removeItem('chat-user');
            setAuthUser(null);
            playChatSound('logout');
        } catch (error) {
            toast.error(error.message);
        } finally{
            setLoading(false);
        }
    }

    return {loading, logout };
}

export default useLogout
