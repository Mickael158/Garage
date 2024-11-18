import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Importation de useNavigate
import { FaTachometerAlt, FaTools, FaClipboardList, FaClock, FaCheckCircle, FaCar, FaUser, FaWrench, FaExclamationTriangle, FaFileAlt, FaBars } from 'react-icons/fa';
import axios from 'axios';
import '../styles/Nav.css';

function Nav() {
    const token = sessionStorage.getItem('token');
    
    const location = useLocation();
    const navigate = useNavigate(); // Initialise useNavigate
    const [activeLink, setActiveLink] = useState(location.pathname);
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [countDemandeAttente, setCountDemandeAttente] = useState(0);
    const [countDemandeValide, setCountDemandeValide] = useState(0);
    const [countDemandePretNonValide, setCountDemandePretNonValide] = useState(0);
    const [Role, setRole] = useState('');

    const handleLinkClick = (path) => {
        setActiveLink(path);
    };

    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    };

    const fetchCountDemandeAttente = async () => {
        try {
            const response = await axios.get('http://localhost:8080/demande_maintenence/SelectCount_Demande_maintenence_Attente', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setCountDemandeAttente(response.data.data);
        } catch (error) {
            console.error('Erreur lors de la récupération du nombre de demandes en attente', error);
        }
    };

    const role = async () => {
        try {
            const response = await axios.post('http://localhost:8080/Token/getRole', { utilisateur: token }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setRole(String(response.data.data));
        } catch (error) {
            console.error('Erreur lors de la récupération du rôle', error);
        }
    };

    const fetchCountDemandeValide = async () => {
        try {
            const response = await axios.get('http://localhost:8080/demande_maintenence_valider/selectCount_demande_maintenence_validation', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setCountDemandeValide(response.data.data);
        } catch (error) {
            console.error('Erreur lors de la récupération du nombre de demandes validées', error);
        }
    };

    const fetchCountDemandePretNonValide = async () => {
        try {
            const response = await axios.get('http://localhost:8080/Demande_pret_voiture/SelectCountl_demande_pret_not_valider_refuser', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setCountDemandePretNonValide(response.data.data);
        } catch (error) {
            console.error('Erreur lors de la récupération du nombre de demandes de prêt non validées', error);
        }
    };

    useEffect(() => {
        fetchCountDemandeAttente();
        fetchCountDemandeValide();
        fetchCountDemandePretNonValide();
        role();
    }, []);

    // Redirection en fonction du rôle
    useEffect(() => {
        if (Role === '2' && !['/demande-entretien', '/pret'].includes(location.pathname)) {
            navigate('/demande-entretien'); // Redirige vers la route autorisée
        }
    }, [Role, location.pathname, navigate]);

    return (
        <nav className={`side-navbar ${isNavOpen ? 'open' : ''}`}>
            <button className="nav-toggle" onClick={toggleNav}>
                <FaBars />
            </button>
            <ul className={isNavOpen ? 'show' : ''}>
                {Role === '1' && (
                    <>
                        <li>
                            <Link to="/dashboard" className={`dashboard ${activeLink === '/dashboard' ? 'active-link' : ''}`} onClick={() => handleLinkClick('/dashboard')}>
                                <FaTachometerAlt className="icon" />
                                Tableau de bord
                            </Link>
                        </li>
                        <li>
                            <Link to="/crud" className={`marcher-hover ${activeLink === '/crud' ? 'active-link' : ''}`} onClick={() => handleLinkClick('/crud')}>
                                <FaClipboardList className="icon" />
                                CRUD
                            </Link>
                        </li>
                        <li>
                            <Link to="/demande-entretien" className={`marcher-hover ${activeLink === '/demande-entretien' ? 'active-link' : ''}`} onClick={() => handleLinkClick('/demande-entretien')}>
                                <FaTools className="icon" />
                                Demande Entretien
                            </Link>
                        </li>
                        <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Link to="/demande-en-attente" className={`demandes-hover ${activeLink === '/demande-en-attente' ? 'active-link' : ''}`} onClick={() => handleLinkClick('/demande-en-attente')}>
                                <FaClock className="icon" />
                                Demandes en attente
                            </Link>
                            <span className="notification-container position-relative">
                                {typeof countDemandeAttente === 'number' && countDemandeAttente > 0 && (
                                    <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                                        {countDemandeAttente}
                                    </span>
                                )}
                            </span>
                        </li>
                        <li>
                            <Link to="/demande_valide" className={`marcher-hover ${activeLink === '/demande_valide' ? 'active-link' : ''}`} onClick={() => handleLinkClick('/demande_valide')}>
                                <FaCheckCircle className="icon" />
                                Demandes Validées
                            </Link>
                            <span className="notification-container position-relative">
                                {typeof countDemandeValide === 'number' && countDemandeValide > 0 && (
                                    <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                                        {countDemandeValide}
                                    </span>
                                )}
                            </span>
                        </li>
                        <li>
                            <Link to="/rapide" className={`rendezvous-hover ${activeLink === '/rapide' ? 'active-link' : ''}`} onClick={() => handleLinkClick('/rapide')}>
                                <FaWrench className="icon" />
                                Réparation Rapide 
                            </Link>
                        </li>
                        <li>
                            <Link to="/pret" className={`rendezvous-hover ${activeLink === '/pret' ? 'active-link' : ''}`} onClick={() => handleLinkClick('/pret')}>
                                <FaCar className="icon" />
                                Demande de Prêt 
                            </Link>
                        </li>
                        <li>
                            <Link to="/validationpret" className={`rendezvous-hover ${activeLink === '/validationpret' ? 'active-link' : ''}`} onClick={() => handleLinkClick('/validationpret')}>
                                <FaCheckCircle className="icon" />
                                Validation des Prêts 
                            </Link>
                            <span className="notification-container position-relative">
                                {typeof countDemandePretNonValide === 'number' && countDemandePretNonValide > 0 && (
                                    <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                                        {countDemandePretNonValide}
                                    </span>
                                )}
                            </span>
                        </li>
                        <li>
                            <Link to="/proprietaire" className={`rendezvous-hover ${activeLink === '/proprietaire' ? 'active-link' : ''}`} onClick={() => handleLinkClick('/proprietaire')}>
                                <FaUser className="icon" />
                                Détenteur
                            </Link>
                        </li>
                        <li>
                            <Link to="/gestionpiece" className={`rendezvous-hover ${activeLink === '/gestionpiece' ? 'active-link' : ''}`} onClick={() => handleLinkClick('/gestionpiece')}>
                                <FaFileAlt className="icon" />
                                Gestions des Pièces
                            </Link>
                        </li>
                        <li>
                            <Link to="/accident" className={`rendezvous-hover ${activeLink === '/accident' ? 'active-link' : ''}`} onClick={() => handleLinkClick('/accident')}>
                                <FaExclamationTriangle className="icon" />
                                Voiture Indisponible
                            </Link>
                        </li>
                        <li>
                            <a 
                                href="/utilisateur" 
                                className={`rendezvous-hover ${activeLink === '/utilisateur' ? 'active-link' : ''}`} 
                                onClick={() => handleLinkClick('/utilisateur')}
                            >
                                <FaUser className="icon" /> 
                                Utilisateur
                            </a>
                        </li>
                    </>
                )}
                {Role === '2' && (
                    <>
                        <li>
                            <Link to="/demande-entretien" className={`marcher-hover ${activeLink === '/demande-entretien' ? 'active-link' : ''}`} onClick={() => handleLinkClick('/demande-entretien')}>
                                <FaTools className="icon" />
                                Demande Entretien
                            </Link>
                        </li>
                        <li>
                            <Link to="/pret" className={`rendezvous-hover ${activeLink === '/pret' ? 'active-link' : ''}`} onClick={() => handleLinkClick('/pret')}>
                                <FaCar className="icon" />
                                Demande de Prêt 
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
}

export default Nav;
