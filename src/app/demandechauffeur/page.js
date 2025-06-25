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
        <div className={styles.introBlock}>
          <h1 className={styles.title}>Rejoignez TaxiT en tant que chauffeur !</h1>
          <p className={styles.motivation}>
            🚗 Devenez acteur de la mobilité urbaine et profitez d’une grande flexibilité.<br />
            💸 Augmentez vos revenus en travaillant selon vos disponibilités.<br />
            🤝 Rejoignez une communauté dynamique et bénéficiez d’un accompagnement personnalisé.<br />

            <br />
            Pour postuler, veuillez remplir le formulaire ci-dessous avec vos informations et télécharger les documents requis.
          </p>
          <p className={styles.abonnementInfo}>
            ℹ️ <strong>Important :</strong> Pour finaliser votre inscription en tant que chauffeur TaxiT, un abonnement mensuel est requis. Ce paiement vous donne accès à la plateforme, à la gestion de vos courses et à l’accompagnement de notre équipe.
          </p>
          {session && <UploadDocumentsForm userId={session.user.id} />}
        </div>
      </main>
      <footer className={styles.footer}>
      </footer>
    </div>

  );
}