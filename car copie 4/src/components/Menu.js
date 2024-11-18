import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Menu.css';
import Top from './TopMenu';
import Nav from './Nav';
import Bouton from './Bouton';



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
            <Top />
                <div className="main-content">
                    <Nav />
                        <div className="content">
                            Bienvenue sur Car Management 2.0
                        </div>
                </div>
        </div>
    ); 
}

export default Menu;
