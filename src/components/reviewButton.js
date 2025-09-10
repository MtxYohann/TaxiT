import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function ReviewButton({ driverId, reservationId }) {
    const [showForm, setShowForm] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [message, setMessage] = useState("");
    const { user, token, isAuthenticated } = useAuth();

    // Récupère l'id de l'utilisateur connecté
    const authorId = user?.id;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        if (!authorId) {
            setMessage("Vous devez être connecté pour laisser un avis.");
            return;
        }
        const res = await fetch("http://loadbalancer-backend-taxit-1400536818.eu-west-3.elb.amazonaws.com:4000/api/reviews", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ authorId, driverId, rating, comment }),
            mode: 'cors'
        });
        const data = await res.json();
        if (data.error) {
            setMessage("Erreur : " + data.error);
        } else {
            setMessage("Avis envoyé !");
            setShowForm(false);
        }
    };

    return (
        <div>
            <button
                style={{ marginTop: 8, background: "#0070f3", color: "#fff", borderRadius: 6, padding: "6px 16px", border: "none", cursor: "pointer" }}
                onClick={() => setShowForm(true)}
                disabled={!isAuthenticated}
            >
                Laisser un avis
            </button>
            {showForm && (
                <form onSubmit={handleSubmit} style={{ marginTop: 10 }}>
                    <label>
                        Note :
                        <span style={{ marginLeft: 8 }}>
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
                                    aria-label={`${n} voiture${n > 1 ? "s" : ""}`}
                                >
                                    🚗
                                </span>
                            ))}
                        </span>
                    </label>
                    <br />
                    <label>
                        Commentaire :
                        <textarea value={comment} onChange={e => setComment(e.target.value)} rows={2} style={{ width: "100%", marginTop: 4 }} />
                    </label>
                    <br />
                    <button type="submit" style={{ marginTop: 6, background: "#0070f3", color: "#fff", borderRadius: 6, padding: "6px 16px", border: "none" }}>
                        Envoyer
                    </button>
                    <button type="button" onClick={() => setShowForm(false)} style={{ marginLeft: 8 }}>
                        Annuler
                    </button>
                    {message && <div style={{ marginTop: 6, color: "#0070f3" }}>{message}</div>}
                </form>
            )}
        </div>
    );
}