import Top from '../TopMenu';
import Nav from '../Nav';
import Bouton from '../Bouton';
import '../../styles/Menu.css';
import '../../styles/Form.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';  

function Concessionnaire() {

    const token=sessionStorage.getItem("token");

    const [data, setData] = useState('');
    const [concessionnaireData, setConcessionnaireData] = useState([]);
    const [lieux, setLieux] = useState([]);
    const [selectedLieu, setSelectedLieu] = useState('');

    

    const enregistrerConcessionnaire = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/Concessionaire/enregistrerConcessionnaire', 
                { nom: data, id_lieu: selectedLieu }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
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
            selectAll_Concessionnaire();  // Recharger les données après l'insertion
            setData('');

        } catch (error) {
            console.error('Erreur d\'insertion', error);
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

    const selectAll_Concessionnaire = async () => {
        try {
            const response = await axios.get('http://localhost:8080/Concessionaire/selectAll_Action_byMaintence',
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            console.log('Données récupérées:', response.data);
            setConcessionnaireData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };

    const selectAll_Lieu = async () => {
        try {
            const response = await axios.get('http://localhost:8080/Lieu/selectAll_lieu',
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            console.log('Données récupérées:', response.data); 
            setLieux(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };

    

    useEffect(() => {
        selectAll_Lieu();
        selectAll_Concessionnaire();
    }, []);

    return (
        <div className="menu-container">
            <Top />
            <div className="main-content">
                <Nav />
                <div className="content">
                    <Bouton />
                    <div className="padding-top-black">
                        <h2 className="text-center">Ajouter Concessionnaire</h2>
                    </div>
                    <div className="table-wrapper">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-container">
                                    <h2>Ajouter Concessionnaire</h2>
                                    <form onSubmit={enregistrerConcessionnaire}>
                                        <label>Nom Concessionnaire:</label>
                                        <input
                                            type="text"
                                            placeholder="Insérer nom Concessionnaire"
                                            value={data}
                                            onChange={(e) => setData(e.target.value)}
                                            required
                                        />
                                        <label>Lieu:</label>
                                        <select
                                            className="form-select"
                                            value={selectedLieu}
                                            onChange={(e) => setSelectedLieu(e.target.value)}
                                            required
                                        >
                                            <option value="">Sélectionner un lieu</option>
                                            {lieux.map(lieu => (
                                                <option key={lieu.id_lieu} value={lieu.id_lieu}>
                                                    {lieu.nom_lieu}
                                                </option>
                                            ))}
                                        </select>
                                        <button type="submit">Valider</button>
                                    </form>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="table-container">
                                    <h3>Liste des Concessionnaires</h3>
                                    <table className="table table-striped table-hover table-bordered table-responsive">
                                        <thead className="table-primary">
                                            <tr>
                                                <th>Nom Concessionnaire</th>
                                                <th>Lieu</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(concessionnaireData) && concessionnaireData.length > 0 ? (
                                                concessionnaireData.map(concessionnaire => (
                                                    <tr key={concessionnaire.id_concessionnaire}>
                                                        <td>{concessionnaire.nom}</td>
                                                        <td>{concessionnaire.id_lieu ? concessionnaire.id_lieu.nom_lieu : 'N/A'}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="2">Aucune donnée disponible</td>
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

export default Concessionnaire;
