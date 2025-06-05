const API_BASE_URL = 'http://localhost:3000'; // Adapte si ton port est différent

// Affiche la réponse dans la zone <pre id="output">
function afficherRéponse(data) {
    document.getElementById('output').textContent = JSON.stringify(data, null, 2);
}

// ========== RÉSERVATIONS ==========

async function getAllReservations() {
    try {
        const res = await fetch(`${API_BASE_URL}/reservations`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            }
        });
        const data = await res.json();
        afficherRéponse(data);
    } catch (err) {
        afficherRéponse({ erreur: 'Erreur lors de la récupération des réservations.' });
    }
}

async function createReservation() {
    const body = {
        utilisateur_id: 1,
        hotel_id: 1,
        date_arrivee: '2025-06-10',
        date_depart: '2025-06-15'
    };

    try {
        const res = await fetch(`${API_BASE_URL}/reservations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        afficherRéponse(data);
    } catch (err) {
        afficherRéponse({ erreur: 'Erreur lors de la création de la réservation.' });
    }
}

async function updateReservation() {
    const id = 1; // Remplace par l'ID que tu veux modifier
    const body = {
        date_arrivee: '2025-06-11',
        date_depart: '2025-06-16',
        statut_id: 1
    };

    try {
        const res = await fetch(`${API_BASE_URL}/reservations/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        afficherRéponse(data);
    } catch (err) {
        afficherRéponse({ erreur: 'Erreur lors de la modification de la réservation.' });
    }
}

async function deleteReservation() {
    const id = 1; // Remplace par l'ID à supprimer

    try {
        const res = await fetch(`${API_BASE_URL}/reservations/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            }
        });
        const data = await res.json();
        afficherRéponse(data);
    } catch (err) {
        afficherRéponse({ erreur: 'Erreur lors de la suppression de la réservation.' });
    }
}
