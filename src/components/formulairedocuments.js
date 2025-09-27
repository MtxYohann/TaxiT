"use client";
import { useState } from "react";
import styles from "../styles/formulairedocuments.module.css";

const handleRequestDriver = async () => {
  console.log('🚀 handleRequestDriver - Début');

  try {
    console.log('📡 Envoi requête request-driver vers:', '/api/request-driver');
    console.log('🍪 Cookies disponibles:', document.cookie);

    const response = await fetch(`/api/request-driver`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      credentials: 'include'
    });

    console.log('📥 Réponse request-driver - Status:', response.status);
    console.log('📥 Réponse request-driver - StatusText:', response.statusText);

    const result = await response.json();
    console.log('📥 Réponse request-driver - Data:', result);

    if (response.ok) {
      console.log('✅ request-driver SUCCESS');
      alert("✅ Demande envoyée ! En attente de validation par un administrateur.");
    } else {
      console.log('❌ request-driver FAILED - Status:', response.status);
      if (response.status === 401) {
        alert("❌ Session expirée. Veuillez vous reconnecter.");
        window.location.href = '/login';
        return;
      }
      alert("❌ Erreur : " + (result.error || result.message || "Erreur inconnue"));
    }
  } catch (error) {
    console.error("❌ ERREUR request-driver :", {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    alert("⚠️ Une erreur de connexion est survenue. Veuillez réessayer.");
  }

  console.log('🏁 handleRequestDriver - Fin');
};

export default function UploadDocumentsForm({ userId }) {
  const [permis, setPermis] = useState(null);
  const [carte, setCarte] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  console.log('🔍 Rendu UploadDocumentsForm avec userId:', userId);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('🚀 handleSubmit - DÉBUT');
    console.log('🍪 Cookies au début:', document.cookie);

    // ← MODIFIÉ : Nouvelle méthode extractAuthToken avec API fallback
    const extractAuthToken = async () => {
      const fullCookie = document.cookie;
      console.log('🔍 Cookie complet:', fullCookie);

      // Méthode 1: Essayer document.cookie d'abord
      const cookies = fullCookie.split(';');
      console.log('🔍 Cookies séparés:', cookies);

      for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        console.log('🔍 Cookie analysé:', { name, value: value?.substring(0, 20) + '...' });
        if (name === 'auth-token') {
          console.log('✅ Token trouvé par document.cookie!');
          return value;
        }
      }

      // Méthode 2: Regex de secours
      const match = fullCookie.match(/auth-token=([^;]+)/);
      if (match) {
        console.log('✅ Token trouvé par regex!');
        return match[1];
      }

      // Méthode 3: Si pas trouvé, demander au serveur via /get-token
      try {
        console.log('🔄 Token non trouvé dans document.cookie, tentative via API...');
        const response = await fetch('/api/get-token', {
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          console.log('✅ Token récupéré via API /get-token');
          return data.token;
        } else {
          console.log('❌ Erreur API /get-token - Status:', response.status);
        }
      } catch (apiError) {
        console.log('❌ Erreur réseau /get-token:', apiError.message);
      }

      console.log('❌ Token auth-token introuvable par toutes les méthodes');
      return null;
    };

    const authToken = await extractAuthToken(); // ← CHANGÉ en async/await
    console.log('🔑 Token final:', authToken ? 'TROUVÉ' : 'ABSENT');

    if (!authToken) {
      alert('⚠️ Session expirée. Veuillez vous reconnecter.');
      window.location.href = '/login';
      return;
    }

    try {
      console.log('🧪 Test de la route upload...');
      const testRes = await fetch('/api/test-upload', {
        method: 'POST',
        credentials: 'include'
      });
      console.log('🧪 Test route upload - Status:', testRes.status);
      if (testRes.ok) {
        const testData = await testRes.json();
        console.log('🧪 Test route upload - Response:', testData);
      }
    } catch (testError) {
      console.log('❌ Test route échoué:', testError);
    }

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

    console.log('✅ Validations passées, préparation FormData');
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("permis", permis);
    formData.append("carte", carte);

    try {
      const uploadUrl = `/api/upload-my-documents`;
      console.log('📡 URL de upload:', uploadUrl);
      console.log('📡 Token à envoyer:', authToken.substring(0, 20) + '...');

      const res = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
        credentials: 'include',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Authorization': `Bearer ${authToken}`
        }
      });

      console.log('📥 Réponse upload - Status:', res.status);
      console.log('📥 Réponse upload - StatusText:', res.statusText);
      console.log('📥 Réponse upload - OK:', res.ok);

      const contentType = res.headers.get('content-type');
      console.log('📥 Content-Type reçu:', contentType);

      if (!contentType || !contentType.includes('application/json')) {
        console.error('❌ Réponse non-JSON détectée !');
        const textResponse = await res.text();
        console.error('📄 Contenu HTML/Texte reçu (200 premiers chars):', textResponse.substring(0, 200));
        throw new Error(`Serveur a retourné ${contentType} au lieu de JSON`);
      }

      const data = await res.json();
      console.log('📥 Réponse upload - Data:', data);

      if (res.ok) {
        console.log('✅ Upload SUCCESS !');
        setMessage("✅ Documents envoyés avec succès !");

        console.log('🚀 Appel handleRequestDriver...');
        await handleRequestDriver();

        console.log('🧹 Nettoyage des fichiers...');
        setPermis(null);
        setCarte(null);

        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach((input) => {
          input.value = '';
        });

      } else {
        console.log('❌ Upload FAILED - Status:', res.status);
        if (res.status === 401) {
          console.log('❌ Session expirée détectée');
          setMessage("❌ Session expirée. Redirection vers la connexion...");
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
          return;
        }
        console.log('❌ Erreur upload:', data.error);
        setMessage(`❌ Erreur : ${data.error || "Erreur inconnue"}`);
      }
    } catch (err) {
      console.error("❌ ERREUR UPLOAD DÉTAILLÉE :", err);

      if (err.name === 'SyntaxError') {
        setMessage("⚠️ Erreur serveur - réponse invalide (HTML au lieu de JSON)");
      } else if (err.name === 'TypeError') {
        setMessage("⚠️ Erreur de connexion réseau");
      } else {
        setMessage("⚠️ Erreur lors de l'envoi. Veuillez vérifier votre connexion.");
      }
    } finally {
      console.log('🏁 handleSubmit - FIN');
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>📄 Envoi des documents chauffeur</h2>

      {/* Debug info */}
      <div style={{
        backgroundColor: "#fff3cd",
        padding: "10px",
        borderRadius: "5px",
        marginBottom: "15px",
        fontSize: "12px",
        fontFamily: "monospace"
      }}>
        <strong>🐛 Debug Info:</strong>
        <br />UserId: {userId} (ne sera plus utilisé dans l'URL)
        <br />Cookies: {typeof window !== 'undefined' ? (document.cookie ? 'présents' : 'absents') : 'N/A'}
        <br />URL actuelle: {typeof window !== 'undefined' ? window.location.href : 'N/A'}
        <br />Permis: {permis ? `${permis.name} (${(permis.size / 1024 / 1024).toFixed(2)}MB)` : 'Non sélectionné'}
        <br />Carte: {carte ? `${carte.name} (${(carte.size / 1024 / 1024).toFixed(2)}MB)` : 'Non sélectionné'}
      </div>

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
          <label className={styles.formLabel}>
            📄 Permis de conduire * :
          </label>
          <input
            className={styles.inputFile}
            type="file"
            accept="image/jpeg,image/jpg,image/png,application/pdf"
            onChange={(e) => {
              console.log('📄 Fichier permis sélectionné:', e.target.files[0]);
              setPermis(e.target.files[0]);
            }}
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
          <label className={styles.formLabel}>
            🚖 Carte chauffeur * :
          </label>
          <input
            className={styles.inputFile}
            type="file"
            accept="image/jpeg,image/jpg,image/png,application/pdf"
            onChange={(e) => {
              console.log('🚖 Fichier carte sélectionné:', e.target.files[0]);
              setCarte(e.target.files[0]);
            }}
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