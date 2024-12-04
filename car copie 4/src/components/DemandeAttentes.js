import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button, Pagination } from 'react-bootstrap';
import Top from './TopMenu';
import Nav from './Nav';
import '../styles/Menu.css';
import { ToastContainer, toast } from 'react-toastify';  
import * as XLSX from 'xlsx';

function DemandeAttente() {

    const token = sessionStorage.getItem('token');

    const [actionMaintData, setActionMaintData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showModalVoiture, setshowModalVoiture] = useState(false);
    const [showRefusModal, setShowRefusModal] = useState(false); // Ajout du modal de refus
    const [matricule, setMatricule] = useState('');
    const [idDemande, setIdDemande] = useState('');
    const [remarque, setRemarque] = useState('');
    const [remarqueRefus, setRemarqueRefus] = useState(''); // Ajout pour le refus
    const [dateRdv, setDateRdv] = useState('');
    const [inputFields, setInputFields] = useState(['']);
    const [lieuData, setLieuData] = useState([]);
    const [SelectRapide, setSelectRapide] = useState([]);
    const [SelectRecu, setSelectRecu] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); 
    const [selectedLieu, setSelectedLieu] = useState('');
    const [searchTermService, setSearchTermService] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const apiUrl = process.env.REACT_APP_API_URL;

    const handleShowModalVoiture = (matricule) => {
        Rapide(matricule);
        Recu(matricule);
        setshowModalVoiture(true);
    };
    const handleCloseRefusModalVoiture = () => {
        setshowModalVoiture(false); // Fermer le modal de refus
    };
    const Rapide = async (matricule) => {
        try {
            const response = await axios.get(`${apiUrl}/Reparation_rapide_voiture/reparation_rapide_fait_by_matricule/${matricule}`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setSelectRapide(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };
    const Recu = async (matricule) => {
        try {
            const response = await axios.get(`${apiUrl}/Tabeau_Recu/reparation_fait_by_matricule/${matricule}`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setSelectRecu(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };
    const handleShowModal = (fonction) => {
        setMatricule(fonction.id_voiture.matricule);
        setIdDemande(fonction.id_demande_maintenence);
        setShowModal(true);
    };

    const handleShowRefusModal = (fonction) => {
        setMatricule(fonction.id_voiture.matricule);
        setIdDemande(fonction.id_demande_maintenence);
        setShowRefusModal(true); // Ouvrir le modal de refus
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setInputFields(['']);
    };

    const handleCloseRefusModal = () => {
        setShowRefusModal(false); // Fermer le modal de refus
    };

    const selectAllLieu = async () => {
        try {
            const response = await axios.get(`${apiUrl}/Lieu/selectAll_lieu`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setLieuData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };

    useEffect(() => {
        selectAllLieu();
    }, []);

    const insertValider = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${apiUrl}/demande_maintenence_valider/insertion_demande_maintenence_validation`, 
                {
                    remarque: remarque,
                    date_rdv: dateRdv,
                    id_lieu: selectedLieu, 
                    id_utilisateur: token,
                    id_demande_maintenence: idDemande
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                }
            );
            
            toast.success('Données bien insérées!', {  
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            handleCloseModal();
            selectAllActionMaintenance();
        } catch (error) {
            console.error('Erreur de Validation', error);
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

    const insertRefus = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${apiUrl}/demande_maintenence_refuser/insertion_demande_maintenence_refuser`, 
                {
                    remarque: remarqueRefus, // Remarque pour le refus
                    id_utilisateur: token,
                    id_demande_maintenence: idDemande
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`

                    },
                }
            );
            
            toast.success('Demande refusée avec succès!', {  
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            handleCloseRefusModal();
        } catch (error) {
            console.error('Erreur de refus', error);
            toast.error('Erreur lors du refus!', {  
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

    const selectAllActionMaintenance = async () => {
        try {
            const response = await axios.get(`${apiUrl}/demande_maintenence/Select_Demande_maintenence_Attente`,
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
        selectAllActionMaintenance();
    }, []);

    const filteredData = actionMaintData.filter(fonction =>
        fonction.id_voiture.matricule.toLowerCase().includes(searchTerm.toLowerCase()) &&
        fonction.id_utilisateur.id_personnel.id_service.nom_service.toLowerCase().includes(searchTermService.toLowerCase())
    );
    

    const handleAddField = () => {
        setInputFields([...inputFields, '']);
    };

    const handleInputChange = (index, event) => {
        const values = [...inputFields];
        values[index] = event.target.value;
        setInputFields(values);
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredData.map(fonction => ({
            Id: fonction.id_demande_maintenence,
            Immatricule: fonction.id_voiture.matricule,
            Nom: fonction.id_utilisateur.id_personnel.nom,
            Service: fonction.id_utilisateur.id_personnel.id_service.nom_service,
            Fonction: fonction.id_utilisateur.id_personnel.id_fonction.nom_fonction,
            Remarque: fonction.remarque
        })));
    
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Demandes');
    
        // Ajuster la largeur des colonnes
        worksheet['!cols'] = [{ wch: 10 }, { wch: 15 }, { wch: 15 }, { wch: 20 }, { wch: 20 }, { wch: 30 }];
    
        // Centrer le texte des cellules
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
            for (let colNum = range.s.c; colNum <= range.e.c; colNum++) {
                const cell = worksheet[XLSX.utils.encode_cell({ r: rowNum, c: colNum })];
                if (cell) {
                    cell.s = {
                        alignment: { horizontal: 'center' }
                    };
                }
            }
        }
    
        XLSX.writeFile(workbook, 'demandes_en_attente.xlsx');
    };

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

    // Calculer les indices de début et de fin pour la page courante
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    // Fonction pour changer de page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (

       
        <div className="menu-container">
    <Top />
    <div className="main-content">
        <Nav />
        <div className="content">
            <div className="content-header d-flex justify-content-between align-items-center"> 
                <button className="btn btn-success insert-vehicle-button" onClick={exportToExcel}>
                            Exporter en Excel
                </button>
            </div>

                <div className="padding-top-black">
                    <h2 className="text-center">Listes des demandes en attente</h2>
                </div>
                <div className="table-wrapper">
    <input 
        type="text" 
        className="form-control" 
        placeholder="Rechercher par immatricule" 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
    />
    <input 
        type="text" 
        className="form-control mt-2" // Ajouter un espacement entre les deux inputs
        placeholder="Rechercher par service" 
        value={searchTermService}
        onChange={(e) => setSearchTermService(e.target.value)}
    /><br></br>

    <div className="scrollable-table">  
        <table className="table table-striped table-hover table-responsive">
        <thead className="table-primary">
                    
                    <tr>
                        <th>Numéro</th>
                        <th>Immatriculation</th>
                        <th>Nom</th>
                        <th>Service</th>
                        <th>Direction</th>
                        <th>Remarque</th>
                        <th>Validation</th>
                        <th>Refus</th>
                    </tr>
                </thead>
            <tbody>
                {currentItems.length > 0 ? (
                    currentItems.map(fonction => (
                        <tr key={fonction.id_demande_maintenence}>
                            <td>{fonction.id_demande_maintenence}</td>
                            <td>
                                <button
                                    className="btn validate-button"
                                    style={{"color": "black" , "background-color": "#0080ff"}}
                                    title="Valider"
                                    onClick={() => handleShowModalVoiture(fonction.id_voiture.matricule)}
                                >
                                    {fonction.id_voiture.matricule}
                                </button>
                                </td>
                            <td>{fonction.id_utilisateur.id_personnel.nom}</td>
                            <td>{fonction.id_utilisateur.id_personnel.id_service.nom_service}</td>
                            <td>{fonction.id_utilisateur.id_personnel.id_fonction.nom_fonction}</td>
                            <td>{fonction.remarque}</td>
                            <td>
                                <button
                                    className="btn btn-success validate-button"
                                    title="Valider"
                                    onClick={() => handleShowModal(fonction)}
                                >
                                    <i className="fas fa-check-circle"></i> Valider
                                </button>
                            </td>
                            <td>
                                <button
                                    className="btn btn-danger reject-button"
                                    title="Rejeter"
                                    onClick={() => handleShowRefusModal(fonction)}
                                >
                                    <i className="fas fa-times-circle"></i> Rejeter
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="8" className="text-center">Aucune donnée disponible</td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
    <PaginationComponent
        itemsPerPage={itemsPerPage}
        totalItems={filteredData.length}
        paginate={paginate}
        currentPage={currentPage}
    />
</div>
        </div>
    </div>


            {/* Modal de validation */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Valider la demande</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Chargement des détails de la demande <b><i>{matricule}</i></b></p>
                    <input
                        className="form-control"
                        type="text"
                        placeholder="Insérer Remarque"
                        value={remarque}
                        onChange={(e) => setRemarque(e.target.value)}
                        required
                    /><br /><br />
                    <select 
                        className="form-select"
                        value={selectedLieu} 
                        onChange={(e) => setSelectedLieu(e.target.value)}>
                        {lieuData.map((lieu) => (
                            <option key={lieu.id_lieu} value={lieu.id_lieu}>
                                {lieu.nom_lieu}
                            </option>
                        ))}
                    </select><br /><br />
                    <input 
                        className="form-control form-control-lg border rounded"
                        type="date" 
                        placeholder="Date RDV" 
                        value={dateRdv}
                        onChange={(e) => setDateRdv(e.target.value)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Fermer
                    </Button>
                    <Button variant="primary" onClick={insertValider}>
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
                    <p>Refus de la demande pour {matricule}</p>
                    <input
                        className="form-control"
                        type="text"
                        placeholder="Insérer une remarque"
                        value={remarqueRefus}
                        onChange={(e) => setRemarqueRefus(e.target.value)}
                        required
                    /><br /><br />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseRefusModal}>
                        Fermer
                    </Button>
                    <Button variant="danger" onClick={insertRefus}>
                        Refuser
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showModalVoiture} onHide={handleCloseRefusModalVoiture}>
                <Modal.Header closeButton>
                    <Modal.Title>Historique du voitire {matricule}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>De ces 12 dernier mois</p>
                    <div className="scrollable-table">  
                        <p>Conssessionnaire</p>
                    <table className="table table-striped table-hover table-responsive">
                        <thead className="table-primary">
                                    <tr>
                                        <th>Date</th>
                                        <th>Designation</th>
                                    </tr>
                                </thead>
                            <tbody>
                            {SelectRecu.length > 0 ? (
                                SelectRecu.map(recu => (
                                    <tr key={recu.id_tableau_recu}>
                                        <td>{recu.id_recu.dates}</td>
                                        <td>{recu.id_designation.nom_designation}</td>
                                    </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center">Aucune donnée disponible</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="scrollable-table">  
                        <p>Rapide</p>
                    <table className="table table-striped table-hover table-responsive">
                        <thead className="table-primary">
                                    <tr>
                                        <th>Date</th>
                                        <th>Designation</th>
                                    </tr>
                                </thead>
                            <tbody>
                            {SelectRapide.length > 0 ? (
                                SelectRapide.map(rapide => (
                                    <tr key={rapide.id_reparation_rapide_voiture}>
                                        <td>{rapide.date}</td>
                                        <td>{rapide.id_action.nom_action}</td>
                                    </tr>
                            ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center">Aucune donnée disponible</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseRefusModalVoiture}>
                        Fermer
                    </Button>
                </Modal.Footer>
            </Modal>
            
            <ToastContainer />
        </div>
    );
}

export default DemandeAttente;