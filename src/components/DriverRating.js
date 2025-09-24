import { useEffect, useState } from "react";

export default function DriverRating({ driverId }) {
    const [average, setAverage] = useState(null);
    const [count, setCount] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchRating() {
            try {
                const res = await fetch(`/api/reviews/driver/${driverId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    credentials: 'include'
                });

                if (!res.ok) {
                    if (res.status === 401) {
                        console.warn("Session expirée pour récupérer les avis");
                        setError("Session expirée");
                        return;
                    }
                    throw new Error(`Erreur ${res.status}`);
                }

                const data = await res.json();
                setAverage(data.average);
                setCount(data.count);
                setError(null);
            } catch (err) {
                console.error("Erreur lors de la récupération des avis:", err);
                setError(err.message);
                setAverage(0);
                setCount(0);
            }
        }

        if (driverId) {
            fetchRating();
        }
    }, [driverId]);

    if (error) {
        return (
            <span style={{ color: "#666", fontSize: "0.9em" }}>
                ⚠️ Avis indisponibles
            </span>
        );
    }

    if (average === null) {
        return (
            <span style={{ color: "#666" }}>
                📊 Chargement des avis...
            </span>
        );
    }

    return (
        <span>
            <strong>Note moyenne :</strong>&nbsp;
            {[1, 2, 3, 4, 5].map(n => (
                <span
                    key={n}
                    style={{
                        fontSize: "1.3rem",
                        filter: n <= Math.round(average) ? "none" : "grayscale(80%)",
                        marginRight: "2px"
                    }}
                >
                    ⭐
                </span>
            ))}
            <span style={{ marginLeft: "8px", color: "#666", fontSize: "0.9em" }}>
                ({average !== null && average !== undefined ? average.toFixed(1) : "0.0"}/5, {count} avis)
            </span>
        </span>
    );
}