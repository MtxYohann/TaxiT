"use client";
import React, { useState, useRef, useEffect } from "react";
import { GoogleMap, Marker, Autocomplete, DirectionsRenderer } from "@react-google-maps/api";
import { calculerTarif } from "../app/controllers/routesController";
import { createLocalDateTime } from "../utils/dateUtils";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 45.764043,
  lng: 4.835659,
};

const rhoneLimite = {
  north: 45.930385,
  south: 45.430385,
  west: 4.630385,
  east: 5.130385,
};

const componentRestrictions = { country: "fr" };

const mapOtions = {
  streetViewControl: false,
  fullscreenControl: false,
  clickableIcons: false,
  mapTypeControl: false,
};

export default function MapPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const [pickup, setPickup] = useState(null);
  const [dropoff, setDropoff] = useState(null);
  const [directions, setDirections] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [tarif, setTarif] = useState(null);
  const router = useRouter();

  const pickupRef = useRef(null);
  const dropoffRef = useRef(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  const handlePlaceChanged = (autocomplete, setLocation) => {
    const place = autocomplete.getPlace();
    if (place.geometry && place.geometry.location) {
      setLocation({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    } else {
      console.error("Invalid place");
    }
  };

  const handleCalculateRoute = () => {
    if (pickup && dropoff) {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: pickup,
          destination: dropoff,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        async (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirections(result);
            const distance = result.routes[0].legs[0].distance.value / 1000;
            const duration = result.routes[0].legs[0].duration.value / 60;
            const dateTime = createLocalDateTime(date, time);
            console.log(`Date: ${dateTime}`);
            console.log(`Distance: ${distance} km`);
            if (!date || !time) {
              console.log("date et heure non indiqué j'ai brulé le serveur")
              const errorTarifMessage = "merci de saisir une date et une heure pour estimer le coût de votre trajet"
              setTarif(errorTarifMessage)
              return
            }
            try {
              const tarifCalculer = await calculerTarif(distance, duration, dateTime);
              setTarif(tarifCalculer);
            } catch (error) {
              console.error("Impossible de calculer le tarif du trajet", error);
            }
          } else {
            console.error(`Error fetching directions: ${result}`);
          }
        }
      );
    }
  };

  const handleReservation = async () => {
    if (pickup && dropoff && date && time) {
      console.log("Reservation en cours...");

      const reservationData = {
        pickupLat: pickup.lat,
        pickupLng: pickup.lng,
        dropoffLat: dropoff.lat,
        dropoffLng: dropoff.lng,
        fare: parseFloat(tarif),
        dateTime: createLocalDateTime(date, time)
      };
      try {
        const response = await fetch("/api/reservations/add-reservation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(reservationData),
          credentials: 'include'

        });

        const result = await response.json();
        console.log('Réponse du serveur:', result);
        if (!response.ok) {
          throw new Error(result.message);
        } else {
          const reservationId = result.reservation.id;
          console.log("Course réservée avec succès ID de la reservation : ", result.reservation.id);
          router.push(`/reservation?reservationId=${reservationId}`);
        }
      } catch (error) {
        console.error("Impossible de réserver la course", error);
        alert("Erreur lors de la réservation : " + error.message);
      }
    } else {
      console.error("Veuillez saisir les lieux de prise en charge et de dépose, ainsi que la date et l'heure de la réservation");
      alert("Veuillez remplir tous les champs avant de réserver.");
    }
  }

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh"
      }}>
        Chargement...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Veuillez vous connecter pour accéder à la carte</h2>
        <button
          onClick={() => router.push("/login")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Se connecter
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", padding: "20px" }}>
      {/* Conteneur de la carte */}
      <div
        style={{
          flex: 2,
          position: "relative",
          borderRadius: "15px",
          overflow: "hidden",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          margin: "10px",
          maxHeight: "80vh",
        }}
      >
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10} options={mapOtions}>
          {pickup && <Marker position={pickup} />}
          {dropoff && <Marker position={dropoff} />}
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </div>

      {/* Formulaire pour saisir les lieux */}
      <div
        style={{
          flex: 1,
          padding: "20px",
          overflowY: "auto",
          zIndex: 1,
          position: "relative",
          backgroundColor: "white",
          borderRadius: "15px",
          height: "75vh",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          margin: "10px",
        }}
      >
        <Autocomplete
          onLoad={(ref) => (pickupRef.current = ref)}
          onPlaceChanged={() => handlePlaceChanged(pickupRef.current, setPickup)}
          options={{ bounds: rhoneLimite, componentRestrictions: componentRestrictions, strictBounds: true }}
        >
          <input
            type="text"
            placeholder="Entrée un point de départ"
            style={{
              width: "90%",
              marginBottom: "10px",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        </Autocomplete>
        <Autocomplete
          onLoad={(ref) => (dropoffRef.current = ref)}
          onPlaceChanged={() => handlePlaceChanged(dropoffRef.current, setDropoff)}
          options={{ componentRestrictions: componentRestrictions }}
        >
          <input
            type="text"
            placeholder="Entrée un point de d'arrivée"
            style={{
              width: "90%",
              marginBottom: "10px",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        </Autocomplete>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{
            width: "90%",
            marginBottom: "10px",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc"
          }}
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={{
            width: "90%",
            marginBottom: "10px",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc"
          }}
        />

        <button
          onClick={handleCalculateRoute}
          style={{
            width: "95%",
            padding: "10px",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            marginBottom: "10px",
          }}
        >
          Estimer le prix
        </button>
        {tarif && (
          <p style={{ marginTop: "20px", padding: "10px", backgroundColor: "#f0f8ff", borderRadius: "8px" }}>
            {typeof tarif === 'number' ? `Estimation prix: ${tarif}€` : tarif}
          </p>
        )}
        <button
          onClick={handleReservation}
          disabled={!tarif || typeof tarif !== 'number'}
          style={{
            width: "95%",
            padding: "10px",
            backgroundColor: (!tarif || typeof tarif !== 'number') ? "#ccc" : "#28a745",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: (!tarif || typeof tarif !== 'number') ? "not-allowed" : "pointer",
          }}
        >
          Réserver une course
        </button>
      </div>
      {/* Styles globaux */}
      <style jsx global>{`
        body {
          margin: 0;
          height: 100vh;
          overflow: hidden;
          font-family: Arial, sans-serif;
        }
      `}</style>
    </div>
  );
}