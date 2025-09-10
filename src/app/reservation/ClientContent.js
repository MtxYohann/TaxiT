'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from '../../styles/chauffeur.module.css';
import DriverRating from "../../components/DriverRating";

function ChauffeursClientWrapper() {
    const [chauffeurs, setChauffeurs] = useState([]);
    const [loading, setLoading] = useState(true);
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
                const response = await fetch("http://loadbalancer-backend-taxit-1400536818.eu-west-3.elb.amazonaws.com:4000/api/chauffeurs-disponibles");
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

    const handleReservation = async (chauffeurId) => {
        if (!reservationId) {
            console.error("Erreur: Aucun reservationId trouvé.");
            return;
        }

        try {
            const response = await fetch(`http://loadbalancer-backend-taxit-1400536818.eu-west-3.elb.amazonaws.com:4000/api/reservations/${chauffeurId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    reservationId: parseInt(reservationId),
                }),
                mode: 'cors'
            });

            const result = await response.json();
            if (response.ok) {
                alert("🚖 Réservation confirmée avec ce chauffeur !");
                window.location.href = '/account';
            } else {
                console.error("Erreur lors de la réservation:", result);
            }
        } catch (error) {
            console.error("Erreur de connexion:", error);
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
