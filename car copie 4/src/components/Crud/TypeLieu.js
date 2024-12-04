import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Top from '../TopMenu';
import Nav from '../Nav';
import Bouton from '../Bouton';
import '../../styles/Menu.css';
import '../../styles/Form.css';
import { ToastContainer, toast } from 'react-toastify';  

function TypeLieu() {
    const token=sessionStorage.getItem("token");
    const apiUrl = process.env.REACT_APP_API_URL;
    const [data, setData] = useState('');
    const [fonctionData, setFonctionData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const lieu = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${apiUrl}/type_lieu/insertion_type_lieu`, 
                { nom_type_lieu: data }, {
                headers: {
                    'content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,

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
            selectAll_Lieu();
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

    const selectAll_Lieu = async () => {
        try {
            const response = await axios.get(`${apiUrl}/type_lieu/selectAll_type_lieu`,
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
        selectAll_Lieu();
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
                        <h2 className="text-center">Ajouter Type de Lieu</h2>
                    </div>

                    <div className="table-wrapper">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-container">
                                    <h2>Ajouter un Type de Lieu</h2>
                                    <form onSubmit={lieu}>
                                        <div className="mb-3">
                                            <label className="form-label">Nom Lieu:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Insérer nom Lieu"
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
                                    <h3>Listes des types de lieu</h3>
                                    <table className="table table-striped table-hover table-bordered">
                                        <thead className="table-primary">
                                            <tr>
                                                <th>Nom TypeLieu</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(currentItems) && currentItems.length > 0 ? (
                                                currentItems.map(lieu => (
                                                    <tr key={lieu.id_type_lieu}>
                                                        <td>{lieu.nom_type_lieu}</td>
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

export default TypeLieu;
