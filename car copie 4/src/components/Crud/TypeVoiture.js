import Top from '../TopMenu';
import Nav from '../Nav';
import Bouton from '../Bouton';
import '../../styles/Menu.css';
import '../../styles/Form.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';  // Import Toastify
import 'react-toastify/dist/ReactToastify.css';  // Import des styles Toastify

function TypeVoiture() {

    const token=sessionStorage.getItem("token");

    const [data, setData] = useState('');
    const [typeVoitureData, setTypeVoitureData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = typeVoitureData.slice(indexOfFirstItem, indexOfLastItem);

    const ajouterTypeVoiture = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`http://localhost:8080/Type_voiture/insertion_Type_voiture`, 
                { nom: data }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`

                },
            });
            console.log('Insertion réussie:', response.data);
            toast.success('Données bien insérées!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            selectAllTypeVoiture(); 
            setData('');
        } catch (error) {
            console.error('Erreur de Vérification', error);
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

    const selectAllTypeVoiture = async () => {
        try {
            const response = await axios.get('http://localhost:8080/Type_voiture/selectAll_Type_voiture',
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setTypeVoitureData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };

    useEffect(() => {
        selectAllTypeVoiture();
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
                        <h2 className="text-center">Ajouter Type de Voiture</h2>
                    </div>
                    <div className="table-wrapper">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-container">
                                    <h2>Ajouter un Type de Voiture</h2>
                                    <form onSubmit={ajouterTypeVoiture}>
                                        <div className="mb-3">
                                            <label className="form-label">Nom Type Voiture:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Insérer nom Type Voiture"
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
                                    <h3>Liste des Types de Voiture</h3>
                                    <table className="table table-striped table-hover table-bordered">
                                        <thead className="table-primary">
                                            <tr>
                                                <th>Nom Type Voiture</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(currentItems) && currentItems.length > 0 ? (
                                                currentItems.map(typeVoiture => (
                                                    <tr key={typeVoiture.id_type_voiture}>
                                                        <td>{typeVoiture.nom}</td>
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
                                        totalItems={typeVoitureData.length}
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

export default TypeVoiture;
