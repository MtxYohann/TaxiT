"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchUserData, deleteAccount, getAddressFromCoords } from "../../utils/accountActions";
import { useAuth } from "../../hooks/useAuth";
import { formatLocalDateTime } from "../../utils/dateUtils";
import Adminbutton from "../../components/adminbutton";
import CommandeChauffeurBouton from "../../components/commandesbuttonchauffeur";
import ReviewButton from "../../components/reviewButton";
import styles from "../../styles/Account.module.css";

export default function AccountPage() {
    const [user, setUser] = useState(null);
    const [reservations, setReservations] = useState([]);
    const [error, setError] = useState("");
    const router = useRouter();
    const [pickupAddresses, setPickupAddresses] = useState({});
    const [dropoffAddresses, setDropoffAddresses] = useState({});
    const { user: authUser, isAuthenticated, loading } = useAuth();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
            return;
        }

        if (isAuthenticated && authUser) {
            setUser(authUser);


            const fetchReservations = async () => {
                try {
                    const resResa = await fetch(`/api/reservations/${authUser.id}`, {
                        method: 'GET',
                        credentials: 'include',
                        mode: 'cors',
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });

                    if (!resResa.ok) throw new Error("Impossible de récupérer les réservations.");
                    const reservationsData = await resResa.json();
                    console.log("Données réservations :", reservationsData);
                    setReservations(reservationsData);
                } catch (err) {
                    setError(err.message);
                }
            };

            fetchReservations();
        }
    }, [isAuthenticated, loading, router, authUser]);

    useEffect(() => {
        async function fetchAddresses() {
            const pickup = {};
            const dropoff = {};
            for (const r of reservations) {
                if (!pickup[r.id]) {
                    pickup[r.id] = await getAddressFromCoords(r.pickupLat, r.pickupLng);
                }
                if (!dropoff[r.id]) {
                    dropoff[r.id] = await getAddressFromCoords(r.dropoffLat, r.dropoffLng);
                }
            }
            setPickupAddresses(pickup);
            setDropoffAddresses(dropoff);
        }
        if (reservations.length > 0) fetchAddresses();
    }, [reservations]);

    if (loading) {
        return <p>Chargement...</p>;
    }

    if (!isAuthenticated) {
        return null;
    }

    if (error) {
        return <p style={{ color: "red" }}>{error}</p>;
    }

    if (!user) {
        return <p>Chargement des informations utilisateur...</p>;
    }

    const now = new Date();

    const upcoming = reservations
        .filter(r => new Date(r.dateTime) > now)
        .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
    const past = reservations
        .filter(r => new Date(r.dateTime) <= now)
        .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));

    return (
        <div className={styles.pageContainer}>
            <h1 className={styles.header}>Mon Compte</h1>
            <div className={styles.userInfo}>
                <p><strong>Nom :</strong> {user.name}</p>
                <p><strong>Email :</strong> {user.email}</p>
                <p><strong>Téléphone :</strong> {user.phone}</p>
                {user.isDriverRequested && (
                    <p><strong>Statut de chauffeur :</strong> En attente de validation</p>
                )}
                {user.isApproved === true && !user.subscriptionId && (
                    <p>
                        <strong>Statut de chauffeur :</strong> Votre compte chauffeur est approuvé, vous devez maintenant vous abonner pour accéder à la plateforme.
                    </p>
                )}
                {user.isApproved === true && user.subscriptionId && (
                    <p>
                        <strong>Statut de chauffeur :</strong> Vous êtes un chauffeur abonné, bienvenue sur la plateforme !
                    </p>
                )}
            </div>
            <button
                onClick={() => router.push("/edit-account")}
                className={styles.button}
                style={{ borderRadius: "8px" }}
            >
                Modifier les informations
            </button>
            <button
                onClick={() => deleteAccount(router, setError)}
                className={styles.button}
                style={{ backgroundColor: "red", borderRadius: "8px" }}
            >
                Supprimer le compte
            </button>
            <Adminbutton />
            <CommandeChauffeurBouton />
            {user.subscriptionId === null && user.isApproved === true && (
                <button
                    className={styles.button}
                    style={{ backgroundColor: "#0070f3", borderRadius: "8px" }}
                    onClick={() => router.push("/subscription")}
                >
                    S'abonner
                </button>
            )}
            {user.subscriptionId && (
                <button
                    className={styles.button}
                    style={{ backgroundColor: "#ff9800", marginBottom: "16px", borderRadius: "8px" }}
                    onClick={async () => {
                        // ← MODIFIÉ : Utilise credentials au lieu du token Authorization
                        const res = await fetch("/api/subscription/cancel-subscription", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Accept": "application/json"
                            },
                            credentials: 'include',
                            mode: 'cors'
                        });
                        const data = await res.json();
                        if (data.success) {
                            alert("Abonnement annulé !");
                        } else {
                            alert("Erreur : " + (data.error?.message || data.error));
                        }
                    }}
                >
                    Se désabonner
                </button>
            )}
            <div className={styles.reservationsWrapper}>
                <div className={styles.reservationColumn}>
                    <h2 className={styles.reservationTitle}>Réservations à venir</h2>
                    {upcoming.length === 0 ? (
                        <p className={styles.emptyText}>Aucune réservation à venir.</p>
                    ) : (
                        <ul className={styles.reservationList}>
                            {upcoming.map(r => (
                                <li key={r.id} className={styles.reservationItem}>
                                    <div className={styles.reservationDate}>
                                        {formatLocalDateTime(r.dateTime)}
                                    </div>
                                    <div className={styles.reservationInfo}>
                                        <span>Départ :</span>
                                        <span className={styles.reservationAddress}> {pickupAddresses[r.id] || `${r.pickupLat}, ${r.pickupLng}`}</span>
                                    </div>
                                    <div className={styles.reservationInfo}>
                                        <span>Arrivée :</span>
                                        <span className={styles.reservationAddress}> {dropoffAddresses[r.id] || `${r.dropoffLat}, ${r.dropoffLng}`}</span>
                                    </div>
                                    <div className={styles.reservationInfo}>
                                        Etat de la course : <span className={styles.reservationStatus}>{r.status}</span>
                                        <br />
                                        Estimation prix : <span className={styles.reservationFare}>{r.fare} €</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className={styles.reservationColumn}>
                    <h2 className={styles.reservationTitle}>Réservations passées</h2>
                    {past.length === 0 ? (
                        <p className={styles.emptyText}>Aucune réservation passée.</p>
                    ) : (
                        <ul className={styles.reservationList}>
                            {past.map(r => (
                                <li key={r.id} className={styles.reservationItem}>
                                    <div className={styles.reservationDatePast}>
                                        {formatLocalDateTime(r.dateTime)}
                                    </div>
                                    <div className={styles.reservationInfo}>
                                        <span>Départ :</span>
                                        <span className={styles.reservationAddress}> {pickupAddresses[r.id] || `${r.pickupLat}, ${r.pickupLng}`}</span>
                                    </div>
                                    <div className={styles.reservationInfo}>
                                        <span>Arrivée :</span>
                                        <span className={styles.reservationAddress}> {dropoffAddresses[r.id] || `${r.dropoffLat}, ${r.dropoffLng}`}</span>
                                    </div>
                                    <div className={styles.reservationInfo}>
                                        Prix de la course : <span className={styles.reservationFare}>{r.fare} €</span>
                                    </div>
                                    {r.driverId && (
                                        <ReviewButton driverId={r.driverId} reservationId={r.id} />
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}