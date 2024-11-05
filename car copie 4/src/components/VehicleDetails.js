import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/VehicleDetails.css';

function VehicleDetails() {
    const { immatriculation } = useParams();
    const navigate = useNavigate();

    // Simuler la récupération des détails du véhicule en fonction de l'immatriculation
    const vehicleDetails = {
        modele: 'Toyota Corolla',
        typeVehicule: 'Voiture',
        immatriculation: immatriculation,
        photo: 'https://via.placeholder.com/150',
        kilometrage: '120,000 km',
        nombrePlaces: 5,
        nombrePortes: 4,
        anneeModele: 2018,
        typeCarburant: 'Essence',
        typeTransmission: 'Automatique',
        dernierKilometrage: '119,500 km',
        entretienOuReparation: 'Entretien',
        remarque: 'Changement d\'huile nécessaire'
    };

    const handleReturn = () => {
        navigate('/menu');
    };

    const handleValidate = () => {
        // Logique de validation
        navigate('/menu');
    };

    const handleReject = () => {
        // Logique de rejet
        navigate('/menu');
    };

    return (
        <div className="vehicle-details-container">
            <header className="top-menu">
                <div className="top-menu-left">
                    <h1>Garage</h1>
                </div>
                <div className="top-menu-right">
                    <a href="#" className="menu-item">Contact</a>
                    <a href="#" className="menu-item">Notifications</a>
                    <a href="#" className="menu-item">Deconnexion</a>
                </div>
            </header>
            <div className="main-content">
                <nav className="side-navbar">
                    <ul>
                        <li><a href="#" className="dashboard">Dashboard</a></li>
                        <li><a href="#" className="demandes-hover">Demandes en attentes</a></li>
                        <li><a href="#" className="constatation-hover">Constatation Technique</a></li>
                        <li><a href="#" className="marcher-hover">Marcher</a></li>
                        <li><a href="#" className="rendezvous-hover">Rendez-vous Prise en Charge</a></li>
                    </ul>
                </nav>
                <div className="content">
                    <button className="back-button" onClick={handleReturn}>Retour</button>
                    <br></br>
                    <br></br>
                    <center><h2>Détails du véhicule</h2></center>
                    <div className="vehicle-details">
                        <img src={vehicleDetails.photo} alt="Photo du véhicule" className="vehicle-photo" />
                        <p><strong>Modèle / Marque:</strong> {vehicleDetails.modele}</p>
                        <p><strong>Type de Véhicule:</strong> {vehicleDetails.typeVehicule}</p>
                        <p><strong>Immatriculation:</strong> {vehicleDetails.immatriculation}</p>
                        <p><strong>Kilométrage:</strong> {vehicleDetails.kilometrage}</p>
                        <p><strong>Nombre de Places:</strong> {vehicleDetails.nombrePlaces}</p>
                        <p><strong>Nombre de Portes:</strong> {vehicleDetails.nombrePortes}</p>
                        <p><strong>Année de Modèle:</strong> {vehicleDetails.anneeModele}</p>
                        <p><strong>Type de Carburant:</strong> {vehicleDetails.typeCarburant}</p>
                        <p><strong>Type de Transmission:</strong> {vehicleDetails.typeTransmission}</p>
                        <p><strong>Dernier Kilométrage:</strong> {vehicleDetails.dernierKilometrage}</p>
                        <p><strong>Entretien ou Réparation:</strong> {vehicleDetails.entretienOuReparation}</p>
                        <p><strong>Remarque:</strong> {vehicleDetails.remarque}</p>
                    </div>
                    <div className="button-container">
                        <button className="validate-button" onClick={handleValidate}>Valider</button>
                        <button className="reject-button" onClick={handleReject}>Rejeter</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VehicleDetails;
