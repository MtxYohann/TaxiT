"use client";

import { useState } from "react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('process.env.next_public_api_url/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, password }),
                mode: 'cors'
            });

            const data = await response.json();
            console.log("Réponse complète du serveur:", data);

            if (response.ok) {
                console.log("Token reçu:", data.token);

                if (data.token) {
                    localStorage.setItem('token', data.token);
                    console.log("✅ Token sauvegardé");
                }

                // Sauvegarde directe de toutes les données utilisateur
                localStorage.setItem('user', JSON.stringify(data));
                console.log("✅ User sauvegardé:", JSON.stringify(data));

                // Vérification
                console.log("🔍 Vérification localStorage:");
                console.log("Token dans localStorage:", localStorage.getItem('token'));
                console.log("User dans localStorage:", localStorage.getItem('user'));

                console.log("Connexion réussie");
                window.location.href = "/";
            } else {
                setError(data.error || "Erreur de connexion");
            }
        } catch (err) {
            console.error("Erreur:", err);
            setError("Erreur de connexion au serveur");
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
            <h1>Connexion</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "10px" }}>
                    <label>Email :</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                    />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label>Mot de passe :</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                    />
                </div>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button
                    type="submit"
                    style={{
                        width: "100%",
                        padding: "10px",
                        backgroundColor: "#0070f3",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                    }}
                >
                    Se connecter
                </button>
            </form>
        </div>
    );
}
