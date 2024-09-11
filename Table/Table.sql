CREATE TABLE service(
    idService SERIAL PRIMARY KEY ,
    nom VARCHAR
);
CREATE TABLE role(
  idRole SERIAL PRIMARY KEY ,
  nom VARCHAR
);
CREATE TABLE personnes(
    IdPersonne SERIAL PRIMARY KEY ,
    Nom VARCHAR,
    email VARCHAR,
    Matricule VARCHAR,
    IdService INT REFERENCES service(idService)
);
CREATE TABLE utilisateur(
  idUtilisateur SERIAL PRIMARY KEY ,
  Nom VARCHAR,
  pwd VARCHAR,
  idRole INT REFERENCES role(idRole),
  idPersonne INT REFERENCES personnes(IdPersonne)
);
SELECT u.idUtilisateur , u.Nom , u.pwd , u.idRole , u.idPersonne
    FROM utilisateur u
        JOIN personnes p on p.IdPersonne = u.idPersonne
    where p.IdPersonne="" AND u.pwd=
-- Insertion des services
INSERT INTO service (nom) VALUES ('Informatique');
INSERT INTO service (nom) VALUES ('Ressources Humaines');
INSERT INTO service (nom) VALUES ('Marketing');

-- Insertion des rôles
INSERT INTO role (nom) VALUES ('Administrateur');
INSERT INTO role (nom) VALUES ('Utilisateur');
INSERT INTO role (nom) VALUES ('Manager');

-- Insertion des personnes
INSERT INTO personnes (Nom, email, Matricule, IdService) VALUES ('Dupont', 'dupont@example.com', 'M001', 1);
INSERT INTO personnes (Nom, email, Matricule, IdService) VALUES ('Martin', 'martin@example.com', 'M002', 2);
INSERT INTO personnes (Nom, email, Matricule, IdService) VALUES ('Durand', 'durand@example.com', 'M003', 3);

-- Insertion des utilisateurs
INSERT INTO utilisateur (Nom, pwd, idRole, idPersonne) VALUES ('admin1', 'password1', 1, 1);
INSERT INTO utilisateur (Nom, pwd, idRole, idPersonne) VALUES ('user1', 'password2', 2, 2);
INSERT INTO utilisateur (Nom, pwd, idRole, idPersonne) VALUES ('manager1', 'password3', 3, 3);
