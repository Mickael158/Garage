import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Top from '../TopMenu';
import Nav from '../Nav';
import '../../styles/Menu.css';
import '../../styles/Form.css';
import Bouton from '../Bouton';
import { ToastContainer, toast } from 'react-toastify';  

function Action() {

    const token=sessionStorage.getItem("token");

    const [data, setData] = useState('');
    const [actionData, setActionData] = useState([]);
    const [maintenanceData, setMaintenanceData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = actionData.slice(indexOfFirstItem, indexOfLastItem);
    const [idMaintenance, setIdMaintenance] = useState(''); 
    const apiUrl = process.env.REACT_APP_API_URL;

    const ajouterAction = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${apiUrl}/Action/insertion_Action`, 
                { nom_action: data , id_maintenance: idMaintenance }, {
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
            selectAll_Action(); 
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

    const selectAllMaintenance = async () => {
        try {
            const response = await axios.get(`${apiUrl}/Maintenance/selectAll_Maintenance`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setMaintenanceData(response.data.data); 
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

    useEffect(() => {
        selectAll_Action();
        selectAllMaintenance();
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
                        <h2 className="text-center">Ajouter Action</h2>
                    </div>
                    <div className="table-wrapper">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-container">
                                    <h2>Ajouter une Action</h2>
                                    <form onSubmit={ajouterAction}>
                                        <div className="mb-3">
                                            <label className="form-label">Nom Action:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Insérer nom Action"
                                                value={data}
                                                onChange={(e) => setData(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Sélectionner Maintenance:</label>
                                            <select
                                                className="form-control"
                                                value={idMaintenance}
                                                onChange={(e) => setIdMaintenance(e.target.value)} // Mise à jour de l'ID de maintenance
                                                required
                                            >
                                                <option value="">Choisir une maintenance</option>
                                                {maintenanceData.map(maintenance => (
                                                    <option key={maintenance.id_maintenance} value={maintenance.id_maintenance}>
                                                        {maintenance.nom_maintenanca}
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
                                    <h3>Liste des Actions</h3>
                                    <table className="table table-striped table-hover table-bordered">
                                        <thead className="table-primary">
                                            <tr>
                                                <th>Nom Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(currentItems) && currentItems.length > 0 ? (
                                                currentItems.map(action => (
                                                    <tr key={action.id_action}>
                                                        <td>{action.nom_action}</td>
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
                                        totalItems={actionData.length}
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

export default Action;
