"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { GoogleMap, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";

export default function OrderDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [directions, setDirections] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  useEffect(() => {
    if (!id) return;
    fetch(`http://13.38.221.141:4000/api/reservations/findbyid/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setOrder(data);
        console.log("Commande récupérée :", data);
      })
      .catch(console.error);
  }, [id]);

  const handleMapLoad = (map) => {
    if (!order) return;

    const origin = {
      lat: parseFloat(order.pickupLat),
      lng: parseFloat(order.pickupLng),
    };
    const destination = {
      lat: parseFloat(order.dropoffLat),
      lng: parseFloat(order.dropoffLng),
    };

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
        } else {
          console.error("Erreur Directions:", result);
        }
      }
    );
  };

  if (!order || !isLoaded) return <p>Chargement...</p>;

  const hasValidCoords =
    order.pickupLat &&
    order.pickupLng &&
    !isNaN(order.pickupLat) &&
    !isNaN(order.pickupLng);

  return (
    <div style={{ backgroundColor: "#eaf7f5", minHeight: "100vh", padding: "40px" }}>
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
        <button
          onClick={() => router.back()}
          style={{
            backgroundColor: "#2f5d5b",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            marginBottom: "25px",
          }}
        >
          ← Revenir
        </button>

        <h1 style={{ fontSize: "1.8rem", color: "#2f5d5b", marginBottom: "15px" }}>
          🚗 Commande #{order.id}
        </h1>

        <p>
          <strong>🧑‍💼 Client :</strong> {order.client?.name || "Inconnu"}
        </p>
        <p>
          <strong>📅 Date :</strong>{" "}
          {order.dateTime ? new Date(order.dateTime).toLocaleString() : "N/A"}
        </p>
        <p>
          <strong>💸 Tarif :</strong> {order.fare ? `${order.fare} €` : "N/A"}
        </p>

        <div
          style={{
            height: "400px",
            borderRadius: "10px",
            overflow: "hidden",
            marginTop: "20px",
            backgroundColor: "#e3e0dc",
          }}
        >
          {hasValidCoords ? (
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={{
                lat: parseFloat(order.pickupLat),
                lng: parseFloat(order.pickupLng),
              }}
              zoom={13}
              onLoad={handleMapLoad}
            >
              {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
          ) : (
            <p style={{ padding: "1rem", textAlign: "center" }}>
              Coordonnées invalides. Impossible d’afficher la carte.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
