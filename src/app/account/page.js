"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchUserData, deleteAccount, editAccount, getAddressFromCoords } from "../../utils/accountActions";
import { useSession } from "next-auth/react";
import Adminbutton from "../../components/adminbutton";
import CommandeChauffeurBouton from "../../components/commandesbuttonchauffeur";
import styles from "../../styles/Account.module.css";


export default function AccountPage() {
    const [user, setUser] = useState(null);
    const [reservations, setReservations] = useState([]);
    const [error, setError] = useState("");
    const router = useRouter();
    const [pickupAddresses, setPickupAddresses] = useState({});
    const [dropoffAddresses, setDropoffAddresses] = useState({});
    const { data: session } = useSession();

    useEffect(() => {
        if (session?.user?.email) {
            fetchUserData(session.user.email, setUser, setReservations, setError);
        }
    }, [session]);
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
            </div>
            <button
                onClick={() => editAccount(router)}
                className={styles.button}
            >
                Modifier les informations
            </button>
            <button
                onClick={() => deleteAccount(router, setError, user.email)}
                className={styles.button}
                style={{ backgroundColor: "red" }}
            >
                Supprimer le compte
            </button>
            <Adminbutton />
            <CommandeChauffeurBouton />

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
                                        {new Date(r.dateTime).toLocaleString()}
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
                                        {new Date(r.dateTime).toLocaleString()}
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
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}