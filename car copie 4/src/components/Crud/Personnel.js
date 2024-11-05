import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Top from '../TopMenu';
import Nav from '../Nav';
import '../../styles/Menu.css';
import '../../styles/Form.css';
import Bouton from '../Bouton';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { Pagination } from 'react-bootstrap';

function Personnel() {

    const token=sessionStorage.getItem("token");

    const [nomPersonnel, setNomPersonnel] = useState('');
    const [matricule, setMatricule] = useState('');
    const [fonction, setFonction] = useState('');
    const [service, setService] = useState('');
    const [poste, setPoste] = useState('');

    const [fonctionData, setFonctionData] = useState([]);
    const [serviceData, setServiceData] = useState([]);
    const [personnelData, setPersonnelData] = useState([]);
    const [posteData, setPosteData] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPersonnel = personnelData.slice(indexOfFirstItem, indexOfLastItem);

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

    const ajouterPersonnel = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(
                'http://localhost:8080/personnel/insertion_personnel',
                {
                    nom: nomPersonnel,
                    matricule: matricule,
                    id_fonction: fonction,
                    id_service: service,
                    id_poste: poste
                },
                {
                    headers: {
                        'content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`

                    },
                }
            );
            console.log('Insertion réussie:', response.data);
            toast.success('Poste bien inséré!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            selectAll_Personnel(); // Recharger les données après l'insertion
            setNomPersonnel('');
        } catch (error) {
            console.error('Erreur d\'insertion', error);
            toast.error('Erreur lors de l\'insertion du poste!', {
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
            const response = await axios.get('http://localhost:8080/Fonction/selectAll_Fonction',
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            console.log('Données récupérées:', response.data);  // Pour vérifier la structure des données
            setFonctionData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };

    const selectAll_Service = async () => {
        try {
            const response = await axios.get('http://localhost:8080/Service/selectAll_service',
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            console.log('Données récupérées:', response.data);  // Pour vérifier la structure des données
            setServiceData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };

    const selectAll_Personnel = async () => {
        try {
            const response = await axios.get('http://localhost:8080/personnel/selectAll_personnel',
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

    const selectAllPoste = async () => {
        try {
            const response = await axios.get('http://localhost:8080/Poste/selectAll_Poste',
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            console.log('Données des postes récupérées:', response.data);
            setPosteData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des postes', error);
        }
    };

    useEffect(() => {
        selectAll_Fonction();
        selectAll_Service();
        selectAll_Personnel();
        selectAllPoste();
    }, []);

    return (
        <div className="menu-container">
            <Top />
            <div className="main-content">
                <Nav />
                <div className="content">
                    <Bouton />
                    <div className="padding-top-black">
                        <h2 className="text-center">Ajouter Personnel</h2>
                    </div>

                    <div className="table-wrapper">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-container">
                                    <h2>Ajouter un Personnel</h2>
                                    <form onSubmit={ajouterPersonnel}>
                            <label>Nom Personnel:</label>
                            <input
                                type="text"
                                placeholder="Insérer nom Personnel"
                                value={nomPersonnel}
                                onChange={(e) => setNomPersonnel(e.target.value)}
                                required
                            />
                            <label>Matricule:</label>
                            <input
                                type="text"
                                placeholder="Insérer Matricule"
                                value={matricule}
                                onChange={(e) => setMatricule(e.target.value)}
                                required
                            />
                            <label>Direction:</label>
                            <select 
                                className="form-select"
                                value={fonction}
                                onChange={(e) => setFonction(e.target.value)}
                                required
                            >
                                <option value="">Choisir une Direction</option>
                                {fonctionData.map((func) => (
                                    <option key={func.id_fonction} value={func.id_fonction}>
                                        {func.nom_fonction}
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
                            <label>Poste:</label>
                            <select 
                                className="form-select"
                                value={poste}
                                onChange={(e) => setPoste(e.target.value)}
                                required
                            >
                                <option value="">Choisir un Poste</option>
                                {posteData.map((p) => (
                                    <option key={p.id_poste} value={p.id_poste}>
                                        {p.nom}
                                    </option>
                                ))}
                            </select>
                            <button type="submit">Valider</button>
                        </form>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="table-container">
                                    <h3>Liste du Personnel</h3>
                                    <table className="table table-striped table-hover table-bordered">
                                        <thead className="table-primary">
                                            <tr>
                                                <th>Numero</th>
                                                <th>Nom Personnel</th>
                                                <th>Matricule</th>
                                                <th>Direction</th>
                                                <th>Service</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentPersonnel.map((personnel) => (
                                                <tr key={personnel.id_personnel}>
                                                    <td>{personnel.id_personnel}</td>
                                                    <td>{personnel.nom}</td>
                                                    <td>{personnel.matricule}</td>
                                                    <td>{personnel.id_fonction.nom_fonction}</td>
                                                    <td>{personnel.id_service.nom_service}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <PaginationComponent
                                        itemsPerPage={itemsPerPage}
                                        totalItems={personnelData.length}
                                        paginate={paginate}
                                        currentPage={currentPage}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Personnel;
