
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import Navbar from "../components/Navbar"
import Head from "next/head";

const Layout = ({ children }) => {
  return (
    
export default Layout;

    <html lang="fr">
      <Head>
        <link rel="icon" href="/Icon.png" />
      </Head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}

