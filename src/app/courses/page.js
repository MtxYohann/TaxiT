"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getAddressFromCoords } from "@/src/utils/accountActions";
import { useRouter } from "next/navigation";

const DriverDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pickupAddresses, setPickupAddresses] = useState({});
  const [dropoffAddresses, setDropoffAddresses] = useState({});
  const [selectedTab, setSelectedTab] = useState("pending");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const chauffeurId = session?.user?.id;

  const fetchOrders = async () => {
    if (!chauffeurId) return;
    setLoading(true);

    let url = `http://13.38.221.141:4000/api/reservations/driver/${chauffeurId}`;
    if (selectedTab === "future") url += "?status=accepted&upcoming=true";
    else if (selectedTab === "history") url += "?history=true";

    try {
      const res = await fetch(url);
      const data = await res.json();
      setOrders(data);

      const pickupMap = {};
      const dropoffMap = {};

      await Promise.all(
        data.map(async (order) => {
          const pickup = await getAddressFromCoords(order.pickupLat, order.pickupLng);
          const dropoff = await getAddressFromCoords(order.dropoffLat, order.dropoffLng);
          pickupMap[order.id] = pickup;
          dropoffMap[order.id] = dropoff;
        })
      );

      setPickupAddresses(pickupMap);
      setDropoffAddresses(dropoffMap);
    } catch (err) {
      console.error("Erreur lors du chargement :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedTab, chauffeurId]);

  const handleUpdateStatus = async (reservationId, action) => {
    try {
      const res = await fetch(`http://13.38.221.141:4000/api/reservations/${reservationId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action === "accept" ? "accepted" : "rejected" }),
      });

      const result = await res.json();
      if (res.ok) {
        alert(`Commande ${action === "accept" ? "acceptée" : "refusée"} avec succès.`);
        fetchOrders();
      } else {
        console.error(result);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut :", error);
    }
  };

  const renderOrders = () => {
    if (loading) return <p>⏳ Chargement des commandes...</p>;
    if (orders.length === 0) return <p>😕 Aucune commande à afficher.</p>;

    return (
      <ul style={{ listStyle: "none", padding: 0 }}>
        {orders.map((order) => (
          <li
            key={order.id}
            onClick={() => router.push(`/courses/detail/${order.id}`)} 
            style={{
              background: "#fff9e5",
              border: "1px solid #f0dfaa",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "15px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              cursor: "pointer",
              transition: "transform 0.1s ease",
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.01)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1.00)"}
          >
            <h3 style={{ fontSize: "1.2rem", color: "#2f5d5b", marginBottom: "10px" }}>
              🚘 Commande #{order.id}
            </h3>
            <p><strong>👤 Client :</strong> {order.client?.name || "N/A"}</p>
            <p><strong>📅 Date :</strong> {new Date(order.dateTime).toLocaleString()}</p>
            <p><strong>📍 Départ :</strong> {pickupAddresses[order.id] || "Chargement..."}</p>
            <p><strong>🏁 Arrivée :</strong> {dropoffAddresses[order.id] || "Chargement..."}</p>
            <p><strong>💸 Tarif :</strong> {order.fare} €</p>

            {selectedTab === "pending" && (
              <div style={{ marginTop: "15px", display: "flex", gap: "12px" }} onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => handleUpdateStatus(order.id, "accept")}
                  style={{
                    backgroundColor: "#46b17c",
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    border: "none",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  ✅ Accepter
                </button>
                <button
                  onClick={() => handleUpdateStatus(order.id, "reject")}
                  style={{
                    backgroundColor: "#e76f51",
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    border: "none",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  ❌ Refuser
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  if (status === "loading") return <p>Chargement de la session...</p>;
  if (!chauffeurId) return <p>Vous devez être connecté comme chauffeur.</p>;

  return (
    <div style={{ backgroundColor: "#eaf7f5", minHeight: "100vh", padding: "40px", fontFamily: "Segoe UI, sans-serif" }}>
      <div
        style={{
          backgroundColor: "#fff6dc",
          padding: "30px",
          borderRadius: "16px",
          maxWidth: "850px",
          margin: "0 auto",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ color: "#2f5d5b", fontSize: "2rem", marginBottom: "1.5rem" }}>
          🚖 Tableau de bord Chauffeur
        </h1>

        <nav style={{ display: "flex", gap: "10px", marginBottom: "25px", flexWrap: "wrap" }}>
          {["pending", "future", "history"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              style={{
                padding: "10px 20px",
                backgroundColor: selectedTab === tab ? "#2f5d5b" : "#dcefe7",
                color: selectedTab === tab ? "white" : "#2f5d5b",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "500",
                transition: "background 0.2s ease",
              }}
            >
              {{
                pending: "🕓 Commandes en attente",
                future: "📅 Commandes futures",
                history: "📜 Historique",
              }[tab]}
            </button>
          ))}
        </nav>

        {renderOrders()}
      </div>
    </div>
  );
};

export default DriverDashboard;
