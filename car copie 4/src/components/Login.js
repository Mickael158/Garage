import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Login.css';

function Login() {

    const [email, setEmail] = useState('');
    const [fonctionData, setFonctionData] = useState([]);
    const [posteData, setPosteData] = useState([]);
    const [serviceData, setServiceData] = useState([]);
    const [password, setPassword] = useState('');
    const [isPasswordReset, setIsPasswordReset] = useState(false);
    const [showResetRequest, setShowResetRequest] = useState(false);
    const [showNewPasswordForm, setShowNewPasswordForm] = useState(false);
    const [ setResetMessage] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [showSignupForm, setShowSignupForm] = useState(false);
    const [nom, setNom] = useState('');
    const [idFonction, setIdFonction] = useState('');
    const [idService, setIdService] = useState('');
    const [idPoste, setIdPoste] = useState('');
    const navigate = useNavigate();

    const apiUrl = process.env.REACT_APP_API_URL;
    const Authentification = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${apiUrl}/Login/checking`, 
                { matricule: email, pswd: password }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            
            if (response.data && response.data.data) {
                const userData = response.data.data;
                    sessionStorage.setItem('token', userData);
                
                // if (userData.id_personnel) {
                //     if (userData.id_personnel.id_service) {
                //         sessionStorage.setItem('service', userData.id_personnel.id_service.id_service);
                //     }
                //     if (userData.id_personnel.id_fonction) {
                //         sessionStorage.setItem('fonction', userData.id_personnel.id_fonction.id_fonction);
                //     }
                //     if (userData.id_personnel.id_poste) {
                //         sessionStorage.setItem('poste', userData.id_personnel.id_poste.id_poste);
                //     }
                // }
                // if (userData.id_role) {
                //     sessionStorage.setItem('role', userData.id_role.id_role);
                // }

                
                navigate('/menu');
            } else {
                throw new Error('Structure de réponse invalide');
            }
        } catch (error) {
            console.error('Erreur de Vérification', error);
            // Afficher un message d'erreur à l'utilisateur
            alert('Erreur de connexion. Veuillez vérifier vos identifiants et réessayer.');
        }
    };
    const selectAll_Fonction = async () => {
        try {
            const response = await axios.get(`${apiUrl}/Fonction/selectAll_Fonction`,
                {}
            );
            setFonctionData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };
    const selectAll_Service = async () => {
        try {
            const response = await axios.get(`${apiUrl}/Service/selectAll_service`,
                {}
            );
            // Pour vérifier la structure des données
            setServiceData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };
    const selectAllPoste = async () => {
        try {
            const response = await axios.get(`${apiUrl}/Poste/selectAll_Poste`,
                {}
            );
            setPosteData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };

    const handleForgotPassword = () => {
        setIsPasswordReset(true);
        setShowResetRequest(false);
        setShowNewPasswordForm(false);
        setEmail('');
        setPassword('');
        setResetMessage('');
    };

    const showResetRequestForm = () => {
        setShowResetRequest(true);
        setShowNewPasswordForm(false);
    };

    const showNewPasswordFormFunc = () => {
        setShowResetRequest(false);
        setShowNewPasswordForm(true);
    };

    const handlePasswordReset = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${apiUrl}/Demande_validation/InsertionDemande_validation`, 
                { matricule: email },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            

            if (response.data && response.data.data) {
                alert("Demande de réinitialisation envoyée avec succès. Veuillez vérifier votre e-mail pour les instructions.");
                returnToLogin();
            } else {
                alert("Aucun utilisateur trouvé avec ce matricule. Veuillez vérifier et réessayer.");
            }
        } catch (error) {
            console.error('Erreur lors de la demande de réinitialisation', error);
            alert("Erreur lors de la demande de réinitialisation. Veuillez réessayer.");
        }
    };

    const handlePasswordResettwo = async (event) => {
        event.preventDefault();
        try {
            
            const response = await axios.post(`${apiUrl}/utilisateur/mdp_oublier`, 
                { matricule: email,
                    pswd: newPassword,
                    verifier: verificationCode

                 },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            

            if (response.data && response.data.data) {
                alert("Demande de réinitialisation envoyée avec succès. Veuillez vérifier votre e-mail pour les instructions.");
                returnToLogin();
            } else {
                alert("Aucun utilisateur trouvé avec ce matricule. Veuillez vérifier et réessayer.");
            }
        } catch (error) {
            console.error('Erreur lors de la demande de réinitialisation', error);
            alert("Erreur lors de la demande de réinitialisation. Veuillez réessayer.");
        }
    };

    const returnToLogin = () => {
        setIsPasswordReset(false);
        setShowResetRequest(false);
        setShowNewPasswordForm(false);
        setEmail('');
        setPassword('');
        setResetMessage('');
    };

    const showSignupFormFunc = () => {
        setShowSignupForm(true);
        setIsPasswordReset(false);
        setShowResetRequest(false);
        setShowNewPasswordForm(false);
    };

    const handleSignup = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${apiUrl}/Inscription/insertion_Inscription`, 
                { 
                    nom: nom,
                    matricule: email,
                    id_fonction: idFonction,
                    id_service: idService,
                    id_poste: idPoste,
                    pswd: password
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data && response.data.data) {
                alert("Inscription réussie !");
                returnToLogin();
            } else {
                alert("Erreur lors de l'inscription. Veuillez réessayer.");
            }
        } catch (error) {
            console.error('Erreur lors de l\'inscription', error);
            alert("Erreur lors de l'inscription. Veuillez réessayer.");
        }
    };

    useEffect(() => {
        selectAll_Fonction();
        selectAllPoste();
        selectAll_Service();
    }, []);

    return (
        <div className="containerlogin d-flex flex-column align-items-center justify-content-center vh-100">
            <div className="d-flex justify-content-center w-100">
                {!isPasswordReset && !showSignupForm && (
                    <div className="card shadow-lg p-4 me-3" style={{ maxWidth: '400px', width: '100%' }}>
                        <h2 className="text-center mb-4">S'identifier</h2>
                        <form onSubmit={Authentification}>
                            <div className="mb-3">
                                <label className="form-label"><i className="fas fa-user"></i> Immatriculation</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="Entrez votre immatriculation"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label"><i className="fas fa-lock"></i> Mot de passe</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="Entrez votre mot de passe"
                                />
                            </div>
                            <div className="d-grid">
                                <button type="submit" className="btn btn-primary">
                                    Se Connecter
                                </button>
                            </div>
                        </form>
                        <div className="text-center mt-2">
                            <a href="#" onClick={handleForgotPassword} className="text-decoration-none">Mot de passe oublié ?</a>
                        </div>
                        <div className="text-center mt-2">
                            <button onClick={showSignupFormFunc} className="btn btn-secondary">S'inscrire</button>
                        </div>
                    </div>
                )}

                {showSignupForm && (
                    <div className="card shadow-lg p-4 me-3" style={{ maxWidth: '400px', width: '100%' }}>
                        <h2 className="text-center mb-4">Inscription</h2>
                        <form onSubmit={handleSignup}>
                            <div className="mb-3">
                                <label className="form-label">Nom</label>
                                <input type="text" className="form-control" value={nom} onChange={(e) => setNom(e.target.value)} required placeholder="Entrez votre nom" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Matricule</label>
                                <input type="text" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Entrez votre matricule" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Direction</label>
                                <select className="form-select" value={idFonction} onChange={(e) => setIdFonction(e.target.value)} required>
                                    <option value="">Sélectionnez une fonction</option>
                                    {fonctionData.map(fonction => (
                                        <option key={fonction.id_fonction} value={fonction.id_fonction}>{fonction.nom_fonction}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Service</label>
                                <select className="form-select" value={idService} onChange={(e) => setIdService(e.target.value)} required>
                                    <option value="">Sélectionnez un service</option>
                                    {serviceData.map(service => (
                                        <option key={service.id_service} value={service.id_service}>{service.nom_service}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Fonction</label>
                                <select className="form-select" value={idPoste} onChange={(e) => setIdPoste(e.target.value)} required>
                                    <option value="">Sélectionnez un poste</option>
                                    {posteData.map(poste => (
                                        <option key={poste.id_poste} value={poste.id_poste}>{poste.nom}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Mot de Passe</label>
                                <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Entrez votre mot de passe" />
                            </div>
                            <div className="d-grid">
                                <button type="submit" className="btn btn-primary">S'inscrire</button>
                            </div>
                        </form>
                        <div className="text-center mt-3">
                            <a href="#" onClick={() => setShowSignupForm(false)} className="text-decoration-none">Retour à la connexion</a>
                        </div>
                    </div>
                )}

                {isPasswordReset && !showResetRequest && !showNewPasswordForm && (
                    <div className="card shadow-lg p-4 me-3" style={{ maxWidth: '400px', width: '100%' }}>
                        <h2 className="text-center mb-4">Réinitialisation du mot de passe</h2>
                        <div className="d-grid gap-2">
                            <button onClick={showResetRequestForm} className="btn btn-primary">
                                Demander une réinitialisation
                            </button>
                            <button onClick={showNewPasswordFormFunc} className="btn btn-secondary">
                                J'ai un code de vérification
                            </button>
                        </div>
                        <div className="text-center mt-3">
                            <a href="#" onClick={returnToLogin} className="text-decoration-none">Retour à la connexion</a>
                        </div>
                    </div>
                )}

                {showResetRequest && (
                    <div className="card shadow-lg p-4 me-3" style={{ maxWidth: '400px', width: '100%' }}>
                        <h2 className="text-center mb-4">Demande de réinitialisation</h2>
                        <form onSubmit={handlePasswordReset}>
                            <div className="mb-3">
                                <label className="form-label">Matricule</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="Entrez votre matricule"
                                />
                            </div>
                            <div className="d-grid">
                                <button type="submit" className="btn btn-primary">
                                    Envoyer la demande
                                </button>
                            </div>
                        </form>
                        <div className="text-center mt-3">
                            <a href="#" onClick={returnToLogin} className="text-decoration-none">Retour à la connexion</a>
                        </div>
                    </div>
                )}

                {showNewPasswordForm && (
                    <div className="card shadow-lg p-4" style={{ maxWidth: '400px', width: '100%' }}>
                        <h2 className="text-center mb-4">Réinitialiser le mot de passe</h2>
                        <form onSubmit={handlePasswordResettwo}>
                            <div className="mb-3">
                                <label className="form-label">Matricule</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="Entrez votre matricule"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Nouveau Mot de Passe</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    placeholder="Entrez le nouveau mot de passe"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Confirmation Nouveau Mot de passe</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    placeholder="Confirmez le nouveau mot de passe"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Code de vérification</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    required
                                    placeholder="Entrez le code de vérification"
                                />
                            </div>
                            <div className="d-grid">
                                <button type="submit" className="btn btn-primary">
                                    Réinitialiser le mot de passe
                                </button>
                            </div>
                        </form>
                        <div className="text-center mt-3">
                            <a href="#" onClick={returnToLogin} className="text-decoration-none">Retour à la connexion</a>
                        </div>
                    </div>
                )}
            </div>

            <div className="contact-info text-center mt-4">
                <div className="contact-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <span> Adresse : Immeuble MEF Antaninarenina</span>
                </div>
                <div className="contact-item">
                    <i className="fas fa-phone-alt"></i>
                    <span> Téléphone : +261 32 11 096 11 / +261 32 11 090 46</span>
                </div>
                <div className="contact-item">
                    <i className="fas fa-envelope"></i>
                    <span> Email : safdlog@gmail.com</span>
                </div>
            </div>
            <footer class="footer py-5">
                <h1 className="small mb-0 text-light">
                    &copy; <script>document.write(new Date().getFullYear())</script> Created With <i class="ti-heart text-light"></i> By <a href="https://www.linkedin.com/in/mickael-razafindrakoto-955873302/" target="_blank"><span class="text-danger" title="Bootstrap 4 Themes and Dashboards">RAZAFINDRAKOTO Georges Aimé Mickaël</span></a> 
                </h1>
            </footer>
            
        </div>
        
    );
}

export default Login;
