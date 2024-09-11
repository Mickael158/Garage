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
CREATE TABLE model(
  id_model SERIAL PRIMARY KEY ,
  nom_model VARCHAR,
  id_marque INT REFERENCES marque(id_marque)
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
  id_service INT REFERENCES service(id_service)
);
CREATE TABLE utilisateur(
  id_utilisateur SERIAL PRIMARY KEY ,
  id_personnel INT REFERENCES personnel(id_personnel),
  pswd VARCHAR,
  id_role INT REFERENCES role(id_role)
);
-- Insertion des données dans la table `fonction`
INSERT INTO fonction (nom_fonction) VALUES
                                        ('Directeur'),
                                        ('Ingénieur'),
                                        ('Technicien'),
                                        ('Administratif');

-- Insertion des données dans la table `service`
INSERT INTO service (nom_service) VALUES
                                      ('Informatique'),
                                      ('Maintenance'),
                                      ('Ressources Humaines'),
                                      ('Finance');

-- Insertion des données dans la table `type_lieu`
INSERT INTO type_lieu (nom_type_lieu) VALUES
                                          ('Bureau'),
                                          ('Atelier'),
                                          ('Parking');

-- Insertion des données dans la table `lieu`
INSERT INTO lieu (nom_lieu, id_type_lieu) VALUES
                                              ('Bureau 101', 1),
                                              ('Atelier Principal', 2),
                                              ('Parking Sud', 3);

-- Insertion des données dans la table `transmision`
INSERT INTO transmision (nom_transmission) VALUES
                                               ('Manuelle'),
                                               ('Automatique');

-- Insertion des données dans la table `energie`
INSERT INTO energie (nom_energie) VALUES
                                      ('Essence'),
                                      ('Diesel'),
                                      ('Electrique'),
                                      ('Hybride');

-- Insertion des données dans la table `marque`
INSERT INTO marque (nom_marque) VALUES
                                    ('Toyota'),
                                    ('Renault'),
                                    ('Tesla'),
                                    ('BMW');

-- Insertion des données dans la table `model`
INSERT INTO model (nom_model, id_marque) VALUES
                                             ('Corolla', 1),
                                             ('Clio', 2),
                                             ('Model S', 3),
                                             ('Serie 3', 4);

-- Insertion des données dans la table `voiture`
INSERT INTO voiture (matricule, place, id_fonction, id_transmision, id_energie, id_service, id_model) VALUES
                                                                                                          ('123ABC', 5, 2, 1, 1, 1, 1),
                                                                                                          ('456DEF', 4, 3, 2, 2, 2, 2),
                                                                                                          ('789GHI', 5, 1, 2, 3, 3, 3),
                                                                                                          ('101JKL', 2, 4, 1, 4, 4, 4);

-- Insertion des données dans la table `role`
INSERT INTO role (nom_role) VALUES
                                ('Admin'),
                                ('Utilisateur'),
                                ('Superviseur');

-- Insertion des données dans la table `personnel`
INSERT INTO personnel (nom, matricule, id_fonction, id_service) VALUES
                                                                    ('Alice Dupont', 'P001', 1, 1),
                                                                    ('Bob Martin', 'P002', 2, 2),
                                                                    ('Charlie Leroy', 'P003', 3, 3),
                                                                    ('Diane Petit', 'P004', 4, 4);

-- Insertion des données dans la table `utilisateur`
INSERT INTO utilisateur (id_personnel, pswd, id_role) VALUES
                                                          (1, 'password123', 1),
                                                          (2, 'password456', 2),
                                                          (3, 'password789', 3),
                                                          (4, 'password101', 2);

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
CREATE TABLE voiture_sur_cal(
  id_voiture_sur_cal SERIAL PRIMARY KEY ,
  dates date,
  id_utilisateur INT REFERENCES utilisateur(id_utilisateur),
  id_voiture INT REFERENCES voiture(id_voiture)
);
CREATE TABLE voiture_reparer(
    id_voiture_reparer SERIAL PRIMARY KEY ,
    dates date,
    id_utilisateur INT REFERENCES utilisateur(id_utilisateur),
    id_voiture INT REFERENCES voiture(id_voiture)
);
CREATE TABLE reparation_rapide_voiture_debut(
    id_reparation_rapide_voiture_debut SERIAL PRIMARY KEY ,
    date_debut date,
    remarque VARCHAR,
    id_utilisateur INT REFERENCES utilisateur(id_utilisateur),
    image VARCHAR
);
CREATE TABLE reparation_rapide_voiture_fin(
    id_reparation_rapide_voiture_fin SERIAL PRIMARY KEY ,
    date_fin date,
    remarque VARCHAR,
    id_utilisateur INT REFERENCES utilisateur(id_utilisateur),
    id_reparation_rapide_voiture_debut INT REFERENCES reparation_rapide_voiture_debut(id_reparation_rapide_voiture_debut)
);
CREATE TABLE motif_pret_voiture(
    id_motif_pret_voiture SERIAL PRIMARY KEY ,
    nom_motif_pret_voiture VARCHAR
);
CREATE TABLE demande_pret_voiture(
  id_demande_pret_voiture SERIAL PRIMARY KEY ,
  date_damande date,
  date_debut date,
  date_fin date,
  id_motif_pret_voiture INT REFERENCES motif_pret_voiture(id_motif_pret_voiture),
  id_lieu INT REFERENCES lieu(id_lieu),
  id_utilisateur INT REFERENCES utilisateur(id_utilisateur),
  id_voiture INT REFERENCES voiture(id_voiture)
);
CREATE TABLE validation_pret_voiture(
  id_validation_pret_voiture SERIAL PRIMARY KEY ,
  id_demande_pret_voiture INT REFERENCES demande_pret_voiture(id_demande_pret_voiture),
  id_utilisateur INT REFERENCES utilisateur(id_utilisateur),
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