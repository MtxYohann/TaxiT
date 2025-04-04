import Link from "next/link";
import styles from "../styles/Navbar.module.css";
import { LoginButton, RegisterButton } from "./buttons";

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <ul>
                <li><Link href="/">Accueil</Link></li>
                <li><Link href="/about">About</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><LoginButton /></li>
                <li><RegisterButton /></li>
            </ul>
        </nav>
    );
}