"use client";
import { useSession } from "next-auth/react";
import StripeSubscription from "../../components/subscription";

export default function SubscriptionPage() {
    const { data: session } = useSession();

    if (!session?.user?.email) {
        return <p>Veuillez vous connecter pour souscrire à un abonnement.</p>;
    }

    return (
        <StripeSubscription
            email={session.user.email}
            priceId="price_1RdRWuQQkPknF24AVtOogMA5"
            onSuccess={() => alert("Abonnement validé !")}
        />
    );
}