import Top from '../TopMenu';
import Nav from '../Nav';
import Bouton from '../Bouton';
import '../../styles/Menu.css';
import '../../styles/Form.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';  // Import Toastify
import 'react-toastify/dist/ReactToastify.css';  // Import des styles Toastify

function Lieu() {
    
    const token=sessionStorage.getItem("token");

    const [data, setData] = useState('');
    const [typeLieuData, setTypeLieuData] = useState([]);  // État pour les types de lieu
    const [idTypeLieu, setIdTypeLieu] = useState('');  // État pour l'ID du type de lieu
    const [lieuData, setLieuData] = useState([]);
    const [kilometrage, setKilometrage] = useState('');  // Nouvel état pour le kilométrage

    // Fonction pour insérer un lieu
    const insererLieu = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`http://localhost:8080/Lieu/insertion_Lieu`, 
                { nom_lieu: data, id_type_lieu: idTypeLieu, km: kilometrage }, {
                    headers: {
                        'content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
            console.log('Insertion réussie:', response.data);
            toast.success('Lieu bien inséré!', {  // Notification de succès
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            selectAllLieu();  // Recharger les données après l'insertion
            setData('');
            setKilometrage('');  // Réinitialiser le kilométrage après l'insertion

        } catch (error) {
            console.error('Erreur de vérification', error);
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

    // Fonction pour récupérer tous les lieux
    const selectAllLieu = async () => {
        try {
            const response = await axios.get('http://localhost:8080/Lieu/selectAll_lieu',
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            console.log('Données récupérées:', response.data);  // Pour vérifier la structure des données
            setLieuData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };

    // Fonction pour récupérer tous les types de lieu
    const selectAllTypeLieu = async () => {
        try {
            const response = await axios.get('http://localhost:8080/type_lieu/selectAll_type_lieu',
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            ); 
            console.log('Types de lieu récupérés:', response.data);
            setTypeLieuData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des types de lieu', error);
        }
    };

    useEffect(() => {
        selectAllLieu();
        selectAllTypeLieu();  // Charger les types de lieu au démarrage
    }, []);

    return (
        <div className="menu-container">
            <Top />
            <div className="main-content">
                <Nav />
                <div className="content">
                    <Bouton />
                    <div className="padding-top-black">
                        <h2 className="text-center">Ajouter Lieu</h2>
                    </div>

                    <div className="table-wrapper">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-container">
                                    <h2>Ajouter un Lieu</h2>
                                    <form onSubmit={insererLieu}>
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
                                        <div className="mb-3">
                                            <label className="form-label">Type de Lieu:</label>
                                            <select 
                                                className="form-select"
                                                value={idTypeLieu} 
                                                onChange={(e) => setIdTypeLieu(e.target.value)} 
                                                required>
                                                <option value="">Sélectionner un type de lieu</option>
                                                {typeLieuData.map(type => (
                                                    <option key={type.id_type_lieu} value={type.id_type_lieu}>{type.nom_type_lieu}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Kilométrage:</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Insérer le kilométrage"
                                                value={kilometrage}
                                                onChange={(e) => setKilometrage(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-success">Valider</button>
                                    </form>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="table-container">
                                    <h3>Liste des Lieux</h3>
                                    <table className="table table-striped table-hover table-bordered">
                                        <thead className="table-primary">
                                            <tr>
                                                <th>Nom Lieu</th>
                                                <th>Type de Lieu</th>
                                                <th>Kilométrage</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(lieuData) && lieuData.length > 0 ? (
                                                lieuData.map(lieu => (
                                                    <tr key={lieu.id_lieu}>
                                                        <td>{lieu.nom_lieu}</td>
                                                        <td>{lieu.id_type_lieu.nom_type_lieu}</td>
                                                        <td>{lieu.km}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="3">Aucune donnée disponible</td>
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
            <ToastContainer />
        </div>
    );
}

export default Lieu;
