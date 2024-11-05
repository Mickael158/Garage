import React, { useState, useEffect } from 'react';
import axios from 'axios';import Top from '../TopMenu';
import Nav from '../Nav';
import Bouton from '../Bouton';
import '../../styles/Menu.css';
import '../../styles/Form.css';
import { ToastContainer, toast } from 'react-toastify';  


function Service() {

    const token=sessionStorage.getItem("token");

    const [data, setData] = useState('');
    const [fonctionData, setFonctionData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const service = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`http://localhost:8080/Service/insertion_Service`, 
                { nom_service: data }, {
                headers: {
                    'content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
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
            selectAll_Service();  // Recharger les données après l'insertion
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
            setFonctionData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };

    useEffect(() => {
        selectAll_Service();
        console.log("Set ", fonctionData)
    }, []);


    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = fonctionData.slice(indexOfFirstItem, indexOfLastItem);

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
            pageIncrementBtn = <button onClick={handleNextBtn}>...</button>;
        }

        let pageDecrementBtn = null;
        if (minPageNumberLimit >= 1) {
            pageDecrementBtn = <button onClick={handlePrevBtn}>...</button>;
        }

        return (
            <div className="pagination">
                <button onClick={() => paginate(1)} disabled={currentPage === 1} className="pagination-button">First</button>
                <button onClick={handlePrevBtn} disabled={currentPage === 1} className="pagination-button">Prev</button>
                {pageDecrementBtn}
                {pageNumbers.map(number => {
                    return (
                        <button key={number} className={`pagination-button ${number === currentPage ? 'active' : ''}`} onClick={() => paginate(number)}>
                            {number}
                        </button>
                    );
                })}
                {pageIncrementBtn}
                <button onClick={handleNextBtn} disabled={currentPage === pageNumbers.length} className="pagination-button">Next</button>
                <button onClick={() => paginate(pageNumbers.length)} disabled={currentPage === pageNumbers.length} className="pagination-button">Last</button>
            </div>
        );
    };

    return (
        <div className="menu-container">
            <Top />
            <div className="main-content">
                <Nav />
                <div className="content">
                    <Bouton />
                    <div className="padding-top-black">
                        <h2 className="text-center">Ajouter Service</h2>
                    </div>

                    <div className="table-wrapper">
                        <div className="row"> 
                            <div className="col-md-6"> 
                                <div className="form-container shadow p-4 rounded">
                                    <h2 className="text-primary">Ajouter Service</h2>
                                    <form onSubmit={service}>
                                        <div className="mb-3">
                                            <label className="form-label">Nom Service:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Insérer nom Service"
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
                                <div className="table-container shadow p-4 rounded">
                                    <h3 className="text-primary">Listes des Services</h3>
                                    <table className="table table-striped table-hover table-bordered">
                                        <thead className="table-primary">
                                            <tr>
                                                <th>Nom Service</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(currentItems) && currentItems.length > 0 ? (
                                                currentItems.map(service => (
                                                    <tr key={service.id_service}>
                                                        <td>{service.nom_service}</td>
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

export default Service;
