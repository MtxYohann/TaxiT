import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
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

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement),
            billing_details: { email }
        });
        if (error) {
            setMessage(error.message);
            setLoading(false);
            return;
        }

        const res = await fetch("/api/subscription/create-subscription", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email,
                paymentMethodId: paymentMethod.id,
                priceId
            }),
        });
        const data = await res.json();
        if (data.error) {
            setMessage(data.error.message);
        } else {
            setMessage("Abonnement réussi !");
            if (onSuccess) onSuccess();
        }
        setLoading(false);
    };

    return (
        <div className={styles.formContainer}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h2>Souscrire à l’abonnement chauffeur</h2>
                <div style={{ width: "100%", marginBottom: 20, marginTop: 20 }}>
                    <CardElement options={{
                        style: {
                            base: {
                                fontSize: "16px",
                                color: "#333",
                                "::placeholder": { color: "#888" }
                            }
                        }
                    }} />
                </div>
                <button
                    type="submit"
                    disabled={!stripe || loading}
                    className={styles.button}
                >
                    {loading ? "Abonnement en cours..." : "S'abonner"}
                </button>
                {message && <p className={styles.message}>{message}</p>}
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