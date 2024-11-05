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

function EntreePiece() {
    const token = sessionStorage.getItem('token');

    const [idDesignation, setIdDesignation] = useState('');
    const [idModel, setIdModel] = useState('');
    const [nbr, setNbr] = useState('');
    const [dates, setDates] = useState('');
    const [annee, setAnnee] = useState('');
    const [etat, setEtat] = useState('');

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

    const [filtres, setFiltres] = useState({
        idDesignation: '',
        idModel: '',
        annee: '',
        etat: ''
    });

    const [resultatsFiltres, setResultatsFiltres] = useState([]);

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

    useEffect(() => {
        setResultatsFiltres(sortiePiece);
    }, [sortiePiece]);

    const handleFiltreChange = (champ, valeur) => {
        setFiltres(prev => ({ ...prev, [champ]: valeur }));
    };

    const handleRecherche = (event) => {
        const resultats = Array.isArray(sortiePiece) ? sortiePiece.filter(entree => 
            (!filtres.idDesignation || (entree.designation && entree.designation.id_designation === filtres.idDesignation)) &&
            (!filtres.idModel || (entree.model && entree.model.id_model === filtres.idModel)) &&
            (!filtres.annee || (entree.annee === Number(filtres.annee))) &&
            (!filtres.etat || (entree.etat_piece && entree.etat_piece.id_etat_piece === filtres.etat && filtres.etat !== '')) &&
            (!idLieu || (entree.lieu && entree.lieu.id_lieu === idLieu))
        ) : [];
        
    };

    const handleInsertion = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`http://localhost:8080/Sortie_piece/insertion_Entre_piece`, 
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
            selectAllSortiePiece();  // Recharger les données après l'insertion
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

    const selectAllSortiePiece = async () => {
        try {
            const response = await axios.get('http://localhost:8080/Entre_piece/selectStock_piece',
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
            const response = await axios.post('http://localhost:8080/Sortie_piece/insertion_Entre_piece', {
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

    return (
        <div className="menu-container">
            <Top />
            <div className="main-content">
                <Nav />
                <div className="content">
                    <BoutonPiece />
                    <div className="padding-top-black rounded">
                        <h2>Recherche de Sortie de Pièces</h2>
                    </div>
                    <div className="table-wrapper">
                        <form onSubmit={handleRecherche} className="mb-4">
                            <div className="mb-3">
                                <label className="form-label">Désignation:</label>
                                <Select
                                    value={designationOptions.find(option => option.value === filtres.idDesignation)}
                                    onChange={(selectedOption) => handleFiltreChange('idDesignation', selectedOption ? selectedOption.value : '')}
                                    options={designationOptions}
                                    placeholder="Sélectionner une désignation"
                                    isSearchable={true}
                                    isClearable={true}
                                />
                            </div>

                            <div className="mb-3">
                                <label>Modèle:</label>
                                <Select
                                    value={modelOptions.find(option => option.value === filtres.idModel)}
                                    onChange={(selectedOption) => handleFiltreChange('idModel', selectedOption ? selectedOption.value : '')}
                                    options={modelOptions}
                                    placeholder="Sélectionner un modèle"
                                    isSearchable={true}
                                    isClearable={true}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Année:</label>
                                <input
                                    className="form-control"
                                    type="number"
                                    placeholder="Filtrer par année"
                                    value={filtres.annee}
                                    onChange={(e) => handleFiltreChange('annee', e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">État:</label>
                                <Select
                                    value={etatOptions.find(option => option.value === filtres.etat)}
                                    onChange={(selectedOption) => handleFiltreChange('etat', selectedOption ? selectedOption.value : '')}
                                    options={etatOptions}
                                    placeholder="Sélectionner un état"
                                    isSearchable={true}
                                    isClearable={true}
                                />
                            </div>

                            <div className="mb-3">
                                <label>Lieu:</label>
                                <Select
                                    value={lieuOptions.find(option => option.value === idLieu)}
                                    onChange={(selectedOption) => setIdLieu(selectedOption.value)}
                                    options={lieuOptions}
                                    placeholder="Sélectionner un lieu"
                                    isSearchable={true}
                                    required
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
                        <th>Date</th>
                        <th>Lieu</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                                {resultatsFiltres && resultatsFiltres.length > 0 ? (
                                    resultatsFiltres.map((sortie, index) => (
                                        <tr key={index}>
                                            <td>{sortie.designation?.nom_designation || 'N/A'}</td>
                                            <td>{sortie.model?.nom_model || 'N/A'}</td>
                                            <td>{sortie.model?.id_marque?.nom_marque || 'N/A'}</td>
                                            <td>{sortie.annee || 'N/A'}</td>
                                            <td>{sortie.etat_piece?.nom || 'N/A'}</td>
                                            <td>{sortie.nbr || 'N/A'}</td>
                                            <td>{sortie.dates || 'N/A'}</td>
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
