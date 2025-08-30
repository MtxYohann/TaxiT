"use client";

import Image from "next/image";
import styles from "../../styles/page.module.css";
import UploadDocumentsForm from "../../components/formulairedocuments";
import { useAuth } from "../../hooks/useAuth"; // ← CHANGÉ : Remplace useSession par useAuth
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DemandeChauffeur() {
  const { user, isAuthenticated, loading } = useAuth(); // ← CHANGÉ : Utilise useAuth
  const router = useRouter();

  // ← AJOUTÉ : Vérification de l'authentification
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  // ← AJOUTÉ : État de chargement
  if (loading) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <p>Chargement...</p>
        </main>
      </div>
    );
  }

  // ← AJOUTÉ : Redirection si pas connecté
  if (!isAuthenticated) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.introBlock}>
            <h1 className={styles.title}>Connexion requise</h1>
            <p>Veuillez vous connecter pour accéder à cette page.</p>
            <button 
              onClick={() => router.push('/login')}
              style={{
                padding: "10px 20px",
                backgroundColor: "#007BFF",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              Se connecter
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.introBlock}>
          <h1 className={styles.title}>Rejoignez TaxiT en tant que chauffeur !</h1>
          <p className={styles.motivation}>
            🚗 Devenez acteur de la mobilité urbaine et profitez d'une grande flexibilité.<br />
            💸 Augmentez vos revenus en travaillant selon vos disponibilités.<br />
            🤝 Rejoignez une communauté dynamique et bénéficiez d'un accompagnement personnalisé.<br />

            <br />
            Pour postuler, veuillez remplir le formulaire ci-dessous avec vos informations et télécharger les documents requis.
          </p>
          <p className={styles.abonnementInfo}>
            ℹ️ <strong>Important :</strong> Pour finaliser votre inscription en tant que chauffeur TaxiT, un abonnement mensuel est requis. Ce paiement vous donne accès à la plateforme, à la gestion de vos courses et à l'accompagnement de notre équipe.
          </p>
          {/* ← CHANGÉ : Utilise user au lieu de session */}
          {user && <UploadDocumentsForm userId={user.id} />}
        </div>
      </main>
      <footer className={styles.footer}>
      </footer>
    </div>
  );
}