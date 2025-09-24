"use client";
import { useAuth } from "../../hooks/useAuth";
import StripeSubscription from "../../components/subscription";

export default function SubscriptionPage() {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) {
        return <p>Chargement...</p>;
    }

    if (!isAuthenticated || !user?.email) {
        return (
            <div style={{
                textAlign: "center",
                padding: "50px",
                backgroundColor: "#f8d7da",
                color: "#721c24",
                borderRadius: "8px",
                margin: "20px"
            }}>
                <h2>🔒 Accès restreint</h2>
                <p>Veuillez vous connecter pour souscrire à un abonnement.</p>
                <button
                    onClick={() => window.location.href = '/login'}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        marginTop: "15px"
                    }}
                >
                    Se connecter
                </button>
            </div>
        );
    }

    return (
        <div style={{ padding: "20px" }}>
            <StripeSubscription
                email={user.email}
                priceId="price_1RdRWuQQkPknF24AVtOogMA5"
                onSuccess={() => {
                    alert("✅ Abonnement validé ! Redirection vers votre profil...");
                    window.location.href = '/account';
                }}
            />
        </div>
    );
}