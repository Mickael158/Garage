\c postgres;
drop database garage;
create database garage;
\c garage;

CREATE TABLE fonction(
  id_fonction SERIAL PRIMARY KEY ,
  nom_fonction VARCHAR
);
CREATE TABLE service(
  id_service SERIAL PRIMARY KEY ,
  nom_service VARCHAR
);
CREATE TABLE type_lieu(
  id_type_lieu SERIAL PRIMARY KEY ,
  nom_type_lieu VARCHAR
);
CREATE TABLE lieu(
  id_lieu SERIAL PRIMARY KEY ,
  nom_lieu VARCHAR,
  km double precision,
  id_type_lieu INT REFERENCES type_lieu(id_type_lieu)
);
CREATE TABLE transmision(
  id_transmision SERIAL PRIMARY KEY ,
  nom_transmission VARCHAR
);

CREATE TABLE energie(
  id_energie SERIAL PRIMARY KEY ,
  nom_energie VARCHAR
);
CREATE TABLE marque(
    id_marque SERIAL PRIMARY KEY ,
    nom_marque VARCHAR
);
CREATE TABLE poste(
    id_poste SERIAL PRIMARY KEY ,
    nom VARCHAR
);
CREATE TABLE model(
  id_model SERIAL PRIMARY KEY ,
  nom_model VARCHAR,
  id_marque INT REFERENCES marque(id_marque)
);
CREATE TABLE type_voiture(
  id_type_voiture SERIAL PRIMARY KEY ,
  nom VARCHAR
);
CREATE TABLE voiture(
  id_voiture SERIAL PRIMARY KEY ,
  matricule VARCHAR,
  dates_aquisition date,
  place int,
  id_fonction INT REFERENCES fonction(id_fonction),
  id_transmision INT REFERENCES transmision(id_transmision),
  id_energie INT REFERENCES energie(id_energie),
  id_service INT REFERENCES service(id_service),
  id_type_voiture INT REFERENCES type_voiture(id_type_voiture),
  id_model INT REFERENCES model(id_model)
);
CREATE TABLE role(
  id_role SERIAL PRIMARY KEY ,
  nom_role VARCHAR
);
CREATE TABLE personnel(
  id_personnel SERIAL PRIMARY KEY ,
  nom VARCHAR,
  matricule VARCHAR,
  id_fonction INT REFERENCES fonction(id_fonction),
  id_service INT REFERENCES service(id_service),
  id_poste INT REFERENCES poste(id_poste)
);
CREATE TABLE utilisateur(
  id_utilisateur SERIAL PRIMARY KEY ,
  id_personnel INT REFERENCES personnel(id_personnel),
  pswd VARCHAR,
  id_role INT REFERENCES role(id_role)
);
CREATE TABLE demande_validation(
  id_demande_validation SERIAL PRIMARY KEY ,
  dates DATE,
  id_utilisateur INT REFERENCES utilisateur(id_utilisateur),
  verifier VARCHAR
);
CREATE TABLE kilometrage(
    id_kilometrage SERIAL PRIMARY KEY ,
    dates date,
    km decimal,
    id_voiture INT REFERENCES voiture(id_voiture),
    id_utilisateur INT REFERENCES utilisateur(id_utilisateur)
);
CREATE TABLE maintenance(
  id_maintenance SERIAL PRIMARY KEY ,
  nom_maintenanca VARCHAR
);
CREATE TABLE action (
  id_action SERIAL PRIMARY KEY ,
  nom_action VARCHAR,
  id_maintenance INT REFERENCES maintenance(id_maintenance)
);
CREATE TABLE demande_maintenence(
    id_demande_maintenence SERIAL PRIMARY KEY ,
    dates date,
    remarque VARCHAR,
    id_service INT REFERENCES service(id_service),
    id_voiture INT REFERENCES voiture(id_voiture),
    id_utilisateur INT REFERENCES utilisateur(id_utilisateur)
);
CREATE TABLE liste_action_demande_maintenence(
    id_liste_action_demande_maintenence SERIAL PRIMARY KEY ,
    id_demande_maintenence INT REFERENCES demande_maintenence(id_demande_maintenence),
    id_action INT REFERENCES action(id_action)
);

CREATE TABLE demande_maintenence_refuser(
  id_demande_maintenence_refuser SERIAL PRIMARY KEY ,
  dates date,
  remarque VARCHAR,
  id_utilisateur INT REFERENCES utilisateur(id_utilisateur),
  id_demande_maintenence INT REFERENCES demande_maintenence(id_demande_maintenence)
);
CREATE TABLE demande_maintenence_valider (
  id_demande_maintenence_valider SERIAL PRIMARY KEY ,
  dates date,
  date_rdv date,
  remarque VARCHAR,
  id_lieu INT REFERENCES lieu(id_lieu),
  id_utilisateur INT REFERENCES utilisateur(id_utilisateur),
  id_demande_maintenence INT REFERENCES demande_maintenence(id_demande_maintenence)
);

