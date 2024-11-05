import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Menu.css';
import { ToastContainer, toast } from 'react-toastify';  

function DemandeEnCoursClient() {

    const token = sessionStorage.getItem('token');
    const navigate = useNavigate();

    const [actionMaintData, setActionMaintData] = useState([]);
    const [Users, setUsers] = useState('');

    // Fonction pour récupérer les demandes en fonction de l'utilisateur
    const selectAllActionMaintenanceValid = async () => {
        if (!Users) return;  // Ne pas faire l'appel si Users est vide
        try {   
            const response = await axios.get(`http://localhost:8080/demande_maintenence/SelectEtat_Demande_maintenence_Attente_validation_by_utilisateur/${Users}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setActionMaintData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };

    // Fonction pour récupérer l'identifiant de l'utilisateur
    const Utilisateur = async () => {
        try {
            const response = await axios.post('http://localhost:8080/Token/getUtilisateur', { utilisateur: token }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUsers(String(response.data.data));
        } catch (error) {
            console.error('Erreur lors de la récupération du rôle', error);
        }
    };

    // Appel de la fonction Utilisateur au montage du composant
    useEffect(() => {
        Utilisateur();
    }, []);

    // Appel de la fonction selectAllActionMaintenanceValid seulement lorsque Users est mis à jour
    useEffect(() => {
        if (Users) {
            selectAllActionMaintenanceValid();
        }
    }, [Users]);

    const formatDateTime = (value) => {
        const [date, time] = value.split('T');
        const formattedTime = time ? `${time}:00` : '';
        return `${date} ${formattedTime}`;
    };

    const handleVoirPlus = (validation) => {
        navigate('/voirplusclient', { state: { data: validation } });
    };

    return (
        <div className="menu-container">
            <h2>Listes des demandes Validées</h2>
            <div className="table-wrapper">
                <div className="table-container mt-4">
                    <table className="table table-striped table-hover table-responsive">
                        <thead className="table-primary">
                            <tr>
                                <th>Numero</th>
                                <th>Immatricule</th>
                                <th>Nom</th>
                                <th>Service</th>
                                <th>Remarque</th>
                                <th>Etat</th>
                                <th>Observation</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(actionMaintData) && actionMaintData.length > 0 ? (
                                actionMaintData.map(validation => (
                                    <tr key={validation.demandeMaintenence.id_demande_maintenence}>
                                        <td>{validation.demandeMaintenence.id_demande_maintenence}</td>
                                        <td>{validation.demandeMaintenence.id_voiture.matricule}</td>
                                        <td>{validation.demandeMaintenence.id_utilisateur.id_personnel.nom}</td>
                                        <td>{validation.demandeMaintenence.id_utilisateur.id_personnel.id_service.nom_service}</td>
                                        <td>{validation.demandeMaintenence.remarque}</td>
                                        <td>{validation.situation_pv}</td>
                                        <td>{validation.situation_recu}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center">Aucune donnée disponible</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default DemandeEnCoursClient;
