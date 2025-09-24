'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from '../../styles/chauffeur.module.css';
import DriverRating from "../../components/DriverRating";

function ChauffeursClientWrapper() {
    const [chauffeurs, setChauffeurs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(""); // ← AJOUTÉ
    const searchParams = useSearchParams();
    const reservationId = searchParams.get("reservationId");

    useEffect(() => {
        if (!reservationId) {
            console.warn("Aucun reservationId trouvé dans l'URL.");
        }
    }, [reservationId]);

    useEffect(() => {
        const fetchChauffeurs = async () => {
            try {
                setLoading(true);
                setError(""); // ← AJOUTÉ

                const response = await fetch("/api/chauffeurs-disponibles", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    credentials: 'include' // ← AJOUTÉ : Pour les cookies httpOnly
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        setError("Session expirée. Redirection vers la connexion...");
                        setTimeout(() => window.location.href = '/login', 2000);
                        return;
                    }
                    throw new Error("Échec de la récupération des chauffeurs.");
                }

                const data = await response.json();
                console.log("Chauffeurs récupérés:", data); // ← AJOUTÉ : Debug
                setChauffeurs(data);
            } catch (error) {
                console.error("Erreur fetch chauffeurs:", error);
                setError("Erreur lors du chargement des chauffeurs.");
            } finally {
                setLoading(false);
            }
        };

        fetchChauffeurs();
    }, []);

    const handleReservation = async (chauffeurId) => {
        if (!reservationId) {
            alert("❌ Erreur: Aucun reservationId trouvé.");
            return;
        }

        try {
            const response = await fetch(`/api/reservations/${chauffeurId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                credentials: 'include', // ← AJOUTÉ : Pour les cookies httpOnly
                body: JSON.stringify({
                    reservationId: parseInt(reservationId),
                })
            });

            const result = await response.json();

            if (response.ok) {
                alert("🚖 Réservation confirmée avec ce chauffeur !");
                window.location.href = '/account';
            } else {
                if (response.status === 401) {
                    alert("❌ Session expirée. Redirection vers la connexion...");
                    window.location.href = '/login';
                    return;
                }

                alert("❌ Erreur : " + (result.error || result.message || "Erreur inconnue"));
                console.error("Erreur lors de la réservation:", result);
            }
        } catch (error) {
            console.error("Erreur de connexion:", error);
            alert("⚠️ Erreur de connexion. Veuillez réessayer.");
        }
    };

    return (
        <div className={styles.container}>
            <h2>Chauffeurs Disponibles</h2>

            {loading ? (
                <p>Chargement des chauffeurs...</p>
            ) : reservationId ? (
                <ul>
                    {chauffeurs.length > 0 ? (
                        chauffeurs.map((chauffeur) => (
                            <li key={chauffeur.id}>
                                <div className={styles.chauffeur_details}>
                                    Prénom : <span className={styles.chauffeur_name}>{chauffeur.name}</span><br />
                                    Numéro de téléphone : <span className={styles.chauffeu_phone}>{chauffeur.phone}</span>
                                </div>
                                <DriverRating driverId={chauffeur.id} />
                                <button
                                    className={styles.reserve_button}
                                    onClick={() => handleReservation(chauffeur.id)}
                                >
                                    Réserver
                                </button>
                            </li>
                        ))
                    ) : (
                        <p>Aucun chauffeur disponible pour le moment.</p>
                    )}
                </ul>
            ) : (
                <p>Chargement de la réservation...</p>
            )}
        </div>
    );
}

export default ChauffeursClientWrapper;
