"use client";

import Image from "next/image";
import styles from "../styles/page.module.css";
import { useAuth } from "../hooks/useAuth";

export default function Home() {
    const { user, loading, isAuthenticated } = useAuth();

    const handleLogout = async () => {
        try {
            // ← MODIFIÉ : Appel à une route de déconnexion côté serveur
            await fetch('/api/logout', {
                method: 'POST',
                mode: 'cors',
                credentials: 'include'
            });

            // ← MODIFIÉ : Plus besoin de localStorage
            window.location.reload();
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
            // Fallback : recharger quand même
            window.location.reload();
        }
    };

    if (loading) {
        return (
            <div className={styles.page}>
                <main className={styles.main}>
                    <p>Chargement...</p>
                </main>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <div className={styles.intro}>
                    <h1 className={styles.title}>
                        {isAuthenticated ? `Bienvenue ${user.name} sur TaxiT !` : 'Bienvenue sur TaxiT !'}
                    </h1>
                    <p className={styles.subtitle}>
                        Réservez facilement votre taxi en ligne, suivez vos réservations et profitez d'un service rapide et fiable.
                    </p>
                </div>

                <div className={styles.features}>
                    <div className={styles.feature}>
                        <Image src="/iconTaxi.png" alt="Réservation rapide" width={50} height={50} />
                        <h3>Réservation rapide</h3>
                        <p>Réservez votre course en quelques clics, où que vous soyez.</p>
                    </div>
                    <div className={styles.feature}>
                        <Image src="/iconChrono.png" alt="Suivi en temps réel" width={50} height={50} />
                        <h3>Suivi en temps réel</h3>
                        <p>Visualisez votre taxi sur la carte et suivez son arrivée.</p>
                    </div>
                    <div className={styles.feature}>
                        <Image src="/iconProfil.png" alt="Espace personnel" width={50} height={50} />
                        <h3>Espace personnel</h3>
                        <p>Consultez l'historique de vos réservations et gérez votre compte.</p>
                    </div>
                </div>

                <div className={styles.ctas}>
                    <a className={styles.primary} href="/maps">
                        <Image src="/iconTaxi.png" alt="Taxi course" width={30} height={30} />
                        Commander un taxi
                    </a>

                    {isAuthenticated ? (
                        // Si connecté : afficher "Mon compte" et "Déconnexion"
                        <>
                            <a className={styles.secondary} href="/account">
                                Mon compte
                            </a>
                            <button className={styles.secondary} onClick={handleLogout}>
                                Se déconnecter
                            </button>
                        </>
                    ) : (
                        // Si pas connecté : afficher "Se connecter" et "S'inscrire"
                        <>
                            <a className={styles.secondary} href="/login">
                                Se connecter
                            </a>
                            <a className={styles.secondary} href="/register">
                                S'inscrire
                            </a>
                        </>
                    )}
                </div>
            </main>

            <footer className={styles.footer}>
                <p>&copy; {new Date().getFullYear()} TaxiT. Tous droits réservés.</p>
            </footer>
        </div>
    );
}