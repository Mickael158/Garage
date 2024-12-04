import Top from './TopMenu';
import Nav from './Nav';
import { Modal, Button, Form } from 'react-bootstrap';
import '../styles/Menu.css';
import '../styles/Form.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';  // Import Toastify
import 'react-toastify/dist/ReactToastify.css';  // Import des styles Toastify
import Select from 'react-select'; // Ajoutez cette importation en haut du fichier

function VoiturePanne() {

    const token = sessionStorage.getItem('token');
    const apiUrl = process.env.REACT_APP_API_URL;
    const [dates, setDates] = useState('');
    const [matricule, setMatricule] = useState('');
    const [datesdispo, setDatesDispo] = useState('');
    const [idLieu, setIdLieu] = useState('');
    const [idpanne, setIdPanne] = useState('');
    const [idIndisponibilite, setIdIndisponibilite] = useState('');
    const [idVoiture, setIdVoiture] = useState('');
    const [voiturePanneData, setVoiturePanneData] = useState([]);
    const [lieux, setLieux] = useState([]);
    const [indisponibilites, setIndisponibilites] = useState([]);
    const [voitures, setVoitures] = useState([]);
    const [showModal, setShowModal] = useState(false);

    // Ajoutez ces nouvelles constantes pour les options
    const lieuOptions = lieux.map(lieu => ({
        value: lieu.id_lieu,
        label: lieu.nom_lieu
    }));

    const indisponibiliteOptions = indisponibilites.map(indisponibilite => ({
        value: indisponibilite.id_indisponibilite,
        label: indisponibilite.nom
    }));

    const voitureOptions = voitures.map(voiture => ({
        value: voiture.id_voiture,
        label: voiture.matricule
    }));

    const insererVoiturePanne = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${apiUrl}/Voiture_panne/insertion_Voiture_panne`, 
                { 
                    dates: dates,
                    id_lieu: idLieu,
                    id_indisponibilite: idIndisponibilite,
                    id_utilisateur: token,
                    id_voiture: idVoiture
                }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`

                },
            });
            
            toast.success('Données bien insérées!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            recupererVoiturePanne();  // Recharger les données après l'insertion
        } catch (error) {
            console.error('Erreur d\'insertion', error);
            toast.error('Erreur lors de l\'insertion!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    const insererVoitureRedisponible = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${apiUrl}/Voiture_redisponible/insertion_Voiture_panne`, 
                { 
                    dates: datesdispo,
                    id_voiture_panne: idpanne,
                    id_utilisateur: token
                }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`

                },
            });
            
            toast.success('Données bien insérées!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            recupererVoiturePanne();  
            handleCloseRefusModal();

        } catch (error) {
            console.error('Erreur d\'insertion', error);
            toast.error('Erreur lors de l\'insertion!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    const recupererVoiturePanne = async () => {
        try {
            const response = await axios.get(`${apiUrl}/Voiture_panne/SelectAll_voiture_again_panne`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            // Pour vérifier la structure des données
            setVoiturePanneData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };

    const recupererLieux = async () => {
        try {
            const response = await axios.get(`${apiUrl}/Lieu/selectAll_lieu`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
              // Pour vérifier la structure des données
            setLieux(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };

    const recupererIndisponibilites = async () => {
        try {
            const response = await axios.get(`${apiUrl}/Indisponibilite/selectAll_Indisponibilite`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
              // Pour vérifier la structure des données
            setIndisponibilites(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };

    const recupererVoitures = async () => {
        try {
            const response = await axios.get(`${apiUrl}/voiture/selectAll_voiture`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setVoitures(response.data.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des voitures', error);
        }
    };
    const handleShowModal = (panne) => {
        setIdPanne(panne.id_voiture_panne);
        setMatricule(panne.id_voiture.matricule);
        setShowModal(true); 
    };
    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleCloseRefusModal = () => {
        setShowModal(false); 
    };

    useEffect(() => {
        recupererVoiturePanne();
        recupererLieux();
        recupererIndisponibilites();
        recupererVoitures();
        
    }, []);

    return (
        <div className="menu-container">
            <Top />
            <div className="main-content">
                <Nav />
                <div className="content">
                    <div className="padding-top-black rounded">
                        <h2>Ajouter Panne de Voiture</h2>
                    </div>
                    <div className="table-wrapper">
                        <form onSubmit={insererVoiturePanne}>
                            <label>Date:</label>
                            <input
                                className="form-select"
                                type="date"
                                value={dates}
                                onChange={(e) => setDates(e.target.value)}
                                required
                            /><br></br>
                            <label>Lieu:</label>
                            <Select
                                value={lieuOptions.find(option => option.value === idLieu)}
                                onChange={(selectedOption) => setIdLieu(selectedOption.value)}
                                options={lieuOptions}
                                placeholder="Sélectionner un lieu"
                                isSearchable={true}
                                required
                            /><br></br>
                            <label>Indisponibilité:</label>
                            <Select
                                value={indisponibiliteOptions.find(option => option.value === idIndisponibilite)}
                                onChange={(selectedOption) => setIdIndisponibilite(selectedOption.value)}
                                options={indisponibiliteOptions}
                                placeholder="Sélectionner une indisponibilité"
                                isSearchable={true}
                                required
                            /><br></br>
                            <label>Voiture:</label>
                            <Select
                                value={voitureOptions.find(option => option.value === idVoiture)}
                                onChange={(selectedOption) => setIdVoiture(selectedOption.value)}
                                options={voitureOptions}
                                placeholder="Sélectionner une voiture"
                                isSearchable={true}
                                required
                            />
                            <br />
                            <Button variant="primary" type="submit">Envoyer</Button>
                        </form>
                        
                        <div className="table-container">
                            <h3>Liste des Pannes de Voiture</h3>
                            <table className="table table-striped table-hover table-responsive">
                                <thead className="table-primary">
                                    <tr>
                                        <th>Date</th>
                                        <th>Lieu</th>
                                        <th>Motif Indisponibilité</th>
                                        <th>Voiture</th>
                                        <th>Etat</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.isArray(voiturePanneData) && voiturePanneData.length > 0 ? (
                                        voiturePanneData.map(panne => (
                                            <tr key={panne.id_voiture_panne}>
                                                <td>{panne.dates}</td>
                                                <td>{panne.id_lieu.id_lieu}</td>
                                                <td>{panne.id_indisponibilite.nom}</td>
                                                <td>{panne.id_voiture.matricule}</td>
                                                <td> 
                                                <button
                                                className="validate-button"
                                                title="Valider"
                                                onClick={() => handleShowModal(panne)}
                                            >
                                                <i className="fas fa-check-circle"></i> Redisponible
                                            </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td>Aucune donnée disponible</td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
             
             <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Refuser la demande</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Mettre la voiture {matricule} disponible </p>
                    <input
                        className="form-control"
                        type="date"
                        placeholder="Insérer une date"
                        value={datesdispo}
                        onChange={(e) => setDatesDispo(e.target.value)}
                        required
                    /><br />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseRefusModal}>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={insererVoitureRedisponible}>
                        Valider
                    </Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer /> 
        
        </div>
    );
}

export default VoiturePanne;
