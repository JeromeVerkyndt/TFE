import { useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;

export default function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:5001/api/auth/me', { withCredentials: true })
            .then(res => {
                setUser(res.data.user);
                setLoading(false);
            })
            .catch(() => {
                setUser(null);
                setLoading(false);
            })
            .finally(() => setLoading(false));
    }, []);

    return { user, loading };
}
