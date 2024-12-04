import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Top from '../TopMenu';
import Nav from '../Nav';
import Bouton from '../Bouton';
import '../../styles/Menu.css';
import '../../styles/Form.css';
import { ToastContainer, toast } from 'react-toastify';  // Import Toastify
import 'react-toastify/dist/ReactToastify.css';  // Import des styles Toastify

function VisiteMedical() {

    const token=sessionStorage.getItem("token");
    const apiUrl = process.env.REACT_APP_API_URL;
    const [dateDebut, setDateDebut] = useState('');
    const [dateFin, setDateFin] = useState('');
    const [idChauffeur, setIdChauffeur] = useState('');
    const [visiteData, setVisiteData] = useState([]);
    const [chauffeurData, setChauffeurData] = useState([]);

    const insertVisiteMedical = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${apiUrl}/Visite_medical/insertion_Visite_medical`, 
                { date_debut: dateDebut, date_fin: dateFin, id_chauffeur: idChauffeur }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`

                },
            });
            
            toast.success('Visite médicale bien insérée!', {  // Afficher une notification de succès
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            fetchAllVisites();  // Recharger les données après l'insertion
        } catch (error) {
            console.error('Erreur de Vérification', error);
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

    const fetchAllVisites = async () => {
        try {
            const response = await axios.get(`${apiUrl}/Visite_medical/selectAll_Visite_medical`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            setVisiteData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };

    const fetchAllChauffeurs = async () => {
        try {
            const response = await axios.get(`${apiUrl}/Chauffeur/selectAll_Chauffeur`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            ); // Endpoint to fetch all chauffeurs
            setChauffeurData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données des chauffeurs', error);
        }
    };

    useEffect(() => {
        fetchAllVisites();
        fetchAllChauffeurs();
    }, []);

    return (
        <div className="menu-container">
            <Top />
            <div className="main-content">
                <Nav />
                <div className="content">
                    <Bouton />
                    <div className="padding-top-black">
                        <h2 className="text-center">Ajouter Visite Médicale</h2>
                    </div>

                    <div className="table-wrapper">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-container">
                                    <h2>Ajouter une Visite Médicale</h2>
                                    <form onSubmit={insertVisiteMedical}>
                                        <div className="mb-3">
                                            <label className="form-label">Date de Début:</label>
                                            <input 
                                                type="date"
                                                className="form-control"
                                                value={dateDebut} 
                                                onChange={(e) => setDateDebut(e.target.value)} 
                                                required 
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Date de Fin:</label>
                                            <input 
                                                type="date"
                                                className="form-control"
                                                value={dateFin} 
                                                onChange={(e) => setDateFin(e.target.value)} 
                                                required 
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Chauffeur:</label>
                                            <select 
                                                className="form-select"
                                                value={idChauffeur} 
                                                onChange={(e) => setIdChauffeur(e.target.value)} 
                                                required>
                                                <option value="">Sélectionnez le Chauffeur</option>
                                                {chauffeurData.map(chauffeur => (
                                                    <option key={chauffeur.id_chauffeur} value={chauffeur.id_chauffeur}>
                                                        {chauffeur.id_personne.nom} {/* Assurez-vous que le champ nom existe */}
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
                                    <h3>Liste des Visites Médicales</h3>
                                    <table className="table table-striped table-hover table-bordered">
                                        <thead className="table-primary">
                                            <tr>
                                                <th>ID Chauffeur</th>
                                                <th>Date de Début</th>
                                                <th>Date de Fin</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(visiteData) && visiteData.length > 0 ? (
                                                visiteData.map(visite => (
                                                    <tr key={visite.id_visite}>
                                                        <td>{visite.id_chauffeur.id_chauffeur}</td>
                                                        <td>{visite.date_debut}</td>
                                                        <td>{visite.date_fin}</td>
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

export default VisiteMedical;
