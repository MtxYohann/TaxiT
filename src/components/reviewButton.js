import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function ReviewButton({ driverId, reservationId }) {
    const [showForm, setShowForm] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [message, setMessage] = useState("");
    const { user, isAuthenticated } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!isAuthenticated || !user) {
            setMessage("Vous devez être connecté pour laisser un avis.");
            return;
        }

        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify({
                    driverId: parseInt(driverId),
                    rating: parseInt(rating),
                    comment
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage("Erreur : " + (data.error || "Erreur inconnue"));
            } else {
                setMessage("✅ Avis envoyé avec succès !");
                setShowForm(false);

                setRating(5);
                setComment("");
            }
        } catch (error) {
            console.error("Erreur envoi avis:", error);
            setMessage("⚠️ Erreur de connexion");
        }
    };

    return (
        <div>
            <button
                style={{
                    marginTop: 8,
                    background: "#0070f3",
                    color: "#fff",
                    borderRadius: 8,
                    padding: "6px 16px",
                    border: "none",
                    cursor: "pointer"
                }}
                onClick={() => setShowForm(true)}
                disabled={!isAuthenticated}
            >
                🚗 Laisser un avis
            </button>

            {showForm && (
                <div style={{
                    marginTop: 10,
                    padding: "15px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9"
                }}>
                    <form onSubmit={handleSubmit}>
                        <label style={{ display: "block", marginBottom: "10px" }}>
                            <strong>Note :</strong>
                            <div style={{ marginTop: 8 }}>
                                {[1, 2, 3, 4, 5].map((n) => (
                                    <span
                                        key={n}
                                        style={{
                                            cursor: "pointer",
                                            fontSize: "1.5rem",
                                            marginRight: 4,
                                            filter: n <= rating ? "none" : "grayscale(80%)",
                                            transition: "filter 0.2s"
                                        }}
                                        onClick={() => setRating(n)}
                                        role="button"
                                        aria-label={`${n} étoile${n > 1 ? "s" : ""}`}
                                    >
                                        🚗
                                    </span>
                                ))}
                                <span style={{ marginLeft: 10, color: "#666" }}>
                                    ({rating}/5)
                                </span>
                            </div>
                        </label>

                        <label style={{ display: "block", marginBottom: "10px" }}>
                            <strong>Commentaire (optionnel) :</strong>
                            <textarea
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                                rows={3}
                                placeholder="Partagez votre expérience..."
                                style={{
                                    width: "100%",
                                    marginTop: 5,
                                    padding: "8px",
                                    borderRadius: "4px",
                                    border: "1px solid #ccc"
                                }}
                            />
                        </label>

                        <div style={{ marginTop: 10 }}>
                            <button
                                type="submit"
                                style={{
                                    background: "#28a745",
                                    color: "#fff",
                                    borderRadius: 6,
                                    padding: "8px 16px",
                                    border: "none",
                                    marginRight: 10,
                                    cursor: "pointer"
                                }}
                            >
                                📤 Envoyer l'avis
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false);
                                    setMessage("");
                                }}
                                style={{
                                    background: "#6c757d",
                                    color: "#fff",
                                    borderRadius: 6,
                                    padding: "8px 16px",
                                    border: "none",
                                    cursor: "pointer"
                                }}
                            >
                                ❌ Annuler
                            </button>
                        </div>

                        {message && (
                            <div style={{
                                marginTop: 10,
                                padding: "8px",
                                borderRadius: "4px",
                                backgroundColor: message.includes('✅') ? "#d4edda" : "#f8d7da",
                                color: message.includes('✅') ? "#155724" : "#721c24",
                                border: `1px solid ${message.includes('✅') ? "#c3e6cb" : "#f5c6cb"}`
                            }}>
                                {message}
                            </div>
                        )}
                    </form>
                </div>
            )}
        </div>
    );
}