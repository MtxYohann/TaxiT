"use client";
import { useState } from "react";
import styles from "../styles/formulairedocuments.module.css";

const handleRequestDriver = async () => {
  try {
    const response = await fetch(`/api/request-driver`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      credentials: 'include'
    });

    const result = await response.json();

    if (response.ok) {
      alert("✅ Demande envoyée ! En attente de validation par un administrateur.");
    } else {
      if (response.status === 401) {
        alert("❌ Session expirée. Veuillez vous reconnecter.");
        window.location.href = '/login';
        return;
      }
      alert("❌ Erreur : " + (result.error || result.message || "Erreur inconnue"));
    }
  } catch (error) {
    console.error("❌ ERREUR request-driver :", error);
    alert("⚠️ Une erreur de connexion est survenue. Veuillez réessayer.");
  }
};

export default function UploadDocumentsForm({ userId }) {
  const [permis, setPermis] = useState(null);
  const [carte, setCarte] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!permis || !carte) {
      setMessage("⚠️ Merci de sélectionner les deux fichiers.");
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(permis.type) || !allowedTypes.includes(carte.type)) {
      setMessage("⚠️ Seuls les fichiers JPG, PNG et PDF sont acceptés.");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (permis.size > maxSize || carte.size > maxSize) {
      setMessage("⚠️ Chaque fichier doit faire moins de 5MB.");
      return;
    }

    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("permis", permis);
    formData.append("carte", carte);

    try {
      const res = await fetch(`/api/upload-my-documents`, {
        method: "POST",
        body: formData,
        credentials: 'include' // ← Seulement les cookies, pas d'Authorization header
      });

      if (!res.ok) {
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error(`Erreur serveur (${res.status})`);
        }
      }

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Documents envoyés avec succès !");
        await handleRequestDriver();

        // Nettoyage
        setPermis(null);
        setCarte(null);
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach((input) => {
          input.value = '';
        });

      } else {
        if (res.status === 401) {
          setMessage("❌ Session expirée. Redirection vers la connexion...");
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
          return;
        }
        setMessage(`❌ Erreur : ${data.error || "Erreur inconnue"}`);
      }
    } catch (err) {
      console.error("❌ ERREUR UPLOAD :", err);
      setMessage("⚠️ Erreur lors de l'envoi. Veuillez vérifier votre connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>📄 Envoi des documents chauffeur</h2>

      <div style={{
        backgroundColor: "#f0f8ff",
        padding: "15px",
        borderRadius: "8px",
        marginBottom: "20px",
        fontSize: "14px",
        color: "#333"
      }}>
        <p><strong>📋 Documents requis :</strong></p>
        <ul style={{ marginLeft: "20px", marginTop: "8px" }}>
          <li>✓ Permis de conduire (recto-verso)</li>
          <li>✓ Carte professionnelle de transport de personnes</li>
        </ul>
        <p style={{ marginTop: "10px", color: "#666" }}>
          <strong>Formats acceptés :</strong> JPG, PNG, PDF • <strong>Taille max :</strong> 5MB par fichier
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>📄 Permis de conduire * :</label>
          <input
            className={styles.inputFile}
            type="file"
            accept="image/jpeg,image/jpg,image/png,application/pdf"
            onChange={(e) => setPermis(e.target.files[0])}
            disabled={loading}
            required
          />
          {permis && (
            <small style={{ color: "#28a745", display: "block", marginTop: "5px" }}>
              ✓ {permis.name} ({(permis.size / 1024 / 1024).toFixed(2)}MB)
            </small>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>🚖 Carte chauffeur * :</label>
          <input
            className={styles.inputFile}
            type="file"
            accept="image/jpeg,image/jpg,image/png,application/pdf"
            onChange={(e) => setCarte(e.target.files[0])}
            disabled={loading}
            required
          />
          {carte && (
            <small style={{ color: "#28a745", display: "block", marginTop: "5px" }}>
              ✓ {carte.name} ({(carte.size / 1024 / 1024).toFixed(2)}MB)
            </small>
          )}
        </div>

        <button
          type="submit"
          className={styles.button}
          disabled={loading || !permis || !carte}
          style={{
            opacity: (loading || !permis || !carte) ? 0.6 : 1,
            cursor: (loading || !permis || !carte) ? "not-allowed" : "pointer",
            backgroundColor: loading ? "#6c757d" : undefined
          }}
        >
          {loading ? "⏳ Envoi en cours..." : "📤 Envoyer les documents"}
        </button>
      </form>

      {message && (
        <div style={{
          marginTop: "15px",
          padding: "12px",
          borderRadius: "8px",
          backgroundColor: message.includes('✅') ? "#d4edda" :
            message.includes('⚠️') ? "#fff3cd" : "#f8d7da",
          color: message.includes('✅') ? "#155724" :
            message.includes('⚠️') ? "#856404" : "#721c24",
          border: `1px solid ${message.includes('✅') ? "#c3e6cb" :
            message.includes('⚠️') ? "#ffeaa7" : "#f5c6cb"}`,
          fontWeight: "500"
        }}>
          <p className={styles.message}>{message}</p>
        </div>
      )}
    </div>
  );
}