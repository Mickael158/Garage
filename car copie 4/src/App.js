import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Menu from './components/Menu';
import VehicleDetails from './components/VehicleDetails';
import Accueil from './components/Accueil'; 
import VoirPlus from './components/VoirPlus'; 
import VoirPlusClient from './components/VoirPlusClient'; 
import Crud from './components/Crud';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Fonction from './components/Crud/Fonction';
import Service from './components/Crud/Service';
import Test from './components/Test';
import InsertPieces from './components/InsertPieces';
import SortiePieces from './components/SortiePieces';
import RapideV from './components/Rapide';
import Proprietaire from './components/Proprietaire';
import TypeLieu from './components/Crud/TypeLieu';
import Indisponible from './components/Crud/Indisponible';
import Lieu from './components/Crud/Lieu';
import Transmission from './components/Crud/Transmission';
import VisiteMedicale from './components/Crud/VisiteMedicale';
import Energie from './components/Crud/Energie';
import Poste from './components/Crud/Poste';
import ModelVoiture from './components/Crud/ModelVoiture';
import Voiture from './components/Crud/Voiture';
import Role from './components/Crud/Role';
import Personnel from './components/Crud/Personnel';
import Utilisateur from './components/Crud/Utilisateur';
import Maintenance from './components/Crud/Maintenance';
import Designation from './components/Crud/Designation';
import Chauffeur from './components/Crud/Chauffeur';
import Permis from './components/Crud/Permis';
import Action from './components/Crud/Action';
import Modif from './components/Crud/Modif';
import Entretien from './components/Entretien';
import ValidationPret from './components/ValidationPret';
import ValidationPretClient from './components/ValidationPretClient';
import Pret from './components/Pret';
import BoutonPiece from './components/BoutonPiece';
import TypeVoiture from './components/Crud/TypeVoiture';
import MarqueVoiture from './components/Crud/MarqueVoiture';
import DemandeAttente from './components/DemandeAttentes';
import Bouton from './components/Bouton';
import GestionPiece from './components/GestionPiece';
import DemandeValide from './components/DemandeValide';
import DemandeValideClient from './components/DemandeValideClient';
import DemandeEnCoursClient from './components/DemandeEnCoursClient';
import DemandeFiniClient from './components/DemandeFiniClient';
import Accident from './components/Accident';
import Dashboard from './components/Dashboard';
import Systeme from './components/Crud/Systeme';
import EtatPiece from './components/Crud/EtatPiece';
import Defaillance from './components/Crud/Defaillance';
import Concessionnaire from './components/Crud/Concessionnaire';
import Payement from './components/Crud/Payement';
import 'bootstrap/dist/css/bootstrap.min.css';
import PrivateRoute from './PrivateRoute';



