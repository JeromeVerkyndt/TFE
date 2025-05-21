import React, { useState } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setMsg('');
        try {
            const res = await axios.post('http://localhost:5001/api/auth/login', {
                email,
                password
            });
            setMsg('Connecté !');
        } catch (err) {
            setMsg(err.response?.data?.error || 'Erreur');
        }
    };

    return (
        <div>
            <h2>Connexion</h2>
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
                <input type="password" placeholder="Mot de passe" onChange={e => setPassword(e.target.value)} />
                <button type="submit">Se connecter</button>
            </form>
            {msg && <p>{msg}</p>}
        </div>
    );
};

export default Login;
