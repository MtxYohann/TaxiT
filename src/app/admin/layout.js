"use client";
import { useAuth } from "../../hooks/useAuth"; // ← CHANGÉ : Remplace useSession par useAuth
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({children}) {
  const { user, loading, isAuthenticated } = useAuth(); // ← CHANGÉ : Utilise useAuth
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // attend que l'authentification se charge

    // Si l'utilisateur n'est pas connecté ou pas admin, on redirige
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/unauthorized");
    }
  }, [user, loading, isAuthenticated, router]); // ← CHANGÉ : Nouvelles dépendances

  if (loading || !isAuthenticated || user?.role !== "admin") {
    return <p>Chargement...</p>;
  }

  return (
    <div>
      <main>{children}</main>
    </div>
  );
}