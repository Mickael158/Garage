import React, { useState } from 'react';
import '../styles/Accueil.css';

function Accueil() {
    const [showForm, setShowForm] = useState(false);
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [vehicleReg, setVehicleReg] = useState('');
    const [submittedReg, setSubmittedReg] = useState('');
    
    const handleFormDisplay = () => {
        setShowForm(!showForm);
        setShowRequestForm(false); // Hide request form when showing the vehicle insertion form
    };

    const handleRequestFormDisplay = () => {
        setShowRequestForm(!showRequestForm);
        setShowForm(false); // Hide vehicle form when showing the request form
    };

    const handleRegChange = (e) => {
        setVehicleReg(e.target.value);
    };

    const handleRegSubmit = () => {
        setSubmittedReg(vehicleReg);
    };

    return (
        <div className="page-container">
            <header className="top-menu">
                <div className="top-menu-left">
                    <h1>Car Management</h1>
                </div>
                <div className="top-menu-right">
                    <a href="#" className="menu-item">Notifications</a>
                    <a href="#" className="menu-item">Déconnexion</a>
                </div>
            </header>

            <div className="main-content">
                <nav className="side-navbar">
                    <ul>
                        <li><a href="#" className="menu-item" onClick={handleFormDisplay}>Insérer une Voiture</a></li>
                        <li><a href="#" className="menu-item" onClick={handleRequestFormDisplay}>Faire une Demande</a></li>
                        <li><a href="#" className="menu-item">Les demandes faites</a></li>
                    </ul>
                </nav>
                
                <div className="content">
                    {showForm && (
                        <div className="form-container">
                            <h3>Insérer un nouveau véhicule</h3>
                            <form>
                                <label>Modèle / Marque:</label>
                                <input type="text" placeholder="Entrez le modèle ou la marque" />

                                <label>Type de Véhicule:</label>
                                <select>
                                    <option value="voiture">Voiture</option>
                                    <option value="moto">Moto</option>
                                </select>

                                <label>Immatriculation:</label>
                                <input type="text" placeholder="Entrez l'immatriculation" />

                                <label>Photo du véhicule:</label>
                                <input type="file" />

                                <label>Nombre de Places:</label>
                                <input type="number" placeholder="Entrez le nombre de places" />

                                <label>Nombre de portes:</label>
                                <input type="number" placeholder="Entrez le nombre de portes" />

                                <label>Année de modèle:</label>
                                <input type="number" placeholder="Entrez l'année de modèle" />

                                <label>Type de Carburant:</label>
                                <select>
                                    <option value="essence">Essence</option>
                                    <option value="diesel">Diesel</option>
                                    <option value="electrique">Electrique</option>
                                    <option value="hybride">Hybride</option>
                                </select>

                                <label>Type de transmission:</label>
                                <select>
                                    <option value="automatique">Automatique</option>
                                    <option value="manuelle">Manuelle</option>
                                </select>

                                <button type="submit">Ajouter Véhicule</button>
                            </form>
                        </div>
                    )}
                    
                    {showRequestForm && !submittedReg && (
                        <div className="request-container">
                            <h3>Faire une Demande de Réparation</h3>
                            <form>
                                <label>Insérer Immatriculation:</label>
                                <input 
                                    type="text" 
                                    placeholder="Entrez l'immatriculation" 
                                    value={vehicleReg}
                                    onChange={handleRegChange}
                                />
                                <button type="button" onClick={handleRegSubmit}>Soumettre</button>
                            </form>
                        </div>
                    )}

                    {showRequestForm && submittedReg && (
                        <div className="repair-request-container">
                            <h3>Demande Réparation</h3>
                            <p><strong>Immatriculation:</strong> {submittedReg}</p>
                            <p><strong>Date de la demande:</strong> {new Date().toLocaleDateString()}</p>

                            <h4>Informations du véhicule</h4>
                            <ul>
                                <li>Modèle / Marque: {/* Display data here */}</li>
                                <li>Type de Véhicule: {/* Display data here */}</li>
                                <li>Immatriculation: {submittedReg}</li>
                                <li>Photo: {/* Display image here */}</li>
                                <li>Kilométrage: {/* Display data here */}</li>
                                <li>Nombre de Places: {/* Display data here */}</li>
                                <li>Nombre de Portes: {/* Display data here */}</li>
                                <li>Année de Modèle: {/* Display data here */}</li>
                                <li>Type de Carburant: {/* Display data here */}</li>
                                <li>Type de Transmission: {/* Display data here */}</li>
                            </ul>

                            <label>Dernier Kilométrage:</label>
                            <input type="number" placeholder="Entrez le dernier kilométrage" />

                            {/* <label>Historique des interventions:</label>
                            <textarea placeholder="Entrez l'historique des interventions"></textarea> */}

                            <label>Réparation ou Entretien:</label>
                            <select>
                                <option value="reparation">Réparation</option>
                                <option value="entretien">Entretien Périodique</option>
                            </select>

                            <div className="options">
                                <h5>Réparation</h5>
                                <label>
                                    <input type="checkbox" /> Remplacement Pièces
                                </label>
                                <h5>Entretien Périodique</h5>
                                <label>
                                    <input type="checkbox" /> Remplacement courroie
                                </label>
                                <label>
                                    <input type="checkbox" /> Remplacement Plaquette
                                </label>
                                <label>
                                    <input type="checkbox" /> Remplacement Batterie
                                </label>
                                <label>
                                    <input type="checkbox" /> Vidange
                                </label>
                            </div>

                            <button type="submit">Soumettre Demande</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Accueil;
