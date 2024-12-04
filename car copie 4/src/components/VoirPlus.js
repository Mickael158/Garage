import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Top from './TopMenu';
import Nav from './Nav';
import '../styles/Menu.css';
import axios from 'axios';
import '../styles/Form.css';
import { toast, ToastContainer } from 'react-toastify';
import { Button, Modal } from 'react-bootstrap';

function VoirPlus() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = sessionStorage.getItem('token');
    const [showImportModal, setShowImportModal] = useState(false);
    const [tab_pvData, settabpvData] = useState([]);
    const [dateDebut, setDateDebut] = useState('');
    const [dateFin, setDateFin] = useState('');
    const [IdEstimation, setIdEstimation] = useState('');
    const [tab_estimationData, setTabEstimationData] = useState([]);
    const [tab_recuData, setTabRecuData] = useState([]);
    const location = useLocation();
    const { data } = location.state; // Récupérer les données de l'état
    const handleShowImportModal = (id) => {
        setShowImportModal(true);
        setIdEstimation(id);
    };
    const handleCloseImportModal = () => {
        setShowImportModal(false);
    };
    const selectAll_Tab_PV = async () => {
        try {
            const response = await axios.get(`${apiUrl}/TableauPv/find_TableauPvBy_id_demande_maintenence_valider/${data.id_demande_maintenence_valider}`,
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
    const insertEstimation = async (debut, fin, estimation) => {
        try {
            const response = await axios.post(`${apiUrl}/Estimation/insertion_Estimation/${debut}/${fin}/${estimation}`, 
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            toast.success('Données Modifier', {  
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            selectAll_Tab_Estimation();
            setIdEstimation('');
            setShowImportModal(false);
        } catch (error) {
            console.error('Erreur lors de l\'insertion de l\'estimation', error);
            toast.error('Erreur lors de la Modification', {  // Notification d'erreur
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
    

    const selectAll_Tab_Estimation = async () => {
        try {
            const response = await axios.get(`${apiUrl}/Tabeau_Estimation/find_Tableau_EstimationBy_id_demande_maintenence_valider/${data.id_demande_maintenence_valider}`,
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
            const response = await axios.get(`${apiUrl}/Tabeau_Recu/find_Tableau_RecuBy_id_demande_maintenence_valider/${data.id_demande_maintenence_valider}`,
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
                                                    <img src={`${apiUrl}${pv.id_pv.image}`} style={{'width':'100%','height':'50px'}}/>
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
                                      Immatriculation: {tab_estimationData[0].id_estimation.id_demande_maintenence_valider.id_demande_maintenence.id_voiture.matricule} <br /><br />
                                      Date entrer: 
                                                <button 
                                                    className="btn btn-success" 
                                                    onClick={() => handleShowImportModal(tab_estimationData[0].id_estimation.id_estimation)}
                                                >
                                                    {tab_estimationData[0].id_estimation.date_entre}
                                                </button>
                                                <br /><br />

                                    Date sortie: 
                                                <button 
                                                    className="btn btn-success" 
                                                    onClick={() => handleShowImportModal(tab_estimationData[0].id_estimation.id_estimation)}
                                                >
                                                    {tab_estimationData[0].id_estimation.date_fin}
                                                </button>
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
                                                <td>{estimation.qte}</td>
                                                <td>{estimation.montant}</td>
                                                <td>
                                                <img src={`${apiUrl}${estimation.id_estimation.image}`} style={{'width':'100%','height':'50px'}}/>
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
                            <h4>Facture</h4>
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
                                                <img src={`${apiUrl}${recu.id_recu.image}`} style={{'width':'100%','height':'50px'}}/>
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
            <Modal show={showImportModal} onHide={handleCloseImportModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Modifier de la date au conssesionnaire</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label className="form-label">Entrer la date d'entrer :</label>
                        <input type="date" className="form-control" value={dateDebut}
                                        onChange={(e) => setDateDebut(e.target.value)}
                                        required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Entrer la date de sortie :</label>
                        <input type="date" className="form-control" value={dateFin}
                                        onChange={(e) => setDateFin(e.target.value)}
                                        required  />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseImportModal}>Fermer</Button>
                    <Button variant="primary" onClick={() => insertEstimation(dateDebut , dateFin , IdEstimation)} >Modifier</Button>
                </Modal.Footer>
            </Modal>
            <ToastContainer />
        </div>
        

    );
}

export default VoirPlus;
