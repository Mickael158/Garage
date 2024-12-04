import Top from '../TopMenu';
import Nav from '../Nav';
import Bouton from '../Bouton';
import '../../styles/Menu.css';
import '../../styles/Form.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';  // Import Toastify
import 'react-toastify/dist/ReactToastify.css';  // Import des styles Toastify

function EtatPiece() {

    const token=sessionStorage.getItem("token");

    const apiUrl = process.env.REACT_APP_API_URL;
    const [data, setData] = useState('');
    const [etatPieceData, setEtatPieceData] = useState([]);

    const insertionEtatPiece = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${apiUrl}/Etat_piece/insertion_Etat_piece`, 
                { nom: data }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
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
            selectAllEtatPiece(); 
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

    const selectAllEtatPiece = async () => {
        try {
            const response = await axios.get(`${apiUrl}/Etat_piece/selectAll_Etat_piece`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            // Pour vérifier la structure des données
            setEtatPieceData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };

    useEffect(() => {
        selectAllEtatPiece();
        
    }, []);

    return (
        <div className="menu-container">
            <Top />
            <div className="main-content">
                <Nav />
                <div className="content">
                    <Bouton />
                    <div className="padding-top-black">
                    <h2 className="text-center">Insertion des États de Pièces</h2>
                </div>

                <div className="table-wrapper">
                        <div className="row"> 
                            <div className="col-md-6"> 
                                <div className="form-container">
                                    <h2>Ajouter État de Pièce</h2>
                                    <form onSubmit={insertionEtatPiece}>
                                        <div className="mb-3">
                                            <label className="form-label">Nom État Pièce:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Insérer nom État Pièce"
                                                value={data}
                                                onChange={(e) => setData(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-primary">Valider</button>
                                    </form>
                                </div>
                            </div>
                            <div className="col-md-6"> {/* Colonne droite */}
                                <div className="table-container">
                                    <h3>Liste des États de Pièces</h3>
                                    <table className="table table-striped table-hover table-bordered">
                                        <thead className="table-primary">
                                            <tr>
                                                <th>Nom État Pièce</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(etatPieceData) && etatPieceData.length > 0 ? (
                                                etatPieceData.map(etatPiece => (
                                                    <tr key={etatPiece.id_etat_piece}>
                                                        <td>{etatPiece.nom}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td>Aucune donnée disponible</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                            </div>
                        </div>
                    </div>
                    </div>

                </div>
            </div>
            <ToastContainer />  {/* Container pour les notifications Toastify */}
        </div>
    );
}

export default EtatPiece;
