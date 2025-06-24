"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";

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
      const res = await fetch(`http://localhost:4000/api/upload-documents/${userId}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("📁 Documents envoyés avec succès !");
      } else {
        setMessage(`Erreur : ${data.error || "Erreur inconnue"}`);
      }
    } catch (err) {
      console.error("Erreur upload :", err);
      setMessage("Erreur lors de l'envoi.");
    }
  };

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px", maxWidth: "500px" }}>
      <h2>📄 Envoi des documents chauffeur</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Permis de conduire :</label><br />
          <input type="file" accept="image/*,.pdf" onChange={(e) => setPermis(e.target.files[0])} />
        </div>
        <div style={{ marginTop: "10px" }}>
          <label>Carte chauffeur :</label><br />
          <input type="file" accept="image/*,.pdf" onChange={(e) => setCarte(e.target.files[0])} />
        </div>
        <button onClick={() => handleRequestDriver(userId)} type="submit" style={{ marginTop: "15px", padding: "8px 16px" }}>
          Envoyer
        </button>
      </form>
      {message && <p style={{ marginTop: "10px", color: "green" }}>{message}</p>}
    </div>
  );
}
