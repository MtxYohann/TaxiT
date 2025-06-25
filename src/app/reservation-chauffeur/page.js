"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react"; // <-- récupère l'utilisateur connecté

const ChauffeurOrders = () => {
  const { data: session, status } = useSession(); // 👈 session contient l'utilisateur
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const chauffeurId = session?.user?.id; // ⚠️ adapte selon ta session

  const fetchOrders = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/reservations/driver/${chauffeurId}`);
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Erreur chargement des commandes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chauffeurId) {
      fetchOrders();
    }
  }, [chauffeurId]);

  const handleUpdateStatus = async (reservationId, action) => {
    try {
      const res = await fetch(`http://localhost:4000/api/reservations/${reservationId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: action === "accept" ? "accepted" : "rejected" }),
      });

      const result = await res.json();
      if (res.ok) {
        alert(`Commande ${action === "accept" ? "acceptée" : "refusée"} avec succès.`);
        fetchOrders(); // 🔄 Rafraîchit
      } else {
        console.error(result);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
    }
  };

  if (status === "loading") return <p>Chargement de la session...</p>;
  if (!chauffeurId) return <p>Vous devez être connecté comme chauffeur.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>📦 Mes courses en attente</h2>
      {loading ? (
        <p>Chargement...</p>
      ) : orders.length === 0 ? (
        <p>Aucune commande assignée pour le moment.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {orders.map((order) => (
            <li key={order.id} style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "10px" }}>
              <p><strong>Client :</strong> {order.client.name}</p>
              <p><strong>Date :</strong> {new Date(order.dateTime).toLocaleString()}</p>
              <p><strong>Départ :</strong> {order.pickupLat}, {order.pickupLng}</p>
              <p><strong>Arrivée :</strong> {order.dropoffLat}, {order.dropoffLng}</p>
              <p><strong>Tarif :</strong> {order.fare} €</p>
              <div style={{ marginTop: "10px" }}>
                <button
                  onClick={() => handleUpdateStatus(order.id, "accept")}
                  style={{ marginRight: "10px", backgroundColor: "green", color: "white", padding: "5px 10px" }}
                >
                  ✅ Accepter
                </button>
                <button
                  onClick={() => handleUpdateStatus(order.id, "reject")}
                  style={{ backgroundColor: "red", color: "white", padding: "5px 10px" }}
                >
                  ❌ Refuser
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChauffeurOrders;
