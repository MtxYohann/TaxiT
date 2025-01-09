import Image from "next/image";
import styles from "../styles/page.module.css";
import RootLayout from "./layout";

export default function Home() {
    return (
        <RootLayout>
            <div className={styles.page}>
                <main className={styles.main}>
                    <div className={styles.ctas}>
                        <a>Suggestion</a>
                        <div >
                            <a className={styles.primary}>
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
                </main>
                <footer className={styles.footer}>
                </footer>
            </div>
        </RootLayout>
    );
}