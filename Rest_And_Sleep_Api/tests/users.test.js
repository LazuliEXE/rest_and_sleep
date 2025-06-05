const request = require('supertest');
const app = require('../index'); // ton app Express
const db = require('../db');
const jwt = require('jsonwebtoken');


describe('POST /users', () => {
    it('should create a new user', async () => {
        const newUser = {
            nom: 'Test User',
            email: 'testuser@example.com',
            mot_de_passe: 'password123',
            role_id: 1,
        };

        const res = await request(app)
        .post('/users')
        .send(newUser);

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('message', 'Utilisateur créé');
        expect(res.body).toHaveProperty('id');
    });

    it('should return an error if email is already taken', async () => {
        const existingUser = {
            nom: 'Existing User',
            email: 'existing@example.com',
            mot_de_passe: 'password123',
            role_id: 1,
        };

        // Crée un utilisateur existant dans la base de données
        await db.query('INSERT INTO utilisateurs (nom, email, mot_de_passe, role_id) VALUES (?, ?, ?, ?)', [
            existingUser.nom,
            existingUser.email,
            existingUser.mot_de_passe,
            existingUser.role_id,
        ]);

        const res = await request(app)
        .post('/users')
        .send(existingUser);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'Un utilisateur avec cet email existe déjà.');
    });
});

describe('GET /users', () => {
    let token;

    beforeAll(() => {
        // Créer un utilisateur fictif et obtenir un token
        const user = { id: 1, email: 'testuser@example.com', role_id: 1 };
        token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
    });

    it('should get all users if authenticated as admin', async () => {
        const res = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${token}`); // Ajouter le token dans les headers

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('should return 401 if not authenticated', async () => {
        const res = await request(app)
        .get('/users');

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('error', 'Accès non autorisé');
    });
});

afterAll(() => {
    db.end(); // Fermer la connexion après tous les tests
});