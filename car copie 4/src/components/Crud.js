import React from 'react';
import Top from './TopMenu';
import Nav from './Nav';
import Bouton from './Bouton';
import '../styles/Menu.css';
import '../styles/Form.css';

function Entretien() {
    return (
        <div className="menu-container">
            <Top />
            <div className="main-content">
                <Nav />
                <div className="content">
                <Bouton />
                </div>
            </div>
        </div>
    );
}

export default Entretien;
