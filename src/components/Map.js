
"use client";
import React, { useState, useRef } from "react";
import { GoogleMap, LoadScript, Marker, Autocomplete, DirectionsRenderer } from "@react-google-maps/api";
import { calculerTarif } from "../app/controllers/routesController";
import { useRouter } from "next/navigation";


const containerStyle = {
  width: "100%",
  height: "100%", // Hauteur ajustée pour que la carte soit plus petite
};

const center = {
  lat: 45.764043, // Latitude de Paris
  lng: 4.835659, // Longitude de Paris
};

//définition de la limite géographique de la carte
const rhoneLimite = {
  north: 45.930385,
  south: 45.430385,
  west: 4.630385,
  east: 5.130385,
};

//limitation de la carte en france 
const componentRestrictions = { country: "fr" };

const mapOtions = {
  streetViewControl: false, // Désactive le mode Street View
  fullscreenControl: false, // Désactive le mode plein écran
  clickableIcons: false, // Désactive les icônes cliquables
  mapTypeControl: false, // Désactive le contrôle du type de carte
};


export default function MapPage() {
  const [pickup, setPickup] = useState(null);
  const [dropoff, setDropoff] = useState(null);
  const [directions, setDirections] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [tarif, setTarif] = useState(null);
  const router = useRouter();

  const pickupRef = useRef(null);
  const dropoffRef = useRef(null);

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
            const dateTime = `${date}T${time}`;
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
        dateTime: `${date}T${time}`,
      };
      try {
        const response = await fetch("http://localhost:4000/api/reservations/add-reservation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reservationData),
        });

        const result = await response.json();
        console.log('Réponse du serveur:', result);
        if (!response.ok) {

          throw new Error(result.message);
        }
        else {
          const reservationId = result.reservation.id;
          console.log("Course réservée avec succès ID de la reservation : ", result.reservation.id);
          router.push(`/reservation?reservationId=${reservationId}`);
        }
      } catch (error) {
        console.error("Impossible de réserver la course", error);

      }

    } else {
      console.error("Veuillez saisir les lieux de prise en charge et de dépose, ainsi que la date et l'heure de la réservation");
    }
  }

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} libraries={["places"]}>
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
          <Autocomplete onLoad={(ref) => (pickupRef.current = ref)} onPlaceChanged={() => handlePlaceChanged(pickupRef.current, setPickup)} options={{ bounds: rhoneLimite, componentRestrictions: componentRestrictions, strictBounds: true }}>
            <input
              type="text"
              placeholder="Entrée un point de départ"
              style={{
                width: "90%",
                marginBottom: "10px",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </Autocomplete>
          <Autocomplete onLoad={(ref) => (dropoffRef.current = ref)} onPlaceChanged={() => handlePlaceChanged(dropoffRef.current, setDropoff)} options={{ componentRestrictions: componentRestrictions }}>
            <input
              type="text"
              placeholder="Entrée un point de d'arrivée"
              style={{
                width: "90%",
                marginBottom: "10px",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </Autocomplete>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ width: "90%", marginBottom: "10px", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }} />
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} style={{ width: "90%", marginBottom: "10px", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }} />

          <button
            onClick={handleCalculateRoute}
            style={{
              width: "95%",
              padding: "10px",
              backgroundColor: "#007BFF",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginBottom: "10px",
            }}
          >
            Estimer le prix
          </button>
          {tarif && <p style={{ marginTop: "20px" }}>Estimation prix: {tarif}€</p>}
          <button
            onClick={handleReservation}
            style={{
              width: "95%",
              padding: "10px",
              backgroundColor: "#007BFF",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Reserver une course
          </button>
        </div>
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
    </LoadScript>
  );
}

