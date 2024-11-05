import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Menu.css';



function Menu() {
    const [showTable, setShowTable] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const handleTableDisplay = (show) => {
        setShowTable(show);
    };

    const handleFormDisplay = () => {
        setShowForm(!showForm);
    };

    return (
        <div className="menu-container">
            <header className="top-menu">
                <div className="top-menu-left">
                    <h1>Car Management</h1>
                </div>
                <div className="top-menu-right">
                <Link to="/accueil" className="menu-item">Accueil</Link> 
                    <a href="" className="menu-item">Calendrier </a>
                    <a href="#" className="menu-item">Notifications</a>
                    <a href="#" className="menu-item">Deconnexion</a>
                </div>
                
            </header>
            <div className="main-content">
                <nav className="side-navbar">
                    <ul>
                        <li><Link to="/crud" className="crud">CRUD</Link></li>
                        <li><Link to="/fonction" className="crud">fonction</Link></li>
                        <li><a href="#" className="dashboard" onClick={() => handleTableDisplay(false)}>Dashboard</a></li>
                        <li><a href="#" className="demandes-hover" onClick={() => handleTableDisplay(true)}>Demandes en attentes</a></li>
                        <li><a href="#" className="constatation-hover" onClick={() => handleTableDisplay(true)}>Constatation Technique</a></li>
                        <li><a href="#" className="marcher-hover">Marcher</a></li>
                        <li><a href="#" className="rendezvous-hover">Rendez-vous Prise en Charge</a></li>
                    </ul>
                </nav>
                <div className="content">
                    <div className="content-header">
                        <h2>Welcome to the Menu Page</h2>
                        <button className="insert-vehicle-button" onClick={handleFormDisplay}>
                            Insérer véhicule
                        </button>
                    </div>
                    {showTable && (
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Immatriculation</th>
                                        <th>A propos</th>
                                        <th>Action</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1545 TBF</td>
                                        <td><Link to="/vehicle-details/1545TBF">Proccess en cours ...</Link></td>
                                        <td><i className="fas fa-check-circle action-icon validate-icon" title="Valider" onClick={() => {/* Logique pour valider */}}></i> <i>Valider</i> </td>
                                        <td><i className="fas fa-times-circle action-icon reject-icon" title="Rejeter" onClick={() => {/* Logique pour rejeter */}}></i> <i>Rejeter</i> </td>
                                    </tr>
                                    <tr>
                                        <td>7084 TAD</td>
                                        <td><Link to="/vehicle-details/7084TAD">Proccess en cours ...</Link></td>
                                        <td><i className="fas fa-check-circle action-icon validate-icon" title="Valider" onClick={() => {/* Logique pour valider */}}></i> <i>Valider</i> </td>
                                        <td><i className="fas fa-times-circle action-icon reject-icon" title="Rejeter" onClick={() => {/* Logique pour rejeter */}}></i> <i>Rejeter</i> </td>
                                    </tr>
                                    <tr>
                                        <td>3890 TBH</td>
                                        <td><Link to="/vehicle-details/3890TBH">Proccess en cours ...</Link></td>
                                        <td><i className="fas fa-check-circle action-icon validate-icon" title="Valider" onClick={() => {/* Logique pour valider */}}></i> <i>Valider</i> </td>
                                        <td><i className="fas fa-times-circle action-icon reject-icon" title="Rejeter" onClick={() => {/* Logique pour rejeter */}}></i> <i>Rejeter</i> </td>
                                    </tr>
                                    <tr>
                                        <td>7065 TCA</td>
                                        <td><Link to="/vehicle-details/7065TCA">Proccess en cours ...</Link></td>
                                        <td><i className="fas fa-check-circle action-icon validate-icon" title="Valider" onClick={() => {/* Logique pour valider */}}></i> <i>Valider</i> </td>
                                        <td><i className="fas fa-times-circle action-icon reject-icon" title="Rejeter" onClick={() => {/* Logique pour rejeter */}}></i> <i>Rejeter</i> </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
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

                </div>
            </div>
        </div>
    );
}

export default Menu;
