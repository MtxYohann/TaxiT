"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import styles from "../styles/formulairedocuments.module.css";

const handleRequestDriver = async (userId) => {
  try {
    const response = await fetch(`http://13.38.221.141:4000/api/request-driver`, {
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


export default function UploadDocumentsForm({ userId }) {
  const [permis, setPermis] = useState(null);
  const [carte, setCarte] = useState(null);
  const [message, setMessage] = useState("");



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!permis || !carte) {
      setMessage("Merci de sélectionner les deux fichiers.");
      return;
    }

    const formData = new FormData();
    formData.append("permis", permis);
    formData.append("carte", carte);

    try {
      const res = await fetch(`http://13.38.221.141:4000/api/upload-documents/${userId}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("📁 Documents envoyés avec succès !");
        await handleRequestDriver(userId); // ← appelle la fonction pour envoyer la demande
      } else {
        setMessage(`Erreur : ${data.error || "Erreur inconnue"}`);
      }
    } catch (err) {
      console.error("Erreur upload :", err);
      setMessage("Erreur lors de l'envoi.");
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>📄 Envoi des documents chauffeur</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Permis de conduire :</label>
          <input className={styles.inputFile} type="file" accept="image/*,.pdf" onChange={(e) => setPermis(e.target.files[0])} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Carte chauffeur :</label>
          <input className={styles.inputFile} type="file" accept="image/*,.pdf" onChange={(e) => setCarte(e.target.files[0])} />
        </div>
        <button type="submit" className={styles.button}>
          Envoyer
        </button>
      </form>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}
