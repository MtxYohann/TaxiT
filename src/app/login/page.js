"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("Formulaire soumis"); // Vérifie si cette ligne s'affiche
        console.log("Email:", email);
        console.log("Password:", password);

        try {
            const result = await signIn("credentials", {
                redirect: false, // Empêche la redirection automatique
                email,
                password,
            });

            console.log("Résultat de signIn :", result); // Vérifie si cette ligne s'affiche

            if (result?.error) {
                console.log("Erreur détectée :", result.error); // Vérifie si une erreur est détectée
                setError("Identifiants incorrects. Veuillez réessayer.");
            } else {
                console.log("Connexion réussie, redirection..."); // Vérifie si la connexion réussit
                window.location.href = "/";
            }
        } catch (err) {
            console.error("Erreur dans handleSubmit :", err); // Capture les erreurs inattendues
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