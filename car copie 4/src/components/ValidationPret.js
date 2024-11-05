import Top from './TopMenu';
import Nav from './Nav';
import '../styles/Menu.css';
import '../styles/Form.css';
import React, { useState, useEffect } from 'react';
import { Modal, Button, Pagination } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

function Pret() {

    const token = sessionStorage.getItem('token');

    // const [idDemandePretVoiture, setIdDemandePretVoiture] = useState("");

    const [voitureData, setVoitureData] = useState([]);
    const [personnelData, setPersonnelData] = useState([]);


    const [remarque, setRemarque] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showRefusModal, setShowRefusModal] = useState(false);
    const [matricule, setMatricule] = useState('');
    const [fonction, setFonction] = useState('');
    const [service, setService] = useState('');
    const [place, setPlace] = useState('');
    const [datefin, setDateFin] = useState('');
    const [datedebut, setDateDebut] = useState('');
    const [idDemande, setIdDemande] = useState('');
    const [idVoiture, setIdVoiture] = useState('');
    const [idPersonnel, setIdPersonnel] = useState('');
    const [remarqueRefus, setRemarqueRefus] = useState('');
    const [pretData, setPretData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [showTrajetModal, setShowTrajetModal] = useState(false);
    const [trajets, setTrajets] = useState([]);
    const [selectedDemande, setSelectedDemande] = useState(null);

    const handleShowModal = (pret) => {
        // Vérifier si pret.id_voiture et pret.id_voiture.matricule existent avant d'y accéder
        // if (pret.id_voiture && pret.id_voiture.matricule) {
        //     setMatricule(pret.id_voiture.matricule);
        // } else {
        //     setMatricule('N/A'); // Ou une valeur par défaut si non disponible
        // }pret.demande_maintenence_valider.id_utilisateur.id_personnel
    
            // setMatricule(pret.id_voiture.matricule);
            const fonctionId = pret.demande_maintenence_valider.id_utilisateur.id_personnel.id_fonction.id_fonction;
            const serviceId = pret.demande_maintenence_valider.id_utilisateur.id_personnel.id_service.id_service;
            const nbrPers = pret.demande_maintenence_valider.nbr_pers;

            // Vérifiez que les valeurs sont définies avant d'appeler selectAll_Voiture
            if (fonctionId && serviceId && nbrPers && pret.demande_maintenence_valider.date_debut && pret.demande_maintenence_valider.date_fin) {
                setFonction(fonctionId);
                setService(serviceId);
                setPlace(nbrPers);
                setDateDebut(pret.demande_maintenence_valider.date_debut);
                setDateFin(pret.demande_maintenence_valider.date_fin);
                setIdDemande(pret.demande_maintenence_valider.id_demande_pret_voiture);
                selectAll_Personnel(pret.demande_maintenence_valider.date_debut, pret.demande_maintenence_valider.date_fin );
                
                // Appel de selectAll_Voiture avec des valeurs définies
                selectAll_Voiture(fonctionId, serviceId, nbrPers, pret.demande_maintenence_valider.date_debut, pret.demande_maintenence_valider.date_fin);
            } else {
                console.error('Les valeurs de fonction, service ou nombre de personnes sont manquantes.');
            }
        
        // Vérifier si pret.id_voiture et pret.id_voiture.id existent avant d'y accéder
        if (pret.id_voiture && pret.id_voiture.id) {
            setIdVoiture(pret.id_voiture.id); // Enregistrer l'idVoiture
        }
    
        // Vérifier si pret.id_utilisateur et pret.demande_maintenence_valider.id_utilisateur.id_personnel existent avant d'y accéder
        if (pret.id_utilisateur && pret.demande_maintenence_valider.id_utilisateur.id_personnel && pret.demande_maintenence_valider.id_utilisateur.id_personnel.id) {
            setIdPersonnel(pret.demande_maintenence_valider.id_utilisateur.id_personnel.id); // Enregistrer l'idPersonnel
        }
        setShowModal(true);
        
    };
    

    const handleShowRefusModal = (pret) => {
        // setMatricule(pret.demande_maintenence_valider.id_voiture.matricule);
        setIdDemande(pret.demande_maintenence_valider.id_demande_pret_voiture);
        setShowRefusModal(true); 
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleCloseRefusModal = () => {
        setShowRefusModal(false); 
    };

    const selectAllPret = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/Demande_pret_voiture/SelectAll_demande_pret_not_valider_refuser`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            // Trier les données par date_debut (ou tout autre champ souhaité)
            const sortedData = response.data.data.sort((a, b) => new Date(a.demande_maintenence_valider.date_debut) - new Date(b.demande_maintenence_valider.date_debut));
            setPretData(sortedData);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };
    const selectAll_Voiture = async (f, s, p, debut, fin) => {
        if (f && s && p && debut && fin) { 
            console.log(`http://localhost:8080/voiture/SelectAll_voiture_by_id_fonction_id_service_place_dispo/${f}/${s}/${p}/${debut}/${fin}`);
            try {
                const response = await axios.get(`http://localhost:8080/voiture/SelectAll_voiture_by_id_fonction_id_service_place_dispo/${f}/${s}/${p}/${debut}/${fin}`,
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
        } else {
            console.error('Paramètres manquants pour selectAll_Voiture:', { f, s, p, debut, fin });
        }
    };
    const selectAll_Personnel = async (debut, fin) => {
        try {
            const response = await axios.post('http://localhost:8080/Chauffeur/chauffeur_dispo',
                {
                    debut: debut,
                    fin: fin
                },
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
        selectAllPret();
        selectAll_Personnel();
    }, []);

    // Fonction pour insérer une validation
    const insertValiderPret = async (event) => {
        event.preventDefault();
        console.log(remarque, idDemande, token, idVoiture, idPersonnel);
        try {
            const response = await axios.post('http://localhost:8080/Validation_pret_voiture/insertion_demande_maintenence_validation', 
                {
                    remarque: remarque,
                    id_demande_pret_voiture: idDemande,
                    id_utilisateur: token,
                    id_voiture: idVoiture, 
                    id_chauffeur: idPersonnel 
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
            selectAllPret(); 
        } catch (error) {
            console.error('Erreur lors de la validation:', error.response ? error.response.data : error.message);
            toast.error('Erreur lors de la validation: ' + (error.response ? error.response.data.message : 'Erreur inconnue'), { position: "top-right" });
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
            selectAllPret(); 

        } catch (error) {
            toast.error('Erreur lors du refus!', { position: "top-right" });
        }
    };

    // Calculer les indices des éléments à afficher
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = pretData.slice(indexOfFirstItem, indexOfLastItem);

    // Changer de page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Remplacez la pagination existante par ce nouveau composant
    const PaginationComponent = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
            pageNumbers.push(i);
        }
    
        const pageNumberLimit = 5;
        const [minPageNumberLimit, setMinPageNumberLimit] = useState(0);
        const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(5);
    
        const handleNextBtn = () => {
            paginate(currentPage + 1);
            if (currentPage + 1 > maxPageNumberLimit) {
                setMaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
                setMinPageNumberLimit(minPageNumberLimit + pageNumberLimit);
            }
        };
    
        const handlePrevBtn = () => {
            paginate(currentPage - 1);
            if ((currentPage - 1) % pageNumberLimit === 0) {
                setMaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
                setMinPageNumberLimit(minPageNumberLimit - pageNumberLimit);
            }
        };
    
        let pageIncrementBtn = null;
        if (pageNumbers.length > maxPageNumberLimit) {
            pageIncrementBtn = <Pagination.Ellipsis onClick={handleNextBtn} />;
        }
    
        let pageDecrementBtn = null;
        if (minPageNumberLimit >= 1) {
            pageDecrementBtn = <Pagination.Ellipsis onClick={handlePrevBtn} />;
        }
    
        return (
            <Pagination className="justify-content-center mt-3">
                <Pagination.First onClick={() => paginate(1)} disabled={currentPage === 1} />
                <Pagination.Prev onClick={handlePrevBtn} disabled={currentPage === 1} />
                {pageDecrementBtn}
                {pageNumbers.map(number => {
                    if (number < maxPageNumberLimit + 1 && number > minPageNumberLimit) {
                        return (
                            <Pagination.Item key={number} active={number === currentPage} onClick={() => paginate(number)}>
                                {number}
                            </Pagination.Item>
                        );
                    } else {
                        return null;
                    }
                })}
                {pageIncrementBtn}
                <Pagination.Next onClick={handleNextBtn} disabled={currentPage === pageNumbers.length} />
                <Pagination.Last onClick={() => paginate(pageNumbers.length)} disabled={currentPage === pageNumbers.length} />
            </Pagination>
        );
    };

    const handleShowTrajetModal = async (pret) => {
        setSelectedDemande(pret);
        try {
            const response = await axios.get(`http://localhost:8080/Destination_pret_voiture/find_Destination_pret_voitureBy_id_id_demande_maintenence_valider/${pret.demande_maintenence_valider.id_demande_pret_voiture}`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setTrajets(response.data.data);
            setShowTrajetModal(true);
        } catch (error) {
            console.error('Erreur lors de la récupération des trajets', error);
            toast.error('Erreur lors de la récupération des trajets');
        }
    };

    const handleCloseTrajetModal = () => {
        setShowTrajetModal(false);
    };

    return (
        <div className="menu-container">
            <Top />
            <div className="main-content">
                <Nav />
                <div className="content">
                    <div className="table-container mt-4">
                        <div className="padding-top-black">
                            <h3>Liste des demandes de prêt</h3>
                        </div>
                <div className="table-wrapper">
                    <div className="table-container mt-4">  
                        <table className="table table-striped table-hover table-responsive">
                            <thead className="table-primary">
                                <tr>
                                    <th>Date Début</th>
                                    <th>Date Fin</th>
                                    <th> Motif</th>
                                    <th>Distance</th>
                                    <th>Nombre de Personne</th>
                                    <th>Action</th>
                                    <th>Rejet</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(currentItems) && currentItems.length > 0 ? (
                                    currentItems.map((pret) => (
                                    <tr key={pret.demande_maintenence_valider.id_demande_pret_voiture}>
                                        <td>{pret.demande_maintenence_valider.date_debut}</td>
                                        <td>{pret.demande_maintenence_valider.date_fin}</td>
                                        <td>{pret.demande_maintenence_valider.id_motif_pret_voiture?.nom || 'N/A'}</td>
                                        <td>
                                            <i>
                                                <a href="#" onClick={() => handleShowTrajetModal(pret)}>
                                                    {pret.distance}
                                                </a>  Km
                                            </i>
                                        </td>
                                        <td>{pret.demande_maintenence_valider.nbr_pers || 'N/A'} prs </td>
                                        <td>
                                        <button
                                            className="validate-button"
                                            title="Valider"
                                            onClick={() => handleShowModal(pret)}
                                        >
                                            <i className="fas fa-check-circle"></i> Valider
                                        </button>
                                        </td>
                                        <td>
                                        <button
                                            className="reject-button"
                                            title="Rejeter"
                                            onClick={() => handleShowRefusModal(pret)}
                                        >
                                            <i className="fas fa-times-circle"></i> Rejeter
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
                        <PaginationComponent
                                itemsPerPage={itemsPerPage}
                                totalItems={pretData.length}
                                paginate={paginate}
                                currentPage={currentPage}
                            />
                        </div>
                    </div>
                </div>
                </div>
            </div>

                    {/* Modal de validation */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Valider la demande</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Chargement des détails de la demande pour {matricule}</p>

                    <input
                        className="form-control"
                        type="text"
                        placeholder="Remarque"
                        value={remarque}
                        onChange={(e) => setRemarque(e.target.value)}
                        required
                    /><br />

                    <select 
                                className="form-select"
                                value={idVoiture}
                                onChange={(e) => setIdVoiture(e.target.value)}  
                                required
                            >
                                <option value="">Choisir une voiture</option>
                                {Array.isArray(voitureData) && voitureData.length > 0 ? (
                                    voitureData.map(mod => (
                                        <option key={mod.id_voiture} value={mod.id_voiture}>
                                            {mod.matricule}
                                        </option>
                                    ))
                                ) : (
                                    <option value="" disabled>Aucune donnée disponible</option>
                                )}
                    </select><br></br>

                    <select 
                                className="form-select"
                                value={idPersonnel}
                                onChange={(e) => setIdPersonnel(e.target.value)}  
                                required
                            >
                                <option value="">Choisir un chauffeur</option>
                                {Array.isArray(personnelData) && personnelData.length > 0 ? (
                                    personnelData.map(pers => (
                                        <option key={pers.id_chauffeur} value={pers.id_chauffeur}>
                                            {pers.id_personne.nom}
                                        </option>
                                    ))
                                ) : (
                                    <option value="" disabled>Aucune donnée disponible</option>
                                )}
                    </select><br></br>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={insertValiderPret}>
                        Valider
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de refus */}
            <Modal show={showRefusModal} onHide={handleCloseRefusModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Refuser la demande</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Refuser la demande pour {matricule}</p>
                    <input
                        className="form-control"
                        type="text"
                        placeholder="Insérer une remarque"
                        value={remarqueRefus}
                        onChange={(e) => setRemarqueRefus(e.target.value)}
                        required
                    /><br />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseRefusModal}>
                        Annuler
                    </Button>
                    <Button variant="danger" onClick={insertRefusPret}>
                        Refuser
                    </Button>
                </Modal.Footer>
            </Modal>

           

            {/* Modal pour afficher les trajets */}
            <Modal show={showTrajetModal} onHide={handleCloseTrajetModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Trajets effectués</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {trajets.length > 0 ? (
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Départ</th>
                                    <th>Arrivée</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trajets.map((trajet, index) => (
                                    <tr key={index}>
                                        <td>{trajet.depart.nom_lieu}</td>
                                        <td>{trajet.arriver.nom_lieu}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Aucun trajet disponible</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseTrajetModal}>
                        Fermer
                    </Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer />
        </div>
    );
}

export default Pret;
