"use client";
import { useAuth } from "../hooks/useAuth"; // ← CHANGÉ : Remplace useSession par useAuth
import { useRouter } from "next/navigation";

export default function AdminButton() {
  const { user, loading, isAuthenticated } = useAuth(); // ← CHANGÉ : Utilise useAuth
  const router = useRouter();

  // ⏳ Attente de chargement de la session
  if (loading) return null;

  // ❌ Pas connecté ou pas admin → on n'affiche rien
  if (!isAuthenticated || user?.role !== "admin") return null;

  // ✅ Utilisateur connecté et admin
  return (
    <button
      onClick={() => router.push("/admin")}
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
      🔐 Accéder au Back-Office Admin
    </button>
  );
}