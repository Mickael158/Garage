import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Top from '../TopMenu';
import Nav from '../Nav';
import Bouton from '../Bouton';
import '../../styles/Menu.css';
import '../../styles/Form.css';
import { ToastContainer, toast } from 'react-toastify';  

function Transmission() {

    const token=sessionStorage.getItem("token");
    const apiUrl = process.env.REACT_APP_API_URL;
    const [data, setData] = useState('');
    const [fonctionData, setFonctionData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = fonctionData.slice(indexOfFirstItem, indexOfLastItem);

    const transmission = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${apiUrl}/transmision/insertion_Transmision`, 
                { nom_transmission: data }, {
                headers: {
                    'content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            
            toast.success('Données bien insérées!', {  // Afficher une notification de succès
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            selectAll_Transmision();  // Recharger les données après l'insertion
            setData('');

        } catch (error) {
            console.error('Erreur de Verification', error);
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

    const selectAll_Transmision = async () => {
        try {
            const response = await axios.get(`${apiUrl}/transmision/selectAll_Transmision`,
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

    useEffect(() => {
        selectAll_Transmision();
        
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
                        <h2 className="text-center">Ajouter Transmission</h2>
                    </div>
                    <div className="table-wrapper">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-container">
                                    <h2>Ajouter une Transmission</h2>
                                    <form onSubmit={transmission}>
                                        <div className="mb-3">
                                            <label className="form-label">Nom Transmission:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Insérer nom Transmission"
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
                                    <h3>Listes des transmissions</h3>
                                    <table className="table table-striped table-hover table-bordered">
                                        <thead className="table-primary">
                                            <tr>
                                                <th>Nom Transmission</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(currentItems) && currentItems.length > 0 ? (
                                                currentItems.map(transmission => (
                                                    <tr key={transmission.id_transmision}>
                                                        <td>{transmission.nom_transmission}</td>
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
                                        totalItems={fonctionData.length}
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

export default Transmission;
