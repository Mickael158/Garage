import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';  // Importation de l'icône de notification
import axios from 'axios'; // Ajout de axios
import { useState, useEffect } from 'react';
import '../styles/Top.css';

function Top() {

    const token = sessionStorage.getItem('token');

    const [countDemandeAttente, setCountDemandeAttente] = useState(0); // État pour le compteur
    const [countDemandeValide, setCountDemandeValide] = useState(0); // État pour le compteur des demandes validées
    const [countDemandePretNonValide, setCountDemandePretNonValide] = useState(0); 
    const navigate = useNavigate();

    const handleLogout = () => {
        // Logique de déconnexion (par exemple, supprimer le token)
        localStorage.removeItem('token'); // Exemple de suppression du token
        navigate('/'); // Redirige vers la page d'index
    };

    const fetchCountDemandeAttente = async () => {
        try {
            const response = await axios.get('http://localhost:8080/demande_maintenence/SelectCount_Demande_maintenence_Attente',
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setCountDemandeAttente(response.data.data); // Accéder à la valeur de data
            console.log(response.data.data); // Affiche la réponse
        } catch (error) {
            console.error('Erreur lors de la récupération du nombre de demandes en attente', error);
        }
    };

    // Fonction pour récupérer le nombre de demandes validées
    const fetchCountDemandeValide = async () => {
        try {
            const response = await axios.get('http://localhost:8080/demande_maintenence_valider/selectCount_demande_maintenence_validation',
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setCountDemandeValide(response.data.data); // Accéder à la valeur de data
            console.log(response.data.data); // Affiche la réponse
        } catch (error) {
            console.error('Erreur lors de la récupération du nombre de demandes validées', error);
        }
    };

    // Fonction pour récupérer le nombre de demandes de prêt non validées
    const fetchCountDemandePretNonValide = async () => {
        try {
            const response = await axios.get('http://localhost:8080/Demande_pret_voiture/SelectCountl_demande_pret_not_valider_refuser',
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setCountDemandePretNonValide(response.data.data); // Accéder à la valeur de data
            console.log(response.data.data); // Affiche la réponse
        } catch (error) {
            console.error('Erreur lors de la récupération du nombre de demandes de prêt non validées', error);
        }
    };

    useEffect(() => {
        fetchCountDemandeAttente(); // Appel de la fonction lors du chargement du composant
        fetchCountDemandeValide(); // Appel de la fonction pour les demandes validées
        fetchCountDemandePretNonValide(); // Appel de la fonction pour les demandes de prêt non validées
    }, []);

    const fetchTotalCounts = () => {
        return countDemandeAttente + countDemandeValide + countDemandePretNonValide; // Calcule le total
    };

    return (
        <header className="top-menu">
            <div className="top-menu-left">
                <h1>Car Management</h1>
            </div>
            <div className="top-menu-right">
                <a href="#" className="menu-item" title={`Total notifications: ${fetchTotalCounts()}`}>
                    <FaBell className="notification-icon" />
                    {fetchTotalCounts() > 0 && (
                        <span className="badge bg-danger translate-middle">{fetchTotalCounts()}</span>
                    )}
                </a>
                <a href="#" className="menu-item" onClick={handleLogout}>Deconnexion</a>
            </div>
        </header>
    );
}

export default Top;
