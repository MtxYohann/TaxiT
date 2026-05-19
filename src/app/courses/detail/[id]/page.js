"use client";
import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { GoogleMap, DirectionsRenderer, Marker, useJsApiLoader } from "@react-google-maps/api";
import { formatLocalDateTime } from "../../../../utils/dateUtils"; // ← AJOUTÉ : Utilitaire pour les dates
import { useAuth } from "../../../../hooks/useAuth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function OrderDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { user, token } = useAuth();
  const [order, setOrder] = useState(null);
  const [directions, setDirections] = useState(null);
  const [sharing, setSharing] = useState(false);
  const [shareError, setShareError] = useState("");
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [locationPingCount, setLocationPingCount] = useState(0);
  const [lastLocationSentAt, setLastLocationSentAt] = useState("");
  const [liveState, setLiveState] = useState(null);
  const stableDriverCoordRef = useRef(null);
  const directionsRequestRef = useRef(0);
  const routeKeyRef = useRef("");

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const isActiveTrip = ["accepted", "driver_en_route", "arrived", "in_progress"].includes(order?.status);

  const resolveNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case "accepted":
        return "driver_en_route";
      case "driver_en_route":
        return "arrived";
      case "arrived":
        return "in_progress";
      case "in_progress":
        return "completed";
      default:
        return null;
    }
  };

  const getAuthToken = () => {
    const directToken = token || localStorage.getItem("token");
    if (directToken && directToken !== "undefined" && directToken !== "null") {
      return directToken;
    }

    const rawUser = localStorage.getItem("user");
    if (!rawUser || rawUser === "undefined" || rawUser === "null") {
      return "";
    }

    try {
      const parsedUser = JSON.parse(rawUser);
      const userToken = parsedUser?.token;
      if (userToken && userToken !== "undefined" && userToken !== "null") {
        localStorage.setItem("token", userToken);
        return userToken;
      }
    } catch {
      return "";
    }

    return "";
  };

  const handleUnauthorized = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setShareError("Session expirée. Merci de vous reconnecter.");
    router.replace("/login");
  };

  const fetchOrder = async () => {
    const authToken = getAuthToken();
    if (!authToken) {
      handleUnauthorized();
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/api/reservations/findbyid/${id}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: "application/json",
      },
    });

    if (response.status === 401) {
      handleUnauthorized();
      return null;
    }

    const data = await response.json();
    setOrder(data);
    return data;
  };

  const fetchLiveState = async () => {
    const authToken = getAuthToken();
    if (!authToken || !id) return;

    const response = await fetch(`${API_BASE_URL}/api/reservations/${id}/live-state`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: "application/json",
      },
    });

    if (response.status === 401) {
      handleUnauthorized();
      return;
    }

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.error || `Erreur lecture live-state (${response.status})`);
    }

    setLiveState(payload.live || null);
  };

  useEffect(() => {
    if (!id) return;
    fetchOrder()
      .then((data) => {
        console.log("Commande récupérée :", data);
      })
      .catch(console.error);
  }, [id, token]);

  useEffect(() => {
    if (!id) return;

    fetchLiveState().catch((error) => {
      console.error("Erreur chargement live-state:", error);
    });

    const intervalId = setInterval(() => {
      fetchLiveState().catch((error) => {
        console.error("Erreur polling live-state:", error);
      });
    }, 5000);

    return () => clearInterval(intervalId);
  }, [id, token]);

  const handleStatusTransition = async (nextStatus) => {
    if (!id) return;

    try {
      setStatusUpdating(true);
      setStatusMessage("");

      const authToken = getAuthToken();
      if (!authToken) {
        handleUnauthorized();
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/reservations/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error || "Impossible de mettre a jour le statut.");
      }

      setStatusMessage(`Statut passe a: ${nextStatus}`);
      await fetchOrder();
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Erreur de mise a jour du statut.");
    } finally {
      setStatusUpdating(false);
    }
  };

  useEffect(() => {
    return () => {
      if (window.__taxitLocationWatchId !== undefined) {
        navigator.geolocation.clearWatch(window.__taxitLocationWatchId);
        window.__taxitLocationWatchId = undefined;
      }
    };
  }, []);

  useEffect(() => {
    const shouldAutoShare = Boolean(id && token && user?.role === "driver" && isActiveTrip);

    if (!shouldAutoShare) {
      if (window.__taxitLocationWatchId !== undefined) {
        navigator.geolocation.clearWatch(window.__taxitLocationWatchId);
        window.__taxitLocationWatchId = undefined;
      }
      setSharing(false);
      return;
    }

    if (!navigator.geolocation) {
      setShareError("Geolocalisation non supportee par ce navigateur.");
      setSharing(false);
      return;
    }

    setShareError("");

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const payload = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          heading: Number.isFinite(position.coords.heading) ? position.coords.heading : null,
          speed: Number.isFinite(position.coords.speed) ? position.coords.speed : null,
          timestamp: new Date(position.timestamp).toISOString(),
        };

        try {
          const authToken = getAuthToken();
          if (!authToken) {
            handleUnauthorized();
            return;
          }

          const response = await fetch(`${API_BASE_URL}/api/reservations/${id}/location`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify(payload),
          });

          if (response.status === 401) {
            handleUnauthorized();
            return;
          }

          if (!response.ok) {
            const apiError = await response.json().catch(() => ({}));
            throw new Error(apiError.error || `Erreur API localisation (${response.status})`);
          }

          setLocationPingCount((prev) => prev + 1);
          setLastLocationSentAt(new Date().toLocaleTimeString());
          setShareError("");
          setSharing(true);
          fetchLiveState().catch(() => {});
        } catch (error) {
          setShareError(error instanceof Error ? error.message : "Echec envoi position chauffeur.");
        }
      },
      () => {
        setSharing(false);
        setShareError("Impossible de partager la position chauffeur. Verifie les permissions du navigateur.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 3000,
      },
    );

    window.__taxitLocationWatchId = watchId;

    return () => {
      if (window.__taxitLocationWatchId !== undefined) {
        navigator.geolocation.clearWatch(window.__taxitLocationWatchId);
        window.__taxitLocationWatchId = undefined;
      }
      setSharing(false);
    };
  }, [id, token, user?.role, isActiveTrip]);

  const nextStatus = resolveNextStatus(order?.status);
  const canProgress = Boolean(user?.role === "driver" && nextStatus);

  const clientLiveCoord = liveState?.clientLocation
    ? {
        lat: Number(liveState.clientLocation.lat),
        lng: Number(liveState.clientLocation.lng),
      }
    : null;

  const driverLiveCoord = liveState?.driverLocation
    ? {
        lat: Number(liveState.driverLocation.lat),
        lng: Number(liveState.driverLocation.lng),
      }
    : null;

  if (driverLiveCoord && Number.isFinite(driverLiveCoord.lat) && Number.isFinite(driverLiveCoord.lng)) {
    stableDriverCoordRef.current = driverLiveCoord;
  }

  const stableDriverCoord = stableDriverCoordRef.current;

  const pickupLat = Number(order?.pickupLat);
  const pickupLng = Number(order?.pickupLng);
  const dropoffLat = Number(order?.dropoffLat);
  const dropoffLng = Number(order?.dropoffLng);
  const driverLiveLat = Number(driverLiveCoord?.lat);
  const driverLiveLng = Number(driverLiveCoord?.lng);

  const hasValidCoords =
    Number.isFinite(pickupLat) &&
    Number.isFinite(pickupLng) &&
    Number.isFinite(dropoffLat) &&
    Number.isFinite(dropoffLng);

  const pickupCoord = { lat: pickupLat, lng: pickupLng };
  const dropoffCoord = { lat: dropoffLat, lng: dropoffLng };

  useEffect(() => {
    if (!isLoaded || !hasValidCoords) return;

    const effectiveDriverCoord = stableDriverCoord;
    const effectiveStatus = liveState?.status || order?.status;
    const shouldRouteToDropoff = ["in_progress", "completed"].includes(effectiveStatus);

    const origin = effectiveDriverCoord || pickupCoord;
    const destination = effectiveDriverCoord
      ? (shouldRouteToDropoff ? dropoffCoord : pickupCoord)
      : dropoffCoord;

    const routeKey = [
      origin.lat.toFixed(5),
      origin.lng.toFixed(5),
      destination.lat.toFixed(5),
      destination.lng.toFixed(5),
      effectiveStatus || "unknown",
    ].join("|");

    if (routeKeyRef.current === routeKey) {
      return;
    }

    routeKeyRef.current = routeKey;

    const requestId = directionsRequestRef.current + 1;
    directionsRequestRef.current = requestId;

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (requestId !== directionsRequestRef.current) {
          return;
        }

        if (status === "OK") {
          setDirections(result);
          return;
        }
        setDirections(null);
      },
    );
  }, [isLoaded, hasValidCoords, pickupLat, pickupLng, dropoffLat, dropoffLng, driverLiveLat, driverLiveLng, liveState?.status, order?.status]);

  const mapOptions = {
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    rotateControl: false,
    keyboardShortcuts: false,
    gestureHandling: "greedy",
  };

  const clientMarker = isLoaded && window.google
    ? {
        path: window.google.maps.SymbolPath.CIRCLE,
        fillColor: "#2563eb",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2,
        scale: 9,
      }
    : undefined;

  const driverMarker = isLoaded && window.google
    ? {
        path: window.google.maps.SymbolPath.CIRCLE,
        fillColor: "#f97316",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2,
        scale: 10,
      }
    : undefined;

  if (!order || !isLoaded) return <p>Chargement...</p>;

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
          {order.dateTime ? formatLocalDateTime(order.dateTime) : "N/A"}
        </p>
        <p>
          <strong>💸 Tarif :</strong> {order.fare ? `${order.fare} €` : "N/A"}
        </p>
        <p>
          <strong>🟢 Statut actuel :</strong> {order.status || "N/A"}
        </p>
        {user?.role === "driver" ? (
          <div style={{ marginTop: "12px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={() => nextStatus && handleStatusTransition(nextStatus)}
              disabled={!canProgress || statusUpdating}
              style={{
                backgroundColor: canProgress ? "#2f5d5b" : "#94a3b8",
                color: "white",
                padding: "10px 16px",
                border: "none",
                borderRadius: "8px",
                cursor: canProgress ? "pointer" : "not-allowed",
                fontWeight: "600",
              }}
            >
              {statusUpdating ? "Mise a jour..." : nextStatus ? `Passer a ${nextStatus}` : "Course terminee"}
            </button>

            <button
              onClick={() => handleStatusTransition("cancelled")}
              disabled={statusUpdating || ["completed", "cancelled", "rejected"].includes(order.status)}
              style={{
                backgroundColor: "#b91c1c",
                color: "white",
                padding: "10px 16px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                opacity: statusUpdating || ["completed", "cancelled", "rejected"].includes(order.status) ? 0.5 : 1,
              }}
            >
              Annuler la course
            </button>
          </div>
        ) : null}
        {statusMessage ? <p style={{ color: "#1d4ed8", marginTop: "10px" }}>{statusMessage}</p> : null}
        {user?.role === "driver" && ["accepted", "driver_en_route", "arrived", "in_progress"].includes(order.status) ? (
          <p>
            <strong>📡 Localisation chauffeur :</strong> {sharing ? "active (automatique)" : "en attente"}
          </p>
        ) : null}
        {user?.role === "driver" && sharing ? (
          <p>
            <strong>📤 Envois position :</strong> {locationPingCount} {lastLocationSentAt ? `• dernier envoi ${lastLocationSentAt}` : ""}
          </p>
        ) : null}
        <p>
          <strong>📍 Position client :</strong> {clientLiveCoord ? `${clientLiveCoord.lat.toFixed(5)}, ${clientLiveCoord.lng.toFixed(5)}` : "pas encore recue"}
        </p>
        <p>
          <strong>📍 Position chauffeur :</strong> {driverLiveCoord ? `${driverLiveCoord.lat.toFixed(5)}, ${driverLiveCoord.lng.toFixed(5)}` : "pas encore recue"}
        </p>
        {shareError ? <p style={{ color: "#c0392b" }}>{shareError}</p> : null}

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
              options={mapOptions}
            >
              {directions && (
                <DirectionsRenderer
                  directions={directions}
                  options={{
                    polylineOptions: {
                      strokeColor: "#0f766e",
                      strokeOpacity: 0.9,
                      strokeWeight: 6,
                    },
                    suppressMarkers: true,
                  }}
                />
              )}
              <Marker position={pickupCoord} label={{ text: "A", color: "#0f172a", fontWeight: "700" }} />
              <Marker position={dropoffCoord} label={{ text: "B", color: "#0f172a", fontWeight: "700" }} />
              {clientLiveCoord ? (
                <Marker
                  position={{ lat: clientLiveCoord.lat, lng: clientLiveCoord.lng }}
                  label={{ text: "Client", color: "#111827" }}
                  icon={clientMarker}
                />
              ) : null}
              {stableDriverCoord ? (
                <Marker
                  position={{ lat: stableDriverCoord.lat, lng: stableDriverCoord.lng }}
                  label={{ text: "Chauffeur", color: "#111827" }}
                  icon={driverMarker}
                />
              ) : null}
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
