import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useAuth } from "../hooks/useAuth";
import styles from "../styles/Subscription.module.css";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function SubscriptionForm({ email, priceId, onSuccess }) {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        if (!stripe || !elements) {
            setMessage("Stripe n'est pas encore chargé. Veuillez patienter.");
            setLoading(false);
            return;
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            setMessage("Erreur avec l'élément de carte. Veuillez rafraîchir la page.");
            setLoading(false);
            return;
        }

        try {
            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: "card",
                card: cardElement,
                billing_details: { email }
            });

            if (error) {
                setMessage(error.message);
                setLoading(false);
                return;
            }

            const res = await fetch("/api/subscription/create-subscription", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    paymentMethodId: paymentMethod.id,
                    priceId
                }),
                credentials: 'include'
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 401) {
                    setMessage("❌ Session expirée. Redirection vers la connexion...");
                    setTimeout(() => window.location.href = '/login', 2000);
                    setLoading(false);
                    return;
                }
                throw new Error(data.error?.message || "Erreur lors de la création de l'abonnement");
            }

            if (data.error) {
                setMessage(data.error.message || "Erreur inconnue");
            } else {
                setMessage("✅ Abonnement réussi ! Redirection en cours...");
                if (onSuccess) {
                    setTimeout(() => onSuccess(), 1000);
                }
            }
        } catch (error) {
            console.error("Erreur lors de l'abonnement:", error);
            setMessage(error.message || "Erreur de connexion. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.formContainer}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                    💳 Souscrire à l'abonnement chauffeur
                </h2>

                <div style={{ marginBottom: "15px" }}>
                    <p style={{ color: "#666", fontSize: "14px" }}>
                        📧 <strong>Email :</strong> {email}
                    </p>
                    <p style={{ color: "#666", fontSize: "14px" }}>
                        💰 <strong>Prix :</strong> 29€/mois
                    </p>
                </div>

                <div style={{
                    width: "100%",
                    marginBottom: 20,
                    marginTop: 20,
                    padding: "15px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9"
                }}>
                    <label style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: "bold",
                        color: "#333"
                    }}>
                        Informations de carte bancaire
                    </label>
                    <CardElement options={{
                        style: {
                            base: {
                                fontSize: "16px",
                                color: "#333",
                                backgroundColor: "white",
                                "::placeholder": { color: "#888" }
                            },
                            invalid: {
                                color: "#e74c3c"
                            }
                        }
                    }} />
                </div>

                <button
                    type="submit"
                    disabled={!stripe || loading}
                    className={styles.button}
                    style={{
                        width: "100%",
                        padding: "12px",
                        backgroundColor: loading ? "#ccc" : "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "16px",
                        fontWeight: "bold",
                        cursor: loading ? "not-allowed" : "pointer",
                        transition: "background-color 0.3s ease"
                    }}
                >
                    {loading ? "⏳ Abonnement en cours..." : "🚀 S'abonner (29€/mois)"}
                </button>

                {message && (
                    <div style={{
                        marginTop: "15px",
                        padding: "10px",
                        borderRadius: "4px",
                        backgroundColor: message.includes('✅') ? "#d4edda" : "#f8d7da",
                        color: message.includes('✅') ? "#155724" : "#721c24",
                        border: `1px solid ${message.includes('✅') ? "#c3e6cb" : "#f5c6cb"}`
                    }}>
                        <p className={styles.message}>{message}</p>
                    </div>
                )}

                <div style={{
                    marginTop: "20px",
                    padding: "15px",
                    backgroundColor: "#f0f8ff",
                    borderRadius: "8px",
                    fontSize: "14px",
                    color: "#666"
                }}>
                    <p><strong>ℹ️ Informations importantes :</strong></p>
                    <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
                        <li>Abonnement mensuel de 29€</li>
                        <li>Accès complet à la plateforme chauffeur</li>
                        <li>Annulation possible à tout moment</li>
                        <li>Paiement sécurisé par Stripe</li>
                    </ul>
                </div>
            </form>
        </div>
    );
}

export default function StripeSubscription({ email, priceId, onSuccess }) {
    return (
        <Elements stripe={stripePromise}>
            <SubscriptionForm email={email} priceId={priceId} onSuccess={onSuccess} />
        </Elements>
    );
}