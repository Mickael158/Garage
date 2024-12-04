import Top from '../TopMenu';
import Nav from '../Nav';
import Bouton from '../Bouton';
import '../../styles/Menu.css';
import '../../styles/Form.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';  // Import Toastify
import 'react-toastify/dist/ReactToastify.css';  // Import des styles Toastify
import { Pagination } from 'react-bootstrap';

function Chauffeur() {

    const token=sessionStorage.getItem("token");


    const [idPersonne, setIdPersonne] = useState('');
    const [idPermis, setIdPermis] = useState('');
    const [chauffeurData, setChauffeurData] = useState([]);
    const [personnelData, setPersonnelData] = useState([]);
    const [permisData, setPermisData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentChauffeurs = chauffeurData.slice(indexOfFirstItem, indexOfLastItem);
    const apiUrl = process.env.REACT_APP_API_URL;

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

    const insertChauffeur = async (event) => {
        event.preventDefault();
        if (!idPersonne || !idPermis) {
            toast.error('Veuillez sélectionner un personnel et un permis!', {  // Notification d'erreur
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }
        try {
            const response = await axios.post(`${apiUrl}/Chauffeur/insertion_Chauffeur`, 
                { id_personne: idPersonne, id_permis: idPermis }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            toast.success('Chauffeur bien inséré!', {  // Afficher une notification de succès
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            fetchAllChauffeurs();  // Recharger les données après l'insertion
        } catch (error) {
            console.error('Erreur de Vérification', error);
            toast.error('Erreur lors de l\'insertion!', {  // Notification d'erreur
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

    const fetchAllChauffeurs = async () => {
        try {
            const response = await axios.get(`${apiUrl}/Chauffeur/selectAll_Chauffeur`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            ); // Pour vérifier la structure des données
            setChauffeurData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };

    const fetchAllPersonnel = async () => {
        try {
            const response = await axios.get(`${apiUrl}/personnel/selectAll_personnel`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            ); // Endpoint to fetch all personnel
            setPersonnelData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données du personnel', error);
        }
    };

    const fetchAllPermis = async () => {
        try {
            const response = await axios.get(`${apiUrl}/Permis/selectAll_Permis`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setPermisData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données des permis', error);
        }
    };

    useEffect(() => {
        fetchAllChauffeurs();
        fetchAllPersonnel();
        fetchAllPermis();
    }, []);

    return (
        <div className="menu-container">
            <Top />
            <div className="main-content">
                <Nav />
                <div className="content">
                    <Bouton />
                    <div className="padding-top-black">
                        <h2 className="text-center">Ajouter Chauffeur</h2>
                    </div>

                    <div className="table-wrapper">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-container">
                                    <h2>Ajouter un Chauffeur</h2>
                                    <form onSubmit={insertChauffeur}>
                                        <div className="mb-3">
                                            <label className="form-label">Personnel:</label>
                                            <select 
                                                className="form-select"
                                                value={idPersonne} 
                                                onChange={(e) => setIdPersonne(e.target.value)} required>
                                                <option value="">Sélectionnez le Personnel</option>
                                                {personnelData.map(person => (
                                                    <option key={person.id_personnel} value={person.id_personnel}>
                                                        {person.nom} 
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Permis:</label>
                                            <select 
                                                className="form-select"
                                                value={idPermis} 
                                                onChange={(e) => setIdPermis(e.target.value)} required>
                                                <option value="">Sélectionnez le Permis</option>
                                                {permisData.map(perm => (
                                                    <option key={perm.id_permis} value={perm.id_permis}>
                                                        {perm.nom} 
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <button type="submit" className="btn btn-success">Valider</button>
                                    </form>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="table-container">
                                    <h3>Liste des Chauffeurs</h3>
                                    <table className="table table-striped table-hover table-bordered">
                                        <thead className="table-primary">
                                            <tr>
                                                <th>ID Personnel</th>
                                                <th>ID Permis</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(currentChauffeurs) && currentChauffeurs.length > 0 ? (
                                                currentChauffeurs.map(chauffeur => (
                                                    <tr key={chauffeur.id_chauffeur}>
                                                        <td>{chauffeur.id_personne.nom} </td>
                                                        <td>{chauffeur.id_permis.nom}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="2">Aucune donnée disponible</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                    <PaginationComponent
                                        itemsPerPage={itemsPerPage}
                                        totalItems={chauffeurData.length}
                                        paginate={paginate}
                                        currentPage={currentPage}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />  {/* Container pour les notifications Toastify */}
        </div>
    );
}

export default Chauffeur;
