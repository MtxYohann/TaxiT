"use client";

import Image from "next/image";
import styles from "../../styles/page.module.css";


const handleRequestDriver = async (userId) => {
  try {
    const response = await fetch(`http://localhost:4000/api/request-driver`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }), // ← envoie le bon ID
    });

    const result = await response.json();

    if (response.ok) {
      alert("Demande envoyée ! En attente de validation par un administrateur.");
    } else {
      alert("Erreur : " + result.message);
    }
  } catch (error) {
    console.error("Erreur lors de la demande chauffeur :", error);
    alert("Une erreur est survenue.");
  }
};

export default function DemandeChauffeur() {
  const utilisateurConnecte = {
    id: 2, // ← TEMPORAIRE ! Mets ici un vrai ID pour tester
  };
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
            Cliquez sur le bouton ci-dessous pour envoyer votre demande et commencer l’aventure TaxiT !
          </p>
          <button className={styles.ctaButton} onClick={() => handleRequestDriver(utilisateurConnecte.id)}>
            Devenir Chauffeur
          </button>
        </div>
      </main>
      <footer className={styles.footer}></footer>
    </div>
  );
}