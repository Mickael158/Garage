import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import Top from './TopMenu';
import Nav from './Nav';
import '../styles/Menu.css';

function DemandeValide() {

    const user = sessionStorage.getItem('token');

    const [remarqueData, setRemarqueData] = useState('');
    const [dates_pvData, setDatePvData] = useState('');
    const [numeroData, setNumeroData] = useState('');
    const [ImagesData, setImagesData] = useState('');
    const [maintenanceData, setmaintenanceData] = useState('');

    const [actionMaintData, setActionMaintData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [defaillanceData, setDefaillanceData] = useState([]);
    const [actionData, setActionData] = useState([]);
    const [systemeData, setSystemeData] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [pvData, setPvData] = useState({
        dates: '',
        numero: '',
        remarque: ''
    });
    const [rows, setRows] = useState([
        { select1: '', select2: '', select3: '', input1: '', input2: '' } // initial row
    ]);

    const selectAllActionMaintenanceValid = async () => {
        try {
            const response = await axios.get('http://localhost:8080/demande_maintenence_valider/selecAll_demande_maintenence_validation');
            setActionMaintData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };

    const selectAll_Systeme = async () => {
        try {
            const response = await axios.get('http://localhost:8080/Systeme/selecAll_Systeme');
            // console.log('Données récupérées:', response.data);  // Pour vérifier la structure des données
            setSystemeData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };

    const selectAll_Defaillance = async () => {
        try {
            const response = await axios.get('http://localhost:8080/Defaillance/selectAll_Defaillance');
            // console.log('Données récupérées:', response.data);  // Pour vérifier la structure des données
            setDefaillanceData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };

    const selectAll_Action = async () => {
        try {
            const response = await axios.get('http://localhost:8080/Action/selectAll_Action');
            // console.log('Données récupérées:', response.data);  // Log to check data structure
            setActionData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };

    useEffect(() => {
        selectAll_Defaillance();
        selectAll_Action();
        selectAll_Systeme();
        selectAllActionMaintenanceValid();
    }, []);

    const handleShowModal = (validation) => {
        setSelectedRequest(validation);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post('http://localhost:8080/submit_pv', {
                ...pvData,
                id_demande: selectedRequest.id_demande_maintenence_valider
            });
            alert('PV inséré avec succès !');
            handleCloseModal();
        } catch (error) {
            console.error('Erreur lors de l\'insertion du PV', error);
        }
    };

    const insert_PV = async (event) => {
        event.preventDefault();
        try {

            // console.log("Donnees: " , remarqueData,dates_pvData,numeroData,ImagesData,user,selectedRequest.id_demande_maintenence_valider);
            const response = await axios.post(`http://localhost:8080/Pv/insertion_Pv`, 
                { 
                    remarque: remarqueData, 
                    dates_pv: dates_pvData, 
                    numero: numeroData, 
                    image: ImagesData, 
                    id_utilisateur: user, 
                    id_demande_maintenence_valider: selectedRequest.id_demande_maintenence_valider
                }, 

                {
                    headers: { 'content-Type': 'application/json' },
                }
            );
            console.log('Insertion réussie:', response.data);
            selectAll_Action();  // Reload data after insertion
            handleCloseModal();
        } catch (error) {
            console.error('Erreur de Verification', error);
        }
    };

    const insert_pv_Tab = async () => {
        try {
            const payload = rows.map(row => ({
                id_systeme: row.select1,
                id_defaillance: row.select2,
                id_action: row.select3,
                observation: row.input1,
                ordre_de_priorite: row.input2
            }));
    
            // Affiche les données envoyées pour vérification
            console.log('Payload:', payload);
    
            // Envoie des données sous forme d'un tableau
            const response = await axios.post(
                'http://localhost:8080/TableauPv/enregistrerTableausPvs', 
                payload, 
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
    
            console.log('Insertion du tableau réussie:', response.data);
        } catch (error) {
            console.error('Erreur lors de l\'insertion du tableau', error);
        }
    };

    const handleRowChange = (index, event) => {
        const { name, value } = event.target;
        const updatedRows = [...rows];
        updatedRows[index][name] = value;
        setRows(updatedRows);
    };

    const handleAddField = () => {
        setRows([...rows, { select1: '', select2: '', select3: '', input1: '', input2: '' }]); // add a new row
    };

    // Nouvelle fonction pour supprimer une ligne
    const handleRemoveField = (index) => {
        const updatedRows = rows.filter((row, rowIndex) => rowIndex !== index);
        setRows(updatedRows);
    };

    return (
        <div className="menu-container">
            <Top />
            <div className="main-content">
                <Nav />
                <div className="content">
                    <div className="content-header">
                        <center><h2>Listes des demandes Valide</h2></center>
                    </div>
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
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
                                        <tr key={validation.id_demande_maintenence_valider}>
                                            <td>{validation.id_demande_maintenence_valider}</td>
                                            <td>{validation.id_demande_maintenence.id_voiture.matricule}</td>
                                            <td>{validation.id_utilisateur.id_personnel.nom}</td>
                                            <td>{validation.id_utilisateur.id_personnel.id_service.nom_service}</td>
                                            <td>{validation.remarque}</td>
                                            <td>
                                                <button
                                                    className="validate-button"
                                                    title="Insertion PV"
                                                    onClick={() => handleShowModal(validation)}
                                                >
                                                    <i className="fas fa-check-circle"></i> Insert PV
                                                </button>
                                            </td>
                                            <td>
                                                <button
                                                    className="validate-button"
                                                    title="Insertion PV"
                                                    onClick={() => handleShowModal(validation)}
                                                >
                                                    <i className="fas fa-check-circle"></i> Insert Proformat
                                                </button>
                                            </td>
                                            <td>
                                                <button
                                                    className="validate-button"
                                                    title="Insertion PV"
                                                    onClick={() => handleShowModal(validation)}
                                                >
                                                    <i className="fas fa-check-circle"></i> Insert Recu
                                                </button>
                                            </td>
                                            <td>
                                                <button
                                                    className="validate-button"
                                                    title="Insertion PV"
                                                    onClick={() => handleShowModal(validation)}
                                                >
                                                    <i className="fas fa-check-circle"></i> Voir plus
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5">Aucune donnée disponible</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
    
            {/* Modal */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Insérer PV</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={insert_PV}>
                        <Form.Group controlId="formDates">
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                type="date"
                                placeholder="Entrez la date"
                                name="dates"
                                value={dates_pvData}
                                onChange={(e) => setDatePvData(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formNumero">
                            <Form.Label>Numéro</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Entrez le numéro"
                                name="numero"
                                value={numeroData}
                                onChange={(e) => setNumeroData(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formRemarque">
                            <Form.Label>Remarque</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Entrez une remarque"
                                name="remarque"
                                value={remarqueData}
                                onChange={(e) => setRemarqueData(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formImage">
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Entrez l'image"
                                value={ImagesData}
                                onChange={(e) => setImagesData(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="success" type="submit" onClick={insert_PV} >
                            Soumettre PVs
                        </Button>
    
                        {/* Tableau à 5 colonnes avec un bouton de suppression */}
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Systeme</th>
                                    <th>Defaillance</th>
                                    <th>Action</th>
                                    <th>Observation</th>
                                    <th>Ordre de Priorité</th>
                                    <th>Actions</th> {/* Colonne pour le bouton Supprimer */}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, index) => (
                                    <tr key={index}>
                                        <td>
                                            <Form.Control 
                                                as="select" 
                                                name="select1" 
                                                value={row.select1} 
                                                onChange={(e) => handleRowChange(index, e)} 
                                            >
                                                <option value="">Choisir un lieu</option>
                                                {systemeData.length > 0 ? (
                                                    systemeData.map(sys => (
                                                        <option key={sys.id_systeme} value={sys.id_systeme}>
                                                            {sys.nom_systeme}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option value="" disabled>Aucune donnée disponible</option>
                                                )}
                                            </Form.Control>
                                        </td>
                                        <td>
                                            <Form.Control 
                                                as="select" 
                                                name="select2" 
                                                value={row.select2} 
                                                onChange={(e) => handleRowChange(index, e)} 
                                            >
                                                <option value="">Choisir un lieu</option>
                                                {defaillanceData.length > 0 ? (
                                                    defaillanceData.map(def => (
                                                        <option key={def.id_defaillance} value={def.id_defaillance}>
                                                            {def.nom_defaillance}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option value="" disabled>Aucune donnée disponible</option>
                                                )}
                                            </Form.Control>
                                        </td>
                                        <td>
                                            <Form.Control 
                                                as="select" 
                                                name="select3" 
                                                value={row.select3} 
                                                onChange={(e) => handleRowChange(index, e)} 
                                            >
                                                <option value="">Choisir une action</option>
                                                {actionData.length > 0 ? (
                                                    actionData.map(action => (
                                                        <option key={action.id_action} value={action.id_action}>
                                                            {action.nom_action}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option value="" disabled>Aucune donnée disponible</option>
                                                )}
                                            </Form.Control>
                                        </td>
                                        <td>
                                            <Form.Control type="text" name="input1" value={row.input1} onChange={(e) => handleRowChange(index, e)} />
                                        </td>
                                        <td>
                                            <Form.Control type="number" name="input2" value={row.input2} onChange={(e) => handleRowChange(index, e)} />
                                        </td>
                                        <td>
                                            <Button variant="danger" onClick={() => handleRemoveField(index)}>
                                                Supprimer
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
    
                        <Button variant="primary" onClick={handleAddField}>
                            + Ajouter une ligne
                        </Button>
                        <br /><br />
                        <Button variant="success" type="submit" onClick={insert_pv_Tab}>
                            Soumettre PV
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
    
}

export default DemandeValide;
