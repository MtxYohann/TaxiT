"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchUserData, deleteAccount, editAccount, getAddressFromCoords } from "../../utils/accountActions";
import { useSession } from "next-auth/react";

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
        <div style={{ maxWidth: "1500px", margin: "0 auto", padding: "20px" }}>
            <h1>Mon Compte</h1>
            <div style={{ marginBottom: "20px" }}>
                <p><strong>Nom :</strong> {user.name}</p>
                <p><strong>Email :</strong> {user.email}</p>
                <p><strong>Téléphone :</strong> {user.phone}</p>
            </div>
            <button
                onClick={() => editAccount(router)}
                style={{
                    padding: "10px",
                    backgroundColor: "#0070f3",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    marginRight: "10px",
                    borderRadius: "8px",
                }}
            >
                Modifier les informations
            </button>
            <button
                onClick={() => deleteAccount(router, setError, user.email)}
                style={{
                    padding: "10px",
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "8px",
                }}
            >
                Supprimer le compte
            </button>

            <div style={{ marginTop: "40px", display: "flex", gap: "40px" }}>
                <div style={{
                    flex: 1,
                    background: "#f5f7fa",
                    borderRadius: "12px",
                    padding: "20px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
                }}>
                    <h2 style={{ borderBottom: "1px solid #e0e0e0", paddingBottom: 8 }}>Réservations à venir</h2>
                    {upcoming.length === 0 ? (
                        <p style={{ color: "#888" }}>Aucune réservation à venir.</p>
                    ) : (
                        <ul style={{ listStyle: "none", padding: 0 }}>
                            {upcoming.map(r => (
                                <li key={r.id} style={{
                                    marginBottom: 18,
                                    padding: "12px 10px",
                                    borderRadius: "8px",
                                    background: "#fff",
                                    boxShadow: "0 1px 4px rgba(0,0,0,0.03)"
                                }}>
                                    <div style={{ fontWeight: "bold", color: "#0070f3" }}>
                                        {new Date(r.dateTime).toLocaleString()} <br />
                                    </div>

                                    <div style={{ margin: "4px 0" }}>
                                        <span style={{ color: "#333" }}>Départ :</span> <span style={{ color: "#444" }}>{pickupAddresses[r.id] || `${r.pickupLat}, ${r.pickupLng}`}</span>
                                        <br />
                                    </div>
                                    <div style={{ margin: "4px 0" }}>
                                        <span style={{ color: "#333" }}>Arrivée :</span> <span style={{ color: "#444" }}>{dropoffAddresses[r.id] || `${r.dropoffLat}, ${r.dropoffLng}`}</span>
                                        <br />
                                    </div>
                                    <div style={{ color: "#666", fontSize: 14 }}>
                                        Etat de la course : <span style={{ color: "#0070f3" }}>{r.status}</span> <br />
                                        Estimation prix : <span style={{ fontWeight: "bold" }}>{r.fare} €</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div style={{
                    flex: 1,
                    background: "#f5f7fa",
                    borderRadius: "12px",
                    padding: "20px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
                }}>
                    <h2 style={{ borderBottom: "1px solid #e0e0e0", paddingBottom: 8 }}>Réservations passées</h2>
                    {past.length === 0 ? (
                        <p style={{ color: "#888" }}>Aucune réservation passée.</p>
                    ) : (
                        <ul style={{ listStyle: "none", padding: 0 }}>
                            {past.map(r => (
                                <li key={r.id} style={{
                                    marginBottom: 18,
                                    padding: "12px 10px",
                                    borderRadius: "8px",
                                    background: "#fff",
                                    boxShadow: "0 1px 4px rgba(0,0,0,0.03)"
                                }}>
                                    <div style={{ fontWeight: "bold", color: "#222" }}>
                                        {new Date(r.dateTime).toLocaleString()}
                                    </div>
                                    <div style={{ margin: "4px 0" }}>
                                        <span style={{ color: "#333" }}>Départ :</span> <span style={{ color: "#444" }}>{pickupAddresses[r.id] || `${r.pickupLat}, ${r.pickupLng}`}</span>
                                        <br />
                                    </div>
                                    <div style={{ margin: "4px 0" }}>
                                        <span style={{ color: "#333" }}>Arrivée :</span> <span style={{ color: "#444" }}>{dropoffAddresses[r.id] || `${r.dropoffLat}, ${r.dropoffLng}`}</span>

                                    </div>
                                    <div style={{ color: "#666", fontSize: 14 }}>
                                        Prix de la course <span style={{ fontWeight: "bold" }}>{r.fare} €</span>
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