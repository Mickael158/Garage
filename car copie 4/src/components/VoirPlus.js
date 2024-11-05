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

    const selectAll_Tab_PV = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/TableauPv/find_TableauPvBy_id_demande_maintenence_valider/${data.id_demande_maintenence_valider}`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            console.log('Données PV récupérées:', response.data); // Pour vérifier la structure des données
            settabpvData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données PV', error);
        }
    };

    const selectAll_Tab_Estimation = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/Tabeau_Estimation/find_Tableau_EstimationBy_id_demande_maintenence_valider/${data.id_demande_maintenence_valider}`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            console.log('Données Estimation récupérées:', response.data); // Pour vérifier la structure des données
            setTabEstimationData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données Estimation', error);
        }
    };

    const selectAll_Tab_Recu = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/Tabeau_Recu/find_Tableau_RecuBy_id_demande_maintenence_valider/${data.id_demande_maintenence_valider}`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            console.log('Données Recu récupérées:', response.data); // Pour vérifier la structure des données
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

                    <div className="padding-top-black rounded">
                        <h4>PV</h4>
                    </div>
                    <div className="table-wrapper">
                        <div className="bg-light p-3 rounded">
                            {Array.isArray(tab_pvData) && tab_pvData.length > 0 ? (
                                <div>
                                  {tab_pvData.length > 0 && (
                                    <div key={tab_pvData[0].id_pv.numero}>
                                      N°{tab_pvData[0].id_pv.numero} /2024/MEF/SG/DGBF/DPE/SSCVA/DTR <br /><br /><br />
                                      Marque : {tab_pvData[0].id_pv?.id_demande_maintenence_valider?.id_demande_maintenence?.id_voiture?.id_model?.id_marque?.nom_marque || 'Inconnu'} <br />
                                      Immatriculation : {tab_pvData[0].id_pv?.id_demande_maintenence_valider?.id_demande_maintenence?.id_voiture?.matricule || 'Inconnu'} <br />
                                      Genre : PV <br />
                                      Fonction : {tab_pvData[0].id_pv?.id_demande_maintenence_valider?.id_demande_maintenence?.id_voiture?.id_fonction?.nom_fonction || 'Inconnu'} <br />
                                      
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <p>Aucun PV n'a été enregistré pour cette demande.</p>
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
                                        <th>image</th>
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
                                                <td>
                                                    <img src={`http://localhost:8080${pv.id_pv.image}`} style={{'width':'100%','height':'50px'}}/>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td>Aucune donnée disponible</td>
                                        </tr>
                                    )}
                                </tbody>
                                {/* <img href={tab_pvData[0].image}/>  */}
                            </table>
                        </div>
                        </div>

                        <br /><br />
                            
                    <div className="padding-top-black rounded">
                        <h4>Proforma</h4>
                    </div>
                    <div className="table-wrapper">
                        <div className="bg-light p-3 rounded">
                            {Array.isArray(tab_estimationData) && tab_estimationData.length > 0 ? (
                                <div>
                                  {tab_estimationData.length > 0 && (
                                    <div key={tab_estimationData[0].id_tableau_estimation}>
                                      ESTIMATION  :  {tab_estimationData[0].id_estimation.numero_estimation} <br /><br /><br />
                                      Date :  {tab_estimationData[0].id_estimation.dates} <br />
                                      Numero Client   : {tab_estimationData[0].id_estimation.numero_client} <br></br>
                                      Immatriculation: {tab_estimationData[0].id_estimation.id_demande_maintenence_valider.id_demande_maintenence.id_voiture.matricule} <br />
                                      {/* Immatriculation : {tab_estimationData[0].id_pv.id_demande_maintenence_valider.id_demande_maintenence.id_voiture.matricule} <br />
                                      Genre : PV <br></br>
                                      Fonction : {tab_estimationData[0].id_pv.id_demande_maintenence_valider.id_demande_maintenence.id_voiture.id_fonction.nom_fonction} <br />
                                      <br /><br /> */}
                                    </div>  
                                  )}
                                </div>
                              ) : (
                                <p>Aucun proformat n'a été enregistré pour cette demande.</p>
                              )}
                          


                            <br /><br />
                            <table className="table table-striped table-responsive mt-3">
                            <thead className="table-primary">
                            
                                    <tr>
                                        <th>Reference</th>
                                        <th>Designation</th>
                                        <th>Prix Unitaire</th>
                                        <th>Date Entrée</th>
                                        <th>Date Sortie</th>
                                        <th>Quantité</th>
                                        <th>Montant</th>
                                        <th>Image</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.isArray(tab_estimationData) && tab_estimationData.length > 0 ? (
                                        tab_estimationData.map(estimation => (
                                            <tr key={estimation.id_designation}>
                                                <td>{estimation.reference}</td>
                                                <td>{estimation.id_designation.nom_designation}</td>
                                                <td>{estimation.p_u}</td>
                                                <td>{estimation.id_estimation.date_entre}</td>
                                                <td>{estimation.id_estimation.date_fin}</td>
                                                <td>{estimation.qte}</td>
                                                <td>{estimation.montant}</td>
                                                <td>

                                                <img src={`http://localhost:8080${estimation.id_estimation.image}`} style={{'width':'100%','height':'50px'}}/>
                                                </td>
                                                
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

                        <br /><br />

                        <div className="padding-top-black rounded">
                            <h4>Reçu</h4>
                        </div>
                        <div className="table-wrapper">
                        <div className="bg-light p-3 rounded">
                            {Array.isArray(tab_recuData) && tab_recuData.length > 0 ? (
                                <div>
                                  {tab_recuData.length > 0 && (
                                    <div key={tab_recuData[0].id_recu}>
                                      N° Facture :  {tab_recuData[0].id_recu.numero_recu} <br /><br />
                                      Date :  {tab_recuData[0].id_recu.dates} <br />
                                      Vendeur : {tab_recuData[0].id_recu.vendeur} <br></br>
                                      Immatriculation: {tab_recuData[0].id_recu.id_demande_maintenence_valider.id_demande_maintenence.id_voiture.matricule} <br />
                                     
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <p>Aucun reçu n'a été enregistré pour cette demande.</p>
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
                                        <th>Image</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.isArray(tab_recuData) && tab_recuData.length > 0 ? (
                                        tab_recuData.map(recu => (
                                            <tr key={recu.id_designation}>
                                                <td>{recu.numero}</td>
                                                <td>{recu.id_designation.nom_designation}</td>
                                                <td>{recu.p_u}</td>
                                                <td>{recu.qte}</td>
                                                <td>{recu.montant}</td>
                                                <td> 
                                                <img src={`http://localhost:8080${recu.id_recu.image}`} style={{'width':'100%','height':'50px'}}/>
                                                    </td>
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
        

    );
}

export default VoirPlus;
