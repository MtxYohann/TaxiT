"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import Navbar from "../components/Navbar"
import Head from "next/head";
import { LoadScript } from "@react-google-maps/api";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
          libraries={["places"]}
        >
            <Navbar />
            <main>{children}</main>
        </LoadScript>
      </body>
    </html>
  );
}

