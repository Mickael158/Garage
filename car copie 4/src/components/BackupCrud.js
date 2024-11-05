import React, { useState , useEffect} from 'react';
import { Link } from 'react-router-dom';
import '../styles/Crud.css';
import axios from 'axios';

function Crud() {
    const [activeForm, setActiveForm] = useState(null);
    const [data, setData] = useState('');
    const [fonctionData, setFonctionData] = useState([]);


    const handleFormDisplay = (formName) => {
        setActiveForm(formName);
    };


    const fonction = async (event) => {
        event.preventDefault();
        try {
            
          const response = await axios.post(`http://localhost:8080/Fonction/insertion_Fonction`, 
            { nom_fonction: data }, {
            headers: {
              'content-Type': 'application/json',
            },
          });
          console.log('ok', response.data);
        } catch (error) {
          console.error('Erreur de Verification', error);
        }
      };

      const fetchFonctionData = async () => {
        try {
            const response = await axios.get('http://localhost:8080/Fonction/selectAll_Fonction');
            setFonctionData(response.data);
            console.log(fonctionData);
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };

    useEffect(() => {
        fetchFonctionData();
    }, []);
    
    


    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Formulaire soumis avec succès!');
    };

    // const handleDelete = (formName, id) => {
    //     setData(prevData => ({
    //         ...prevData,
    //         [formName]: prevData[formName].filter(item => item.id !== id)
    //     }));
    // };


    const renderTables = () => {
        return (
                <table>
                    <thead>
                        <tr>
                            <th>aaa</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        Array.isArray(fonctionData)
                        ?
                            (
                                fonctionData.map
                                (item => 
                                    (
                                        <tr key={item.id}>
                                                <td>{item.nom_fonction}</td>
                                                <td>
                                                {/* <button onClick={() => handleDelete('Fonction', item.id)}>Supprimer</button> */}
                                                </td>
                                        </tr>
                                    )
                                ) ):(<tr>aaaa</tr>)
                                
                            
                    }
                    </tbody>
                </table>
            );
    
        
    };
    

    const renderTablest = () => {
        return 
        (

            <table>
                <thead>
                </thead>
                <tbody>
                    {
                        Array.isArray(fonctionData)
                        ?
                            (
                                fonctionData.map
                                (item => 
                                    (
                                        <tr key={item.id}>
                                                <td>{item.nom_fonction}</td>
                                                <td>
                                                {/* <button onClick={() => handleDelete('Fonction', item.id)}>Supprimer</button> */}
                                                </td>
                                        </tr>
                                    )
                                ) ):(<tr>aaaa</tr>)
                                
                            
                    }
                </tbody>
            </table>
        );
    };
    

    const renderForm = () => {
        switch (activeForm) {
           case 'Fonction':
    return (
        <>
            <form onSubmit={fonction}>
                <label>Nom Fonction:</label>
                <input
                    type="text"
                    placeholder="Insérer nom Fonction"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    required
                />
                <button type="submit">Valider</button>
            </form>
            {renderTables()}
        </>
    );

            case 'Service':
                return (
                    <>
                        <form onSubmit={handleSubmit}>
                            <label>Nom du Service:</label>
                            <input type="text" placeholder="Insérer nom Service" required />
                            <button type="submit">Valider</button>
                        </form>
                        {/* {renderTable('Service')} */}
                    </>
                );
            case 'Type de Lieu':
                return (
                    <>
                        <form onSubmit={handleSubmit}>
                            <label>Nom du Lieu:</label>
                            <input type="text" placeholder="Insérer nom Lieu" required />
                            <button type="submit">Valider</button>
                        </form>
                        {/* {renderTable('Type de Lieu')} */}
                    </>
                );
            case 'Transmission':
                return (
                    <>
                        <form onSubmit={handleSubmit}>
                            <label>Nom de la Transmission:</label>
                            <input type="text" placeholder="Insérer nom Transmission" required />
                            <button type="submit">Valider</button>
                        </form>
                        {/* {renderTable('Transmission')} */}
                    </>
                );
            case 'Energie':
                return (
                    <>
                        <form onSubmit={handleSubmit}>
                            <label>Nom de l'Énergie:</label>
                            <input type="text" placeholder="Insérer nom Énergie" required />
                            <label>ID Carburant:</label><br />
                            <select required>
                                <option value="">Sélectionner ID Carburant</option>
                                <option value="1">Carburant 1</option>
                                <option value="2">Carburant 2</option>
                            </select><br /><br />
                            <button type="submit">Valider</button>
                        </form>
                        {/* {renderTable('Energie')} */}
                    </>
                );
            case 'Marque Voiture':
                return (
                    <>
                        <form onSubmit={handleSubmit}>
                            <label>Nom de la Marque:</label>
                            <input type="text" placeholder="Insérer nom Marque" required />
                            <button type="submit">Valider</button>
                        </form>
                        {/* {renderTable('Marque Voiture')} */}
                    </>
                );
            case 'Model Voiture':
                return (
                    <>
                        <form onSubmit={handleSubmit}>
                            <label>Nom du Modèle:</label>
                            <input type="text" placeholder="Insérer nom Modèle" required />
                            <label>ID Marque:</label><br />
                            <select required>
                                <option value="">Sélectionner ID Marque</option>
                                <option value="1">Marque 1</option>
                                <option value="2">Marque 2</option>
                            </select><br /><br />
                            <button type="submit">Valider</button>
                        </form>
                        {/* {renderTable('Model Voiture')} */}
                    </>
                );
            case 'Voiture':
                return (
                    <>
                        <form onSubmit={handleSubmit}>
                            <label>Immatriculation:</label>
                            <input type="text" placeholder="Insérer Immatriculation" required />
                            <label>Nombre de Place:</label>
                            <input type="number" placeholder="Nombre de places" required />
                            <label>ID Fonction:</label>
                            <select required>
                                <option value="">Sélectionner ID Fonction</option>
                                <option value="1">Fonction 1</option>
                                <option value="2">Fonction 2</option>
                            </select><br />
                            <label>ID Transmission:</label>
                            <select required>
                                <option value="">Sélectionner ID Transmission</option>
                                <option value="1">Transmission 1</option>
                                <option value="2">Transmission 2</option>
                            </select><br />
                            <label>ID Carburant:</label>
                            <select required>
                                <option value="">Sélectionner ID Carburant</option>
                                <option value="1">Carburant 1</option>
                                <option value="2">Carburant 2</option>
                            </select><br />
                            <label>ID Service:</label>
                            <select required>
                                <option value="">Sélectionner ID Service</option>
                                <option value="1">Service 1</option>
                                <option value="2">Service 2</option>
                            </select>
                            <label>ID Modèle:</label>
                            <select required>
                                <option value="">Sélectionner ID Modèle</option>
                                <option value="1">Modèle 1</option>
                                <option value="2">Modèle 2</option>
                            </select><br /><br />
                            <button type="submit">Valider</button>
                        </form>
                        {/* {renderTable('Voiture')} */}
                    </>
                );
            case 'Rôle':
                return (
                    <>
                        <form onSubmit={handleSubmit}>
                            <label>Nom du Rôle:</label>
                            <input type="text" placeholder="Insérer nom Rôle" required />
                            <button type="submit">Valider</button>
                        </form>
                        {/* {renderTable('Rôle')} */}
                    </>
                );
            case 'Personnel':
                return (
                    <>
                        <form onSubmit={handleSubmit}>
                            <label>Nom du Personnel:</label>
                            <input type="text" placeholder="Insérer nom Personnel" required />
                            <label>Matricule:</label>
                            <input type="text" placeholder="Insérer Matricule" required />
                            <label>ID Fonction:</label>
                            <select required>
                                <option value="">Sélectionner ID Fonction</option>
                                <option value="1">Fonction 1</option>
                                <option value="2">Fonction 2</option>
                            </select><br /><br />
                            <label>ID Service:</label>
                            <select required>
                                <option value="">Sélectionner ID Service</option>
                                <option value="1">Service 1</option>
                                <option value="2">Service 2</option>
                            </select><br /><br />
                            <button type="submit">Valider</button>
                        </form>
                        {/* {renderTable('Personnel')} */}
                    </>
                );
            case 'Utilisateur':
                return (
                    <>
                        <form onSubmit={handleSubmit}>
                            <label>Mot de Passe:</label>
                            <input type="password" placeholder="Insérer mot de passe" required />
                            <label>Nom Utilisateur:</label>
                            <input type="text" placeholder="Insérer nom Utilisateur" required /><br />
                            <label>ID Refuser:</label>
                            <select required>
                                <option value="">Sélectionner ID Refuser</option>
                                <option value="1">Refuser 1</option>
                                <option value="2">Refuser 2</option>
                            </select><br />
                            <label>ID Rôle:</label>
                            <select required>
                                <option value="">Sélectionner ID Rôle</option>
                                <option value="1">Rôle 1</option>
                                <option value="2">Rôle 2</option><br />
                            </select><br />
                            <label>ID Personnel:</label>
                            <select required>
                                <option value="">Sélectionner ID Personnel</option>
                                <option value="1">Personnel 1</option>
                                <option value="2">Personnel 2</option>
                            </select><br /><br />
                            <button type="submit">Valider</button>
                        </form>
                        {/* {renderTable('Utilisateur')} */}
                    </>
                );
            case 'Kilometrage':
                return (
                    <>
                        <form onSubmit={handleSubmit}>
                            <label>Nombre de Kilométrage:</label>
                            <input type="number" placeholder="Insérer nombre de Kilométrage" required />
                            <label>Date:</label>
                            <input type="date" required />
                            <label>ID Voiture:</label>
                            <select required>
                                <option value="">Sélectionner ID Voiture</option>
                                <option value="1">Voiture 1</option>
                                <option value="2">Voiture 2</option>
                            </select><br /><br />
                            <button type="submit">Valider</button>
                        </form>
                        {/* {renderTable('Kilometrage')} */}
                    </>
                );
            case 'Maintenance':
                return (
                    <>
                        <form onSubmit={handleSubmit}>
                            <label>Nom de la Maintenance:</label>
                            <input type="text" placeholder="Insérer nom Maintenance" required />
                            <button type="submit">Valider</button>
                        </form>
                        {/* {renderTable('Maintenance')} */}
                    </>
                );
            case 'Action':
                return (
                    <>
                        <form onSubmit={handleSubmit}>
                            <label>Nom de l'Action:</label>
                            <input type="text" placeholder="Insérer nom Action" required />
                            <button type="submit">Valider</button>
                        </form>
                        {/* {renderTable('Action')} */}
                    </>
                );
            case 'PV':
                return (
                    <>
                        <form onSubmit={handleSubmit}>
                            <label>Numéro PV:</label>
                            <input type="text" placeholder="Insérer numéro PV" required />
                            <label>Date:</label>
                            <input type="date" required />
                            <label>ID Voiture:</label>
                            <select required>
                                <option value="">Sélectionner ID Voiture</option>
                                <option value="1">Voiture 1</option>
                                <option value="2">Voiture 2</option>
                            </select><br /><br />
                            <button type="submit">Valider</button>
                        </form>
                        {/* {renderTable('PV')} */}
                    </>
                );
            case 'Facture':
                return (
                    <>
                        <form onSubmit={handleSubmit}>
                            <label>Date:</label>
                            <input type="date" required />
                            <label>Montant:</label>
                            <input type="number" placeholder="Insérer montant" required />
                            <label>ID Voiture:</label>
                            <select required>
                                <option value="">Sélectionner ID Voiture</option>
                                <option value="1">Voiture 1</option>
                                <option value="2">Voiture 2</option>
                            </select><br /><br />
                            <button type="submit">Valider</button>
                        </form>
                        {/* {renderTable('Facture')} */}
                    </>
                );
            case 'Recu':
                return (
                    <>
                        <form onSubmit={handleSubmit}>
                            <label>Date:</label>
                            <input type="date" required />
                            <label>Montant:</label>
                            <input type="number" placeholder="Insérer montant" required />
                            <label>ID Facture:</label>
                            <select required>
                                <option value="">Sélectionner ID Facture</option>
                                <option value="1">Facture 1</option>
                                <option value="2">Facture 2</option>
                            </select><br /><br />
                            <button type="submit">Valider</button>
                        </form>
                        {/* {renderTable('Recu')} */}
                    </>
                );
            case 'Reparation Voiture':
                return (
                    <>
                        <form onSubmit={handleSubmit}>
                            <label>Date:</label>
                            <input type="date" required />
                            <label>ID Voiture:</label>
                            <select required>
                                <option value="">Sélectionner ID Voiture</option>
                                <option value="1">Voiture 1</option>
                                <option value="2">Voiture 2</option>
                            </select><br />
                            <label>Description:</label>
                            <textarea placeholder="Décrire la réparation" required></textarea><br /><br />
                            <button type="submit">Valider</button>
                        </form>
                        {/* {renderTable('Reparation Voiture')} */}
                    </>
                );
            case 'Demande Prêt Voiture':
                return (
                    <>
                        <form onSubmit={handleSubmit}>
                            <label>Date de Demande:</label>
                            <input type="date" required />
                            <label>ID Voiture:</label>
                            <select required>
                                <option value="">Sélectionner ID Voiture</option>
                                <option value="1">Voiture 1</option>
                                <option value="2">Voiture 2</option>
                            </select><br />
                            <label>Durée du Prêt:</label>
                            <input type="number" placeholder="Nombre de jours" required /><br /><br />
                            <button type="submit">Valider</button>
                        </form>
                        {/* {renderTable('Demande Prêt Voiture')} */}
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="crud-container">
            <header className="top-menu">
                <div className="top-menu-left">
                    <h1>Car Management</h1>
                </div>
                <div className="top-menu-right">
                    <Link to="/accueil" className="menu-item">Accueil</Link>
                    <Link to="/menu" className="menu-item">Menu</Link>
                    <a href="#" className="menu-item">Notifications</a>
                    <a href="#" className="menu-item">Déconnexion</a>
                </div>
            </header>
            <div className="main-content">
                <nav className="side-navbar">
                    <ul>
                        <li><Link to="/Crud/Fonction" className="crud">CRUD</Link></li>
                        <li><a href="#" className="dashboard">Dashboard</a></li>
                        <li><a href="#" className="demandes-hover">Demandes en attentes</a></li>
                        <li><a href="#" className="constatation-hover">Constatation Technique</a></li>
                        <li><a href="#" className="marcher-hover">Marché</a></li>
                        <li><a href="#" className="rendezvous-hover">Rendez-vous Prise en Charge</a></li>
                    </ul>
                </nav>
                <div className="content">
                    <div className="button-group">
                        {[
                            'Fonction', 'Service', 'Type de Lieu', 'Transmission', 'Energie',
                            'Marque Voiture', 'Model Voiture', 'Voiture', 'Rôle', 'Personnel',
                            'Utilisateur', 'Kilometrage', 'Maintenance', 'Action', 'PV',
                            'Facture', 'Recu', 'Reparation Voiture', 'Demande Prêt Voiture'
                        ].map((item, index) => (
                            <button key={index} onClick={() => handleFormDisplay(item)}>{item}</button>
                        ))}
                    </div>
                    <div className="form-display">
                        {renderForm()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Crud;
