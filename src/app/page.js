import Image from "next/image";
import styles from "../styles/page.module.css";

export default function Home() {
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <h1 className={styles.title}>TaxiT</h1>
                <div className={styles.container}>
                    <div>
                        <Image src="/ville.jpg" alt="Ville" width={650} height={430} className={styles.image} />
                    </div>
                    <div className={styles.ctas}>
                        <a>Suggestion</a>
                        <div >
                            <a className={styles.primary}
                                href="/maps">
                                <Image
                                    src="/iconTaxi.png"
                                    alt="Taxi course"
                                    width={50}
                                    height={50}
                                />
                                course
                            </a>
                            <a className={styles.primary}>Read our docs</a>
                        </div>
                    </div>
                </div>
            </main>
            <footer className={styles.footer}>
            </footer>
        </div>

    );
}