"use client";

import Navbar from "./Navbar";
import { LoadScript } from "@react-google-maps/api";

const GOOGLE_MAPS_LIBRARIES = ["places"];

export default function AppShell({ children }) {
  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      libraries={GOOGLE_MAPS_LIBRARIES}
    >
      <Navbar />
      <main>{children}</main>
    </LoadScript>
  );
}
