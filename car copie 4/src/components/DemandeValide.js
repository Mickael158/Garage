import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Top from './TopMenu';
import Nav from './Nav';
import '../styles/Menu.css';
import { ToastContainer, toast } from 'react-toastify';  

function DemandeValide() {

    const token = sessionStorage.getItem('token');

    const [remarqueData, setRemarqueData] = useState('');
    const [remarqueProforamatData, setRemarqueProforamatData] = useState('');
    const [vendeurData, setVendeurData] = useState('');
    const [dates_pvData, setDatePvData] = useState('');
    const [dates_proformatData, setDateProformatData] = useState('');
    const [dates_RecuData, setDateRecuData] = useState('');
    const [numeroData, setNumeroData] = useState('');
    const [numeroProforamatData, setNumeroProforamatData] = useState('');
    const [numeroRecuData, setNumeroRecuData] = useState('');
    const [numeroClientData, setNumeroClientData] = useState('');
    const [ImagesData, setImagesData] = useState('');
    const [ImagesProforamatData, setImagesProforamatData] = useState('');
    const [ImagesRecuData, setImagesRecuData] = useState('');
    const [selectedConcessionnaire, setSelectedConcessionnaire] = useState('');
    const [selectedPayement, setSelectedPayement] = useState('');
    const [selectedRecu, setSelectedRecu] = useState('');
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState(''); 
    const [selectedLieu, setSelectedLieu] = useState('');
    const [searchTermService, setSearchTermService] = useState('');


    const [maintenanceData, setmaintenanceData] = useState('');

    const [actionMaintData, setActionMaintData] = useState([]);
    const [showModalPV, setShowModalPV] = useState(false);
    const [showModalProformat, setShowModalProformat] = useState(false);
    const [showModalRecu, setShowModalRecu] = useState(false);
    const [defaillanceData, setDefaillanceData] = useState([]);
    const [actionData, setActionData] = useState([]);
    const [RecuData, setRecuData] = useState([]);
    const [modePayementData, setModePayementData] = useState([]);
    const [concessionnaireData, setConcessionnaireData] = useState([]);
    const [systemeData, setSystemeData] = useState([]);
    const [designationData, setDesignationData] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [pvData, setPvData] = useState({
        dates: '',
        numero: '',
        remarque: ''
    });
    const [rows, setRows] = useState([
        { select1: '', select2: '', select3: '', input1: '', 3: '' } // initial row
    ]);
    const [rowsi, setRowsi] = useState([
        { select1: '', select2: '', select3: '', input1: '', 3: '' } // initial row
    ]);

    const [dateEntreData, setDateEntreData] = useState('');
    const [dateFinData, setDateFinData] = useState('');

    const [pvInsere, setPvInsere] = useState({});
    const [proformatInsere, setProformatInsere] = useState({});
    const [recuInsere, setRecuInsere] = useState({});

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const selectAllActionMaintenanceValid = async () => {
        try {
            const response = await axios.get('http://localhost:8080/demande_maintenence_valider/selecAll_demande_maintenence_validation',
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setActionMaintData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };

    const selectAll_Systeme = async () => {
        try {
            const response = await axios.get('http://localhost:8080/Systeme/selecAll_Systeme',
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            // console.log('Données récupérées:', response.data);  // Pour vérifier la structure des données
            setSystemeData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };

    const selectAll_Defaillance = async () => {
        try {
            const response = await axios.get('http://localhost:8080/Defaillance/selectAll_Defaillance',
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            // console.log('Données récupérées:', response.data);  // Pour vérifier la structure des données
            setDefaillanceData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };
    const selectAll_Designation = async () => {
        try {
            const response = await axios.get('http://localhost:8080/Action/selectAll_enregistrerDesignation',
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            // console.log('Données récupérées:', response.data);
            setDesignationData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };

    const selectAll_Action = async () => {
        try {
            const response = await axios.get('http://localhost:8080/Action/selectAll_Action',
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            // console.log('Données récupérées:', response.data);  // Log to check data structure
            setActionData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
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
            // console.log('Données récupérées:', response.data);
            setConcessionnaireData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };
    const selectAll_ModePayement = async () => {
        try {
            const response = await axios.get('http://localhost:8080/Mode_payement/selectAll_Mode_payement',
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            // console.log('Données récupérées:', response.data);
            setModePayementData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };

    useEffect(() => {
        selectAll_Defaillance();
        selectAll_Action();
        selectAll_ModePayement();
        selectAll_Concessionnaire();
        selectAll_Systeme();
        selectAll_Designation();
        selectAllActionMaintenanceValid();
    }, []);

    useEffect(() => {
        actionMaintData.forEach(validation => {
            checkPvExists(validation.id_demande_maintenence_valider);
            checkProformatExists(validation.id_demande_maintenence_valider);
            checkRecuExists(validation.id_demande_maintenence_valider);
        });
    }, [actionMaintData]);

    const handleShowModalPV = async (validation) => {
        const pvExists = await checkPvExists(validation.id_demande_maintenence_valider);
        if (pvExists) {
            toast.warning("Un PV existe déjà pour cette demande. Vous ne pouvez pas en ajouter un autre.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } else {
            setSelectedRequest(validation);
            setShowModalPV(true);
        }
    };
    const handleShowModalProformat = async (validation) => {
        const proformatExists = await checkProformatExists(validation.id_demande_maintenence_valider);
        if (proformatExists) {
            toast.warning("Un proformat existe déjà pour cette demande. Vous ne pouvez pas en ajouter un autre.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } else {
            setSelectedRequest(validation);
            setShowModalProformat(true);
        }
    };
    const handleShowModalRecu = async (validation) => {
        const recuExists = await checkRecuExists(validation.id_demande_maintenence_valider);
        if (recuExists) {
            toast.warning("Un reçu existe déjà pour cette demande. Vous ne pouvez pas en ajouter un autre.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } else {
            setSelectedRequest(validation);
            setShowModalRecu(true);
        }
    };

    const handleCloseModalPV = () => {
        setShowModalPV(false);
    };
    const handleCloseModalProforamat = () => {
        setShowModalProformat(false);
    };
    const handleCloseModalRecu = () => {
        setShowModalRecu(false);
    };
    const filteredData = actionMaintData.filter(validation =>
        validation.id_demande_maintenence.id_voiture.matricule.toLowerCase().includes(searchTerm.toLowerCase()) &&
        validation.id_utilisateur.id_personnel.id_service.nom_service.toLowerCase().includes(searchTermService.toLowerCase())
    );

    

    const handleDateChange = (e) => {
        const dateTimeValue = e.target.value; // Récupère la valeur datetime-local (format : YYYY-MM-DDTHH:mm)
        
        // Convertir en format souhaité YYYY-MM-DD HH:mm:ss
    const formattedDate = formatDateTime(dateTimeValue);
        
        setDateRecuData(formattedDate);
      };

      const formatDateTime = (value) => {
        // Sépare la date et l'heure
        const [date, time] = value.split('T');
        
        // Ajouter ":00" pour les secondes
        const formattedTime = time ? `${time}:00` : '';
        
        // Combine date et heure dans le format souhaité
        return `${date} ${formattedTime}`;
      };

    const handleSubmiPVt = async (event) => {
        event.preventDefault();
        try {
            await axios.post('http://localhost:8080/submit_pv', {
                ...pvData,
                id_demande: selectedRequest.id_demande_maintenence_valider
            });
            alert('PV inséré avec succès !');
            handleCloseModalPV();
        } catch (error) {
            console.error('Erreur lors de l\'insertion du PV', error);
        }
    };

    const insert_pv_Tab = async () => {
        try {
            const payload = rows.map(row => ({
                id_systeme: row.select1,
                id_defaillance: row.select2,
                id_action: row.select3,
                observation: row.input1,
                ordre_de_priorite: row.input2
            }));
    
            // Affiche les données envoyées pour vérification
            console.log('Payload:', payload);
    
            // Envoie des données sous forme d'un tableau
            const response = await axios.post(
                'http://localhost:8080/TableauPv/enregistrerTableausPvs', 
                payload, 
                {
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                     },
                }
            );
    
            console.log('Insertion du tableau réussie:', response.data);
            handleCloseModalPV();
        } catch (error) {
            console.error('Erreur lors de l\'insertion du tableau', error);
        }
    };

    const insert_PV = async (event) => {
        event.preventDefault();
        try {
            console.log(token);
            const data = new FormData();

            data.append('credentials', JSON.stringify({
                remarque: remarqueData,
                dates_pv: dates_pvData,
                numero: numeroData,
                id_utilisateur: token,
                id_demande_maintenence_valider: selectedRequest.id_demande_maintenence_valider,
            }));

            ImagesData.forEach((image) => {
                data.append('image', image);
              });
            
            const response = await axios.post(`http://localhost:8080/Pv/insertion_Pv`,data,
                {
                    headers: { 
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                     },
                }
            );
            selectAll_Action(); 
            insert_pv_Tab();
            toast.success('Données bien insérées!', {  
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            handleCloseModalPV();
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
    const handleFileChange = (e) => {
        setImagesData([...e.target.files]);
      };

    const insert_proforamat_Tab = async () => {
        try {
            const payload = rows.map(row => ({
                reference: row.input2,
                id_designation: row.select1,
                p_u: row.input3,
                qte: row.input4,
            }));
            
        // console.log("pro: ", payload);
    
            // Affiche les données envoyées pour vérification
            // console.log('Payload:', payload);
    
            // Envoie des données sous forme d'un tableau
            const response = await axios.post(
                'http://localhost:8080/Tabeau_Estimation/insertion_Liste_action_demande_maintenence_', 
                payload, 
                {
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                 },
                }
            );
    
            console.log('Insertion du tableau réussie:', response.data);
            handleCloseModalProforamat();
        } catch (error) {
            console.error('Erreur lors de l\'insertion du tableau', error);
        }
    };

    const insert_Proforamat = async (event) => {
        event.preventDefault();
        const datas = new FormData();
        datas.append('credentials', JSON.stringify({
            id_concessionnaire: selectedConcessionnaire,
            dates_estimation: dates_proformatData,
            numero_estimation: numeroProforamatData,
            numero_client: numeroClientData,
            remarque: remarqueProforamatData,
            id_utilisateur: token,
            id_demande_maintenence_valider: selectedRequest.id_demande_maintenence_valider,
            date_entre: dateEntreData,
            date_fin: dateFinData,
          }));
      
          // Ajoutez les fichiers image
          ImagesProforamatData.forEach((image) => {
            datas.append('image', image);
          });
      
        try {
            
            const response = await axios.post(`http://localhost:8080/Estimation/insertion_Estimation`, 
                datas, 
                {
                    headers: { 
                        'content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                      },
                }
            );
            console.log('Insertion réussie:', response.data);
            selectAll_Action();  
            insert_proforamat_Tab();
            toast.success('Données bien insérées!', {  
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            handleCloseModalProforamat();
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
    const handleFileChanges = (e) => {
        setImagesProforamatData([...e.target.files]);
      };

    const insert_Recu_Tab = async () => {
        try {
            const payload = rows.map(row => ({
                numero: row.input2,
                id_designation: row.select1,
                p_u: row.input3,
                qte: row.input4,
            }));
            
        console.log("recu tab : ", payload);
    
            // Affiche les données envoyées pour vérification
            console.log('Payload:', payload);
    
            // Envoie des données sous forme d'un tableau
            const response = await axios.post(
                'http://localhost:8080/Tabeau_Recu/insertion_Liste_action_demande_maintenence_', 
                payload, 
                {
                    headers: { 
                        'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                 },
                }
            );
    
            console.log('Insertion du tableau réussie:', response.data);
            handleCloseModalProforamat();
        } catch (error) {
            console.error('Erreur lors de l\'insertion du tableau', error);
        }
    };

    const insert_Recu = async (event) => {
        event.preventDefault();
        const datass = new FormData();
        datass.append('credentials', JSON.stringify({
            id_concessionnaire: selectedConcessionnaire,
            numero_recu: numeroRecuData,
            dates_recu: dates_RecuData,
            vendeur: vendeurData,
            id_mode_payement: selectedPayement,
            id_utilisateur: token,
            id_demande_maintenence_valider: selectedRequest.id_demande_maintenence_valider
          }));
      
          ImagesRecuData.forEach((image) => {
            datass.append('image', image);
          });
        try {

            const response = await axios.post(`http://localhost:8080/Recu/insertion_Recu`, 
                datass, 

                {
                    headers: { 
                        'content-Type': 'multipart/form-data' ,
                        'Authorization': `Bearer ${token}`
                     },
                }
                
            );
            console.log('Insertion réussie:', response.data.data);
            selectAll_Action();  
            insert_Recu_Tab();
            toast.success('Données bien insérées!', { 
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            handleCloseModalRecu();
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
        setImagesRecuData([...e.target.files]);
      };
    

    const handleRowChange = (index, event) => {
        const { name, value } = event.target;
        const updatedRows = [...rows];
        const updatedRowsi = [...rowsi];
        updatedRows[index][name] = value;
        updatedRowsi[index][name] = value;
        setRows(updatedRows);
        setRowsi(updatedRowsi);
    };

    const handleAddField = () => {
        setRows([...rows, { select1: '', select2: '', select3: '', input1: '', input2: '', input3: '', input4: '' }]); // add a new row
        setRowsi([...rowsi, { select1: '', select2: '', select3: '', input1: '', input2: '', input3: '', input4: '' }]); // add a new row
    };

    // Nouvelle fonction pour supprimer une ligne
    const handleRemoveField = (index) => {
        const updatedRows = rows.filter((row, rowIndex) => rowIndex !== index);
        const updatedRowsi = rows.filter((row, rowIndex) => rowIndex !== index);
        setRows(updatedRows);
        setRowsi(updatedRowsi);
    };

        // Fonction pour rediriger vers la page des détails avec les données
        const handleVoirPlus = (validation) => {
          navigate('/voirplus', { state: { data: validation } });
        };

    // Fonctions pour vérifier l'existence des documents
    const checkPvExists = async (id_demande_maintenence_valider) => {
        try {
            const response = await axios.get(`http://localhost:8080/TableauPv/find_TableauPvBy_id_demande_maintenence_valider/${id_demande_maintenence_valider}`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            const exists = response.data.data.length > 0;
            setPvInsere(prevState => ({...prevState, [id_demande_maintenence_valider]: exists}));
            return exists;
        } catch (error) {
            console.error('Erreur lors de la vérification du PV', error);
            return false;
        }
    };

    const checkProformatExists = async (id_demande_maintenence_valider) => {
        try {
            const response = await axios.get(`http://localhost:8080/Tabeau_Estimation/find_Tableau_EstimationBy_id_demande_maintenence_valider/${id_demande_maintenence_valider}`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            const exists = response.data.data.length > 0;
            setProformatInsere(prevState => ({...prevState, [id_demande_maintenence_valider]: exists}));
            return exists;
        } catch (error) {
            console.error('Erreur lors de la vérification du proformat', error);
            return false;
        }
    };

    const checkRecuExists = async (id_demande_maintenence_valider) => {
        try {
            const response = await axios.get(`http://localhost:8080/Tabeau_Recu/find_Tableau_RecuBy_id_demande_maintenence_valider/${id_demande_maintenence_valider}`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            const exists = response.data.data.length > 0;
            setRecuInsere(prevState => ({...prevState, [id_demande_maintenence_valider]: exists}));
            return exists;
        } catch (error) {
            console.error('Erreur lors de la vérification du reçu', error);
            return false;
        }
    };

    // Calculer les indices des éléments à afficher
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    // Changer de page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Composant de pagination
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
            pageIncrementBtn = <Pagination.Ellipsis onClick={handleNextBtn} />;
        }
    
        let pageDecrementBtn = null;
        if (minPageNumberLimit >= 1) {
            pageDecrementBtn = <Pagination.Ellipsis onClick={handlePrevBtn} />;
        }
    
        return (
            <Pagination className="justify-content-center mt-3">
                <Pagination.First onClick={() => paginate(1)} disabled={currentPage === 1} />
                <Pagination.Prev onClick={handlePrevBtn} disabled={currentPage === 1} />
                {pageDecrementBtn}
                {pageNumbers.map(number => {
                    if (number < maxPageNumberLimit + 1 && number > minPageNumberLimit) {
                        return (
                            <Pagination.Item key={number} active={number === currentPage} onClick={() => paginate(number)}>
                                {number}
                            </Pagination.Item>
                        );
                    } else {
                        return null;
                    }
                })}
                {pageIncrementBtn}
                <Pagination.Next onClick={handleNextBtn} disabled={currentPage === pageNumbers.length} />
                <Pagination.Last onClick={() => paginate(pageNumbers.length)} disabled={currentPage === pageNumbers.length} />
            </Pagination>
        );
    };

    return (
        <div className="menu-container">
    <Top />
    <div className="main-content">
        <Nav />
        <div className="content">
            <div className="padding-top-black">
                <h2>Listes des demandes Valide</h2>
            </div>
            
            <div className="table-wrapper">
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Rechercher par immatricule" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <input 
                    type="text" 
                    className="form-control mt-2" // Ajouter un espacement entre les deux inputs
                    placeholder="Rechercher par service" 
                    value={searchTermService}
                    onChange={(e) => setSearchTermService(e.target.value)}
                />
                <div className="table-container mt-4">
                    <table className="table table-striped table-hover table-responsive">
                        <thead className="table-primary">
                    
                        <tr>
                            <th>Numero</th>
                            <th>Immatricule</th>
                            <th>Nom</th>
                            <th>Service</th>
                            <th>Remarque</th>
                            <th>Pv</th>
                            <th>Proforma</th>
                            <th>Recu</th>
                            <th>Voir Demarche</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(currentItems) && currentItems.length > 0 ? (
                            currentItems.map(validation => (
                                <tr key={validation.id_demande_maintenence_valider}>
                                    <td>{validation.id_demande_maintenence_valider}</td>
                                    <td>{validation.id_demande_maintenence.id_voiture.matricule}</td>
                                    <td>{validation.id_utilisateur.id_personnel.nom}</td>
                                    <td>{validation.id_utilisateur.id_personnel.id_service.nom_service}</td>
                                    <td>{validation.remarque}</td>
                                    <td>
                                        {pvInsere[validation.id_demande_maintenence_valider] ? (
                                            <span className="badge bg-success text-dark">PV inséré</span>
                                        ) : (
                                            <button
                                                className="btn btn-success btn-sm"
                                                title="Insertion PV"
                                                onClick={() => handleShowModalPV(validation)}
                                            >
                                                <i className="fas fa-paperclip"></i> Insert PV
                                            </button>
                                        )}
                                    </td>
                                    <td>
                                        {proformatInsere[validation.id_demande_maintenence_valider] ? (
                                            <span className="badge bg-success text-dark">Proformat inséré</span>
                                        ) : (
                                            <button
                                                className="btn btn-success btn-sm"
                                                title="Insertion Proformat"
                                                onClick={() => handleShowModalProformat(validation)}
                                            >
                                                <i className="fas fa-paperclip"></i> Insert Proformat
                                            </button>
                                        )}
                                    </td>
                                    <td>
                                        {recuInsere[validation.id_demande_maintenence_valider] ? (
                                            <span className="badge bg-success text-dark">Recu inséré</span>
                                        ) : (
                                            <button
                                                className="btn btn-success btn-sm"
                                                title="Insertion Recu"
                                                onClick={() => handleShowModalRecu(validation)}
                                            >
                                                <i className="fas fa-paperclip"></i> Insert Recu
                                            </button>
                                        )}
                                    </td>

                                    <td>
                                        <button
                                            className="btn btn-info btn-sm"
                                            title="Voir plus"
                                            onClick={() => handleVoirPlus(validation)}
                                        >
                                            <i className="fas fa-eye"></i> Voir plus
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="text-center">Aucune donnée disponible</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                </div>
                {/* Ajoutez le composant de pagination ici */}
                <PaginationComponent
                    itemsPerPage={itemsPerPage}
                    totalItems={filteredData.length}
                    paginate={paginate}
                    currentPage={currentPage}
                />
            </div>
        </div>
    </div>


    
            {/* Modal */}
            <Modal show={showModalPV} onHide={handleCloseModalPV} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Insérer PV</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={insert_PV}>
                        <Form.Group controlId="formDates">
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                type="date"
                                placeholder="Entrez la date"
                                name="dates"
                                value={dates_pvData}
                                onChange={(e) => setDatePvData(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formNumero">
                            <Form.Label>Numéro</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Entrez le numéro"
                                name="numero"
                                value={numeroData}
                                onChange={(e) => setNumeroData(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formRemarque">
                            <Form.Label>Remarque</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Entrez une remarque"
                                name="remarque"
                                value={remarqueData}
                                onChange={(e) => setRemarqueData(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formImage" className="mb-3">
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                                type="file"
                                multiple
                                placeholder="Entrez l'image"
                                onChange={handleFileChange}
                            />
                        </Form.Group>
                        {/* <Button variant="success" type="submit" onClick={insert_PV} >
                            Soumettre PVs
                        </Button> */}
    
                        {/* Tableau à 5 colonnes avec un bouton de suppression */}
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Systeme</th>
                                    <th>Defaillance</th>
                                    <th>Action</th>
                                    <th>Observation</th>
                                    <th>Ordre de Priorité</th>
                                    <th>Actions</th> {/* Colonne pour le bouton Supprimer */}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, index) => (
                                    <tr key={index}>
                                        <td>
                                            <Form.Control 
                                                as="select" 
                                                name="select1" 
                                                value={row.select1} 
                                                onChange={(e) => handleRowChange(index, e)} 
                                            >
                                                <option value="">Choisir un lieu</option>
                                                {systemeData.length > 0 ? (
                                                    systemeData.map(sys => (
                                                        <option key={sys.id_systeme} value={sys.id_systeme}>
                                                            {sys.nom_systeme}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option value="" disabled>Aucune donnée disponible</option>
                                                )}
                                            </Form.Control>
                                        </td>
                                        <td>
                                            <Form.Control 
                                                as="select" 
                                                name="select2" 
                                                value={row.select2} 
                                                onChange={(e) => handleRowChange(index, e)} 
                                            >
                                                <option value="">Choisir un lieu</option>
                                                {defaillanceData.length > 0 ? (
                                                    defaillanceData.map(def => (
                                                        <option key={def.id_defaillance} value={def.id_defaillance}>
                                                            {def.nom_defaillance}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option value="" disabled>Aucune donnée disponible</option>
                                                )}
                                            </Form.Control>
                                        </td>
                                        <td>
                                            <Form.Control 
                                                as="select" 
                                                name="select3" 
                                                value={row.select3} 
                                                onChange={(e) => handleRowChange(index, e)} 
                                            >
                                                <option value="">Choisir une action</option>
                                                {actionData.length > 0 ? (
                                                    actionData.map(action => (
                                                        <option key={action.id_action} value={action.id_action}>
                                                            {action.nom_action}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option value="" disabled>Aucune donnée disponible</option>
                                                )}
                                            </Form.Control>
                                        </td>
                                        <td>
                                            <Form.Control type="text" name="input1" value={row.input1} onChange={(e) => handleRowChange(index, e)} />
                                        </td>
                                        <td>
                                            <Form.Control type="number" name="input2" value={row.input2} onChange={(e) => handleRowChange(index, e)} />
                                        </td>
                                        <td>
                                            <Button variant="danger" onClick={() => handleRemoveField(index)}>
                                                Supprimer
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
    
                        <Button variant="primary" onClick={handleAddField}>
                            + Ajouter une ligne
                        </Button>
                        <br /><br />
                        <Button variant="success" type="submit">
                            Soumettre PV
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showModalProformat} onHide={handleCloseModalProforamat} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Insérer Proformat</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={insert_Proforamat}>
                    <Form.Label>Concessionnaire</Form.Label>
                                <Form.Control
                                as="select"
                                name="concessionnaire"
                                value={selectedConcessionnaire} // Assurez-vous que cet état est bien défini
                                onChange={(e) => setSelectedConcessionnaire(e.target.value)}
                                >
                                <option value="">Choisir un concessionnaire</option>
                                {concessionnaireData.length > 0 ? (
                                    concessionnaireData.map(conc => (
                                    <option key={conc.id_concessionnaire} value={conc.id_concessionnaire}>
                                        {conc.nom}
                                    </option>
                                    ))
                                ) : (
                                    <option value="" disabled>Aucune donnée disponible</option>
                                )}
                                </Form.Control><br></br>



                        <Form.Group controlId="formDates">
                            <Form.Label>Date Estimation</Form.Label>
                            <Form.Control
                                type="date"
                                placeholder="Entrez la date"
                                name="dates"
                                value={dates_proformatData}
                                onChange={(e) => setDateProformatData(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formNumero">
                            <Form.Label>Numéro</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Entrez le numéro"
                                name="numero"
                                value={numeroProforamatData}
                                onChange={(e) => setNumeroProforamatData(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formNumero">
                            <Form.Label>Numéro Client </Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Entrez le numéro"
                                name="numero_client"
                                value={numeroClientData}
                                onChange={(e) => setNumeroClientData(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formRemarque">
                            <Form.Label>Remarque</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Entrez une remarque"
                                name="remarque"
                                value={remarqueProforamatData}
                                onChange={(e) => setRemarqueProforamatData(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formImage" className="mb-3">
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                                type="file"
                                multiple
                                placeholder="Entrez l'image"
                                onChange={handleFileChanges}
                            />
                        </Form.Group>
                        
                        <Form.Group controlId="formDateEntre">
                            <Form.Label>Date d'entrée</Form.Label>
                            <Form.Control
                                type="date"
                                placeholder="Entrez la date d'entrée"
                                name="date_entre"
                                value={dateEntreData}
                                onChange={(e) => setDateEntreData(e.target.value)}
                            />
                        </Form.Group>
                        
                        <Form.Group controlId="formDateFin">
                            <Form.Label>Date de sortie</Form.Label>
                            <Form.Control
                                type="date"
                                placeholder="Entrez la date de sortie"
                                name="date_fin"
                                value={dateFinData}
                                onChange={(e) => setDateFinData(e.target.value)}
                            />
                        </Form.Group>

                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Reference</th>
                                    <th>Designation</th>
                                    <th>Prix U.</th>
                                    <th>Quantité</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, index) => (
                                    <tr key={index}>
                                        <td>
                                            <Form.Control 
                                                type="number" 
                                                name="input2" 
                                                value={row.input2} 
                                                onChange={(e) => handleRowChange(index, e)} 
                                            />
                                        </td>
                                        <td>
                                            <Form.Control 
                                                as="select" 
                                                name="select1" 
                                                value={row.select1} 
                                                onChange={(e) => handleRowChange(index, e)} 
                                            >
                                                <option value="">Choisir un lieu</option>
                                                {designationData.length > 0 ? (
                                                    designationData.map(des => (
                                                        <option key={des.id_designation} value={des.id_designation}>
                                                            {des.nom_designation}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option value="" disabled>Aucune donnée disponible</option>
                                                )}
                                            </Form.Control>
                                        </td>
                                        <td>
                                            <Form.Control 
                                                type="number" 
                                                name="input3"  // <- Ici, on met input3
                                                value={row.input3} 
                                                onChange={(e) => handleRowChange(index, e)} 
                                            />
                                        </td>
                                        <td>
                                            <Form.Control 
                                                type="number" 
                                                name="input4"  // <- Ici, on met input4
                                                value={row.input4} 
                                                onChange={(e) => handleRowChange(index, e)} 
                                            />
                                        </td>
                                        <td>
                                            <Button variant="danger" onClick={() => handleRemoveField(index)}>
                                                Supprimer
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
    
                        <Button variant="primary" onClick={handleAddField}>
                            + Ajouter une ligne
                        </Button>
                        <br /><br />
                        <Button variant="success" type="submit">
                            Soumettre Proforma
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>



            <Modal show={showModalRecu} onHide={handleCloseModalRecu} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Insérer Recu</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={insert_Recu}>
                    <Form.Label>Concessionnaire</Form.Label>
                                <Form.Control
                                as="select"
                                name="concessionnaire"
                                value={selectedConcessionnaire} // Assurez-vous que cet état est bien défini
                                onChange={(e) => setSelectedConcessionnaire(e.target.value)}
                                >
                                <option value="">Choisir un concessionnaire</option>
                                {concessionnaireData.length > 0 ? (
                                    concessionnaireData.map(conc => (
                                    <option key={conc.id_concessionnaire} value={conc.id_concessionnaire}>
                                        {conc.nom}
                                    </option>
                                    ))
                                ) : (
                                    <option value="" disabled>Aucune donnée disponible</option>
                                )}
                                </Form.Control><br></br>

                                <Form.Group controlId="formImage" className="mb-3">
                                <Form.Label>Numéro Recu</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Entrez le numéro"
                                name="numero"
                                value={numeroRecuData}
                                onChange={(e) => setNumeroRecuData(e.target.value)}
                            />
                        </Form.Group>



                        <Form.Group controlId="formDates">
                            <Form.Label>Date et Heure Reçue</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                placeholder="Entrez la date et l'heure"
                                name="dates"
                                value={dates_RecuData}
                                onChange={handleDateChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formVendeur">
                            <Form.Label>Vendeur</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Entrez le vendeur"
                                name="vendeur"
                                value={vendeurData}
                                onChange={(e) => setVendeurData(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="formImage" className="mb-3">
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                                type="file"
                                multiple
                                placeholder="Entrez l'image"
                                onChange={handleFileChangess}
                            />
                        </Form.Group>
                    <Form.Label>Mode de Payement </Form.Label>
                        
                        <Form.Control
                                as="select"
                                name="payement"
                                value={selectedPayement} // Assurez-vous que cet état est bien défini
                                onChange={(e) => setSelectedPayement(e.target.value)}
                                >
                                <option value="">Choisir un mode de payement</option>
                                {modePayementData.length > 0 ? (
                                    modePayementData.map(pay => (
                                    <option key={pay.id_mode_payement} value={pay.id_mode_payement}>
                                        {pay.nom}
                                    </option>
                                    ))
                                ) : (
                                    <option value="" disabled>Aucune donnée disponible</option>
                                )}
                                </Form.Control><br></br>
                        
                        
                        {/* <Button variant="success" type="submit" onClick={insert_Recu} >
                            Soumettre PVs
                        </Button> */}
    
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Numero</th>
                                    <th>Designation</th>
                                    <th>Prix U.</th>
                                    <th>Quantité</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, index) => (
                                    <tr key={index}>
                                        <td>
                                            <Form.Control 
                                                type="number" 
                                                name="input2" 
                                                value={row.input2} 
                                                onChange={(e) => handleRowChange(index, e)} 
                                            />
                                        </td>
                                        <td>
                                            <Form.Control 
                                                as="select" 
                                                name="select1" 
                                                value={row.select1} 
                                                onChange={(e) => handleRowChange(index, e)} 
                                            >
                                                <option value="">Choisir un lieu</option>
                                                {designationData.length > 0 ? (
                                                    designationData.map(des => (
                                                        <option key={des.id_designation} value={des.id_designation}>
                                                            {des.nom_designation}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option value="" disabled>Aucune donnée disponible</option>
                                                )}
                                            </Form.Control>
                                        </td>
                                        <td>
                                            <Form.Control 
                                                type="number" 
                                                name="input3"  // <- Ici, on met input3
                                                value={row.input3} 
                                                onChange={(e) => handleRowChange(index, e)} 
                                            />
                                        </td>
                                        <td>
                                            <Form.Control 
                                                type="number" 
                                                name="input4"  // <- Ici, on met input4
                                                value={row.input4} 
                                                onChange={(e) => handleRowChange(index, e)} 
                                            />
                                        </td>
                                        <td>
                                            <Button variant="danger" onClick={() => handleRemoveField(index)}>
                                                Supprimer
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
    
                        <Button variant="primary" onClick={handleAddField}>
                            + Ajouter une ligne
                        </Button>
                        <br /><br />
                        <Button variant="success" type="submit">
                            Soumettre PV
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
            <ToastContainer />

        </div>
    );
    
};

export default DemandeValide;