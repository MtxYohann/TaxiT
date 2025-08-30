"use client";
import { useAuth } from "../../hooks/useAuth"; // ← CHANGÉ : Remplace useSession par useAuth
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DriverPage({children}) {
  const { user, loading, isAuthenticated } = useAuth(); // ← CHANGÉ : Utilise useAuth
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // attend que l'authentification se charge

    // ← CHANGÉ : Vérification avec useAuth
    if (!isAuthenticated || user?.role !== "driver") {
      router.push("/unauthorized");
    }
  }, [user, loading, isAuthenticated, router]); // ← CHANGÉ : Nouvelles dépendances

  // ← CHANGÉ : Conditions avec useAuth
  if (loading || !isAuthenticated || user?.role !== "driver") {
    return <p>Chargement...</p>;
  }

  return (
    <div>
      <main>{children}</main>
    </div>
  );
}