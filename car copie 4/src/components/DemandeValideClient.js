import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Menu.css';
import { ToastContainer, toast } from 'react-toastify';  

function DemandeValide() {

    const token = sessionStorage.getItem('token');
    const navigate = useNavigate();

    const [actionMaintData, setActionMaintData] = useState([]);
    const [Users, setUsers] = useState('');
    const apiUrl = process.env.REACT_APP_API_URL;
    const Utilisateur = async () => {
        try {
            const response = await axios.post(`${apiUrl}/Token/getUtilisateur`, { utilisateur: token }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            setUsers(String(response.data.data));
        } catch (error) {
            console.error('Erreur lors de la récupération du rôle', error);
        }
    };

    const selectAllActionMaintenanceValid = async () => {
        if (!Users) return; // S'assurer que Users est défini avant de faire l'appel
        try {
            const response = await axios.get(`${apiUrl}/demande_maintenence/SelectEtat_Demande_maintenence_Attente_by_utilisateur/${Users}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setActionMaintData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };

    useEffect(() => {
        Utilisateur();
    }, []);

    useEffect(() => {
        selectAllActionMaintenanceValid();
    }, [Users]); // Exécuter selectAllActionMaintenanceValid lorsque Users est mis à jour

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
                                <th>Immatriculation</th>
                                <th>Nom</th>
                                <th>Service</th>
                                <th>Remarque</th>
                                <th>PV</th>
                                <th>Proforma</th>
                                <th>Facture</th>
                                <th>Voir Démarche</th>
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
                                        <td style={{ backgroundColor: validation.situation_pv === 'En attente' ? '#FFFF00' : '#90EE90' }}>
                                            {validation.situation_pv === 'En attente' ? validation.situation_pv : `N° ${validation.situation_pv}`}
                                        </td>
                                        <td style={{ backgroundColor: validation.situation_estimation === 'En attente' ? '#FFFF00' : '#90EE90' }}>
                                            {validation.situation_estimation === 'En attente' ? validation.situation_estimation : `N° ${validation.situation_estimation}`}
                                        </td>
                                        <td style={{ backgroundColor: validation.situation_recu === 'En attente' ? '#FFFF00' : '#90EE90' }}>
                                            {validation.situation_recu === 'En attente' ? validation.situation_recu : `N° ${validation.situation_recu}`}
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-info btn-sm"
                                                title="Voir plus"
                                                onClick={() => handleVoirPlus(validation)}
                                            >
                                                <i className="fas fa-eye"></i> Voir plus
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="text-center">Aucune donnée disponible</td>
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

export default DemandeValide;
