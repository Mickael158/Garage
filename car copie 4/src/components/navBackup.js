import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaTools, FaClipboardList, FaClock, FaCheckCircle, FaCar, FaUser, FaWrench, FaExclamationTriangle, FaFileAlt } from 'react-icons/fa'; // Importation des icônes
import '../styles/Nav.css';

function Nav() {

    const role = localStorage.getItem('role');

    const location = useLocation(); // Pour obtenir la route actuelle
    const [activeLink, setActiveLink] = useState(location.pathname); // Stocker l'élément actif

    const handleLinkClick = (path) => {
        setActiveLink(path); // Met à jour l'élément actif
    };

    return (
        <nav className="side-navbar">
            <ul>
                <li>
                    <a 
                        href="#" 
                        className={`dashboard ${activeLink === '/dashboard' ? 'active-link' : ''}`} 
                        onClick={() => handleLinkClick('/dashboard')}
                    >
                        <FaTachometerAlt className="icon" /> 
                        Dashboard
                    </a>
                </li>
                <li>
                    <Link 
                        to="/crud" 
                        className={`marcher-hover ${activeLink === '/crud' ? 'active-link' : ''}`}
                        onClick={() => handleLinkClick('/crud')}
                    >
                        <FaClipboardList className="icon" /> 
                        CRUD
                    </Link>
                </li>
                <li>
                    <Link 
                        to="/demande-entretien" 
                        className={`marcher-hover ${activeLink === '/demande-entretien' ? 'active-link' : ''}`}
                        onClick={() => handleLinkClick('/demande-entretien')}
                    >
                        <FaTools className="icon" /> 
                        Demande Entretien
                    </Link>
                </li>
                <li>
                    <Link 
                        to="/demande-en-attente" 
                        className={`demandes-hover ${activeLink === '/demande-en-attente' ? 'active-link' : ''}`}
                        onClick={() => handleLinkClick('/demande-en-attente')}
                    >
                        <FaClock className="icon" /> 
                        Demande en attentes
                    </Link>
                </li>
                <li>
                    <Link 
                       to="/demande_valide"
                        className={`marcher-hover ${activeLink === '/demande_valide' ? 'active-link' : ''}`} 
                        onClick={() => handleLinkClick('/demande_valide')}
                    >
                        <FaCheckCircle className="icon" /> 
                        Demandes Validé
                    </Link>
                </li>
                <li>
                    <Link 
                       to="/demande_valide_client"
                        className={`marcher-hover ${activeLink === '/demande_valide_client' ? 'active-link' : ''}`} 
                        onClick={() => handleLinkClick('/demande_valide_client')}
                    >
                        <FaCheckCircle className="icon" /> 
                        Demandes Validé Client 
                    </Link>
                </li>
                <li>
                    <a 
                        href="/rapide" 
                        className={`rendezvous-hover ${activeLink === '/rapide' ? 'active-link' : ''}`} 
                        onClick={() => handleLinkClick('/rapide')}
                    >
                        <FaWrench className="icon" /> 
                        Réparation Rapide 
                    </a>
                </li>
                <li>
                    <a 
                        href="/pret" 
                        className={`rendezvous-hover ${activeLink === '/pret' ? 'active-link' : ''}`} 
                        onClick={() => handleLinkClick('/pret')}
                    >
                        <FaCar className="icon" /> 
                        Demande de Prêt 
                    </a>
                </li>
                <li>
                    <a 
                        href="/validationpret" 
                        className={`rendezvous-hover ${activeLink === '/validationpret' ? 'active-link' : ''}`} 
                        onClick={() => handleLinkClick('/validationpret')}
                    >
                        <FaCheckCircle className="icon" /> 
                        Validation des Prêt 
                    </a>
                </li>
                <li>
                    <a 
                        href="/proprietaire" 
                        className={`rendezvous-hover ${activeLink === '/proprietaire' ? 'active-link' : ''}`} 
                        onClick={() => handleLinkClick('/proprietaire')}
                    >
                        <FaUser className="icon" /> 
                        Détenteur
                    </a>
                </li>
                <li>
                    <a 
                        href="/gestionpiece" 
                        className={`rendezvous-hover ${activeLink === '/gestionpiece' ? 'active-link' : ''}`} 
                        onClick={() => handleLinkClick('/gestionpiece')}
                    >
                        <FaFileAlt className="icon" /> 
                        Gestions des Pièces
                    </a>
                </li>
                <li>
                    <a 
                        href="/accident" 
                        className={`rendezvous-hover ${activeLink === '/accident' ? 'active-link' : ''}`} 
                        onClick={() => handleLinkClick('/accident')}
                    >
                        <FaExclamationTriangle className="icon" /> 
                        Voiture Indisponible
                    </a>
                </li>
            </ul>
        </nav>
    );
}

export default Nav;
