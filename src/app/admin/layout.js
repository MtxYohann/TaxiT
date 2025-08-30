"use client";
import { useAuth } from "../../hooks/useAuth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({children}) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // ← CHANGÉ : Attendre que le chargement soit fini
    if (!loading) {
      console.log("AdminLayout - Vérification:", { 
        isAuthenticated, 
        userRole: user?.role,
        user: user 
      });

      if (!isAuthenticated || user?.role !== "admin") {
        console.log("❌ Accès refusé, redirection...");
        router.push("/unauthorized");
      } else {
        console.log("✅ Accès admin autorisé pour:", user.name);
      }
    }
  }, [loading, isAuthenticated, user, router]); // ← CHANGÉ : Dépendances simplifiées

  // ← CHANGÉ : Pendant le chargement
  if (loading) {
    console.log("Layout admin en chargement...");
    return <p>Chargement...</p>;
  }

  // ← CHANGÉ : Si pas admin après chargement
  if (!isAuthenticated || user?.role !== "admin") {
    console.log("Layout admin - accès refusé");
    return <p>Redirection...</p>;
  }

  // ← CHANGÉ : Succès !
  console.log("Layout admin - affichage du contenu");
  return (
    <div>
      <main>{children}</main>
    </div>
  );
}