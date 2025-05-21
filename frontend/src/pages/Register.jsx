import { useState } from "react";
import axios from "axios";

const Register = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        first_name: "",
        last_name: "",
    });

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5001/api/auth/register", formData);
            alert("Compte créé !");
        } catch (err) {
            console.error(err);
            alert("Erreur à l'enregistrement");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="first_name" placeholder="Prénom" value={formData.first_name} onChange={handleChange} />
            <input type="text" name="last_name" placeholder="Nom" value={formData.last_name} onChange={handleChange} />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
            <input type="password" name="password" placeholder="Mot de passe" value={formData.password} onChange={handleChange} />
            <button type="submit">Créer un compte</button>
        </form>
    );
};

export default Register;
