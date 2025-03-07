import Link from "next/link";
import styles from "../styles/Navbar.module.css";

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <ul>
                <li><Link href="/">Accueil</Link></li>
                <li><Link href="/maps">Réservation</Link></li>
                <li><Link href="/contact">Contact</Link></li>
            </ul>
        </nav>
    );
}