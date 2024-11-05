import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Menu.css';
import { ToastContainer, toast } from 'react-toastify';  

function DemandeFini() {

    const token = sessionStorage.getItem('token');

    const navigate = useNavigate();


    const [actionMaintData, setActionMaintData] = useState([]);


    const selectAllActionMaintenanceValid = async () => {
        try {
            
            const response = await axios.get(`http://localhost:8080/demande_maintenence/SelectEtat_Demande_maintenence_Attente_by_utilisateur/${token}`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setActionMaintData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };

 

    useEffect(() => {
        selectAllActionMaintenanceValid();
    }, []);

      const formatDateTime = (value) => {
        // Sépare la date et l'heure
        const [date, time] = value.split('T');
        
        // Ajouter ":00" pour les secondes
        const formattedTime = time ? `${time}:00` : '';
        
        // Combine date et heure dans le format souhaité
        return `${date} ${formattedTime}`;
      };

        const handleVoirPlus = (validation) => {
          navigate('/voirplusclient', { state: { data: validation } });
        };

    return (
    <div className="menu-container">
            
                <h2>Listes des demandes Valide</h2>
            
            
                <div className="table-wrapper">
                <div className="table-container mt-4">
                    <table className="table table-striped table-hover table-responsive">
                        <thead className="table-primary">
                    
                        <tr>
                            <th>Id</th>
                            <th>Immatricule</th>
                            <th>Nom</th>
                            <th>Service</th>
                            <th>Remarque</th>
                            <th>PV</th>
                            <th>Proformat</th>
                            <th>Recu</th>
                            <th>Voir Demarche</th>
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
                                    <td>{validation.situation_estimation}</td>
                                    <td>{validation.situation_recu}</td>
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
    
};

export default DemandeFini;
