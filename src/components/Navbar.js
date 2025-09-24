"use client";

import Link from "next/link";
import styles from "../styles/Navbar.module.css";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
    const { user, isAuthenticated, loading } = useAuth();

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include'
            });

            if (response.ok) {
                console.log("Déconnexion réussie");
                window.location.href = '/login';
            } else {
                console.error("Erreur lors de la déconnexion");
                window.location.href = '/login';
            }
        } catch (error) {
            console.error('Erreur de déconnexion:', error);
            window.location.href = '/login';
        }
    };

    if (loading) {
        return (
            <nav className={styles.navbar}>
                <ul>
                    <li>Chargement...</li>
                </ul>
            </nav>
        );
    }

    return (
        <nav className={styles.navbar}>
            <ul>
                <li><Link href="/">Accueil</Link></li>
                <li><Link href="/about">About</Link></li>
                <li><Link href="/contact">Contact</Link></li>

                {!isAuthenticated ? (
                    <>
                        <li><Link href="/login">Se connecter</Link></li>
                        <li><Link href="/register">S'inscrire</Link></li>
                    </>
                ) : (
                    <>
                        <li><Link href="/maps">Commander</Link></li>

                        {user?.role === "user" && (
                            <li className={styles.profile}>
                                <Link href="/demandechauffeur">Devenir chauffeur</Link>
                            </li>
                        )}

                        {user?.role === "driver" && (
                            <li className={styles.profile}>
                                <Link href="/courses">🚖 Mes courses</Link>
                            </li>
                        )}

                        <li className={styles.profile}>
                            <Link href="/account">Profile</Link>
                        </li>
                        <li>
                            <button
                                onClick={handleLogout}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'inherit',
                                    cursor: 'pointer',
                                    textDecoration: 'underline'
                                }}
                            >
                                Se déconnecter
                            </button>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
}