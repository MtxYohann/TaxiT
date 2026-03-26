"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth"; // ← CHANGÉ : Remplace useSession par useAuth
import { fetchUserData } from "../../utils/accountActions";

export default function EditAccountPage() {
    const [user, setUser] = useState(null);
    const [reservations, setReservations] = useState([]); // ← AJOUTÉ : Pour fetchUserData
    const { user: authUser, isAuthenticated, loading, token } = useAuth(); // ← CHANGÉ : Utilise useAuth
    const router = useRouter();
    const [form, setForm] = useState({ name: "", phone: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ← CHANGÉ : Vérification d'authentification et récupération des données
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
            return;
        }

        if (isAuthenticated) {
            // ← CHANGÉ : Plus besoin de passer l'email, fetchUserData utilise localStorage
            fetchUserData(
                (data) => {
                    setUser({
                        id: data.id,
                        name: data.name,
                        email: data.email,
                        phone: data.phone,
                    });
                    setForm({
                        name: data.name || "",
                        phone: data.phone || "",
                    });
                },
                setReservations, // ← AJOUTÉ : Paramètre requis pour fetchUserData
                setError
            );
        }
    }, [isAuthenticated, loading, router]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("process.env.next_public_api_url/api/edit-account", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}` // ← AJOUTÉ : Token d'authentification
                },
                body: JSON.stringify({
                    email: authUser.email, // ← CHANGÉ : Utilise authUser au lieu de session
                    name: form.name,
                    phone: form.phone,
                }),
                mode: 'cors'
            });
            if (!res.ok) throw new Error("Erreur lors de la modification.");
            setSuccess("Compte modifié !");
            setTimeout(() => router.push("/account"), 1500);
        } catch (err) {
            setError(err.message);
        }
    };

    // ← AJOUTÉ : État de chargement
    if (loading) {
        return <p>Chargement...</p>;
    }

    // ← AJOUTÉ : Redirection si pas connecté
    if (!isAuthenticated) {
        return null;
    }

    if (!user) {
        return <p>Chargement des informations utilisateur...</p>;
    }

    return (
        <div style={{ maxWidth: 400, margin: "0 auto", padding: 20 }}>
            <h1>Modifier mon compte</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 10 }}>
                    <label>Nom :</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", padding: 8, marginTop: 5 }}
                    />
                </div>
                <div style={{ marginBottom: 10 }}>
                    <label>Téléphone :</label>
                    <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        pattern="^(\+33|0)[1-9](\d{2}){4}$"
                        style={{ width: "100%", padding: 8, marginTop: 5 }}
                    />
                </div>
                {error && <p style={{ color: "red" }}>{error}</p>}
                {success && <p style={{ color: "green" }}>{success}</p>}
                <button
                    type="submit"
                    style={{
                        width: "100%",
                        padding: 10,
                        backgroundColor: "#0070f3",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                    }}
                >
                    Enregistrer
                </button>
            </form>
        </div>
    );
}