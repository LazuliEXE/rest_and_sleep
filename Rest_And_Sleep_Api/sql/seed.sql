
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

-- Insertion des utilisateurs
INSERT INTO utilisateurs (nom, email, mot_de_passe, role_id) VALUES
('Alice Dupont', 'alice@example.com', 'hashedpassword1', 1),
('Bob Martin', 'bob@example.com', 'hashedpassword2', 3),
('Claire Durand', 'claire@example.com', 'hashedpassword3', 5);

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