import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordReset, setIsPasswordReset] = useState(false);
    const [showResetRequest, setShowResetRequest] = useState(false);
    const [showNewPasswordForm, setShowNewPasswordForm] = useState(false);
    const [resetMessage, setResetMessage] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const navigate = useNavigate();

    const Authentification = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`http://localhost:8080/Login/checking`, 
                { matricule: email, pswd: password }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            
            if (response.data && response.data.data) {
                const userData = response.data.data;
                    sessionStorage.setItem('token', userData);
                navigate('/menu');
            } else {
                throw new Error('Structure de réponse invalide');
            }
        } catch (error) {
            console.error('Erreur de Vérification', error);
            alert('Erreur de connexion. Veuillez vérifier vos identifiants et réessayer.');
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
            console.log(email);
            const response = await axios.post('http://localhost:8080/Demande_validation/InsertionDemande_validation', 
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
            console.log("Données envoyées:", email,
                 newPassword,
                 verificationCode
            );
            const response = await axios.post('http://localhost:8080/utilisateur/mdp_oublier', 
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

            console.log("Réponse reçue:", response.data);

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

    return (
        <div className="containerlogin d-flex flex-column align-items-center justify-content-center vh-100">
            <div className="d-flex justify-content-center w-100">
                {!isPasswordReset && (
                    <div className="card shadow-lg p-4 me-3" style={{ maxWidth: '400px', width: '100%' }}>
                        <h2 className="text-center mb-4">S\'identifier</h2>
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
                    <span> Adresse : 123 Rue Exemple, Ville, Pays</span>
                </div>
                <div className="contact-item">
                    <i className="fas fa-phone-alt"></i>
                    <span> Téléphone : +123 456 7890</span>
                </div>
                <div className="contact-item">
                    <i className="fas fa-envelope"></i>
                    <span> Email : contact@entreprise.com</span>
                </div>
            </div>
        </div>
    );
}

export default Login;
