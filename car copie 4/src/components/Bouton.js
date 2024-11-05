import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';import Top from './TopMenu';
import Nav from './Nav';
import '../styles/Bouton.css';

function Bouton() {
    const [showSubMenu, setShowSubMenu] = useState(false);

    const toggleSubMenu = () => {
        setShowSubMenu(!showSubMenu);
    };

    return (
                <div className="content">
                    <div className="button-container">
                        <button className="menu-button"><Link to="/fonction">Direction</Link></button>
                        <button className="menu-button"><Link to="/poste">Poste</Link></button>
                        <button className="menu-button"><Link to="/service">Service</Link></button>
                        <button className="menu-button"><Link to="/typelieu"> Type Lieu</Link></button>
                        <button className="menu-button"><Link to="/lieu">Lieu</Link></button>
                        <button className="menu-button"><Link to="/transmission">Transmission</Link></button>
                        <button className="menu-button"><Link to="/energie">Energie</Link></button>
                        <button className="menu-button"><Link to="/marque">Marque</Link></button>
                        <button className="menu-button"><Link to="/model">Modèle</Link></button>
                        <button className="menu-button"><Link to="/role">Rôle</Link></button>
                        <button className="menu-button"><Link to="/maintenance">Entretien</Link></button>
                        <button className="menu-button"><Link to="/action">Action</Link></button>
                        <button className="menu-button"><Link to="/systeme">Système</Link></button>
                        <button className="menu-button"><Link to="/defaillance">Défaillance</Link></button>
                        <button className="menu-button"><Link to="/voiture">Voiture</Link></button>
                        <button className="menu-button"><Link to="/concessionnaire">Concessionnaire</Link></button>
                        <button className="menu-button"><Link to="/designation">Désignation</Link></button>
                        <button className="menu-button"><Link to="/payement">Mode de Payement</Link></button>
                        <button className="menu-button"><Link to="/modif">Motif prêt Voiture </Link></button>
                        <button className="menu-button"><Link to="/personnel">Personnel</Link></button>
                        <button className="menu-button"><Link to="/typevoiture">Type de Voiture</Link></button>
                        <button className="menu-button"><Link to="/permis">Type de Permis </Link></button>
                        <button className="menu-button"><Link to="/chauffeur">chauffeur </Link></button>
                        <button className="menu-button"><Link to="/visitemedicale">Visite Médicale  </Link></button>
                        <button className="menu-button"><Link to="/indisponible">Motif Indisponible </Link></button>
                        <button className="menu-button"><Link to="/etatPiece">Etat des Pieces</Link></button>
                      </div>
                </div>
    );
}

export default Bouton;
