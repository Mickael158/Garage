import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Top from './TopMenu';
import Nav from './Nav';
import '../styles/Menu.css';
import axios from 'axios';
import '../styles/Form.css';

function VoirPlus() {

    const token = sessionStorage.getItem('token');

    const [tab_pvData, settabpvData] = useState([]);
    const [tab_estimationData, setTabEstimationData] = useState([]);
    const [tab_recuData, setTabRecuData] = useState([]);
    const location = useLocation();
    const { data } = location.state; // Récupérer les données de l'état
    const apiUrl = process.env.REACT_APP_API_URL;
    const selectAll_Tab_PV = async () => {
        try {
            const response = await axios.get(`${apiUrl}/TableauPv/find_TableauPvBy_id_demande_maintenence_valider/${data.demande_maintenence_valider.id_demande_maintenence_valider}`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            settabpvData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données PV', error);
        }
    };

    const selectAll_Tab_Estimation = async () => {
        try {
            const response = await axios.get(`${apiUrl}/Tabeau_Estimation/find_Tableau_EstimationBy_id_demande_maintenence_valider/${data.demande_maintenence_valider.id_demande_maintenence_valider}`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            setTabEstimationData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données Estimation', error);
        }
    };

    const selectAll_Tab_Recu = async () => {
        try {
            const response = await axios.get(`${apiUrl}/Tabeau_Recu/find_Tableau_RecuBy_id_demande_maintenence_valider/${data.demande_maintenence_valider.id_demande_maintenence_valider}`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            setTabRecuData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données Recu', error);
        }
    };

    useEffect(() => {
        selectAll_Tab_PV();
        selectAll_Tab_Estimation();
        selectAll_Tab_Recu();
    }, []); // Le tableau vide signifie que le useEffect s'exécutera une seule fois lors du premier rendu

    return (
        <div className="menu-container">
            <Top />
            <div className="main-content">
                <Nav />
                <div className="content p-4">
                    <h2 className="text-center mb-4">Détails de la Demande</h2>

                    {/* Aligner les sections en une ligne */}
                    <div className="row">
                        {/* Section PV */}
                        <div className="col-md-4">
                            <div className="padding-top-black rounded">
                                <h4>PV</h4>
                            </div>
                            <div className="table-wrapper bg-light p-3 rounded">
                                {Array.isArray(tab_pvData) && tab_pvData.length > 0 ? (
                                    <div>
                                        <div key={tab_pvData[0].id_pv?.numero}>
                                            N°{tab_pvData[0].id_pv?.numero} /2024/MEF/SG/DGBF/DPE/SSCVA/DTR <br /><br /><br />
                                            Marque : {tab_pvData[0].id_pv?.id_demande_maintenence_valider?.id_demande_maintenence?.id_voiture?.id_model?.id_marque?.nom_marque} <br></br>
                                            Immatriculation : {tab_pvData[0].id_pv?.id_demande_maintenence_valider?.id_demande_maintenence?.id_voiture?.matricule} <br />
                                            Genre : PV <br></br>
                                            Fonction : {tab_pvData[0].id_pv?.id_demande_maintenence_valider?.id_demande_maintenence?.id_voiture?.id_fonction?.nom_fonction} <br />
                                        </div>
                                    </div>
                                ) : (
                                    <p>Aucune donnée disponible</p>
                                )}
                                <br /><br />
                                <table className="table table-striped table-responsive mt-3">
                                    <thead className="table-primary">
                                        <tr>
                                            <th>Systeme</th>
                                            <th>Defaillance</th>
                                            <th>Piece a Remplacer </th>
                                            <th>Observation</th>
                                            <th>Ordre de Priorite </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(tab_pvData) && tab_pvData.length > 0 ? (
                                            tab_pvData.map(pv => (
                                                <tr key={pv.id_systeme}>
                                                    <td>{pv.id_systeme.nom_systeme}</td>
                                                    <td>{pv.id_defaillance.nom_defaillance}</td>
                                                    <td>{pv.id_action.nom_action}</td>
                                                    <td>{pv.observation}</td>
                                                    <td>{pv.ordre_de_priorite}</td>
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

                        {/* Section Proformat */}
                        <div className="col-md-4">
                            <div className="padding-top-black rounded">
                                <h4>Proformat</h4>
                            </div>
                            <div className="table-wrapper bg-light p-3 rounded">
                                {Array.isArray(tab_estimationData) && tab_estimationData.length > 0 ? (
                                    <div>
                                        <div key={tab_estimationData[0].id_tableau_estimation}>
                                            ESTIMATION  :  {tab_estimationData[0].id_estimation.numero_estimation} <br /><br /><br />
                                            Date :  {tab_estimationData[0].id_estimation.dates} <br />
                                            Numero Client   : {tab_estimationData[0].id_estimation.numero_client} <br></br>
                                            Immatriculation: {tab_estimationData[0].id_estimation.id_demande_maintenence_valider.id_demande_maintenence.id_voiture.matricule} <br />
                                        </div>  
                                    </div>
                                ) : (
                                    <p>Aucune donnée disponible</p>
                                )}
                                <br /><br />
                                <table className="table table-striped table-responsive mt-3">
                                    <thead className="table-primary">
                                        <tr>
                                            <th>Reference</th>
                                            <th>Designation</th>
                                            <th>Prix Unitaire</th>
                                            <th>Quantité</th>
                                            <th>Montant</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(tab_estimationData) && tab_estimationData.length > 0 ? (
                                            tab_estimationData.map(estimation => (
                                                <tr key={estimation.id_designation}>
                                                    <td>{estimation.reference}</td>
                                                    <td>{estimation.id_designation.nom_designation}</td>
                                                    <td>{estimation.p_u}</td>
                                                    <td>{estimation.qte}</td>
                                                    <td>{estimation.montant}</td>
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

                        {/* Section Recu */}
                        <div className="col-md-4">
                            <div className="padding-top-black rounded">
                                <h4>Recu</h4>
                            </div>
                            <div className="table-wrapper bg-light p-3 rounded">
                                {Array.isArray(tab_recuData) && tab_recuData.length > 0 ? (
                                    <div>
                                        <div key={tab_recuData[0].id_recu}>
                                            N° Facture :  {tab_recuData[0].id_recu.numero_recu} <br /><br />
                                            Date :  {tab_recuData[0].id_recu.dates} <br />
                                            Vendeur : {tab_recuData[0].id_recu.vendeur} <br></br>
                                            Immatriculation: {tab_recuData[0].id_recu.id_demande_maintenence_valider.id_demande_maintenence.id_voiture.matricule} <br />
                                        </div>
                                    </div>
                                ) : (
                                    <p>Aucune donnée disponible</p>
                                )}
                                <br /><br />
                                <table className="table table-striped table-responsive mt-3">
                                    <thead className="table-primary">
                                        <tr>
                                            <th>Numero</th>
                                            <th>Designation</th>
                                            <th>Prix Unitaire</th>
                                            <th>Quantité</th>
                                            <th>Montant</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(tab_recuData) && tab_recuData.length > 0 ? (
                                            tab_recuData.map(recu => (
                                                <tr key={recu.id_recu}>
                                                    <td>{recu.reference}</td>
                                                    <td>{recu.id_designation.nom_designation}</td>
                                                    <td>{recu.p_u}</td>
                                                    <td>{recu.qte}</td>
                                                    <td>{recu.montant}</td>
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
    );
}

export default VoirPlus;
