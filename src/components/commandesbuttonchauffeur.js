"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CommandeChauffeurBouton() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // ⏳ Attente de chargement de la session
  if (status === "loading") return null;

  // ❌ Pas de session ou pas admin → on n'affiche rien
  if (!session || session.user?.role !== "driver") return null;


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