CREATE TABLE liste_action_demande_maintenence_valider(
    id_liste_action_demande_maintenence_valider SERIAL PRIMARY KEY ,
    id_demande_maintenence_valider INT REFERENCES demande_maintenence_valider(id_demande_maintenence_valider),
    id_action INT REFERENCES action(id_action)
);
CREATE TABLE systeme(
    id_systeme SERIAL PRIMARY KEY ,
    nom_systeme VARCHAR
);
CREATE TABLE defaillance(
    id_defaillance SERIAL PRIMARY KEY ,
    nom_defaillance VARCHAR
);
CREATE TABLE pv(
  id_pv SERIAL PRIMARY KEY ,
  dates date,
  dates_pv date,
  numero VARCHAR,
  remarque VARCHAR,
  image VARCHAR,
  id_utilisateur INT REFERENCES utilisateur(id_utilisateur),
  id_demande_maintenence_valider INT REFERENCES demande_maintenence_valider(id_demande_maintenence_valider)
);
CREATE TABLE tableauPv(
  id_tableauPv SERIAL PRIMARY KEY ,
  id_pv INT REFERENCES pv(id_pv),
  id_systeme INT REFERENCES systeme(id_systeme),
  id_defaillance INT REFERENCES defaillance(id_defaillance),
  id_action INT REFERENCES action(id_action),
  observation VARCHAR,
  Ordre_de_priorite int
);

CREATE TABLE concessionnaire(
    id_concessionnaire SERIAL PRIMARY KEY ,
    nom VARCHAR,
    id_lieu INT REFERENCES lieu(id_lieu)
);
CREATE TABLE estimation(
   id_estimation SERIAL PRIMARY KEY ,
   dates date,
   id_concessionnaire INT REFERENCES concessionnaire(id_concessionnaire),
   dates_estimation date,
   numero_estimation VARCHAR,
   numero_client VARCHAR,
   date_entre date,
   date_fin date,
   date_fin date,
   remarque VARCHAR,
   image VARCHAR,
   id_utilisateur INT REFERENCES utilisateur(id_utilisateur),
   id_demande_maintenence_valider INT REFERENCES demande_maintenence_valider(id_demande_maintenence_valider)
);
CREATE TABLE designation(
    id_designation SERIAL PRIMARY KEY ,
    nom_designation VARCHAR
);
CREATE TABLE tableau_Estimation(
    id_tableau_Estimation SERIAL PRIMARY KEY ,
    id_Estimation INT REFERENCES estimation(id_estimation),
    reference VARCHAR,
    id_designation INT REFERENCES designation(id_designation),
    p_u float,
    qte int,
    montant float
);
CREATE TABLE mode_payement(
  id_mode_payement SERIAL PRIMARY KEY ,
  nom VARCHAR
);
CREATE TABLE recu(
   id_recu SERIAL PRIMARY KEY ,
   dates date,
   id_concessionnaire INT REFERENCES concessionnaire(id_concessionnaire),
   Numero_recu VARCHAR,
   dates_recu timestamp,
   vendeur VARCHAR,
   image VARCHAR,
   id_mode_payement INT REFERENCES mode_payement(id_mode_payement),
   id_utilisateur INT REFERENCES utilisateur(id_utilisateur),
   id_demande_maintenence_valider INT REFERENCES demande_maintenence_valider(id_demande_maintenence_valider)
);
CREATE TABLE tableau_Recu(
    id_tableau_Recu SERIAL PRIMARY KEY ,
    id_Recu INT REFERENCES recu(id_recu),
    numero VARCHAR,
    id_designation INT REFERENCES designation(id_designation),
    p_u float,
    qte int,
    montant float
);
CREATE TABLE reparation_voiture_sous_facture_debut(
  id_reparation_voiture_sous_facture_debut SERIAL PRIMARY KEY ,
  date_rdv date,
  remarque VARCHAR,
  id_utilisateur INT REFERENCES utilisateur(id_utilisateur),
  id_recu INT REFERENCES recu(id_recu)
);
CREATE TABLE reparation_voiture_sous_facture_fin(
    id_reparation_voiture_sous_facture SERIAL PRIMARY KEY ,
    date_fin date,
    remarque VARCHAR,
    id_utilisateur INT REFERENCES utilisateur(id_utilisateur),
    id_reparation_voiture_sous_facture_debut INT REFERENCES reparation_voiture_sous_facture_debut(id_reparation_voiture_sous_facture_debut)
);
CREATE TABLE indisponibilite(
  id_indisponibilite SERIAL PRIMARY KEY ,
  nom VARCHAR
);
CREATE TABLE voiture_panne(
  id_voiture_panne SERIAL PRIMARY KEY ,
  dates date,
  id_lieu INT REFERENCES lieu(id_lieu),
  id_indisponibilite INT REFERENCES indisponibilite(id_indisponibilite),
  id_utilisateur INT REFERENCES utilisateur(id_utilisateur),
  id_voiture INT REFERENCES voiture(id_voiture)
);
CREATE TABLE voiture_redisponible(
    id_voiture_redisponible SERIAL PRIMARY KEY ,
    dates date,
    id_voiture_panne INT REFERENCES voiture_panne(id_voiture_panne),
    id_utilisateur INT REFERENCES utilisateur(id_utilisateur)
);
CREATE TABLE reparation_rapide_voiture(
    id_reparation_rapide_voiture SERIAL PRIMARY KEY ,
    date date,
    remarque VARCHAR,
    id_utilisateur INT REFERENCES utilisateur(id_utilisateur),
    id_voiture INT REFERENCES voiture(id_voiture),
    id_action INT REFERENCES action(id_action)
);
CREATE TABLE motif_pret_voiture(
  id_motif_pret_voiture SERIAL PRIMARY KEY ,
  nom VARCHAR
);
CREATE TABLE demande_pret_voiture(
  id_demande_pret_voiture SERIAL PRIMARY KEY ,
  date_damande date,
  date_debut date,
  date_fin date,
  nbr_pers int,
  id_motif_pret_voiture INT REFERENCES motif_pret_voiture(id_motif_pret_voiture),
  id_utilisateur INT REFERENCES utilisateur(id_utilisateur)
);


