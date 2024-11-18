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
import { jsPDF } from "jspdf";
import Select from 'react-select';

function EntreePiece() {
    const token = sessionStorage.getItem('token');

    const [idDesignation, setIdDesignation] = useState('');
    const [idModel, setIdModel] = useState('');
    const [nbr, setNbr] = useState('');
    const [dates, setDates] = useState('');
    const [annee, setAnnee] = useState('');
    const [etat, setEtat] = useState('');
    const [idLieu, setIdLieu] = useState('');  // Ajout de l'état pour id_lieu

    const [lieuData, setLieuData] = useState([]);
    const [entreePieceData, setEntreePieceData] = useState([]);
    const [etatPieceData, setEtatPieceData] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [modelVoitures, setModelVoitures] = useState([]);

    const designationOptions = designations.map(designation => ({
        value: designation.id_designation,
        label: designation.nom_designation
    }));
    const lieuOptions = lieuData.map(lieu => ({
        value: lieu.id_lieu,
        label: lieu.nom_lieu
    }));

    const modelOptions = modelVoitures.map(model => ({
        value: model.id_model,
        label: model.nom_model
    }));

    const etatOptions = etatPieceData.map(etat => ({
        value: etat.id_etat_piece,
        label: etat.nom
    }));

    const handleInsertion = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`http://localhost:8080/Entre_piece/insertion_Entre_piece`,  // Changement de l'URL
                {
                    id_utilisateur: token,
                    id_designation: idDesignation,
                    id_model: idModel,
                    annee: annee,
                    nbr: nbr,
                    id_etat_piece: etat,
                    dates: dates,
                    id_lieu: idLieu, 
                }, {
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
            });
            selectAllEntreePiece();  // Recharger les données après l'insertion
        } catch (error) {
            console.error('Erreur de vérification', error);
            toast.error('Erreur lors de l\'insertion!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    const selectAllEntreePiece = async () => {
        try {
            const response = await axios.get('http://localhost:8080/Entre_piece/selectAll_Entre_piece',
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

    const selectAllEtatPiece = async () => {
        try {
            const response = await axios.get('http://localhost:8080/Etat_piece/selectAll_Etat_piece',
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
            const response = await axios.get('http://localhost:8080/Action/selectAll_enregistrerDesignation',
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
            const response = await axios.get('http://localhost:8080/model/selectAll_Model',
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

    const generatePDF = (entree) => {
        const doc = new jsPDF();
        doc.setFontSize(12);
        
        doc.text("Détails de l'entrée de pièce", 10, 10);
        doc.text(`Utilisateur: ${entree.id_utilisateur.id_personnel.nom}`, 10, 20);
        doc.text(`Désignation: ${entree.id_designation.nom_designation}`, 10, 30);
        doc.text(`Modèle: ${entree.id_model.nom_model}`, 10, 40);
        doc.text(`Année: ${entree.annee}`, 10, 50);
        doc.text(`État: ${entree.id_etat_piece.nom}`, 10, 60);
        doc.text(`Date: ${entree.dates}`, 10, 70);
        doc.text(`Nombre: ${entree.nbr}`, 10, 80);
        
        doc.save(`entree_piece_${entree.id_entre_piece}.pdf`);
    };

    const selectAllLieu = async () => {
        try {
            const response = await axios.get('http://localhost:8080/Lieu/selectAll_lieu',
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
        selectAllEntreePiece();
        selectAll_Designation();
        selectAll_ModelVoiture();
        selectAllEtatPiece();
        selectAllLieu();
    }, []);

    return (
        <div className="menu-container">
            <Top />
            <div className="main-content">
                <Nav />
                <div className="content">
                    <BoutonPiece />
                    <div className="padding-top-black rounded">
                        <h2>Ajouter Entrée de Pièce</h2>
                    </div>
                    <div className="table-wrapper">
                        <form onSubmit={handleInsertion} className="mb-4">
                            <div className="mb-3">
                                <label className="form-label">Désignation:</label>
                                <Select
                                    value={designationOptions.find(option => option.value === idDesignation)}
                                    onChange={(selectedOption) => setIdDesignation(selectedOption.value)}
                                    options={designationOptions}
                                    placeholder="Sélectionner une désignation"
                                    isSearchable={true}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label>Modèle:</label>
                                <Select
                                    value={modelOptions.find(option => option.value === idModel)}
                                    onChange={(selectedOption) => setIdModel(selectedOption.value)}
                                    options={modelOptions}
                                    placeholder="Sélectionner un modèle"
                                    isSearchable={true}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Nombre:</label>
                                <input
                                    className="form-control"
                                    type="number"
                                    placeholder="Insérer nombre"
                                    value={nbr}
                                    onChange={(e) => setNbr(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label>Lieu:</label>
                                <Select
                                    value={lieuOptions.find(option => option.value === idLieu)}  // Utilisation de lieuOptions
                                    onChange={(selectedOption) => setIdLieu(selectedOption.value)}  // Mise à jour de l'état pour idLieu
                                    options={lieuOptions}  // Assurez-vous que lieuOptions est bien défini
                                    placeholder="Sélectionner un lieu"
                                    isSearchable={true}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Année Modèle:</label>
                                <input
                                    className="form-control"
                                    type="number"
                                    placeholder="Insérer l'année"
                                    value={annee}
                                    onChange={(e) => setAnnee(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">État:</label>
                                <Select
                                    value={etatOptions.find(option => option.value === etat)}
                                    onChange={(selectedOption) => setEtat(selectedOption.value)}
                                    options={etatOptions}
                                    placeholder="Sélectionner un état"
                                    isSearchable={true}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label>Date:</label>
                                <input
                                    className="form-control"
                                    type="date"
                                    value={dates}
                                    onChange={(e) => setDates(e.target.value)}
                                    required
                                />
                            </div>

                            <Button variant="primary" type="submit">Envoyer</Button>
                        </form>

                        <div className="table-container">
                            <h3>Liste des Entrées de Pièces</h3>
                            <table className="table table-striped table-hover table-responsive">
                                <thead className="table-primary">
                                    <tr>
                                        <th>Utilisateur</th>
                                        <th>Désignation</th>
                                        <th>Modèle</th>
                                        <th>Année Modèle</th>
                                        <th>Nombre</th>
                                        <th>État</th>
                                        <th>Date</th>
                                        <th>Lieu</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.isArray(entreePieceData) && entreePieceData.length > 0 ? (
                                        entreePieceData.map(entree => (
                                            <tr key={entree.id_entre_piece}>
                                                <td>{entree.id_utilisateur.id_personnel.nom}</td>
                                                <td>{entree.id_designation.nom_designation}</td>
                                                <td>{entree.id_model.nom_model}</td>
                                                <td>{entree.annee}</td>
                                                <td>{entree.nbr}</td>
                                                <td>{entree.id_etat_piece.nom}</td>
                                                <td>{entree.dates}</td>
                                                <td>{entree.id_lieu.nom_lieu}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7">Aucune donnée disponible</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default EntreePiece;