function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/menu" element={
                        <PrivateRoute>
                            <Menu />
                        </PrivateRoute>
                        } />
                    <Route path="/vehicle-details" element={
                        <PrivateRoute>
                            <VehicleDetails />
                        </PrivateRoute>
                        } />
                    <Route path="/accueil" element={
                        <PrivateRoute>
                            <Accueil />
                        </PrivateRoute>
                        } /> 
                    <Route path="/crud" element={
                        <PrivateRoute>
                            <Crud />
                        </PrivateRoute>
                        } />
                    <Route path="/dashboard" element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                        } />
                    <Route path="/fonction" element={
                        <PrivateRoute>
                            <Fonction />
                        </PrivateRoute>
                        } />
                    <Route path="/service" element={
                        <PrivateRoute>
                            <Service />
                        </PrivateRoute>
                        } />
                    <Route path="/typelieu" element={
                        <PrivateRoute>
                            <TypeLieu />
                        </PrivateRoute>
                        } />
                    <Route path="/lieu" element={
                        <PrivateRoute>
                            <Lieu />
                        </PrivateRoute>
                        } />
                    <Route path="/transmission" element={
                        <PrivateRoute>
                            <Transmission />
                        </PrivateRoute>
                        } />
                    <Route path="/etatPiece" element={
                        <PrivateRoute>
                            <EtatPiece />
                        </PrivateRoute>
                        } />
                    <Route path="/energie" element={
                        <PrivateRoute>
                            <Energie />
                        </PrivateRoute>
                        } />
                    <Route path="/model" element={
                        <PrivateRoute>
                            <ModelVoiture />
                        </PrivateRoute>
                        } />
                    <Route path="/voiture" element={
                        <PrivateRoute>
                            <Voiture />
                        </PrivateRoute>
                        } />
                    <Route path="/poste" element={
                        <PrivateRoute>
                            <Poste />
                        </PrivateRoute>
                        } />
                    <Route path="/role" element={
                        <PrivateRoute>
                            <Role />
                        </PrivateRoute>
                        } />
                    <Route path="/personnel" element={
                        <PrivateRoute>
                             <Personnel />
                        </PrivateRoute>
                       } />
                    <Route path="/utilisateur" element={
                        <PrivateRoute>
                            <Utilisateur />
                        </PrivateRoute>
                        } />
                    <Route path="/maintenance" element={
                        <PrivateRoute>
                            <Maintenance />
                        </PrivateRoute>
                        } />
                    <Route path="/action" element={
                        <PrivateRoute>
                            <Action />
                        </PrivateRoute>
                        } />
                    <Route path="/demande-entretien" element={
                        <PrivateRoute>
                            <Entretien />
                        </PrivateRoute>
                        } />
                    <Route path="/marque" element={
                        <PrivateRoute>
                            <MarqueVoiture />
                        </PrivateRoute>
                        } />
                    <Route path="/demande-en-attente" element={
                        <PrivateRoute>
                            <DemandeAttente />
                        </PrivateRoute>
                        } />
                    <Route path="/bouton" element={
                        <PrivateRoute>
                            <Bouton />
                        </PrivateRoute>
                        } />
                    <Route path="/aaa" element={
                        <PrivateRoute>
                            <Test />
                        </PrivateRoute>
                        } />
                    <Route path="/demande_valide" element={
                        <PrivateRoute>
                            <DemandeValide />
                        </PrivateRoute>
                        } />
                    <Route path="/demande_valide_client" element={
                        <PrivateRoute>
                            <DemandeValideClient />
                        </PrivateRoute>
                        } />
                    <Route path="/demande_en_cours_client" element={
                        <PrivateRoute>
                            <DemandeEnCoursClient />
                        </PrivateRoute>
                        } />
                    <Route path="/demande_fini_client" element={
                        <PrivateRoute>
                            <DemandeFiniClient />
                        </PrivateRoute>
                        } />
                    <Route path="/systeme" element={
                        <PrivateRoute>
                            <Systeme />
                        </PrivateRoute>
                        } />
                    <Route path="/defaillance" element={
                        <PrivateRoute>
                            <Defaillance />
                        </PrivateRoute>
                        } />
                    <Route path="/concessionnaire" element={
                        <PrivateRoute>
                            <Concessionnaire />
                        </PrivateRoute>
                        } />
                    <Route path="/designation" element={
                        <PrivateRoute>
                            <Designation />
                        </PrivateRoute>
                        } />
                    <Route path="/payement" element={
                        <PrivateRoute>
                            <Payement />
                        </PrivateRoute>
                        } />
                    <Route path="/voirplus" element={
                        <PrivateRoute>
                            <VoirPlus />
                        </PrivateRoute>
                        } />
                    <Route path="/voirplusclient" element={
                        <PrivateRoute>
                            <VoirPlusClient />
                        </PrivateRoute>
                        } />
                    <Route path="/rapide" element={
                        <PrivateRoute>
                            <RapideV />
                        </PrivateRoute>
                        } />
                    <Route path="/pret" element={
                        <PrivateRoute>
                            <Pret />
                        </PrivateRoute>
                        } />
                    <Route path="/modif" element={
                        <PrivateRoute>
                            <Modif />
                        </PrivateRoute>
                        } />
                    <Route path="/validationpret" element={
                        <PrivateRoute>
                            <ValidationPret />
                        </PrivateRoute>
                        } />
                    <Route path="/proprietaire" element={
                        <PrivateRoute>
                            <Proprietaire />
                        </PrivateRoute>
                        } />
                    <Route path="/insertpieces" element={
                        <PrivateRoute>
                            <InsertPieces />
                        </PrivateRoute>
                        } />
                    <Route path="/sortiepieces" element={
                        <PrivateRoute>
                             <SortiePieces />
                        </PrivateRoute>
                       } />
                    <Route path="/typevoiture" element={
                        <PrivateRoute>
                            <TypeVoiture />
                        </PrivateRoute>
                        } />
                    <Route path="/gestionpiece" element={
                        <PrivateRoute>
                            <GestionPiece />
                        </PrivateRoute>
                        } />
                    <Route path="/boutonpiece" element={
                        <PrivateRoute>
                            <BoutonPiece />
                        </PrivateRoute>
                        } />
                    <Route path="/permis" element={
                        <PrivateRoute>
                            <Permis />
                        </PrivateRoute>
                        } />
                    <Route path="/chauffeur" element={
                        <PrivateRoute>
                            <Chauffeur />
                        </PrivateRoute>
                        } />
                    <Route path="/visitemedicale" element={
                        <PrivateRoute>
                            <VisiteMedicale />
                        </PrivateRoute>
                        } />
                    <Route path="/indisponible" element={
                        <PrivateRoute>
                            <Indisponible />
                        </PrivateRoute>
                        } />
                    <Route path="/accident" element={
                        <PrivateRoute>
                            <Accident />
                        </PrivateRoute>
                        } />
                    <Route path="/validation_pret_client" element={
                        <PrivateRoute>
                            <ValidationPretClient />
                        </PrivateRoute>
                        } />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
