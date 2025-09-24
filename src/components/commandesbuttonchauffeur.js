"use client";

import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/navigation";

export default function CommandeChauffeurBouton() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  if (loading) return null;

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