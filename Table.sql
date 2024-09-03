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
CREATE TABLE pv(
  id_pv SERIAL PRIMARY KEY ,
  dates date,
  remarque VARCHAR,
  image VARCHAR,
  id_utilisateur INT REFERENCES utilisateur(id_utilisateur),
  id_demande_maintenence_valider INT REFERENCES demande_maintenence_valider(id_demande_maintenence_valider)
);