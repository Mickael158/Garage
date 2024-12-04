import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import Top from './TopMenu';
import Nav from './Nav';
import MesDemandes from './DemandeValideClient'; 
import MesDemandesEnCours from './DemandeEnCoursClient'; 
import MesDemandesFini from './DemandeFiniClient'; 
import Select from 'react-select';

import '../styles/Menu.css';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

function Entretien() {
    const token = sessionStorage.getItem('token');
    const apiUrl = process.env.REACT_APP_API_URL;
    const [data, setData] = useState('');
    const [remarqueData, setRemarqueData] = useState('');
    const [diagnosticData, setDiagnosticData] = useState([]);
    const [entretienData, setEntretienData] = useState([]);
    const [reparationData, setReparationData] = useState([]);
    const [voitureData, setVoitureData] = useState([]);
    const [fonctionData, setFonctionData] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedService, setSelectedService] = useState('');
    const [show, setShow] = useState(false);
    const [sousCompte, setSousCompte] = useState(false);
    const [showMesDemandes, setShowMesDemandes] = useState(false); 
    const [showMesDemandesEnCours, setShowMesDemandesEnCours] = useState(false); 
    const [showMesDemandesFini, setShowMesDemandesFini] = useState(false); 
    const [isLoading, setIsLoading] = useState(true);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const insert_maintenance = async () => {
        try {
            const response = await axios.post(
                `${apiUrl}/demande_maintenence/insertion_demande_maintenence`,
                { 
                    id_voiture: data, 
                    remarque: remarqueData, 
                    id_utilisateur: token, 
                    id_service: selectedService 
                },
                { headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                } }
            );
            toast.success('Demande d\'entretien bien insérée!', { autoClose: 3000 });
            return response.data;
        } catch (error) {
            toast.error('Erreur lors de l\'insertion de la demande!', { autoClose: 3000 });
            throw error;
        }
    };

    const selectAll_Service = async () => {
        try {
            const response = await axios.get(`${apiUrl}/Service/selectAll_service`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setFonctionData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des services', error);
        }
    };

    const selectAll_Diagnostic = async () => {
        try {
            const response = await axios.get(`${apiUrl}/Action/selectAll_Action_byMaintence/1`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setDiagnosticData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des diagnostics', error);
        }
    };

    const selectAll_Entretien = async () => {
        try {
            const response = await axios.get(`${apiUrl}/Action/selectAll_Action_byMaintence/2`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setEntretienData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des entretiens', error);
        }
    };

    const selectAll_Reparation = async () => {
        try {
            const response = await axios.get(`${apiUrl}/Action/selectAll_Action_byMaintence/3`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setReparationData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des réparations', error);
        }
    };

    const selectAll_Voiture = async () => {
        setIsLoading(true);
        
        try {
            
            // Récupérer le token depuis l'API
            const fonction = await axios.post(`${apiUrl}/Token/getFonction`, 
                { 
                    id_fonction: token
                },
                {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

           
            const service = await axios.post(`${apiUrl}/Token/getService`, 
                { 
                    service: token
                },
                {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const fonctionToken = fonction.data.data; 
            const serviceToken = service.data.data; 

            

            const response = await axios.get(`${apiUrl}/voiture/selecAll_voiture_by_id_fonction_id_service/${fonctionToken}/${serviceToken}`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setVoitureData(response.data.data || []);
        } catch (error) {
            console.error('Erreur de récupération des voitures', error);
            setVoitureData([]);
        } finally {
            setIsLoading(false);
        }
    };
    

    const handleCheckboxChange = (e) => {
        const value = e.target.value;
        setSelectedItems((prev) => 
            prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
        );
    };

    const handleInsertAll = async (e) => {
        e.preventDefault();
        await insert_maintenance();
        handleClose();
        // Réinitialiser les états si nécessaire
    };

    const handleShowMesDemandes = () => {
        setShowMesDemandes(!showMesDemandes); 
    };
    const handleShowMesDemandesEnCours = () => {
        setShowMesDemandesEnCours(!showMesDemandesEnCours); 
    };
    const handleShowMesDemandesFini = () => {
        setShowMesDemandesFini(!showMesDemandesFini); 
    };
    

    useEffect(() => {
        selectAll_Service();
        selectAll_Diagnostic();
        selectAll_Entretien();
        selectAll_Reparation();
        selectAll_Voiture();
        
    }, []);

    if (isLoading) {
        return <div>Chargement en cours...</div>;
    }

    // Ajoutez ces nouvelles constantes pour les options de Voiture et Service
    const voitureOptions = voitureData.map(voiture => ({
        value: voiture.id_voiture,
        label: voiture.matricule
    }));

    const serviceOptions = fonctionData.map(service => ({
        value: service.id_service,
        label: service.nom_service
    }));

    return (
        <div className="menu-container">
            <Top />
            <div className="main-content">
                <Nav />
                <div className="content">
                    <div className="content-header d-flex justify-content-between align-items-center"> 
                        <button className="btn btn-success insert-vehicle-button" onClick={handleShowMesDemandesEnCours}>
                            Mes demandes en Cours
                        </button>
                        <button className="btn btn-success insert-vehicle-button" onClick={handleShowMesDemandes}>
                            Mes demandes
                        </button>
                        {/* <button className="btn btn-success insert-vehicle-button" onClick={handleShowMesDemandesFini}>
                            Mes demandes Fait
                        </button> */}
                    </div>

                    <div className="padding-top-black rounded">
                        <h2>Envoyer une demande d'entretien</h2>
                    </div>

                    <div className="table-wrapper">
                        <form onSubmit={handleInsertAll} className="mb-4">
                            <div className="col-md-12">
                                <label className="form-label">Voiture:</label>
                                <Select
                                    value={voitureOptions.find(option => option.value === data)}
                                    onChange={(selectedOption) => setData(selectedOption.value)}
                                    options={voitureOptions}
                                    placeholder="Choisir un matricule"
                                    isSearchable={true}
                                    required
                                />
                            </div><br></br>
                            <div className="form-group mb-3">
                                <label>Remarque :</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Insérer une remarque"
                                    value={remarqueData}
                                    onChange={(e) => setRemarqueData(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="col-md-12">
                                <label>Service :</label>
                                <Select
                                    value={serviceOptions.find(option => option.value === selectedService)}
                                    onChange={(selectedOption) => setSelectedService(selectedOption.value)}
                                    options={serviceOptions}
                                    placeholder="Choisir un Service"
                                    isSearchable={true}
                                    required
                                />
                            </div><br></br>

                            <div className="d-flex justify-content-between mb-3">
                                <div className="checkbox-groups me-3">
                                    <h5>Diagnostic</h5>
                                    {diagnosticData.map(fonction => (
                                        <div key={fonction.id_action} className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id={`diagnostic-${fonction.id_action}`}
                                                value={fonction.id_action}
                                                onChange={handleCheckboxChange}
                                            />
                                            <label className="form-check-label" htmlFor={`diagnostic-${fonction.id_action}`}>
                                                {fonction.nom_action}
                                            </label>
                                        </div>
                                    ))}
                                </div>

                                <div className="checkbox-groups me-3">
                                    <h5>Entretien</h5>
                                    {entretienData.map(fonction => (
                                        <div key={fonction.id_action} className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id={`entretien-${fonction.id_action}`}
                                                value={fonction.id_action}
                                                onChange={handleCheckboxChange}
                                            />
                                            <label className="form-check-label" htmlFor={`entretien-${fonction.id_action}`}>
                                                {fonction.nom_action}
                                            </label>
                                        </div>
                                    ))}
                                </div>

                                <div className="checkbox-groups me-3">
                                    <h5>Réparation</h5>
                                    {reparationData.map(fonction => (
                                        <div key={fonction.id_action} className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id={`reparation-${fonction.id_action}`}
                                                value={fonction.id_action}
                                                onChange={handleCheckboxChange}
                                            />
                                            <label className="form-check-label" htmlFor={`reparation-${fonction.id_action}`}>
                                                {fonction.nom_action}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary">
                                Envoyer
                            </button>
                        </form><br></br>
                        {showMesDemandes && (
                            <MesDemandes />
                        )}
                        {showMesDemandesEnCours && (
                            <MesDemandesEnCours />
                        )}
                        {showMesDemandesFini && (
                            <MesDemandesFini />
                        )}
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Entretien;
