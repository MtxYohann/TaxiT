"use client";

import Link from "next/link";
import styles from "../styles/Navbar.module.css";
import { useAuth } from "../hooks/useAuth"; // ← CHANGÉ : Remplace useSession par useAuth

export default function Navbar() {
    const { user, isAuthenticated, loading } = useAuth(); // ← CHANGÉ : Utilise useAuth

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
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
                    // Si pas connecté : afficher login/register
                    <>
                        <li><Link href="/login">Se connecter</Link></li>
                        <li><Link href="/register">S'inscrire</Link></li>
                    </>
                ) : (
                    // Si connecté : afficher les options utilisateur
                    <>
                        <li><Link href="/maps">Commander</Link></li>
                        {user?.role === "user" && (
                            <li className={styles.profile}>
                                <Link href="/demandechauffeur">Devenir chauffeur</Link>
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