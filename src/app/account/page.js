"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchUserData, deleteAccount, editAccount } from "../../utils/accountActions";
import { useSession } from "next-auth/react";

export default function AccountPage() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const router = useRouter();

    const { data: session } = useSession();

    useEffect(() => {
        if (session?.user?.email) {
            fetchUserData(session.user.email, setUser, setError);
        }
    }, [session]);

    if (error) {
        return <p style={{ color: "red" }}>{error}</p>;
    }

    if (!user) {
        return <p>Chargement des informations utilisateur...</p>;
    }

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
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
        </div>
    );
}