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
                            Insérer véhicule
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Menu;
