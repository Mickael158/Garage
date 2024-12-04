import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Top from '../TopMenu';
import Nav from '../Nav';
import Bouton from '../Bouton';
import '../../styles/Menu.css';
import '../../styles/Form.css';
import { ToastContainer, toast } from 'react-toastify';  
import { Pagination} from 'react-bootstrap';

function Voiture() {

    const token = sessionStorage.getItem("token");
    const apiUrl = process.env.REACT_APP_API_URL;
    const [data, setData] = useState('');
    const [voitureData, setVoitureData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    

    const [immatriculation, setImmatriculation] = useState('');
    const [places, setPlaces] = useState('');
    const [fonction, setFonction] = useState('');
    const [transmission, setTransmission] = useState('');
    const [carburant, setCarburant] = useState('');
    const [service, setService] = useState('');
    const [modele, setModele] = useState('');
    const [typeVoiture, setTypeVoiture] = useState('');

    const [fonctionData, setFonctionData] = useState([]);
    const [transmissionData, setTransmissionData] = useState([]);
    const [carburantData, setCarburantData] = useState([]);
    const [serviceData, setServiceData] = useState([]);
    const [modeleData, setModeleData] = useState([]);
    const [typeVoitureData, setTypeVoitureData] = useState([]);

    const [voitures, setVoitures] = useState([]); // Ajout de l'état pour 'voitures'
    const currentItems = voitures.slice(indexOfFirstItem, indexOfLastItem);

    const ajouterVoiture = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(
                `${apiUrl}/voiture/insertion_voiture`,
                {
                    matricule: immatriculation,
                    place: places,
                    id_fonction: fonction,
                    id_transmision: transmission,
                    id_energie: carburant,
                    id_service: service,
                    id_model: modele,
                    id_type_voiture: typeVoiture
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
            
        fetchVoitures(); 

            toast.success('Données bien insérées!', {  
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            // Ajouter la nouvelle voiture à la liste des voitures
            setVoitures([...voitures, response.data.voiture]); // Utilisation de 'setVoitures'
        } catch (error) {
            console.error('Erreur lors de l\'insertion de la voiture', error);
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

    const selectAll_Fonction = async () => {
        try {
            const response = await axios.get(`${apiUrl}/Fonction/selectAll_Fonction`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setFonctionData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };

    const selectAll_Transmision = async () => {
        try {
            const response = await axios.get(`${apiUrl}/transmision/selectAll_Transmision`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setTransmissionData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };

    const selectAll_Carburant = async () => {
        try {
            const response = await axios.get(`${apiUrl}/Energie/selectAll_Energie`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setCarburantData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
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
            setServiceData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };

    const selectAll_Modele = async () => {
        try {
            const response = await axios.get(`${apiUrl}/model/selectAll_Model`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setModeleData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des modèles', error);
        }
    };

    const selectAll_TypeVoiture = async () => {
        try {
            const response = await axios.get(`${apiUrl}/Type_voiture/selectAll_Type_voiture`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setTypeVoitureData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des types de voiture', error);
        }
    };

    const fetchVoitures = async () => {
        try {
            const response = await axios.get(`${apiUrl}/voiture/selectAll_voiture`, // Ajout du token ici
                {
                    headers:{
                        'Authorization': `Bearer ${token}` // ... code modifié ...
                    }
                }
            );
            setVoitures(response.data.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des voitures', error);
        }
    };

    useEffect(() => {
        selectAll_Fonction();       
        selectAll_Transmision();
        selectAll_Carburant();
        selectAll_Service();
        selectAll_Modele();
        selectAll_TypeVoiture();
        fetchVoitures(); 
    }, []);


    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const PaginationComponent = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
            pageNumbers.push(i);
        }

        return (
            <Pagination className="justify-content-center mt-3">
                <Pagination.First onClick={() => paginate(1)} disabled={currentPage === 1} />
                <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
                {pageNumbers.map(number => (
                    <Pagination.Item key={number} active={number === currentPage} onClick={() => paginate(number)}>
                        {number}
                    </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === pageNumbers.length} />
                <Pagination.Last onClick={() => paginate(pageNumbers.length)} disabled={currentPage === pageNumbers.length} />
            </Pagination>
        );
    };

    return (
        <div className="menu-container">
            <Top />
            <div className="main-content">
                <Nav />
                <div className="content">
                    <Bouton />
                    <div className="padding-top-black">
                        <h2 className="text-center">Ajouter Voiture</h2>
                    </div>
                    <div className="table-wrapper">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-container">
                                    <h2>Ajouter une Voiture</h2>
                                    <form onSubmit={ajouterVoiture}>
                            <label>Immatriculation:</label>
                            <input
                                type="text"
                                placeholder="Insérer Immatriculation"
                                value={immatriculation}
                                onChange={(e) => setImmatriculation(e.target.value)}
                                required
                            />
                            <label>Nombre de places:</label>
                            <input
                                type="number"
                                placeholder="Nombre de places"
                                value={places}
                                onChange={(e) => setPlaces(e.target.value)}
                                required
                            />
                            <label>Type de Voiture:</label>
                            <select 
                                className="form-select"
                                value={typeVoiture}
                                onChange={(e) => setTypeVoiture(e.target.value)}
                                required
                            >
                                <option value="">Choisir un Type de Voiture</option>
                                {typeVoitureData.map((type) => (
                                    <option key={type.id_type_voiture} value={type.id_type_voiture}>
                                        {type.nom}
                                    </option>
                                ))}
                            </select>
                            <label>Fonction:</label>
                            <select 
                                className="form-select"
                                value={fonction}
                                onChange={(e) => setFonction(e.target.value)}
                                required
                            >
                                <option value="">Choisir une Fonction</option>
                                {fonctionData.map((func) => (
                                    <option key={func.id_fonction} value={func.id_fonction}>
                                        {func.nom_fonction}
                                    </option>
                                ))}
                            </select>
                            <label>Transmission:</label>
                            <select 
                                className="form-select"
                                value={transmission}
                                onChange={(e) => setTransmission(e.target.value)}
                                required
                            >
                                <option value="">Choisir une Transmission</option>
                                {transmissionData.map((trans) => (
                                    <option key={trans.id_transmision} value={trans.id_transmision}>
                                        {trans.nom_transmission}
                                    </option>
                                ))}
                            </select>
                            <label>Carburant:</label>
                            <select 
                                className="form-select"
                                value={carburant}
                                onChange={(e) => setCarburant(e.target.value)}
                                required
                            >
                                <option value="">Choisir un Carburant</option>
                                {carburantData.map((carb) => (
                                    <option key={carb.id_energie} value={carb.id_energie}>
                                        {carb.nom_energie}
                                    </option>
                                ))}
                            </select>
                            <label>Service:</label>
                            <select 
                                className="form-select"
                                value={service}
                                onChange={(e) => setService(e.target.value)}
                                required
                            >
                                <option value="">Choisir un Service</option>
                                {serviceData.map((serv) => (
                                    <option key={serv.id_service} value={serv.id_service}>
                                        {serv.nom_service}
                                    </option>
                                ))}
                            </select>
                            <label>Modèle:</label>
                            <select 
                                className="form-select"
                                value={modele}
                                onChange={(e) => setModele(e.target.value)}
                                required
                            >
                                <option value="">Choisir un Modèle</option>
                                {modeleData.map((mod) => (
                                    <option key={mod.id_model} value={mod.id_model}>
                                        {mod.nom_model}
                                    </option>
                                ))}
                            </select>
                            <button type="submit">Valider</button>
                        </form>
                                </div>
                            </div>
                            
                            <div className="col-md-6">
                            </div>
                                <div className="table-container">
                                    <h3>Liste des Voitures</h3>
                                    <table className="table table-striped table-hover table-bordered">
                                        <thead className="table-primary">
                                            <tr>
                                                <th>IM</th>
                                                <th>Places</th>
                                                <th>Type</th>
                                                <th>Fonct.</th>
                                                <th>Trans.</th>
                                                <th>Carb.</th>
                                                <th>Service</th>
                                                <th>Modèle</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(currentItems) && currentItems.length > 0 ? (
                                                currentItems.map(voiture => (
                                                    <tr key={voiture.id_voiture}>
                                                        <td>{voiture?.matricule || 'N/A'}</td>
                                                        <td>{voiture?.place || 'N/A'}</td>
                                                        <td>{voiture?.id_type_voiture?.nom || 'N/A'}</td>
                                                        <td>{voiture?.id_fonction?.nom_fonction || 'N/A'}</td>
                                                        <td>{voiture?.id_transmision?.nom_transmission || 'N/A'}</td>
                                                        <td>{voiture?.id_energie?.nom_energie || 'N/A'}</td>
                                                        <td>{voiture?.id_service?.nom_service || 'N/A'}</td>
                                                        <td>{voiture?.id_model?.nom_model || 'N/A'}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td>Aucune donnée disponible</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                    <PaginationComponent
                                        itemsPerPage={itemsPerPage}
                                        totalItems={voitures.length}
                                        paginate={paginate}
                                        currentPage={currentPage}
                                    />
                                </div>
                            </div>
                        </div>
                    
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Voiture;
