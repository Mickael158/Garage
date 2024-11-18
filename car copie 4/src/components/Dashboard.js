import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Top from './TopMenu';
import Nav from './Nav';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';  

const Dashboard = () => {
    const token = sessionStorage.getItem("token");
    const [showImportModal, setShowImportModal] = useState(false);
    const [showImportModalSortie, setShowImportModalSortie] = useState(false);
    const [dateDebut, setDateDebut] = useState('');
    const [dateFin, setDateFin] = useState('');
    const [serviceData, setServiceData] = useState([]);
    const [departData, setDepartData] = useState([]);
    const [arriveeData, setArriveeData] = useState([]);
    const [serviceFiltreData, setServiceFiltreData] = useState([]);
    const [ImagesData, setImagesData] = useState('');
    const [ImagesDatas, setImagesDatas] = useState('');
    const [id_demamnde_pret, setId_demamnde_pret] = useState('');
    const [data, setData] = useState('');
    const [imageDepart,setImageDepart] = useState('');
    const handleShowImportModal = (id) => {
        setShowImportModal(true);
        setId_demamnde_pret(id);
    };
    const handleCloseImportModal = () => {
        setImageDepart('');
        setShowImportModalSortie(false);
    };
    const handleShowImportModalSortie = (id) => {
        setShowImportModalSortie(true);
        setId_demamnde_pret(id);
        getImage(id);
    };
    const handleCloseImportModalSortie = () => {
        setShowImportModalSortie(false);
    };
    const selectAllServiceFiltrer = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.get(`http://localhost:8080/Recu/Etat_maintenance_by_service/${data}/${dateDebut}/${dateFin}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setServiceFiltreData(response.data.data || []);
            console.log(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };

    const selectAllService = async () => {
        try {
            const response = await axios.get('http://localhost:8080/Service/selectAll_service', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setServiceData(response.data.data || []);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };

    const selectAllVoitureParJourDepart = async () => {
        try {
            const response = await axios.get('http://localhost:8080/Demande_pret_voiture/Select_pret_voiture_depart_jour', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setDepartData(response.data.data || []);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };

    const selectAllVoitureParJourArrivee = async () => {
        try {
            const response = await axios.get('http://localhost:8080/Demande_pret_voiture/Select_pret_voiture_arriver_jour', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setArriveeData(response.data.data || []);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };

    const insert_Depart_Pret = async (event) => {
        event.preventDefault();
        try {
            const data = new FormData();

            data.append('credentials', JSON.stringify({
                id_demande_pret_voiture: id_demamnde_pret,
            }));

            ImagesData.forEach((depart) => {
                data.append('depart', depart);
              });

              console.log(data.get('credentials'));
            
            const response = await axios.post(`http://localhost:8080/Controlle_pret/insertion_Depart_Controlle_pret`,data,
                {
                    headers: { 
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                     },
                }
            );
            toast.success('Données bien insérées!', {  
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (error) {
            console.error('Erreur de Verification', error);
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
    const handleFileChange = (e) => {
        setImagesData([...e.target.files]);
      };

      const insert_Arriver = async (event) => {
        event.preventDefault();
        try {
            const data = new FormData();

            data.append('credentials', JSON.stringify({
                id_demande_pret_voiture: id_demamnde_pret,
            }));

            ImagesDatas.forEach((arriver) => {
                data.append('arriver', arriver);
              });


            
            const response = await axios.post(`http://localhost:8080/Controlle_pret/insertion_Arriver_Controlle_pret`,data,
                {
                    headers: { 
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                     },
                }
            );
            toast.success('Données bien insérées!', {  
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
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
    const handleFileChangess = (e) => {
        setImagesDatas([...e.target.files]);
      };

    const getImage = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8080/Controlle_pret/select_Controller_By_id_demande_pret_voiture/${id}`,{
                headers:{
                    'Authorization': `Bearer ${token}`
                }
            });
            setImageDepart(response.data.data.depart)
        } catch (error) {
            console.error(error);
        }
    }  


    useEffect(() => {
        selectAllService();
        selectAllVoitureParJourArrivee();
        selectAllVoitureParJourDepart();
    }, []);

    return (
        <div className="menu-container">
            <Top />
            <div className="main-content">
                <Nav />
                <div className="container-fluid mt-4">
                    <h2 className="mb-4">Tableau de bord</h2>
                    <div className="row mb-4">
                        <div className="col-md-3">
                            <div className="card bg-primary text-white">
                                <div className="card-body">
                                    <h5 className="card-title">Véhicules en service</h5>
                                    <p className="card-text h2">{departData.length}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card bg-success text-white">
                                <div className="card-body">
                                    <h5 className="card-title">Retours prévus aujourd'hui</h5>
                                    <p className="card-text h2">{arriveeData.length}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card bg-warning text-white">
                                <div className="card-body">
                                    <h5 className="card-title">Services actifs</h5>
                                    <p className="card-text h2">{serviceData.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="table-wrapper">
                        <div className="card-body">
                            <h5 className="card-title">Filtrer les données</h5>
                            <form className="row g-3" onSubmit={selectAllServiceFiltrer}>
                                <div className="col-md-4">
                                    <label htmlFor="idService" className="form-label">Service</label>
                                    <select
                                        className="form-select"
                                        value={data}
                                        onChange={(e) => setData(e.target.value)}
                                        required
                                    >
                                        <option value="">Choisir un service</option>
                                        {serviceData.map((service) => (
                                            <option key={service.id_service} value={service.id_service}>
                                                {service.nom_service}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="dateDebut" className="form-label">Date de Début</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="dateDebut"
                                        value={dateDebut}
                                        onChange={(e) => setDateDebut(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="dateFin" className="form-label">Date de Fin</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="dateFin"
                                        value={dateFin}
                                        onChange={(e) => setDateFin(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-12">
                                    <button type="submit" className="btn btn-primary">Rechercher</button>
                                </div>
                            </form>
                        </div>
                    </div><br />
                    {/* Tableau des services filtrés */}
                    <div className="table-wrapper">
                        <div className="card-header bg-info text-white">
                            Services filtrés
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-striped table-hover">
                                    <thead>
                                        <tr>
                                            <th>Numéro</th>
                                            <th>Matricule</th>
                                            <th>Nom</th>
                                            <th>Service</th>
                                            <th>Fonction</th>
                                            <th>Montant</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(serviceFiltreData) && serviceFiltreData.length > 0 ? (
                                            serviceFiltreData.map(service => (
                                                <tr key={service.recu.id_recu}>
                                                    <td>{service.recu.id_recu}</td>
                                                    <td>
                                                        {service.recu.id_demande_maintenence_valider.id_demande_maintenence.id_voiture.matricule                                                        }
                                                    </td>
                                                    <td>{service.recu.id_utilisateur?.id_personnel?.nom || 'N/A'}</td>
                                                    <td>{service.recu.id_utilisateur?.id_personnel?.id_service?.nom_service || 'N/A'}</td>
                                                    <td>{service.recu.id_utilisateur?.id_personnel?.id_fonction?.nom_fonction || 'N/A'}</td>
                                                    <td>{service.montant || 'N/A'}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6">Aucune donnée disponible</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <br />
                    {/* Tableaux de données */}
                    <div className="row">
                        <div className="col-md-6">
                            <div className="table-wrapper">
                                <div className="card-header bg-primary text-white">
                                    Départs
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table table-striped table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Nom</th>
                                                    <th>Motif</th>
                                                    <th>Inspection</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {departData.map(depart => (
                                                    <tr key={depart.id_demande_pret_voiture}>
                                                        <td>{depart.id_utilisateur.id_personnel.nom}</td>
                                                        <td>{depart.id_motif_pret_voiture.nom}</td>
                                                        <td>
                                                        <button className="btn btn-info btn-sm" onClick={() => handleShowImportModal(depart.id_demande_pret_voiture)}>Rapport</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="table-wrapper">
                                <div className="card-header bg-success text-white">
                                    Arrivées
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table table-striped table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Nom</th>
                                                    <th>Motif</th>
                                                    <th>Inspection</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {arriveeData.map(arrivee => (
                                                    <tr key={arrivee.id_demande_pret_voiture}>
                                                        <td>{arrivee.id_utilisateur.id_personnel.nom}</td>
                                                        <td>{arrivee.id_motif_pret_voiture.nom}</td>
                                                        <td>
                                                        <button
                                                            className="btn btn-info btn-sm"
                                                            onClick={() => handleShowImportModalSortie(arrivee.id_demande_pret_voiture)}
                                                        >
                                                            Rapport
                                                        </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    
                </div>
            </div>
            <Modal show={showImportModal} onHide={handleCloseImportModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Enregistrer un constatation de depart</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form onSubmit={insert_Depart_Pret}>
                    <div className="mb-3">
                        <label className="form-label">Entrer la date d'entrer :</label>
                        <input type="file"
                                multiple
                                placeholder="Entrez l'image"
                                onChange={handleFileChange}
                                className="form-control"  />
                    </div>        
                    <Button variant="success" type="submit">
                        Enregistrer
                    </Button>              
                </Form>
                    
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseImportModal}>Fermer</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showImportModalSortie} onHide={handleCloseImportModalSortie}>
                <Modal.Header closeButton>
                    <Modal.Title>Enregistrer un constatation d'arriver</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form onSubmit={insert_Arriver}>  
                    <div className="mb-3">
                        <label className="form-label">Constatation au Depart :</label>
                        {imageDepart !== '' && (
                            <img src={`http://localhost:8080${imageDepart}`} alt='' className='img-fluid' />
                        )}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Entrer la date d'entrer :</label>
                        <input type="file"
                                multiple
                                placeholder="Entrez l'image"
                                onChange={handleFileChangess}
                                className="form-control"/>
                    </div>
                    <Button variant="success" type="submit">
                        Enregistrer
                    </Button>              
                </Form>
                    
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseImportModal}>Fermer</Button>
                </Modal.Footer>
            </Modal>
            <ToastContainer />
        </div>
    );
};

export default Dashboard;