import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

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

        const res = await fetch("http://localhost:4000/api/subscription/create-subscription", {
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
        <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "0 auto" }}>
            <CardElement />
            <button type="submit" disabled={!stripe || loading} style={{ marginTop: 20 }}>
                {loading ? "Abonnement en cours..." : "S'abonner"}
            </button>
            {message && <p>{message}</p>}
        </form>
    );
}

export default function StripeSubscription({ email, priceId, onSuccess }) {
    return (
        <Elements stripe={stripePromise}>
            <SubscriptionForm email={email} priceId={priceId} onSuccess={onSuccess} />
        </Elements>
    );
}