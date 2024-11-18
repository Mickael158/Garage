import Top from './TopMenu';
import Nav from './Nav';
import '../styles/Menu.css';
import '../styles/Form.css';
import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Form } from 'react-router-dom';

function Pret() {
    const token = sessionStorage.getItem('token');
    const [idDemandePretVoiture, setIdDemandePretVoiture] = useState("");

    const [voitureData, setVoitureData] = useState([]);
    const [personnelData, setPersonnelData] = useState([]);


    const [remarque, setRemarque] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showRefusModal, setShowRefusModal] = useState(false);
    const [matricule, setMatricule] = useState('');
    const [fonction, setFonction] = useState('');
    const [service, setService] = useState('');
    const [place, setPlace] = useState('');
    const [idDemande, setIdDemande] = useState('');
    const [idVoiture, setIdVoiture] = useState('');
    const [idPersonnel, setIdPersonnel] = useState('');
    const [remarqueRefus, setRemarqueRefus] = useState('');
    const [pretData, setPretData] = useState([]);
    const [S, setS] = useState('');
    const getService = async () => {
        try {
            const response = await axios.post('http://localhost:8080/Token/getService', { service: token }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setS(String(response.data.data));
        } catch (error) {
            console.error('Erreur lors de la récupération du rôle', error);
        }
    };
    const [F, setF] = useState('');
    const getFonction = async () => {
        try {
            const response = await axios.post('http://localhost:8080/Token/getFonction', { service: token }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setF(String(response.data.data));
        } catch (error) {
            console.error('Erreur lors de la récupération du rôle', error);
        }
    };

    const handleShowModal = (pret) => {
        // Vérifier si pret.id_voiture et pret.id_voiture.matricule existent avant d'y accéder
        // if (pret.id_voiture && pret.id_voiture.matricule) {
        //     setMatricule(pret.id_voiture.matricule);
        // } else {
        //     setMatricule('N/A'); // Ou une valeur par défaut si non disponible
        // }
    
            // setMatricule(pret.id_voiture.matricule);
            setFonction(pret.id_utilisateur.id_personnel.id_fonction.id_fonction);
            setService(pret.id_utilisateur.id_personnel.id_service.id_service);
            setPlace(pret.nbr_pers);
            setIdDemande(pret.id_demande_pret_voiture);
            selectAll_Voiture(F , S , pret.nbr_pers );
        
        // Vérifier si pret.id_voiture et pret.id_voiture.id existent avant d'y accéder
        if (pret.id_voiture && pret.id_voiture.id) {
            setIdVoiture(pret.id_voiture.id); // Enregistrer l'idVoiture
        }
    
        // Vérifier si pret.id_utilisateur et pret.id_utilisateur.id_personnel existent avant d'y accéder
        if (pret.id_utilisateur && pret.id_utilisateur.id_personnel && pret.id_utilisateur.id_personnel.id) {
            setIdPersonnel(pret.id_utilisateur.id_personnel.id); // Enregistrer l'idPersonnel
        }
        setShowModal(true);
        
    };
    

    const handleShowRefusModal = (pret) => {
        setMatricule(pret.id_voiture.matricule);
        setIdDemande(pret.id_demande_pret_voiture);
        setShowRefusModal(true); 
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleCloseRefusModal = () => {
        setShowRefusModal(false); 
    }; 
    const [users, setUsers] = useState('');
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

    const selectAllPret = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/Demande_pret_voiture/selectEtat_Demande_pret_voiture_by_utilisateur/${users}`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setPretData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };
    const annulerPret = async (idDemandePretVoitureValeur) => {
        try {
            const response = await axios.get(`http://localhost:8080/Demande_pret_voiture/annulerPret/${idDemandePretVoitureValeur}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Réponse:', response.data.data);
            selectAllPret();
            toast.success(response.data.data);
        } catch (error) {
            console.error('Erreur lors de l\'annulation de la demande de prêt voiture', error);
            toast.error('Erreur lors de l\'annulation de la demande de prêt voiture');
        }
    };
    
    const selectAll_Voiture = async (f , s , p) => {
        try {
            const response = await axios.get(`http://localhost:8080/voiture/selecAll_voiture_by_id_fonction_id_service_id_type_voiture/${f}/${s}/${p}`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setVoitureData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des voitures', error);
        }
    };
    const selectAll_Personnel = async () => {
        try {
            const response = await axios.get('http://localhost:8080/personnel/selectAll_personnel',
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setPersonnelData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des personnels', error);
        }
    };

    useEffect(() => {
        Utilisateur();
        getFonction();
        getService();
    }, []); // Exécute ces appels une seule fois lors du montage du composant
    
    useEffect(() => {
        if (users) {
            selectAllPret(); // Appelle selectAllPret uniquement lorsque users est disponible
        }
    }, [users]); // Dépend de users

    // Fonction pour insérer une validation
    const insertValiderPret = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/Validation_pret_voiture/insertion_demande_maintenence_validation', 
                {
                    remarque: remarque,
                    id_demande_pret_voiture: idDemande,
                    id_utilisateur: token,
                    id_voiture: idVoiture, 
                    id_personnel: idPersonnel 
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`

                    },
                }
            );
            toast.success('Validation réussie!', { position: "top-right" });
            handleCloseModal();
            selectAllPret(); // Mettre à jour la liste après validation
        } catch (error) {
            toast.error('Erreur lors de la validation!', { position: "top-right" });
        }
    };

    const insertRefusPret = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/Refus_pret_voiture/insertion_Refus_pret_voiture',
                {
                    remarque: remarqueRefus,
                    id_demande_pret_voiture: idDemande,
                    id_utilisateur: token
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`

                    },
                }
            );
            toast.success('Refus bien enregistré!', { position: "top-right" });
            handleCloseRefusModal();
        } catch (error) {
            toast.error('Erreur lors du refus!', { position: "top-right" });
        }
    };

    const getSituationStyle = (situation) => {
        switch(situation) {
            case 'Demande refusée':
                return { backgroundColor: 'red', color: 'white' };
            case 'Demande validée':
                return { backgroundColor: 'green', color: 'white' };
            case 'En attente':
                return { backgroundColor: 'yellow', color: 'black' };
            default:
                return {};
        }
    };

    return (
        <div className="menu-container">
               
            <center><h3>Liste des demandes de prêt</h3></center>
                        
                <div className="table-wrapper">
                    <div className="table-container mt-4">  
                    <table className="table table-striped table-hover table-responsive">
                        <thead className="table-primary">
                            <tr>
                                <th>Date Début</th>
                                <th>Date Fin</th>
                                <th>Motif</th>
                                <th>Utilisateur</th>
                                {/* <th>Voiture</th> */}
                                <th>Nombre de Personnes</th>
                                <th>Etat</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(pretData) && pretData.length > 0 ? (
                                pretData.map((pret) => (
                                    <tr key={pret.demande_maintenence_valider.id_demande_pret_voiture}>
                                        <td>{pret.demande_maintenence_valider.date_debut}</td>
                                        <td>{pret.demande_maintenence_valider.date_fin}</td>
                                        <td>{pret.demande_maintenence_valider.id_motif_pret_voiture?.nom || 'N/A'}</td>
                                        <td>{pret.demande_maintenence_valider.id_utilisateur?.id_personnel?.nom || 'N/A'}</td>
                                        {/* <td>{pret.id_voiture?.matricule || 'N/A'}</td> */}
                                        <td>{pret.demande_maintenence_valider.nbr_pers || 'N/A'}</td>
                                        <td style={getSituationStyle(pret.situation)}>
  {pret.situation === 'Demande refusée' ? (
    'Demande refusée'
  ) : pret.situation === 'Demande validée' ? (
    <>
      <p>{pret.validation_pret_voiture?.id_chauffeur?.id_personne?.nom || 'N/A'}</p>
      <p>{pret.validation_pret_voiture?.id_voiture?.matricule || 'N/A'}</p>
    </>
  ) : (
    pret.situation || 'N/A'
  )}
</td>

                                        <td> 
                                                <button 
                                                    className="validate-button"
                                                    title="Annuler"
                                                    onClick={() => annulerPret(pret.demande_maintenence_valider.id_demande_pret_voiture)}
                                                >
                                                    Annuler
                                                </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8">Aucune donnée disponible</td>
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

export default Pret;
