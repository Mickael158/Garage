import Top from '../TopMenu';
import Nav from '../Nav';
import Bouton from '../Bouton';
import '../../styles/Menu.css';
import '../../styles/Form.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';  

function Systeme() {

    const token=sessionStorage.getItem("token");
    
    const [data, setData] = useState('');
    const [systemeData, setSystemeData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = systemeData.slice(indexOfFirstItem, indexOfLastItem);

    const ajouterSysteme = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`http://localhost:8080/Systeme/insertion_Systeme`, 
                { nom_systeme: data }, {
                headers: {
                    'content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
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
            selectAll_Systeme(); 
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

    const selectAll_Systeme = async () => {
        try {
            const response = await axios.get('http://localhost:8080/Systeme/selecAll_Systeme',
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setSystemeData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };

    useEffect(() => {
        selectAll_Systeme();
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
                        <h2 className="text-center">Ajouter Système</h2>
                    </div>
                    <div className="table-wrapper">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-container">
                                    <h2>Ajouter un Système</h2>
                                    <form onSubmit={ajouterSysteme}>
                                        <div className="mb-3">
                                            <label className="form-label">Nom Système:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Insérer nom Système"
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
                                    <h3>Liste des Systèmes</h3>
                                    <table className="table table-striped table-hover table-bordered">
                                        <thead className="table-primary">
                                            <tr>
                                                <th>Nom Système</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(currentItems) && currentItems.length > 0 ? (
                                                currentItems.map(systeme => (
                                                    <tr key={systeme.id_systeme}>
                                                        <td>{systeme.nom_systeme}</td>
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
                                        totalItems={systemeData.length}
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

export default Systeme;
