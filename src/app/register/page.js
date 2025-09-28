"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!acceptTerms) {
            setError("Vous devez accepter les conditions générales d'utilisation pour vous inscrire");
            return;
        }

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ email, password, name, phone }),
                credentials: 'include'
            });

            if (!res.ok) {
                const { error } = await res.json();
                throw new Error(error || "Erreur lors de l'inscription");
            }

            setSuccess("Inscription réussie ! Vous pouvez maintenant vous connecter.");
            setError("");

            setTimeout(() => {
                router.push("/login");
            }, 500);

        } catch (err) {
            setError(err.message);
            setSuccess("");
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
            <h1>Inscription</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "10px" }}>
                    <label>Prénom :</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{
                            width: "100%",
                            padding: "8px",
                            marginTop: "5px",
                            borderRadius: "4px",
                            border: "1px solid #ccc"
                        }}
                    />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label>Email :</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            width: "100%",
                            padding: "8px",
                            marginTop: "5px",
                            borderRadius: "4px",
                            border: "1px solid #ccc"
                        }}
                    />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label>Téléphone :</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        pattern="^(\+33|0)[1-9](\d{2}){4}$"
                        placeholder="06 12 34 56 78 ou +33 6 12 34 56 78"
                        style={{
                            width: "100%",
                            padding: "8px",
                            marginTop: "5px",
                            borderRadius: "4px",
                            border: "1px solid #ccc"
                        }}
                    />
                    <small style={{ color: "#666" }}>
                        Format attendu : 06 12 34 56 78 ou +33 6 12 34 56 78
                    </small>
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label>Mot de passe :</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength="6"
                        style={{
                            width: "100%",
                            padding: "8px",
                            marginTop: "5px",
                            borderRadius: "4px",
                            border: "1px solid #ccc"
                        }}
                    />
                    <small style={{ color: "#666" }}>
                        Minimum 6 caractères
                    </small>
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
                {success && <p style={{ color: "green" }}>{success}</p>}
                <button
                    type="submit"
                    style={{
                        width: "100%",
                        padding: "10px",
                        backgroundColor: "#0070f3",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        marginTop: "10px"
                    }}
                >
                    S'inscrire
                </button>
            </form>
            <div style={{ textAlign: "center", marginTop: "20px" }}>
                <p>Déjà inscrit ?{" "}
                    <button
                        onClick={() => router.push("/login")}
                        style={{
                            background: "none",
                            border: "none",
                            color: "#0070f3",
                            textDecoration: "underline",
                            cursor: "pointer"
                        }}
                    >
                        Se connecter
                    </button>
                </p>
            </div>
        </div>
    );
}