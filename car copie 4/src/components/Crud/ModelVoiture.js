import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Top from '../TopMenu';
import Nav from '../Nav';
import Bouton from '../Bouton';
import '../../styles/Menu.css';
import '../../styles/Form.css';
import { ToastContainer, toast } from 'react-toastify';  
import { Pagination } from 'react-bootstrap';

function ModelVoiture() {
    const token=sessionStorage.getItem("token");

    const [data, setData] = useState(''); // Pour le nom du modèle
    const [marika, setMarika] = useState(''); // Pour l'ID de la marque sélectionnée
    const [marqueData, setMarqueData] = useState([]); // Pour stocker les marques récupérées
    const [modelData, setModelData] = useState([]); // Pour stocker les modèles de voitures récupérés

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = modelData.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

    const ajouterModel = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(
                `http://localhost:8080/model/insertion_Model`, 
                { nom_model: data, id_marque: marika }, 
                {
                    headers: {
                        'content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`

                    },
                }
            );
            console.log('Insertion réussie:', response.data);
            toast.success('Données bien insérées!', {  // Afficher une notification de succès
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            selectAll_ModelVoiture(); // Recharger les modèles après l'insertion
            setData('');

        } catch (error) {
            console.error('Erreur lors de l\'insertion du modèle', error);
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

    const selectAll_MarqueVoiture = async () => {
        try {
            const response = await axios.get('http://localhost:8080/Marque/selectAll_Marque',
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            console.log('Données récupérées:', response.data);
            setMarqueData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des marques', error);
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
            console.log('Données récupérées:', response.data);  // Pour vérifier la structure des données
            setModelData(response.data.data);
            console.log(modelData) ;
        } catch (error) {
            console.error('Erreur de récupération des modèles', error);
        }
    };

    useEffect(() => {
        selectAll_MarqueVoiture();
        selectAll_ModelVoiture();
    }, []);

    return (
        <div className="menu-container">
            <Top />
            <div className="main-content">
                <Nav />
                <div className="content">
                    <Bouton />
                    <div className="padding-top-black">
                        <h2 className="text-center">Ajouter Modèle Voiture</h2>
                    </div>
                    <div className="table-wrapper">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-container">
                                    <h2>Ajouter un Modèle</h2>
                                    <form onSubmit={ajouterModel}>
                                        <div className="mb-3">
                                            <label className="form-label">Nom Modèle:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Insérer nom Modèle"
                                                value={data}
                                                onChange={(e) => setData(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Marque:</label>
                                            <select 
                                                className="form-select"
                                                value={marika}
                                                onChange={(e) => setMarika(e.target.value)}
                                                required
                                            >
                                                <option value="">Choisir une Marque</option>
                                                {marqueData.map(marque => (
                                                    <option key={marque.id_marque} value={marque.id_marque}>
                                                        {marque.nom_marque}
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
                                    <h3>Liste des Modèles de Voiture</h3>
                                    <table className="table table-striped table-hover table-bordered">
                                        <thead className="table-primary">
                                            <tr>
                                                <th>ID</th>
                                                <th>Nom Modèle</th>
                                                <th>Nom Marque</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(currentItems) && currentItems.length > 0 ? (
                                                currentItems.map(model => (
                                                    <tr key={model.id_model}>
                                                        <td>{model.id_model}</td>
                                                        <td>{model.nom_model}</td>
                                                        <td>{model.id_marque ? model.id_marque.nom_marque : 'Aucune marque'}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="3">Aucune donnée disponible</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                    <PaginationComponent
                                        itemsPerPage={itemsPerPage}
                                        totalItems={modelData.length}
                                        paginate={paginate}
                                        currentPage={currentPage}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default ModelVoiture;
