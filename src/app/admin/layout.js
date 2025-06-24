"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage({children}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // attend que la session se charge

    // Si l'utilisateur n'est pas connecté ou pas admin, on redirige
    if (!session || session.user.role !== "admin") {
      router.push("/unauthorized");
    }
  }, [session, status, router]);

  if (status === "loading" || !session || session.user.role !== "admin") {
    return <p>Chargement...</p>;
  }

  return (
    <div>
      <main>{children}</main>
    </div>
  );
}
