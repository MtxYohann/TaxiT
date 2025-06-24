"use client";

import Image from "next/image";
import styles from "../../styles/page.module.css";
import UploadDocumentsForm from "../../components/formulairedocuments"; 
import { useSession } from "next-auth/react";




export default function DemandeChauffeur() {

    const { data: session, status } = useSession();
    
    return (

        <div className={styles.page}>
            <main className={styles.main}>
                <div>
                {session && <UploadDocumentsForm userId={session.user.id} />}
                </div>
            </main>
            <footer className={styles.footer}>
            </footer>
        </div>

    );
}