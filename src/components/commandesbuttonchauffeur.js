"use client";

import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/navigation";

export default function CommandeChauffeurBouton() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  // ⏳ Attente de chargement
  if (loading) return null;

  // ❌ Pas connecté ou pas chauffeur → on n’affiche rien
  if (!isAuthenticated || user?.role !== "driver") return null;

  return (
    <button
      onClick={() => router.push("/courses")}
      style={{
        padding: "10px 20px",
        backgroundColor: "#0070f3",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginTop: "10px",
      }}
    >
      Voir mes courses en attentes
    </button>
  );
}