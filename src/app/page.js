"use client";

import Image from "next/image";
import styles from "../styles/page.module.css";

export default function Home() {
    return (

        <div className={styles.page}>
            <main className={styles.main}>
                <div className={styles.intro}>
                    <h1 className={styles.title}>Bienvenue sur TaxiT !</h1>
                    <p className={styles.subtitle}>
                        Réservez facilement votre taxi en ligne, suivez vos réservations et profitez d’un service rapide et fiable.
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
                        <p>Consultez l’historique de vos réservations et gérez votre compte.</p>
                    </div>
                </div>
                <div className={styles.ctas}>
                    <a className={styles.primary} href="/maps">
                        <Image src="/iconTaxi.png" alt="Taxi course" width={30} height={30} />
                        Commander un taxi
                    </a>
                    <a className={styles.secondary} href="/account">
                        Mon compte
                    </a>
                </div>
            </main>
            <footer className={styles.footer}>
                <p>&copy; {new Date().getFullYear()} TaxiT. Tous droits réservés.</p>
            </footer>
        </div>

    );
}