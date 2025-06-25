import Link from "next/link";
import styles from "../styles/Navbar.module.css";
import { LoginButton, RegisterButton } from "./buttons";
import { useSession } from "next-auth/react";

export default function Navbar() {
    const { data: session } = useSession();
    return (
        <nav className={styles.navbar}>
            <ul>
                <li ><Link href="/">Accueil</Link></li>
                <li ><Link href="/about">About</Link></li>
                <li ><Link href="/contact">Contact</Link></li>
                <li ><LoginButton /></li>
                <li ><RegisterButton /></li>
                {session?.user?.role === "user" && (
                    <li className={styles.profile}><Link href="/demandechauffeur">Devenir chauffeur</Link></li>
                )}
                {session?.user && (
                    <li className={styles.profile}><Link href="/account">Profile</Link></li>
                )}

            </ul>
        </nav>
    );
}