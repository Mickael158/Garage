import React from 'react';
import Top from './TopMenu';
import Nav from './Nav';
import '../styles/Menu.css';

function Test() {
    return (
        <div className="menu-container">
            <Top />
            <div className="main-content">
                <Nav />
                <div className="content">
                    <div className="content-header">
                        <h2>Welcome to the Menu Page</h2>
                        <button className="insert-vehicle-button">Insérer véhicule</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Test;
