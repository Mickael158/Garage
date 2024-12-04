import Top from '../TopMenu';
import Nav from '../Nav';
import Bouton from '../Bouton';
import { Modal, Button, Form } from 'react-bootstrap';
import '../../styles/Menu.css';
import '../../styles/Form.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';  // Import Toastify
import 'react-toastify/dist/ReactToastify.css';  // Import des styles Toastify

function Indisponibilite() {

    const token=sessionStorage.getItem("token");
    const apiUrl = process.env.REACT_APP_API_URL;
    const [data, setData] = useState('');
    const [indisponibiliteData, setIndisponibiliteData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = indisponibiliteData.slice(indexOfFirstItem, indexOfLastItem);

    const insererIndisponibilite = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${apiUrl}/Indisponibilite/insertion_Indisponibilite`, 
                { nom: data }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            
            toast.success('Données bien insérées!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            recupererIndisponibilite(); 
            setData('');
        } catch (error) {
            console.error('Erreur d\'insertion', error);
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

    const recupererIndisponibilite = async () => {
        try {
            const response = await axios.get(`${apiUrl}/Indisponibilite/selectAll_Indisponibilite`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setIndisponibiliteData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };

    useEffect(() => {
        recupererIndisponibilite();
    }, []);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const PaginationComponent = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
        // ... existing pagination logic ...
    };

    return (
        <div className="menu-container">
            <Top />
            <div className="main-content">
                <Nav />
                <div className="content">
                    <Bouton />
                    <div className="padding-top-black">
                        <h2 className="text-center">Ajouter Indisponibilité</h2>
                    </div>
                    <div className="table-wrapper">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-container">
                                    <h2>Ajouter une Indisponibilité</h2>
                                    <form onSubmit={insererIndisponibilite}>
                                        <div className="mb-3">
                                            <label className="form-label">Nom Indisponibilité:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Insérer nom Indisponibilité"
                                                value={data}
                                                onChange={(e) => setData(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-success">Valider</button>
                                    </form>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="table-container">
                                    <h3>Liste des Indisponibilités</h3>
                                    <table className="table table-striped table-hover table-bordered">
                                        <thead className="table-primary">
                                            <tr>
                                                <th>Nom Indisponibilité</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(currentItems) && currentItems.length > 0 ? (
                                                currentItems.map(indisponibilite => (
                                                    <tr key={indisponibilite.id_indisponibilite}>
                                                        <td>{indisponibilite.nom}</td>
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
                                        totalItems={indisponibiliteData.length}
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

export default Indisponibilite;
