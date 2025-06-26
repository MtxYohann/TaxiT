"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; //  Récupère les paramètres URL
import styles from "../../styles/chauffeur.module.css";
import DriverRating from "../../components/DriverRating";

function ChauffeursDisponibles() {
    const [chauffeurs, setChauffeurs] = useState([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const reservationId = searchParams.get("reservationId"); //  Récupération de l'ID depuis l'URL

    //  Vérifie que `reservationId` est bien présent et valide
    useEffect(() => {
        if (!reservationId) {
            console.warn(" Aucun reservationId trouvé dans l'URL.");
        }
    }, [reservationId]);

    //  Récupère les chauffeurs disponibles depuis l'API
    useEffect(() => {
        const fetchChauffeurs = async () => {
            try {
                setLoading(true);
                const response = await fetch("http://localhost:4000/api/chauffeurs-disponibles");
                if (!response.ok) {
                    throw new Error("Échec de la récupération des chauffeurs.");
                }
                const data = await response.json();
                setChauffeurs(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchChauffeurs();
    }, []);

    //  Fonction pour réserver un chauffeur
    const handleReservation = async (chauffeurId) => {
        if (!reservationId) {
            console.error(" Erreur: Aucun reservationId trouvé.");
            return;
        }

        console.log(` Tentative de réservation - Chauffeur ID: ${chauffeurId}, Réservation ID: ${reservationId}`);

        try {
            const response = await fetch(`http://localhost:4000/api/reservations/${chauffeurId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    reservationId: parseInt(reservationId), //  Convertir en `Int`
                }),
            });

            const result = await response.json();
            if (response.ok) {
                console.log(" Réservation mise à jour avec succès !");
                alert("🚖 Réservation confirmée avec ce chauffeur !");

                window.location.href = '/account'
            } else {
                console.error(" Erreur lors de la réservation:", result);
            }
        } catch (error) {
            console.error(" Erreur de connexion:", error);
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
                                    Prénom :<span className={styles.chauffeur_name}>{chauffeur.name}</span>
                                    <br />
                                    Numéro de téléphone :<span className={styles.chauffeu_phone}>{chauffeur.phone}</span>
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

export default ChauffeursDisponibles;
