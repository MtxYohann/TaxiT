"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminButton() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // ⏳ Attente de chargement de la session
  if (status === "loading") return null;

  // ❌ Pas de session ou pas admin → on n'affiche rien
  if (!session || session.user?.role !== "admin") return null;

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
