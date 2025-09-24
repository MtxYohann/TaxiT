"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";

export default function EditAccountPage() {
    const [form, setForm] = useState({ name: "", phone: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const { user: authUser, isAuthenticated, loading } = useAuth();
    const router = useRouter();


    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
            return;
        }

        if (authUser) {
            setForm({
                name: authUser.name || "",
                phone: authUser.phone || "",
            });
        }
    }, [isAuthenticated, loading, router, authUser]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/edit-account", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({

                    name: form.name,
                    phone: form.phone,
                }),
                credentials: 'include'
            });

            if (!res.ok) throw new Error("Erreur lors de la modification.");
            setSuccess("Compte modifié !");
            setTimeout(() => router.push("/account"), 1500);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return <p>Chargement...</p>;
    }

    if (!isAuthenticated) {
        return null;
    }

    if (!authUser) {
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
                        style={{
                            width: "100%",
                            padding: 8,
                            marginTop: 5,
                            borderRadius: "4px",
                            border: "1px solid #ccc"
                        }}
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
                        placeholder="06 12 34 56 78 ou +33 6 12 34 56 78"
                        style={{
                            width: "100%",
                            padding: 8,
                            marginTop: 5,
                            borderRadius: "4px",
                            border: "1px solid #ccc"
                        }}
                    />
                    <small style={{ color: "#666" }}>
                        Format attendu : 06 12 34 56 78 ou +33 6 12 34 56 78
                    </small>
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
                        borderRadius: "8px",
                        cursor: "pointer",
                        marginTop: 10
                    }}
                >
                    Enregistrer
                </button>
            </form>
        </div>
    );
}