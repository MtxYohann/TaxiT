"use client";

import { useState } from "react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!acceptTerms) {
            setError("Vous devez accepter les conditions générales d'utilisation pour vous connecter");
            return;
        }

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });

            const data = await response.json();
            console.log("Réponse complète du serveur:", data);

            if (response.ok) {
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
                <div style={{
                    marginBottom: "15px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "8px"
                }}>
                    <input
                        type="checkbox"
                        id="acceptTerms"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        required
                        style={{
                            marginTop: "2px",
                            transform: "scale(1.1)"
                        }}
                    />
                    <label
                        htmlFor="acceptTerms"
                        style={{
                            fontSize: "14px",
                            lineHeight: "1.4",
                            color: "#333",
                            cursor: "pointer"
                        }}
                    >
                        J'accepte les{" "}
                        <a
                            href="/terms"
                            target="_blank"
                            style={{
                                color: "#0070f3",
                                textDecoration: "underline"
                            }}
                        >
                            conditions générales d'utilisation
                        </a>
                        {" "}et la{" "}
                        <a
                            href="/privacy"
                            target="_blank"
                            style={{
                                color: "#0070f3",
                                textDecoration: "underline"
                            }}
                        >
                            politique de confidentialité
                        </a>
                        <span style={{ color: "red", marginLeft: "2px" }}>*</span>
                    </label>
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
