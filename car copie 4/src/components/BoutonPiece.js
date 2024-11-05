import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Bouton.css';

function BoutonPiece() {
    const [showSubMenu, setShowSubMenu] = useState(false);

    const toggleSubMenu = () => {
        setShowSubMenu(!showSubMenu);
    };

    return (
                <div className="content">
                    <div className="button-container">
                        <button className="menu-button"><Link to="/insertpieces">Inserer pièce </Link></button>
                        <button className="menu-button"><Link to="/sortiepieces">Sortie pièce</Link></button>
                      </div>
                </div>
    );
}

export default BoutonPiece;
