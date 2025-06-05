-- Suppression et création de la nouvelle base
DROP DATABASE IF EXISTS rest_and_sleep;
CREATE DATABASE rest_and_sleep;
USE rest_and_sleep;

-- Table des rôles
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL UNIQUE
);

-- Table des utilisateurs
CREATE TABLE utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    role_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Table des hôtels
CREATE TABLE hotels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    adresse VARCHAR(255) NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des types de chambres
CREATE TABLE types_chambres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL UNIQUE
);

-- Table des chambres
CREATE TABLE chambres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_chambre INT NOT NULL,
    type_id INT,
    tarif DECIMAL(10, 2) NOT NULL,
    disponibilite BOOLEAN DEFAULT TRUE,
    hotel_id INT,
    photo_url VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id),
    FOREIGN KEY (type_id) REFERENCES types_chambres(id)
);

-- Table des statuts de réservation
CREATE TABLE statuts_reservation (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL UNIQUE
);

-- Table des réservations
CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id INT,
    chambre_id INT,
    hotel_id INT,
    date_arrivee DATE,
    date_depart DATE,
    statut_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id),
    FOREIGN KEY (chambre_id) REFERENCES chambres(id),
    FOREIGN KEY (hotel_id) REFERENCES hotels(id),
    FOREIGN KEY (statut_id) REFERENCES statuts_reservation(id)
);

-- Table des logs
CREATE TABLE logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    method VARCHAR(10),
    url TEXT,
    status_code INT,
    duration_ms INT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insertion des rôles
INSERT INTO roles (nom) VALUES 
('ADMIN'),
('PDG'),
('MANAGER'),
('EMPLOYEE'),
('CLIENT');

-- Insertion des types de chambres
INSERT INTO types_chambres (nom) VALUES
('Simple'),
('Double'),
('Suite');

-- Insertion des statuts de réservation
INSERT INTO statuts_reservation (nom) VALUES
('confirmée'),
('annulée'),
('en attente');

-- Insertion des utilisateurs avec mots de passe hachés
INSERT INTO utilisateurs (nom, email, mot_de_passe, role_id) VALUES
('Alice Dupont', 'alice@example.com', '$2b$12$v8f8YYWN4qBXPYGcp2LdsOxDIrBBmNrFR9ieATQwDGZqQ35aHz0LW', 1),
('Bob Martin', 'bob@example.com', '$2b$12$F.a6UpFnl65hFnzaWxEas.3PvcK7hmdIDvJN82TAoN.76UeqhfYuW', 3),
('Claire Durand', 'claire@example.com', '$2b$12$wv2FB40qvDdQ9Iwylv1/tubAqE/2C4/cjEb1zG95lhVnQnfk0khhW', 5);

-- Insertion des hôtels
INSERT INTO hotels (nom, adresse, description) VALUES
('Hôtel Paris', '123 rue de Paris, 75000 Paris', 'Un hôtel 4 étoiles au cœur de Paris.'),
('Hôtel Lyon', '45 rue de Lyon, 69000 Lyon', 'Un hôtel moderne à proximité du centre-ville.'),
('Hôtel Marseille', '78 rue du Vieux-Port, 13000 Marseille', 'Un hôtel en bord de mer avec vue imprenable.');

-- Insertion des chambres
INSERT INTO chambres (numero_chambre, type_id, tarif, disponibilite, hotel_id, photo_url) VALUES
(101, 1, 80.00, TRUE, 1, NULL),
(102, 2, 120.00, TRUE, 1, NULL),
(201, 3, 200.00, FALSE, 1, NULL),
(301, 2, 110.00, TRUE, 2, NULL),
(302, 1, 75.00, TRUE, 2, NULL),
(401, 3, 180.00, TRUE, 3, NULL),
(402, 2, 130.00, FALSE, 3, NULL);

-- Insertion des réservations
INSERT INTO reservations (utilisateur_id, chambre_id, hotel_id, date_arrivee, date_depart, statut_id) VALUES
(1, 1, 1, '2025-05-10', '2025-05-12', 1),
(2, 4, 2, '2025-06-01', '2025-06-05', 3),
(3, 3, 1, '2025-07-15', '2025-07-20', 2),
(1, 6, 3, '2025-08-01', '2025-08-03', 1);