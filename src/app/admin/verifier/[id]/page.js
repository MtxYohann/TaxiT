"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function VerifChauffeurPage() {
  const { id } = useParams();
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/driver-documents/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setDocuments(data);
      } catch (err) {
        console.error(err);
        setError("Erreur lors de la récupération des documents.");
      }
    };

    if (id) fetchDocs();
  }, [id]);

  const handleValidation = async (isApproved) => {
    try {
      const res = await fetch(`http://localhost:4000/api/approve-driver/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approve: isApproved }),
      });
      const data = await res.json();
      alert(data.message || "Action effectuée");
      router.push("/admin"); // retourne au panneau admin
    } catch (err) {
      alert("Erreur lors de l'action.");
      console.error(err);
    }
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!documents) return <p>Chargement des documents...</p>;

  return (
    <div style={{
      padding: "40px",
      maxWidth: "800px",
      margin: "0 auto",
      fontFamily: "Arial, sans-serif"
    }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "30px" }}>🔍 Vérification des documents du chauffeur</h1>

      <div style={{ display: "flex", gap: "30px", marginBottom: "30px" }}>
        <div style={{ textAlign: "center" }}>
          <h3 style={{ marginBottom: "10px" }}>📄 Permis</h3>
          <img
            src={`http://localhost:4000${documents.permisUrl}`}
            alt="Permis"
            style={{
              maxWidth: "300px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
          />
        </div>

        <div style={{ textAlign: "center" }}>
          <h3 style={{ marginBottom: "10px" }}>🪪 Carte chauffeur</h3>
          <img
            src={`http://localhost:4000${documents.carteUrl}`}
            alt="Carte chauffeur"
            style={{
              maxWidth: "300px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
        <button
          onClick={() => handleValidation(true)}
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "1rem"
          }}
        >
          ✅ Valider
        </button>

        <button
          onClick={() => handleValidation(false)}
          style={{
            backgroundColor: "#e74c3c",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "1rem"
          }}
        >
          ❌ Refuser
        </button>
      </div>
    </div>
  );
}
