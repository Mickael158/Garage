import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';  // Importation de l'icône de notification
import '../styles/Top.css';

function Top() {
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem('token'); // Exemple de suppression du token
        navigate('/'); // Redirige vers la page d'index
    };

    return (
        <header className="top-menu">
            <div className="top-menu-left">
                <h1>Car Management</h1>
            </div>
            <div className="top-menu-right">
                <a href="#" className="menu-item" onClick={handleLogout}>Deconnexion</a>
            </div>
        </header>
    );
}

export default Top;
