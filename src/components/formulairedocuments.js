"use client";
import { useState } from "react";
import styles from "../styles/formulairedocuments.module.css";

const handleRequestDriver = async (userId) => {
  console.log('🚀 handleRequestDriver - Début avec userId:', userId);

  try {
    console.log('📡 Envoi requête request-driver vers:', '/api/request-driver');
    console.log('🍪 Cookies disponibles:', document.cookie);

    const response = await fetch(`/api/request-driver`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ userId }),
      credentials: 'include'
    });

    console.log('📥 Réponse request-driver - Status:', response.status);
    console.log('📥 Réponse request-driver - StatusText:', response.statusText);
    console.log('📥 Réponse request-driver - Headers:', {
      'content-type': response.headers.get('content-type'),
      'set-cookie': response.headers.get('set-cookie')
    });

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
    console.log('🔍 userId:', userId);
    console.log('🔍 permis:', permis ? { name: permis.name, size: permis.size, type: permis.type } : 'null');
    console.log('🔍 carte:', carte ? { name: carte.name, size: carte.size, type: carte.type } : 'null');
    console.log('🍪 Cookies au début:', document.cookie);

    try {
      console.log('🧪 Test de la route upload...');
      const testRes = await fetch('/api/test-upload', {
        method: 'POST',
        credentials: 'include'
      });
      console.log('🧪 Test route upload - Status:', testRes.status);
      console.log('🧪 Test route upload - OK:', testRes.ok);

      if (testRes.ok) {
        const testData = await testRes.json();
        console.log('🧪 Test route upload - Response:', testData);
      } else {
        console.log('🧪 Test route upload - Erreur Status:', testRes.status);
        const testText = await testRes.text();
        console.log('🧪 Test route upload - Error Response:', testText.substring(0, 200));
      }
    } catch (testError) {
      console.log('❌ Test route échoué:', testError);
    }

    if (!permis || !carte) {
      console.log('❌ Fichiers manquants');
      setMessage("⚠️ Merci de sélectionner les deux fichiers.");
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(permis.type) || !allowedTypes.includes(carte.type)) {
      console.log('❌ Types de fichiers non autorisés:', { permis: permis.type, carte: carte.type });
      setMessage("⚠️ Seuls les fichiers JPG, PNG et PDF sont acceptés.");
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (permis.size > maxSize || carte.size > maxSize) {
      console.log('❌ Fichiers trop volumineux:', {
        permis: `${(permis.size / 1024 / 1024).toFixed(2)}MB`,
        carte: `${(carte.size / 1024 / 1024).toFixed(2)}MB`
      });
      setMessage("⚠️ Chaque fichier doit faire moins de 5MB.");
      return;
    }

    console.log('✅ Validations passées, préparation FormData');
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("permis", permis);
    formData.append("carte", carte);

    console.log('📦 FormData préparé avec:', {
      permis: permis.name,
      carte: carte.name
    });

    try {
      const uploadUrl = `/api/upload-documents/${userId}`;
      console.log('📡 URL de upload:', uploadUrl);
      console.log('📡 Envoi requête upload...');
      console.log('🍪 Cookies avant requête upload:', document.cookie);

      const res = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
        credentials: 'include',
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      console.log('📥 Réponse upload - Status:', res.status);
      console.log('📥 Réponse upload - StatusText:', res.statusText);
      console.log('📥 Réponse upload - OK:', res.ok);
      console.log('📥 Réponse upload - Headers:', {
        'content-type': res.headers.get('content-type'),
        'content-length': res.headers.get('content-length'),
        'server': res.headers.get('server')
      });

      // Vérifier le Content-Type avant de parser en JSON
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
        await handleRequestDriver(userId);

        console.log('🧹 Nettoyage des fichiers...');
        setPermis(null);
        setCarte(null);

        const fileInputs = document.querySelectorAll('input[type="file"]');
        console.log('🧹 Nombre d\'inputs trouvés:', fileInputs.length);
        fileInputs.forEach((input, index) => {
          input.value = '';
          console.log(`🧹 Input ${index} nettoyé`);
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
      console.error("❌ ERREUR UPLOAD DÉTAILLÉE :", {
        message: err.message,
        name: err.name,
        stack: err.stack,
        cause: err.cause
      });

      if (err.name === 'SyntaxError') {
        console.error('❌ Erreur JSON parsing - probablement HTML reçu');
        setMessage("⚠️ Erreur serveur - réponse invalide (HTML au lieu de JSON)");
      } else if (err.name === 'TypeError') {
        console.error('❌ Erreur de réseau');
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
        <br />UserId: {userId}
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
          onClick={() => console.log('🔘 Bouton submit cliqué')}
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