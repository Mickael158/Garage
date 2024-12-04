import Top from './TopMenu';
import Nav from './Nav';
import { ToastContainer, toast } from 'react-toastify';  
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Menu.css';
import Select from 'react-select'; 
import { Pagination } from 'react-bootstrap';


function ReparationRapide() {
    const token = sessionStorage.getItem('token');
    const [date, setDate] = useState('');
    const [remarque, setRemarque] = useState('');
    const [idAction, setIdAction] = useState('');
    const apiUrl = process.env.REACT_APP_API_URL;
    const [voitures, setVoitures] = useState([]); 
    const [selectedVoiture, setSelectedVoiture] = useState('');  // Voiture sélectionnée
    const [actionData, setActionData] = useState([]);
    const [reparationData, setReparationData] = useState([]);

    const [dateError, setDateError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);



    const validateDate = (selectedDate) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const twoDaysBefore = new Date(today);
        twoDaysBefore.setDate(today.getDate() - 15);
        const twoDaysAfter = new Date(today);
        twoDaysAfter.setDate(today.getDate() + 2);
        const selected = new Date(selectedDate);

        if (selected < twoDaysBefore || selected > twoDaysAfter) {
            setDateError('La date doit être entre deux jours avant et deux jours après aujourd\'hui');
            return false;
        }
        setDateError('');
        return true;
    };

    const handleDateChange = (e) => {
        const newDate = e.target.value;
        setDate(newDate);
        validateDate(newDate);
    };

    const insertionReparation = async (event) => {
        event.preventDefault();
        if (!validateDate(date)) {
            toast.error('Date invalide. Veuillez corriger avant de soumettre.', { position: "top-right", autoClose: 3000 });
            return;
        }
        try {
            const response = await axios.post(`${apiUrl}/Reparation_rapide_voiture/insertion_Reparation_rapide_voiture`, 
                {
                    date: date,
                    remarque: remarque,
                    id_utilisateur: token,
                    id_action: idAction,
                    id_voiture: selectedVoiture  // Utilisation de la voiture sélectionnée
                }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`

                },
            });
            toast.success('Données bien insérées!', { position: "top-right", autoClose: 3000 });
            selectAllReparation();
        } catch (error) {
            console.error('Erreur d\'insertion', error);
            toast.error('Erreur lors de l\'insertion!', { position: "top-right", autoClose: 3000 });
        }
    };

    const selectAllReparation = async () => {
        try {
            const response = await axios.get(`${apiUrl}/Reparation_rapide_voiture/selectAll_Reparation_rapide_voiture`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setReparationData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };

    const selectAll_Action = async () => {
        try {
            const response = await axios.get(`${apiUrl}/Action/selectAll_Action`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setActionData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };

    const fetchVoitures = async () => {
        try {
            const response = await axios.get(`${apiUrl}/voiture/selectAll_voiture`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setVoitures(response.data.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des voitures', error);
        }
    };

    useEffect(() => {
        selectAll_Action();
        fetchVoitures();
        selectAllReparation();
    }, []);

    // Ajoutez ces nouvelles constantes pour les options d'Action et de Voiture
    const actionOptions = actionData.map(action => ({
        value: action.id_action,
        label: action.nom_action
    }));

    const voitureOptions = voitures.map(voiture => ({
        value: voiture.id_voiture,
        label: voiture.matricule
    }));

    const inputFields = [
        { 
            label: 'Date', 
            type: 'date', 
            value: date, 
            onChange: handleDateChange,
            error: dateError
        },
        { label: 'Remarque', type: 'text', value: remarque, onChange: (e) => setRemarque(e.target.value) },
        { 
            label: 'Action', 
            type: 'select', 
            value: actionOptions.find(option => option.value === idAction),
            onChange: (selectedOption) => setIdAction(selectedOption.value),
            options: actionOptions
        },
        { 
            label: 'Voiture', 
            type: 'select', 
            value: voitureOptions.find(option => option.value === selectedVoiture),
            onChange: (selectedOption) => setSelectedVoiture(selectedOption.value),
            options: voitureOptions
        }
    ];

    // Ajoutez cette fonction pour filtrer les données
    const filteredReparationData = reparationData.filter(reparation =>
        reparation.id_voiture.matricule.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = reparationData.slice(indexOfFirstItem, indexOfLastItem);
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

    return (
        <div className="menu-container">
            <Top />
            <div className="main-content">
                <Nav />
                <div className="content">
                    <div className="padding-top-black rounded">
                        <h2 className="text-center">Ajouter Réparation Rapide</h2>
                    </div>
                    <div className="table-wrapper">
                        <form onSubmit={insertionReparation} className="mb-4">
                            <div className="row mb-3">
                                {inputFields.map((field, index) => (
                                    <div className="col-md-6 mb-3" key={index}>
                                        <label className="form-label">{field.label}:</label>
                                        {field.type === 'select' ? (
                                            <Select
                                                value={field.value}
                                                onChange={field.onChange}
                                                options={field.options}
                                                placeholder={`Choisir ${field.label === 'Action' ? 'une' : 'un'} ${field.label}`}
                                                isSearchable={true}
                                                required
                                            />
                                        ) : (
                                            <>
                                                <input
                                                    type={field.type}
                                                    className={`form-control ${field.error ? 'is-invalid' : ''}`}
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    required
                                                />
                                                {field.error && <div className="invalid-feedback">{field.error}</div>}
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <button type="submit" className="btn btn-primary">Valider</button>
                        </form>
                    
                        <div className="table-container">
                            <h3 className="text-center">Liste des Réparations Rapides</h3>
                            
                            {/* Ajoutez ce champ de recherche */}
                            <input 
                                type="text" 
                                className="form-control mb-3" 
                                placeholder="Rechercher par immatriculation" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />

                            <table className="table table-striped table-hover table-responsive">
                                <thead className="table-primary">
                                    <tr>
                                        <th>Date</th>
                                        <th>Remarque</th>
                                        <th>Nom Utilisateur</th>
                                        <th>Matricule</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.isArray(filteredReparationData) && filteredReparationData.length > 0 ? (
                                        filteredReparationData.map((reparation) => (
                                            <tr key={reparation.id_reparation_rapide_voiture}>
                                                <td>{reparation.date}</td>
                                                <td>{reparation.remarque}</td>
                                                <td>{reparation.id_utilisateur.id_personnel.nom}</td> 
                                                <td>{reparation.id_voiture.matricule}</td> 
                                                <td>{reparation.id_action.nom_action}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center">Aucune donnée disponible</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <PaginationComponent
                                itemsPerPage={itemsPerPage}
                                totalItems={reparationData.length}
                                paginate={paginate}
                                currentPage={currentPage}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default ReparationRapide;
