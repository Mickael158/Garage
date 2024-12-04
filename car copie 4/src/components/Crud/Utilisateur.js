import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Top from '../TopMenu';
import Nav from '../Nav';
import '../../styles/Menu.css';
import '../../styles/Form.css';
import '../../styles/Bouton.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';


function Utilisateur() {

    const token=sessionStorage.getItem("token");

    const [showInscription, setShowInscription] = useState(false);
    const [showMotDePasseOublie, setShowMotDePasseOublie] = useState(false);
    const [email, setEmail] = useState('');
    const [motDePasse, setMotDePasse] = useState('');
    const [role, setRole] = useState('');
    const [personnel, setPersonnel] = useState('');
    const [matricule, setMatricule] = useState('');
    const [nouveauMotDePasse, setNouveauMotDePasse] = useState('');
    const [codeVerification, setCodeVerification] = useState('');

    const [roleData, setRoleData] = useState([]);
    const [personnelData, setPersonnelData] = useState([]);
    const [demandesAttente, setDemandesAttente] = useState([]);
    const [demandesUtilisateur, setDemandesUtilisateur] = useState([]);
    const [demandesVerifiees, setDemandesVerifiees] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [selectedDemande, setSelectedDemande] = useState(null);
    const apiUrl = process.env.REACT_APP_API_URL;
    const ajouterUtilisateur = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(
                `${apiUrl}/utilisateur/insertion_utilisateur`,
                {
                    id_personnel: personnel,
                    pswd: motDePasse,
                    id_role: role
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`

                    },
                }
            );
            toast.success('Utilisateur ajouté avec succès!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            // Réinitialiser les champs du formulaire
            setPersonnel('');
            setMotDePasse('');
            setRole('');
        } catch (error) {
            toast.error('Erreur lors de l\'ajout de l\'utilisateur!', {
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

    const selectAll_Role = async () => {
        try {
            const response = await axios.get(`${apiUrl}/role/selectAll_role`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setRoleData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };

    const selectAll_Personnel = async () => {
        try {
            const response = await axios.get(`${apiUrl}/personnel/selectAll_personnel`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setPersonnelData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des personnels', error);
        }
    };

    const selectDemandesAttente = async () => {
        try {
            const response = await axios.get(`${apiUrl}/Demande_validation/select_demande_attente`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setDemandesAttente(response.data.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des demandes en attente', error);
            toast.error('Erreur lors de la récupération des demandes en attente');
        }
    };
    const selectDemandesutilisateur = async () => {
        try {
            const response = await axios.get(`${apiUrl}/Inscription/Demande_validation_inscription`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setDemandesUtilisateur(response.data.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des demandes en attente', error);
            toast.error('Erreur lors de la récupération des demandes en attente');
        }
    };

    const selectDemandesVerifiees = async () => {
        try {
            const response = await axios.get(`${apiUrl}/Demande_validation/select_demande_verifier`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setDemandesVerifiees(response.data.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des demandes vérifiées', error);
            toast.error('Erreur lors de la récupération des demandes vérifiées');
        }
    };

    const handleInscription = () => {
        setShowInscription(prevState => !prevState);
        setShowMotDePasseOublie(false);
        if (!showInscription) {
            selectDemandesVerifiees();
        }
    };

    const handleMotDePasseOublie = () => {
        setShowInscription(false);
        setShowMotDePasseOublie(true);
    };

    const handleResetPassword = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(
                `${apiUrl}/utilisateur/mdp_oublier`,
                {
                    matricule: matricule,
                    pswd: nouveauMotDePasse,
                    verifier: codeVerification
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`

                    },
                }
            );
            
            if (response.data.data === "Code de verification incorrecte") {
                toast.error('Code de vérification incorrect');
            } else if (response.data.data === "Cette mstricule n'exciste pas") {
                toast.error('Ce matricule n\'existe pas');
            } else {
                toast.success('Mot de passe réinitialisé avec succès');
                setShowMotDePasseOublie(false);
            }
        } catch (error) {
            console.error('Erreur lors de la réinitialisation du mot de passe', error);
            toast.error('Erreur lors de la réinitialisation du mot de passe');
        }
    };

    const handleShowModal = (demande) => {
        setSelectedDemande(demande);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedDemande(null);
        setCodeVerification('');
    };

    const handleCodeVerification = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(
                `${apiUrl}/Demande_validation/code_verification`,
                {
                    user: selectedDemande.id_demande_validation.toString(),
                    code: codeVerification
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`

                    },
                }
            );
            toast.success('Code de vérification envoyé avec succès!');
            handleCloseModal();
            selectDemandesAttente(); // Rafraîchir la liste des demandes
        } catch (error) {
            console.error('Erreur lors de l\'envoi du code de vérification', error);
            toast.error('Erreur lors de l\'envoi du code de vérification');
        }
    };
    const Validation = async ( users) => {
        try {
            const response = await axios.post(
                `${apiUrl}/Inscription/validation`,
                {
                    id: users
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`

                    },
                }
            );
            toast.success('Nouveau Utilisateur');
            selectDemandesutilisateur(); // Rafraîchir la liste des demandes
        } catch (error) {
            console.error('Erreur lors de l\'envoi du code de vérification', error);
            toast.error('Erreur lors de l\'envoi du code de vérification');
        }
    };

    useEffect(() => {
        // selectAll_Refuser();
        selectAll_Role();
        selectAll_Personnel();
        selectDemandesAttente();
        selectDemandesutilisateur();
    }, []);

    return (
        <div className="menu-container">
            <Top />
            <div className="main-content">
                <Nav />
                <div className="content">
                    <div className="button-container">
                        <button className="menu-button" onClick={handleInscription}>
                            {showInscription ? "Masquer les demandes" : "Demande effectuée"}
                        </button>
                        {/* <button className="menu-button" onClick={handleMotDePasseOublie}>Mot de passe oublié</button> */}
                    </div>

                    {showInscription && (
                        <div className="table-container">
                            <h3>Demandes vérifiées</h3>
                            <table className="table table-striped table-hover table-bordered">
                                <thead className="table-primary">
                                    <tr>
                                        <th>Numero</th>
                                        <th>Date</th>
                                        <th>Utilisateur</th>
                                        <th>Direction</th>
                                        <th>Service</th>
                                        <th>Poste</th>
                                        <th>Code de vérification</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {demandesVerifiees.length > 0 ? (
                                        demandesVerifiees.map(demande => (
                                            <tr key={demande.id_demande_validation}>
                                                <td>{demande.id_demande_validation}</td>
                                                <td>{demande.dates}</td>
                                                <td>{demande.id_utilisateur.id_personnel.nom}</td>
                                                <td>{demande.id_utilisateur.id_personnel.id_fonction.nom_fonction}</td>
                                                <td>{demande.id_utilisateur.id_personnel.id_service.nom_service}</td>
                                                <td>{demande.id_utilisateur.id_personnel.id_poste.nom}</td>
                                                <td>{demande.verifier}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7">Aucune demande vérifiée</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {showMotDePasseOublie && (
                        <div className="form-container">
                            <h2>Mot de passe oublié</h2>
                            <form onSubmit={handleResetPassword}>
                                <label>Matricule:</label>
                                <input
                                    type="text"
                                    value={matricule}
                                    onChange={(e) => setMatricule(e.target.value)}
                                    required
                                />
                                <label>Nouveau mot de passe:</label>
                                <input
                                    type="password"
                                    value={nouveauMotDePasse}
                                    onChange={(e) => setNouveauMotDePasse(e.target.value)}
                                    required
                                />
                                <label>Code de vérification:</label>
                                <input
                                    type="text"
                                    value={codeVerification}
                                    onChange={(e) => setCodeVerification(e.target.value)}
                                    required
                                />
                                <button className="menu-button" type="submit">Réinitialiser le mot de passe</button>
                            </form>
                        </div>
                    )}

                    <div className="table-container">
                        <h3>Demandes en attente mots de passe oubliés</h3>
                        <table className="table table-striped table-hover table-bordered">
                            <thead className="table-primary">
                                <tr>
                                    <th>Numero</th>
                                    <th>Date</th>
                                    <th>Utilisateur</th>
                                    <th>Direction</th>
                                    <th>Service</th>
                                    <th>Poste</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {demandesAttente.length > 0 ? (
                                    demandesAttente.map(demande => (
                                        <tr key={demande.id_demande_validation}>
                                            <td>{demande.id_demande_validation}</td>
                                            <td>{demande.dates}</td>
                                            <td>{demande.id_utilisateur.id_personnel.nom}</td>
                                            <td>{demande.id_utilisateur.id_personnel.id_fonction.nom_fonction}</td>
                                            <td>{demande.id_utilisateur.id_personnel.id_service.nom_service}</td>
                                            <td>{demande.id_utilisateur.id_personnel.id_poste.nom}</td>
                                            <td>
                                                <button 
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => handleShowModal(demande)}
                                                >
                                                    Update
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7">Aucune demande en attente</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="table-container">
                        <h3>Demandes en attente nouvel Utilisateur</h3>
                        <table className="table table-striped table-hover table-bordered">
                            <thead className="table-primary">
                                <tr>
                                    <th>Numero</th>
                                    <th>Nom</th>
                                    <th>Matricule</th>
                                    <th>Direction</th>
                                    <th>Service</th>
                                    <th>Poste</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {demandesUtilisateur.length > 0 ? (
                                    demandesUtilisateur.map(demande => (
                                        <tr key={demande.id_inscription}>
                                            <td>{demande.id_inscription}</td>
                                            <td>{demande.nom}</td>
                                            <td>{demande.matricule}</td>
                                            <td>{demande.id_fonction.nom_fonction}</td>
                                            <td>{demande.id_service.nom_service}</td>
                                            <td>{demande.id_poste.nom}</td>
                                            <td>
                                                <button 
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => Validation(demande.id_inscription)}
                                                >
                                                    Valider
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7">Aucune demande en attente</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <Modal show={showModal} onHide={handleCloseModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Entrer le code de vérification</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form onSubmit={handleCodeVerification}>
                                <div className="mb-3">
                                    <label htmlFor="codeVerification" className="form-label">Code de vérification</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="codeVerification"
                                        value={codeVerification}
                                        onChange={(e) => setCodeVerification(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button variant="primary" type="submit">
                                    Envoyer
                                </Button>
                            </form>
                        </Modal.Body>
                    </Modal>

                    <ToastContainer />
                </div>
            </div>
        </div>
    );
}

export default Utilisateur;
