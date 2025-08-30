"use client";
import { useAuth } from "../../hooks/useAuth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({children}) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    console.log("AdminLayout - Vérification:", { isAuthenticated, userRole: user?.role });

    if (!isAuthenticated || user?.role !== "admin") {
      console.log("❌ Accès refusé, redirection...");
      router.push("/unauthorized");
    } else {
      console.log("✅ Accès admin autorisé");
    }
  }, [user, loading, isAuthenticated, router]);

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return <p>Redirection...</p>;
  }

  return (
    <div>
      <main>{children}</main>
    </div>
  );
}