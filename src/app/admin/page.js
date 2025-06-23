"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const handleDelete = async (email) => {
    if (!confirm(`Supprimer ${email} ?`)) return;
  
    try {
      const res = await fetch("http://localhost:4000/api/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      alert(data.message);
      window.location.reload();
    } catch (error) {
      console.error("Erreur suppression :", error);
      alert("Erreur lors de la suppression.");
    }
  };
  
  const handleEdit = async (user) => {
    const newName = prompt("Nouveau nom :", user.name);
    const newPhone = prompt("Nouveau téléphone :", user.phone);
  
    if (!newName && !newPhone) return;
  
    try {
      const res = await fetch("http://localhost:4000/api/edit-account", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          name: newName || user.name,
          phone: newPhone || user.phone,
        }),
      });
      const data = await res.json();
      alert(data.message);
      window.location.reload();
    } catch (error) {
      console.error("Erreur édition :", error);
      alert("Erreur lors de la modification.");
    }
  };

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedModule, setSelectedModule] = useState("dashboard");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user?.role !== "admin") {
      router.push("/unauthorized");
    }
  }, [status, session, router]);

  // Fetch users depuis l’API backend (filtrage par rôle dans le front ici)
  useEffect(() => {
    const fetchUsers = async () => {
      if (selectedModule === "users") {
        try {
          const res = await fetch("http://localhost:4000/api/users");
          const data = await res.json();
          const filtered = data.filter((user) => user.role === "user");
          setUsers(filtered);
        } catch (error) {
          console.error("Erreur lors de la récupération des utilisateurs :", error);
        }
      }
      if (selectedModule === "chauffeurs") {
        try {
          const res = await fetch("http://localhost:4000/api/users");
          const data = await res.json();
          const filtered = data.filter((user) => user.role === "driver");
          setUsers(filtered);
        } catch (error) {
          console.error("Erreur lors de la récupération des utilisateurs :", error);
        }
    }

    };

    fetchUsers();
  }, [selectedModule]);

  if (status === "loading" || !session) return <p>Chargement...</p>;

  const renderContent = () => {
    switch (selectedModule) {
      case "dashboard":
        return <p>Bienvenue dans le tableau de bord admin.</p>;
      case "users":
        return (
            <div>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "10px" }}>
              <span>👥</span> Utilisateurs (role: "user")
            </h2>
            {users.length === 0 ? (
              <p>Aucun utilisateur trouvé.</p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "1rem",
                }}
              >
                {users.map((user) => (
                  <div
                    key={user.id}
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      padding: "15px",
                      background: "#fff",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    <h3 style={{ fontSize: "1.1rem", marginBottom: "5px" }}>{user.name}</h3>
                    <p>📧 {user.email}</p>
                    <p>📞 {user.phone || "N/A"}</p>
                    <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                      <button
                        onClick={() => handleEdit(user)}
                        style={{
                          backgroundColor: "#0070f3",
                          color: "white",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        📝 Éditer
                      </button>
                      <button
                        onClick={() => handleDelete(user.email)}
                        style={{
                          backgroundColor: "#e00",
                          color: "white",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        ❌ Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case "chauffeurs":
        return (
            <div>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "10px" }}>
              <span>👥</span> Utilisateurs (role: "driver")
            </h2>
            {users.length === 0 ? (
              <p>Aucun utilisateur trouvé.</p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "1rem",
                }}
              >
                {users.map((user) => (
                  <div
                    key={user.id}
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      padding: "15px",
                      background: "#fff",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    <h3 style={{ fontSize: "1.1rem", marginBottom: "5px" }}>{user.name}</h3>
                    <p>📧 {user.email}</p>
                    <p>📞 {user.phone || "N/A"}</p>
                    <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                      <button
                        onClick={() => handleEdit(user)}
                        style={{
                          backgroundColor: "#0070f3",
                          color: "white",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        📝 Éditer
                      </button>
                      <button
                        onClick={() => handleDelete(user.email)}
                        style={{
                          backgroundColor: "#e00",
                          color: "white",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        ❌ Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case "verif-chauffeurs":
        return <p>🚗 Chauffeurs en attente</p>;
      default:
        return <p>Sélectionnez un module.</p>;
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🛡️ Panneau d’administration</h1>
      <nav style={{ marginBottom: "20px" }}>
        <button onClick={() => setSelectedModule("dashboard")}>🏠 Dashboard</button>{" "}
        <button onClick={() => setSelectedModule("users")}>👥 Utilisateurs</button>{" "}
        <button onClick={() => setSelectedModule("chauffeurs")}>🚖 Chauffeurs</button>{" "}
        <button onClick={() => setSelectedModule("verif-chauffeurs")}>⏳ Chauffeurs en attente</button>
      </nav>

      <section
        style={{
          border: "1px solid #ccc",
          padding: "15px",
          borderRadius: "8px",
        }}
      >
        {renderContent()}
      </section>
    </div>
  );
}
