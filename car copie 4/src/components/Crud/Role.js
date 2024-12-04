import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Top from '../TopMenu';
import Nav from '../Nav';
import Bouton from '../Bouton';
import '../../styles/Menu.css';
import '../../styles/Form.css';
import { ToastContainer, toast } from 'react-toastify';  

function Role() {
    const token=sessionStorage.getItem("token");
    const apiUrl = process.env.REACT_APP_API_URL;
    const [data, setData] = useState('');
    const [roleData, setRoleData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = roleData.slice(indexOfFirstItem, indexOfLastItem);

    const ajouterRole = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${apiUrl}/role/insertion_role`, 
                { nom_role: data }, {
                headers: {
                    'content-Type': 'application/json',
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
            selectAll_Role(); 
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

    const selectAll_Role = async () => {
        try {
            const response = await axios.get(`${apiUrl}/role/selectAll_role`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setRoleData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };

    useEffect(() => {
        selectAll_Role();
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
                        <h2 className="text-center">Ajouter Rôle</h2>
                    </div>
                    <div className="table-wrapper">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-container">
                                    <h2>Ajouter un Rôle</h2>
                                    <form onSubmit={ajouterRole}>
                                        <div className="mb-3">
                                            <label className="form-label">Nom Rôle:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Insérer nom Rôle"
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
                                    <h3>Liste des Rôles</h3>
                                    <table className="table table-striped table-hover table-bordered">
                                        <thead className="table-primary">
                                            <tr>
                                                <th>Nom Rôle</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(currentItems) && currentItems.length > 0 ? (
                                                currentItems.map(role => (
                                                    <tr key={role.id_role}>
                                                        <td>{role.nom_role}</td>
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
                                        totalItems={roleData.length}
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

export default Role;
