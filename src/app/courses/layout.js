"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DriverPage({children}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // attend que la session se charge

    
    if (!session || session.user.role !== "driver") {
      router.push("/unauthorized");
    }
  }, [session, status, router]);

  if (status === "loading" || !session || session.user.role !== "driver") {
    return <p>Chargement...</p>;
  }

  return (
    <div>
      <main>{children}</main>
    </div>
  );
}
