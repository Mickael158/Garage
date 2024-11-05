import Top from './TopMenu';
import Nav from './Nav';
import '../styles/Menu.css';
import '../styles/Form.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Modal, Button } from 'react-bootstrap';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Pagination } from 'react-bootstrap';
import Select from 'react-select';

function Proprietaire() {
    const token = sessionStorage.getItem('token');

    const [personnel, setPersonnel] = useState('');
    const [date, setDate] = useState('');
    const [voiture, setVoiture] = useState('');
    const [idProprietaire, setProprietaire] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedProprietaire, setSelectedProprietaire] = useState(null);
    const [showImportModal, setShowImportModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const [personnelData, setPersonnelData] = useState([]);
    const [proprietaireData, setProprietaireData] = useState([]);
    const [voitureData, setVoitureData] = useState([]); // Assurez-vous que c'est un tableau vide par défaut

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const [personnelOptions, setPersonnelOptions] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');

    const [pdfData, setPdfData] = useState({
        designation: '',
        numero: '',
        espece: '',
        prixUnitaire: '',
        quantite: '',
        valeurTotale: '', // Valeur totale sera calculée automatiquement
        provenance: '',
        etat: '',
        observation: ''
    });
    const [showPdfModal, setShowPdfModal] = useState(false);

    const [additionalFields, setAdditionalFields] = useState([]); // État pour les champs supplémentaires

    const handleAddField = () => {
        setAdditionalFields([...additionalFields, { designation: '', numero: '', espece: '', prixUnitaire: '', quantite: '', valeurTotale: '', provenance: '', etat: '', observation: '' }]);
    };

    const handleShowModal = (proprietaire) => {
        setProprietaire(proprietaire.id_proprietere_voiture);
        setSelectedProprietaire(proprietaire);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const enregistrerProprietaireEtGenererPdf = async (event) => {
        if (event) event.preventDefault(); // Vérifiez si l'événement est défini
        try {
            // Insérer les données du propriétaire
            const response = await axios.post('http://localhost:8080/Proprietere_voiture/insertion_Proprietere_voiture', {
                id_personnel: personnel,
                id_voiture: voiture,
                id_utilisateur: token,
                dates: date,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`

                },
            });
            toast.success('Données bien insérées!', { position: "top-right", autoClose: 3000 });
            selectAllProprietaire();

            // Remplir les données PDF avec les informations du personnel et de la voiture
            const selectedPersonnel = personnelData.find(p => p.id_personnel === personnel);
            const selectedVoiture = voitureData.find(v => v.id_voiture === voiture);

            if (selectedPersonnel) {
                setPdfData(prevData => ({
                    ...prevData,
                    service: selectedPersonnel.id_service.nom_service,
                    nomDetenteur: selectedPersonnel.nom, 
                    im: selectedPersonnel.matricule,
                    grade: selectedPersonnel.id_fonction.nom_fonction,
                    fonction: selectedPersonnel.id_poste ? selectedPersonnel.id_poste.nom : 'Non disponible'
                }));
            } else {
                toast.error('Personnel non trouvé!', { position: "top-right", autoClose: 3000 });
                return; // Sortir de la fonction si le personnel n'est pas trouvé
            }

            // Afficher le modal PDF
            handleShowPdfModal();

        } catch (error) {
            toast.error('Erreur lors de l\'insertion!', { position: "top-right", autoClose: 3000 });
        }
    };

    const rendreVoiture = async () => {
        try {
            const response = await axios.post('http://localhost:8080/Rendu_voiture/insertion_Rendu_voiture', {
                id_utilisateur: token,
                id_proprietere_voiture: idProprietaire,
                dates: date,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`

                },
            });
            toast.success('Voiture rendue avec succès!', { position: "top-right", autoClose: 3000 });
            handleCloseModal();
            selectAllProprietaire();
        } catch (error) {
            toast.error('Erreur lors du rendu!', { position: "top-right", autoClose: 3000 });
        }
    };

    const selectAllProprietaire = async () => {
        try {
            const response = await axios.get('http://localhost:8080/Proprietere_voiture/selectAll_voiture_have_proprietere',
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            if (response.data && Array.isArray(response.data.data)) {
                setProprietaireData(response.data.data);
            } else {
                console.error('Données de propriété non disponibles ou mal formatées', response.data);
            }
        } catch (error) {
            console.error('Erreur de récupération des données', error);
        }
    };

    const selectAll_Personnel = async () => {
        try {
            const response = await axios.get('http://localhost:8080/personnel/selectAll_personnel',
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setPersonnelData(response.data.data);
            // Créer les options pour react-select
            const options = response.data.data.map(pers => ({
                value: pers.id_personnel,
                label: pers.nom
            }));
            setPersonnelOptions(options);
        } catch (error) {
            console.error('Erreur de récupération des personnels', error);
        }
    };

    const selectAll_Voiture = async () => {
        try {
            const response = await axios.get('http://localhost:8080/voiture/SelectAll_voiture_not_proprietere',
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setVoitureData(response.data.data);
        } catch (error) {
            console.error('Erreur de récupération des voitures', error);
        }
    };


    const handleShowImportModal = () => {
        setShowImportModal(true);
    };

    const handleCloseImportModal = () => {
        setShowImportModal(false);
        setSelectedFile(null);
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleImport = async () => {
        if (!selectedFile) {
            toast.error('Veuillez sélectionner un fichier', { position: "top-right", autoClose: 3000 });
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axios.post(`http://localhost:8080/Import_proprietere_voiture/insertion_Import_proprietere_voiture/${selectedFile.name}/${token}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
            });
            toast.success('Importation réussie!', { position: "top-right", autoClose: 3000 });
            handleCloseImportModal();
            selectAllProprietaire();
        } catch (error) {
            toast.error('Erreur lors de l\'importation!', { position: "top-right", autoClose: 3000 });
        }
    };

    useEffect(() => {
        selectAll_Personnel();
        selectAll_Voiture();
        selectAllProprietaire();
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const filteredItems = proprietaireData.filter(proprietaire =>
        proprietaire.id_voiture && proprietaire.id_voiture.matricule.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Fonction pour ouvrir le modal PDF
    const handleShowPdfModal = () => {
        setShowPdfModal(true);
    };

    // Fonction pour fermer le modal PDF
    const handleClosePdfModal = () => {
        setShowPdfModal(false);
    };

    // Fonction pour générer le PDF
    const generatePdf = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        const pageWidth = doc.internal.pageSize.getWidth(); 

        // Titre
        doc.setFontSize(18);

        const titleLines = [
            "MINISTERE DE L'ECONOMIE ET DES FINANCES",
            "SECRETARIAT GENERAL",
            "DGBF"
        ];
        titleLines.forEach((line, index) => {
            const textWidth = doc.getTextWidth(line);
            const x = (pageWidth - textWidth) / 2; 
            doc.text(line, x, 10 + (index * 10)); // Ajuster la position Y
        });
        doc.setFontSize(11);

        const soustitre = [
            "                             ",
            "Service ........................................",
            "Dépositaire Comptable ......................................."
        ];
        soustitre.forEach((line, index) => {
            const textWidth = doc.getTextWidth(line);
            const x = (pageWidth - textWidth) / 2; 
            doc.text(line, x, 30 + (index * 10)); // Ajuster la position Y
        });
        // Section INVENTAIRE
        const inventoryLines = [
            "INVENTAIRE DE MATERIEL",
            "REMIS A UN DETENTEUR EFFECTIF"
        ];
        inventoryLines.forEach((line, index) => {
            const textWidth = doc.getTextWidth(line);
            const x = (pageWidth - textWidth) / 2; 
            doc.text(line, x, 60 + (index * 10)); // Ajuster la position Y
        });

        // Informations sur le dépositaire
        doc.setFontSize(10);

        const depositaireInfo = [
            `Nom, grade et fonction du dépositaire comptable : ................... `,
            `Nom du détenteur : ${pdfData.nomDetenteur}`,
            `IM : ${pdfData.im}`,
            `Grade : ${pdfData.grade}`,
            `Fonction : ${pdfData.fonction}`,
            `Adresse : ........................................`
        ];
        depositaireInfo.forEach((line, index) => {
            doc.text(line, 10, 80 + (index * 8)); // Ajuster la position Y (inter-lignes plus serrées)
        });

        // Table des objets
        const tableColumn = ["Désignation détaillée des objets", "Numéro des objets", "Espèce d'un", "Prix Unitaire (Ariary)", "Quantité", "Valeur totale", "Provenance", "État des objets", "Observations"];
        const tableRows = [
            [pdfData.designation, pdfData.numero, pdfData.espece, pdfData.prixUnitaire, pdfData.quantite, pdfData.valeurTotale, pdfData.provenance, pdfData.etat, pdfData.observation],
            ...additionalFields.map(field => [field.designation, field.numero, field.espece, field.prixUnitaire, field.quantite, field.valeurTotale, field.provenance, field.etat, field.observation]) // Ajout des champs supplémentaires
        ];

        // Calculer la somme des valeurs totales
        const totalValeurTotale = tableRows.reduce((acc, row) => acc + (parseFloat(row[5]) || 0), 0); // row[5] correspond à la valeur totale

        doc.autoTable(tableColumn, tableRows, { startY: 130 });

        // Total
        const lastY = doc.lastAutoTable.finalY; // Position Y de la dernière ligne de la table
        doc.text("TOTAL", 10, lastY + 10);
        doc.setFontSize(10);
        doc.text(totalValeurTotale.toString(), 150, lastY + 10); // Insérer la somme calculée

        // Convertir le total en lettres et l'afficher
        const totalEnLettres = numberToWords(totalValeurTotale);
        // doc.text(`Total en lettres : ${totalEnLettres}`, 10, lastY + 20);

        // Arrêté le présent inventaire
        doc.text(`Arrêté le présent inventaire à ........ ARTICLE évalué à la somme de ${totalEnLettres} ARIARY`, 10, lastY + 20);

        // Instruction générale
        
        doc.text("Suivant INSTRUCTION GENERALE du 22 juillet 1955 sur la COMPTABILITÉ DES MATIERES, Titre II, Chapitre II :", 10, lastY + 30);
        const text = "Art. 26. – Dès qu'ils ont constaté la perte ou la disparition du matériel, les détenteurs doivent en rendre compte au dépositaire comptable dudit matériel et au chef de service...";
        const maxWidth = pageWidth - 20; // Largeur maximale (ajuster selon les marges)
        const lines = doc.splitTextToSize(text, maxWidth); // Diviser le texte en plusieurs lignes

        let yPosition = lastY + 40; // Position Y initiale
        lines.forEach((line) => {
            const textWidth = doc.getTextWidth(line);
            const x = (pageWidth - textWidth) / 2; // Centrer chaque ligne
            doc.text(line, x, yPosition); // Ajouter la ligne au PDF
            yPosition += 5; // Ajuster la position Y pour l'interligne
        });

        // Reconnaissance
        doc.text("Reconnu exacte en quantités et qualité.", 10, lastY + 57);

        // Table de signature
        const signatureY = lastY + 65;
        doc.text("Le Gestionnaire d'activités", 10, signatureY);
        doc.text("Antananarivo, le ..................", 150, signatureY);
        doc.text("........................................", 10, signatureY + 10);
        doc.text("Le Dépositaire comptable", 150, signatureY + 10);
        doc.text("Le Détenteur", 10, signatureY + 20);
        doc.text("........................................", 150, signatureY + 20);

        doc.save("details_objets.pdf");
    };

    const handlePdfValidation = async () => {
        await enregistrerProprietaireEtGenererPdf(); // Appel de la fonction pour enregistrer le propriétaire
        generatePdf(); // Appel de la fonction pour générer le PDF
        handleClosePdfModal(); // Fermer le modal après la génération
    };

    return (
        <div className="menu-container">
            <Top />
            <div className="main-content">
                <Nav />
                <div className="content">
                <button className="btn btn-success" onClick={handleShowImportModal}>
                                Importation
                            </button><br></br>
                <Modal show={showPdfModal} onHide={handleClosePdfModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Générer PDF</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <div className="mb-3">
                                <label className="form-label">Désignation :</label>
                                <input type="text" className="form-control" value={pdfData.designation} onChange={(e) => setPdfData({ ...pdfData, designation: e.target.value })} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Numéro :</label>
                                <input type="number" className="form-control" value={pdfData.numero} onChange={(e) => setPdfData({ ...pdfData, numero: e.target.value })} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Espèce :</label>
                                <input type="text" className="form-control" value={pdfData.espece} onChange={(e) => setPdfData({ ...pdfData, espece: e.target.value })} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Prix Unitaire :</label>
                                <input type="number" className="form-control" value={pdfData.prixUnitaire} onChange={(e) => {
                                    setPdfData({ ...pdfData, prixUnitaire: e.target.value });
                                }} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Quantité :</label>
                                <input type="number" className="form-control" value={pdfData.quantite} onChange={(e) => {
                                    setPdfData({ ...pdfData, quantite: e.target.value });
                                }} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Valeur Totale :</label>
                                <input type="text" className="form-control" value={pdfData.valeurTotale} onChange={(e) => {
                                    setPdfData({ ...pdfData, valeurTotale: e.target.value }); // Mise à jour correcte de l'état
                                }} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Provenance :</label>
                                <input type="text" className="form-control" value={pdfData.provenance} onChange={(e) => setPdfData({ ...pdfData, provenance: e.target.value })} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">État :</label>
                                <input type="text" className="form-control" value={pdfData.etat} onChange={(e) => setPdfData({ ...pdfData, etat: e.target.value })} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Observation :</label>
                                <input type="text" className="form-control" value={pdfData.observation} onChange={(e) => setPdfData({ ...pdfData, observation: e.target.value })} required />
                            </div>
                            <button type="button" className="btn btn-secondary" onClick={handleAddField}> +add </button> {/* Bouton pour ajouter un champ */}
                            
                            {additionalFields.map((field, index) => (
                                <div key={index}>
                                    <div className="mb-3">
                                        <label className="form-label">Désignation :</label>
                                        <input type="text" className="form-control" value={field.designation} onChange={(e) => {
                                            const newFields = [...additionalFields];
                                            newFields[index].designation = e.target.value;
                                            setAdditionalFields(newFields);
                                        }} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Numéro :</label>
                                        <input type="number" className="form-control" value={field.numero} onChange={(e) => {
                                            const newFields = [...additionalFields];
                                            newFields[index].numero = e.target.value;
                                            setAdditionalFields(newFields);
                                        }} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Espèce :</label>
                                        <input type="text" className="form-control" value={field.espece} onChange={(e) => {
                                            const newFields = [...additionalFields];
                                            newFields[index].espece = e.target.value;
                                            setAdditionalFields(newFields);
                                        }} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Prix Unitaire :</label>
                                        <input type="number" className="form-control" value={field.prixUnitaire} onChange={(e) => {
                                            const newFields = [...additionalFields];
                                            newFields[index].prixUnitaire = e.target.value;
                                            setAdditionalFields(newFields);
                                        }} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Quantité :</label>
                                        <input type="number" className="form-control" value={field.quantite} onChange={(e) => {
                                            const newFields = [...additionalFields];
                                            newFields[index].quantite = e.target.value;
                                            setAdditionalFields(newFields);
                                        }} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Valeur Totale :</label>
                                        <input type="text" className="form-control" value={field.valeurTotale} onChange={(e) => {
                                            const newFields = [...additionalFields];
                                            newFields[index].valeurTotale = e.target.value; // Insertion normale
                                            setAdditionalFields(newFields);
                                        }} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Provenance :</label>
                                        <input type="text" className="form-control" value={field.provenance} onChange={(e) => {
                                            const newFields = [...additionalFields];
                                            newFields[index].provenance = e.target.value;
                                            setAdditionalFields(newFields);
                                        }} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">État :</label>
                                        <input type="text" className="form-control" value={field.etat} onChange={(e) => {
                                            const newFields = [...additionalFields];
                                            newFields[index].etat = e.target.value;
                                            setAdditionalFields(newFields);
                                        }} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Observation :</label>
                                        <input type="text" className="form-control" value={field.observation} onChange={(e) => {
                                            const newFields = [...additionalFields];
                                            newFields[index].observation = e.target.value;
                                            setAdditionalFields(newFields);
                                        }} required />
                                    </div>
                                    <button type="button" className="btn btn-secondary" onClick={handleAddField}> +add </button> 
                                </div>
                            ))}
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClosePdfModal}>Fermer</Button>
                        <Button variant="primary" onClick={handlePdfValidation}>Générer</Button> {/* Assurez-vous que ce bouton appelle la bonne fonction */}
                    </Modal.Footer>
                </Modal>
                <div className="padding-top-black">
                            <h2>Ajouter Detenteur</h2>
                            
                        </div>
                        <div className="table-wrapper">
                        <form onSubmit={(e) => { e.preventDefault(); handleShowPdfModal(); }} className="mb-4">
                            <div className="mb-3">
                                <label className="form-label">Personnel:</label>
                                <Select
                                    value={personnelOptions.find(option => option.value === personnel)}
                                    onChange={(selectedOption) => setPersonnel(selectedOption.value)}
                                    options={personnelOptions}
                                    placeholder="Rechercher un personnel..."
                                    isSearchable={true}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Voiture:</label>
                                <select className="form-select" value={voiture} onChange={(e) => setVoiture(e.target.value)} required>
                                    <option value="">Sélectionner une Voiture</option>
                                    {Array.isArray(voitureData) && voitureData.map(voiture => (
                                        <option key={voiture.id_voiture} value={voiture.id_voiture}>
                                            {voiture.matricule}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Date :</label>
                                <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} required />
                            </div>
                            <button type="submit" className="btn btn-primary">Valider</button>
                        </form>

                    <div className="table-container">
                        <h3>Liste des Propriétaires de voiture</h3>
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Rechercher par matricule..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <table className="table table-striped table-hover table-responsive">
                            <thead className="table-primary">
                                <tr>
                                    <th scope="col">Personnel</th>
                                    <th scope="col">Voiture</th>
                                    <th scope="col">Utilisateur</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(currentItems) && currentItems.length > 0 ? (
                                    currentItems.map(proprietaire => (
                                        <tr key={proprietaire.id_proprietere_voiture}>
                                            <td>{proprietaire.id_personnel ? proprietaire.id_personnel.nom : 'Non disponible'}</td>
                                            <td>{proprietaire.id_voiture ? proprietaire.id_voiture.matricule : 'Non disponible'}</td>
                                            <td>{proprietaire.id_utilisateur ? proprietaire.id_utilisateur.id_personnel.nom : 'Non disponible'}</td>
                                            <td>{proprietaire.dates}</td>
                                            <td>
                                                <button className="btn btn-warning" title="Rendre" onClick={() => handleShowModal(proprietaire)}>
                                                    <i className="fas fa-check-circle"></i> Rendre
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center">Aucune donnée disponible</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <PaginationComponent
                            itemsPerPage={itemsPerPage}
                            totalItems={filteredItems.length}
                            paginate={paginate}
                            currentPage={currentPage}
                        />
                    </div>
                    </div>
                </div>
            </div>

            {/* Modal de validation */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Rendre la voiture</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Êtes-vous sûr de vouloir rendre cette voiture ?</p>
                    <div className="mb-3">
                        <label className="form-label">Date de retour :</label>
                        <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} required />
                    </div>
                    {/* <Button variant="info" onClick={generatePdf}>Générer PDF</Button> */}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Fermer</Button>
                    <Button variant="primary" onClick={rendreVoiture}>Valider</Button>
                </Modal.Footer>
            </Modal>

            {/* Modal d'importation */}
            <Modal show={showImportModal} onHide={handleCloseImportModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Importer la base</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label className="form-label">Sélectionner un fichier :</label>
                        <input type="file" className="form-control" onChange={handleFileChange} />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseImportModal}>Fermer</Button>
                    <Button variant="primary" onClick={handleImport}>Importer</Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer />
        </div>
    );
}

const PaginationComponent = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const pageNumberLimit = 5;
    const [minPageNumberLimit, setMinPageNumberLimit] = useState(0);
    const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(5);

    const handleNextBtn = () => {
        paginate(currentPage + 1);
        if (currentPage + 1 > maxPageNumberLimit) {
            setMaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
            setMinPageNumberLimit(minPageNumberLimit + pageNumberLimit);
        }
    };

    const handlePrevBtn = () => {
        paginate(currentPage - 1);
        if ((currentPage - 1) % pageNumberLimit === 0) {
            setMaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
            setMinPageNumberLimit(minPageNumberLimit - pageNumberLimit);
        }
    };

    let pageIncrementBtn = null;
    if (pageNumbers.length > maxPageNumberLimit) {
        pageIncrementBtn = <Pagination.Ellipsis onClick={handleNextBtn} />;
    }

    let pageDecrementBtn = null;
    if (minPageNumberLimit >= 1) {
        pageDecrementBtn = <Pagination.Ellipsis onClick={handlePrevBtn} />;
    }

    return (
        <Pagination className="justify-content-center mt-3">
            <Pagination.First onClick={() => paginate(1)} disabled={currentPage === 1} />
            <Pagination.Prev onClick={handlePrevBtn} disabled={currentPage === 1} />
            {pageDecrementBtn}
            {pageNumbers.map(number => {
                if (number < maxPageNumberLimit + 1 && number > minPageNumberLimit) {
                    return (
                        <Pagination.Item key={number} active={number === currentPage} onClick={() => paginate(number)}>
                            {number}
                        </Pagination.Item>
                    );
                } else {
                    return null;
                }
            })}
            {pageIncrementBtn}
            <Pagination.Next onClick={handleNextBtn} disabled={currentPage === pageNumbers.length} />
            <Pagination.Last onClick={() => paginate(pageNumbers.length)} disabled={currentPage === pageNumbers.length} />
        </Pagination>
    );
};

// Fonction pour convertir un nombre en lettres
const numberToWords = (num) => {
    const units = [
        '', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf',
        'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept',
        'dix-huit', 'dix-neuf', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante',
        'soixante-dix', 'quatre-vingts', 'quatre-vingt-dix'
    ];
    const tens = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante'];

    if (num < 20) return units[num];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + units[num % 10] : '');
    if (num < 1000) return units[Math.floor(num / 100)] + ' cent' + (num % 100 !== 0 ? ' ' + numberToWords(num % 100) : '');
    if (num === 1000) return 'mille';
    return '';
}

export default Proprietaire;
