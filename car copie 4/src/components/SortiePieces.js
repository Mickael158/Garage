import Top from './TopMenu';
import Nav from './Nav';
import { Modal, Button, Form } from 'react-bootstrap';
import BoutonPiece from './BoutonPiece';
import '../styles/Menu.css';
import '../styles/Form.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import jsPDF from "jspdf";
import "jspdf-autotable";

function EntreePiece() {
    const token = sessionStorage.getItem('token');
    const apiUrl = process.env.REACT_APP_API_URL;

    

    const [sortiePiece, setsortiePiece] = useState([]);
    const [etatPieceData, setEtatPieceData] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [modelVoitures, setModelVoitures] = useState([]);

    const [entreePieceData, setEntreePieceData] = useState([]);

    const designationOptions = designations.map(designation => ({
        value: designation.id_designation,
        label: designation.nom_designation
    }));

    const modelOptions = modelVoitures.map(model => ({
        value: model.id_model,
        label: model.nom_model
    }));

    const etatOptions = etatPieceData.map(etat => ({
        value: etat.id_etat_piece,
        label: etat.nom
    }));



    const [dateActuelle] = useState(new Date().toISOString().split('T')[0]);

    const [showModal, setShowModal] = useState(false);
    const [selectedSortie, setSelectedSortie] = useState(null);
    const [nombreARecuperer, setNombreARecuperer] = useState('');

    const [idLieu, setIdLieu] = useState('');
    const [lieuData, setLieuData] = useState([]);
    const lieuOptions = lieuData.map(lieu => ({
        value: lieu.id_lieu,
        label: lieu.nom_lieu
    }));

    const [selectedDesignation, setSelectedDesignation] = useState(null);
const [selectedModel, setSelectedModel] = useState(null);
const [annee, setAnnee] = useState('');
const [selectedEtat, setSelectedEtat] = useState(null);
const [selectedLieu, setSelectedLieu] = useState(null);
    


    

const generatePDF = (data) => {
    const doc = new jsPDF();

    // Ajouter le titre et les informations principales
    doc.setFontSize(12);
    doc.text("MINISTÈRE DES FINANCES ET DU BUDGET", 10, 10);
    doc.text("Secrétariat Général", 10, 16);
    doc.text("Direction Générale du Budget et des Finances", 10, 22);
    doc.text("Service Administratif et Financier", 10, 28);
    
    doc.setFontSize(14);
    doc.text("BON DE SORTIE", 90, 40);

    // Informations du document
    doc.setFontSize(12);
    doc.text(`Destiné au : ${data.destinataire}`, 10, 50);
    doc.text(`Numéro : ${data.numero}`, 10, 56);

    // Tableau des pièces
    const tableColumn = ["DESIGNATIONS", "UNITÉ", "QUANTITÉ", "OBSERVATION"];
    const tableRows = [];

    data.pieces.forEach((piece) => {
        tableRows.push([piece.designation, piece.unite, piece.quantite, piece.observation || ""]);
    });

    doc.autoTable({
        startY: 65,
        head: [tableColumn],
        body: tableRows,
    });

    // Signatures
    doc.text("Le Bénéficiaire", 10, doc.lastAutoTable.finalY + 20);
    doc.text("Le Dépositaire", 90, doc.lastAutoTable.finalY + 20);
    doc.text("Le Magasinier", 160, doc.lastAutoTable.finalY + 20);

    // Sauvegarder ou afficher le PDF
    doc.save("bon_de_sortie.pdf");
};

    

    const selectAllSortiePiece = async () => {
        try {
            const response = await axios.get(`${apiUrl}/Entre_piece/selectStock_piece1`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setsortiePiece(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };

    const selectAllEtatPiece = async () => {
        try {
            const response = await axios.get(`${apiUrl}/Etat_piece/selectAll_Etat_piece`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setEtatPieceData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };

    const selectAll_Designation = async () => {
        try {
            const response = await axios.get(`${apiUrl}/Action/selectAll_enregistrerDesignation`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setDesignations(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };

    const selectAll_ModelVoiture = async () => {
        try {
            const response = await axios.get(`${apiUrl}/model/selectAll_Model`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setModelVoitures(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des modèles', error);
        }
    };

    const selectAllEntreePiece = async () => {
        try {
            const response = await axios.get(`${apiUrl}/Entre_piece/selectAll_Entre_piece`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setEntreePieceData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };

    const handleRecupererClick = (sortie) => {
        setSelectedSortie(sortie);
        setShowModal(true);
        setNombreARecuperer('');
    };

    const handleRecuperer = async () => {
        if (!selectedSortie) return;

        const nombre = parseInt(nombreARecuperer);
        if (isNaN(nombre) || nombre <= 0 || nombre > selectedSortie.nbr) {
            toast.error('Nombre invalide ou supérieur à la quantité disponible');
            return;
        }

        try {
            const response = await axios.post(`${apiUrl}/Sortie_piece/insertion_Entre_piece`, {
                id_utilisateur: token,
                id_designation: selectedSortie.designation.id_designation,
                id_model: selectedSortie.model.id_model,
                annee: selectedSortie.annee,
                nbr: nombre,
                id_etat_piece: selectedSortie.etat_piece.id_etat_piece,
                id_lieu : selectedSortie.lieu.id_lieu,
                dates: dateActuelle
            }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`

                    },
                }
            );
            toast.success('Pièces récupérées avec succès!');
            selectAllSortiePiece();  // Recharger les données
            setShowModal(false);
            const data = {
                destinataire: "Personne Responsable des Marchés Publics DGBF",
                numero: "2024 MEF/SG/DGFAG/SAF",
                pieces: [
                    { designation: selectedSortie.designation?.nom_designation, unite: selectedSortie.designation?.nom_designation, quantite: nombre, observation: "via Car management" },
                ]
            };
            generatePDF(data);
        } catch (error) {
            console.error('Erreur lors de la récupération', error);
            toast.error('Erreur lors de la récupération des pièces');
        }
    };

    useEffect(() => {
        selectAllSortiePiece();
        selectAll_Designation();
        selectAll_ModelVoiture();
        selectAllEtatPiece();
        selectAllLieu();
        selectAllEntreePiece();
    }, []);

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
    const filteredSortiePiece = sortiePiece.filter(sortie => {
        return (
            (selectedDesignation ? sortie.designation?.nom_designation === selectedDesignation.label : true) &&
            (selectedModel ? sortie.model?.nom_model === selectedModel.label : true) &&
            (annee ? sortie.annee === parseInt(annee) : true) &&
            (selectedEtat ? sortie.etat_piece?.nom === selectedEtat.label : true) &&
            (selectedLieu ? sortie.lieu.nom_lieu === selectedLieu.label : true)
        );
    });
    const handleSearch = (e) => {
        e.preventDefault();
        // Filtrer les données ici
    };

    return (
        <div className="menu-container">
            <Top />
            <div className="main-content">
                <Nav />
                <div className="content">
                    <BoutonPiece />
                    <div className="padding-top-black rounded">
                        <h2>Recherche des Pièces</h2>
                    </div>
                    <div className="table-wrapper">
                    <form className="mb-4" onSubmit={handleSearch}>
        <div className="mb-3">
            <label className="form-label">Désignation:</label>
            <Select
                value={selectedDesignation}
                options={designationOptions}
                onChange={(selectedOption) => setSelectedDesignation(selectedOption)}
                placeholder="Sélectionner une désignation"
                isSearchable={true}
                isClearable={true}
            />
        </div>

        <div className="mb-3">
            <label>Modèle:</label>
            <Select
                value={selectedModel}
                options={modelOptions}
                onChange={(selectedOption) => setSelectedModel(selectedOption)}
                placeholder="Sélectionner un modèle"
                isSearchable={true}
                isClearable={true}
            />
        </div>

        <div className="mb-3">
            <label className="form-label">Année Modèle:</label>
            <input
                className="form-control"
                type="number"
                placeholder="Filtrer par année"
                value={annee}
                onChange={(e) => setAnnee(e.target.value)}
            />
        </div>

        <div className="mb-3">
            <label className="form-label">État:</label>
            <Select
                value={selectedEtat}
                options={etatOptions}
                onChange={(selectedOption) => setSelectedEtat(selectedOption)}
                placeholder="Sélectionner un état"
                isSearchable={true}
                isClearable={true}
            />
        </div>

        <div className="mb-3">
            <label>Lieu:</label>
            <Select
                value={selectedLieu}
                options={lieuOptions}
                onChange={(selectedOption) => setSelectedLieu(selectedOption)}
                placeholder="Sélectionner un lieu"
                isSearchable={true}
                isClearable={true}
            />
        </div>

        <Button variant="primary" type="submit">Rechercher</Button>
    </form>


                        <table className="table table-striped table-hover">
                        <thead className="table-primary">
                    <tr>
                        <th>Désignation</th>
                        <th>Modèle</th>
                        <th>Marque</th>
                        <th>Année</th>
                        <th>État</th>
                        <th>Nombre</th>
                        <th>Lieu</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredSortiePiece.length > 0 ? (
                        filteredSortiePiece.map((sortie, index) => (
                            <tr key={index}>
                                <td>{sortie.designation?.nom_designation || 'N/A'}</td>
                                <td>{sortie.model?.nom_model || 'N/A'}</td>
                                <td>{sortie.model?.id_marque?.nom_marque || 'N/A'}</td>
                                <td>{sortie.annee || 'N/A'}</td>
                                <td>{sortie.etat_piece?.nom || 'N/A'}</td>
                                <td>{sortie.nbr || 'N/A'}</td>
                                <td>{sortie.lieu.nom_lieu || 'N/A'}</td>
                                <td>
                                    <Button variant="primary" onClick={() => handleRecupererClick(sortie)}>
                                        Récupérer
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8">Aucune donnée correspondante trouvée</td>
                        </tr>
                    )}
                </tbody>
                        </table>

                        <Modal show={showModal} onHide={() => setShowModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Récupérer des pièces</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Nombre de pièces à récupérer</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Entrez le nombre"
                                            value={nombreARecuperer}
                                            onChange={(e) => setNombreARecuperer(e.target.value)}
                                            min="1"
                                            max={selectedSortie?.nbr}
                                        />
                                    </Form.Group>
                                    <p>Quantité disponible : {selectedSortie?.nbr}</p>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowModal(false)}>
                                    Annuler
                                </Button>
                                <Button variant="primary" onClick={handleRecuperer}>
                                    Confir
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default EntreePiece;
