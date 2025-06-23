"use client";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="unauthorized-container">
      <h1>⛔ Accès refusé</h1>
      <p>Cette page est réservée aux administrateurs.</p>
      <button onClick={() => router.push("/")}>Retour à l'accueil</button>

      <style jsx>{`
        .unauthorized-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: #f8f8f8;
          text-align: center;
          font-family: Arial, sans-serif;
          padding: 20px;
        }

        h1 {
          font-size: 2.5rem;
          color: #cc0000;
        }

        p {
          font-size: 1.2rem;
          margin-bottom: 20px;
        }

        button {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 10px 20px;
          font-size: 1rem;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
}
