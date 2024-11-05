import Top from './TopMenu';
import Nav from './Nav';
import { ToastContainer, toast } from 'react-toastify';  
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Menu.css';
import ValidationPret from './ValidationPretClient';
import Select from 'react-select'; // Ajoutez cette importation en haut du fichier

function Pret() {
    const token = sessionStorage.getItem('token');

    const [dateDebut, setDateDebut] = useState('');
    const [dateFin, setDateFin] = useState('');
    const [motifPret, setMotifPret] = useState('');
    const [nbrPers, setNbrPers] = useState(''); // Ajout du nombre de personnes
    const [idVoiture, setIdVoiture] = useState('');
    const [idLieu, setIdLieu] = useState('');
    const [pretData, setPretData] = useState([]);
    const [voitureData, setVoitureData] = useState([]);
    const [modifData, setModifData] = useState([]);
    const [showMesDemandes, setShowMesDemandes] = useState(false); 
    const [lieuData, setLieuData] = useState([]);
    const [lieuDepart, setLieuDepart] = useState('');
    const [lieuArrivee, setLieuArrivee] = useState('');
    const [destinationPretData, setDestinationPretData] = useState([]);
    const [destinations, setDestinations] = useState([{ depart: '', arriver: '' }]);

    // Ajoutez ces nouvelles constantes pour les options de lieu
    const lieuOptions = lieuData.map(lieu => ({
        value: lieu.id_lieu,
        label: lieu.nom_lieu
    }));

    const insertDemandePret = async () => {
        const data = {
            date_debut: dateDebut,
            date_fin: dateFin,
            id_motif_pret_voiture: motifPret,
            id_utilisateur: token,
            nbr_pers: nbrPers,
            id_lieu: lieuDepart
        };
        console.log("Données de demande de prêt:", data);
        try {
            const response = await axios.post(`http://localhost:8080/Demande_pret_voiture/insertion_demande_maintenence`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                    
                },
            });
            return response;
        } catch (error) {
            console.error("Erreur détaillée:", error.response ? error.response.data : error.message);
            throw error;
        }
    };

    const addDestination = () => {
        const lastDestination = destinations[destinations.length - 1];
        setDestinations([...destinations, { depart: lastDestination.arriver, arriver: '' }]);
    };

    const removeDestination = (index) => {
        const newDestinations = destinations.filter((_, i) => i !== index);
        setDestinations(newDestinations);
    };

    const handleDestinationChange = (index, field, value) => {
        const newDestinations = [...destinations];
        newDestinations[index][field] = value;
        
        if (field === 'arriver') {
            if (index === 0) {
                // Mettre à jour le lieu de départ initial
                setLieuDepart(value);
            }
            if (index < newDestinations.length - 1) {
                // Mettre à jour le lieu de départ du trajet suivant
                newDestinations[index + 1].depart = value;
            }
        }
        
        setDestinations(newDestinations);
    };

    const insertDestinationPret = async (idDemandePret) => {
        const data = destinations.map(dest => ({
            depart: dest.depart,
            arriver: dest.arriver
        }));
        console.log("Données de destination de prêt:", data);
        const response = await axios.post(`http://localhost:8080/Destination_pret_voiture/enregistrerDestination_pret_voiture`, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`

            },
        });
        return response;
    };

    const insertPret = async (event) => {
        event.preventDefault();
        try {
            // Insérer d'abord la demande de prêt
            const responsePret = await insertDemandePret();
            console.log("Réponse de demande de prêt:", responsePret);

            // Vérifier si l'insertion de la demande a réussi
            if (responsePret.data && responsePret.data.data) {
                // Récupérer l'ID de la demande de prêt nouvellement créée
                const idDemandePret = responsePret.data.data.id_demande_pret_voiture;

                // Insérer ensuite la destination du prêt
                const responseDestination = await insertDestinationPret(idDemandePret);
                console.log("Réponse de destination de prêt:", responseDestination);

                toast.success('Demande de prêt et destination enregistrées avec succès!', { position: "top-right", autoClose: 3000 });
            } else {
                throw new Error('Échec de l\'insertion de la demande de prêt');
            }
        } catch (error) {
            console.error('Erreur d\'insertion', error);
            if (error.response) {
                console.error('Données de réponse d\'erreur:', error.response.data);
            }
            toast.error('Erreur lors de l\'insertion!', { position: "top-right", autoClose: 3000 });
        }
    };

    const selectAllPret = async () => {
        try {
            const response = await axios.get('http://localhost:8080/Demande_pret_voiture/selectAll_demande_pret_voiture',
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

    const selectAllModifPret = async () => {
        try {
            const response = await axios.get('http://localhost:8080/Motif_pret_voiture/selectAll_Motif_pret_voiture',
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setModifData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };

    const selectAll_Voiture = async () => {
        try {
            const response = await axios.get('http://localhost:8080/voiture/selectAll_voiture',
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


    const handleShowMesDemandes = () => {
        setShowMesDemandes(!showMesDemandes); // Bascule entre vrai et faux
    };

    // Modifiez la fonction qui gère le changement du lieu d'arrivée initial
    const handleLieuArriveeChange = (selectedOption) => {
        setLieuArrivee(selectedOption.value);
        // Mettre à jour le lieu de départ du premier trajet
        const newDestinations = [...destinations];
        newDestinations[0].depart = selectedOption.value;
        setDestinations(newDestinations);
    };

    useEffect(() => {
        selectAllPret();
        selectAllLieu();
        selectAllModifPret();
        selectAll_Voiture();
    }, []);

    return (
        <div className="menu-container">
            <Top />
            <div className="main-content">
                <Nav />
                <div className="content container">
                    <div className="content-header d-flex justify-content-between align-items-center"> 
                        <button className="btn btn-success insert-vehicle-button" onClick={handleShowMesDemandes}>
                            Mes demandes
                        </button>
                    </div>
                    <div className="padding-top-black rounded">
                        <h2 className="text-center my-4">Ajouter une demande de prêt</h2>
                    </div>
                    <div className="table-wrapper">

                    <form onSubmit={insertPret} className="bg-light p-4 ">
                        <div className="mb-3">
                            <label className="form-label">Date de début:</label>
                            <input
                                type="date"
                                className="form-control"
                                value={dateDebut}
                                onChange={(e) => setDateDebut(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Date de fin:</label>
                            <input
                                type="date"
                                className="form-control"
                                value={dateFin}
                                onChange={(e) => setDateFin(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Nombre de personnes:</label> {/* Nouveau champ */}
                            <input
                                type="number"
                                className="form-control"
                                value={nbrPers}
                                onChange={(e) => setNbrPers(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Motif Prêt:</label>
                            <select 
                                className="form-select"
                                value={motifPret}
                                onChange={(e) => setMotifPret(e.target.value)}
                                required
                            >
                                <option value="">Choisir un motif</option>
                                {modifData.map(modif => (
                                    <option key={modif.id_motif_pret_voiture} value={modif.id_motif_pret_voiture}>
                                        {modif.nom}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Lieu de départ:</label>
                                <Select
                                    value={lieuOptions.find(option => option.value === lieuDepart)}
                                    onChange={(selectedOption) => setLieuDepart(selectedOption.value)}
                                    options={lieuOptions}
                                    placeholder="Rechercher un lieu de départ..."
                                    isSearchable={true}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Lieu d'arrivée:</label>
                                <Select
                                    value={lieuOptions.find(option => option.value === lieuArrivee)}
                                    onChange={(selectedOption) => handleLieuArriveeChange(selectedOption)}
                                    options={lieuOptions}
                                    placeholder="Rechercher un lieu d'arrivée..."
                                    isSearchable={true}
                                    required
                                />
                            </div>
                        </div>
                        {destinations.map((dest, index) => (
                            <div key={index} className="row mb-3">
                                <div className="col-md-5">
                                    <label className="form-label">Lieu de départ:</label>
                                    <Select
                                        value={lieuOptions.find(option => option.value === dest.depart)}
                                        onChange={(selectedOption) => handleDestinationChange(index, 'depart', selectedOption.value)}
                                        options={lieuOptions}
                                        placeholder="Rechercher un lieu de départ..."
                                        isSearchable={true}
                                        required
                                        isDisabled={true} // Désactiver tous les champs de départ
                                    />
                                </div>
                                <div className="col-md-5">
                                    <label className="form-label">Lieu d'arrivée:</label>
                                    <Select
                                        value={lieuOptions.find(option => option.value === dest.arriver)}
                                        onChange={(selectedOption) => handleDestinationChange(index, 'arriver', selectedOption.value)}
                                        options={lieuOptions}
                                        placeholder="Rechercher un lieu d'arrivée..."
                                        isSearchable={true}
                                        required
                                    />
                                </div>
                                {index > 0 && (
                                    <div className="col-md-2">
                                        <button type="button" className="btn btn-danger mt-4" onClick={() => removeDestination(index)}>
                                            Supprimer
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                        
                        <button type="button" className="btn btn-secondary mb-3" onClick={addDestination}>
                            Ajouter une destination
                        </button><br></br>

                        <button type="submit" className="btn btn-primary">Valider</button>
                    </form><br></br>
                    {showMesDemandes && (
                            <ValidationPret />
                    )}
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Pret;
