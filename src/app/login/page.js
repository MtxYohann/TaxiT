"use client";

import { useState } from "react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://13.38.221.141:4000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            
            // 🔥 AJOUTE CETTE LIGNE POUR DÉBUGGER
            console.log("Réponse complète du serveur:", data);

            if (response.ok) {
                // 🔥 AJOUTE CES VÉRIFICATIONS
                console.log("Token reçu:", data.token);
                console.log("User reçu:", data.user);
                
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    console.log("✅ Token sauvegardé");
                } else {
                    console.error("❌ Aucun token reçu du serveur");
                }
                
                if (data.user) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                    console.log("✅ User sauvegardé:", JSON.stringify(data.user));
                } else {
                    console.error("❌ Aucune donnée utilisateur reçue du serveur");
                }

                // Vérification de ce qui est vraiment dans le localStorage
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