CREATE TABLE destination_pret_voiture(
  id_destination_pret_voiture SERIAL PRIMARY KEY ,
  id_demande_pret_voiture INT REFERENCES demande_pret_voiture(id_demande_pret_voiture),
  depart INT REFERENCES lieu(id_lieu),
  arriver INT REFERENCES lieu(id_lieu)
);
CREATE TABLE validation_pret_voiture(
  id_validation_pret_voiture SERIAL PRIMARY KEY ,
  id_demande_pret_voiture INT REFERENCES demande_pret_voiture(id_demande_pret_voiture),
  id_utilisateur INT REFERENCES utilisateur(id_utilisateur),
  id_voiture INT REFERENCES voiture(id_voiture),
  id_personnel INT REFERENCES personnel(id_personnel),
  dates date,
  remarque VARCHAR
);
CREATE TABLE refus_pret_voiture(
    id_refus_pret_voiture SERIAL PRIMARY KEY ,
    id_demande_pret_voiture INT REFERENCES demande_pret_voiture(id_demande_pret_voiture),
    id_utilisateur INT REFERENCES utilisateur(id_utilisateur),
    dates date,
    remarque VARCHAR
);
CREATE TABLE import_proprietere_voiture(
    id_import_proprietere_voiture SERIAL PRIMARY KEY ,
    direction VARCHAR,
    service VARCHAR,
    imatriculation VARCHAR,
    modele VARCHAR,
    marque VARCHAR,
    types VARCHAR,
    energie VARCHAR,
    nom VARCHAR,
    Fonction VARCHAR
);
CREATE TABLE proprietere_voiture(
  id_proprietere_voiture SERIAL PRIMARY KEY ,
  id_personnel INT REFERENCES personnel(id_personnel),
  id_voiture INT REFERENCES voiture(id_voiture),
  id_utilisateur INT REFERENCES utilisateur(id_utilisateur),
  dates date
);
CREATE TABLE rendu_voiture(
    id_rendu_voiture SERIAL PRIMARY KEY ,
    id_proprietere_voiture  INT REFERENCES proprietere_voiture(id_proprietere_voiture),
    id_utilisateur INT REFERENCES utilisateur(id_utilisateur),
    dates date
);
CREATE TABLE etat_piece(
  id_etat_piece SERIAL PRIMARY KEY ,
  nom VARCHAR
);
CREATE TABLE entre_piece(
  id_entre_piece SERIAL PRIMARY KEY ,
  id_utilisateur INT REFERENCES utilisateur(id_utilisateur),
  id_designation INT REFERENCES designation(id_designation),
  id_model INT REFERENCES model(id_model),
  annee INT,
  nbr int,
  id_etat_piece INT REFERENCES etat_piece(id_etat_piece),
  dates date
);
CREATE TABLE sortie_piece(
    id_sortie_piece SERIAL PRIMARY KEY ,
    id_utilisateur INT REFERENCES utilisateur(id_utilisateur),
    id_designation INT REFERENCES designation(id_designation),
    id_model INT REFERENCES model(id_model),
    annee INT,
    nbr int,
    id_etat_piece INT REFERENCES etat_piece(id_etat_piece),
    dates date
);
CREATE TABLE permis(
  id_permis SERIAL PRIMARY KEY ,
  nom VARCHAR
);
CREATE TABLE chauffeur(
  id_chauffeur SERIAL PRIMARY KEY ,
  id_personne INT REFERENCES personnel(id_personnel),
  id_permis INT REFERENCES permis(id_permis)
);
CREATE TABLE visite_medical(
  id_visite_medical SERIAL PRIMARY KEY ,
  date_debut date,
  date_fin date,
  id_chauffeur INT REFERENCES chauffeur(id_chauffeur)
);

