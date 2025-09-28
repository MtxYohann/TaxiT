"use client";

export default function PrivacyPage() {
    return (
        <div style={{
            maxWidth: "700px",
            margin: "40px auto",
            padding: "30px",
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
            fontFamily: "Arial, sans-serif"
        }}>
            <h1 style={{ fontSize: "2rem", marginBottom: "25px" }}>Politique de confidentialité</h1>
            <ol style={{ paddingLeft: "18px", color: "#222", fontSize: "1.05rem" }}>
                <li style={{ marginBottom: "18px" }}>
                    <strong>Données collectées</strong><br />
                    Nous collectons uniquement les données nécessaires au fonctionnement de la plateforme :<br />
                    <ul style={{ marginTop: "8px", marginBottom: "8px" }}>
                        <li>Clients : nom, prénom, email, téléphone, mot de passe (chiffré), informations de réservation et historique des trajets.</li>
                        <li>Chauffeurs : informations personnelles (nom, email, téléphone), informations professionnelles (numéro de licence de taxi, permis de conduire, etc.), documents justificatifs nécessaires à la vérification.</li>
                    </ul>
                </li>
                <li style={{ marginBottom: "18px" }}>
                    <strong>Finalité de l’utilisation</strong><br />
                    Les données sont utilisées pour :
                    <ul style={{ marginTop: "8px", marginBottom: "8px" }}>
                        <li>Créer et gérer les comptes utilisateurs,</li>
                        <li>Permettre la mise en relation entre clients et chauffeurs,</li>
                        <li>Sécuriser le service en vérifiant l’identité et la légalité des chauffeurs,</li>
                        <li>Gérer les paiements et factures,</li>
                        <li>Améliorer l’expérience utilisateur et la qualité du service.</li>
                    </ul>
                </li>
                <li style={{ marginBottom: "18px" }}>
                    <strong>Partage des données</strong><br />
                    Nous ne vendons pas vos données à des tiers.<br />
                    Les données peuvent être partagées uniquement avec :
                    <ul style={{ marginTop: "8px", marginBottom: "8px" }}>
                        <li>Les prestataires techniques (hébergement cloud, API Google Maps, paiement via Stripe),</li>
                        <li>Les autorités compétentes si la loi nous y oblige.</li>
                    </ul>
                </li>
                <li style={{ marginBottom: "18px" }}>
                    <strong>Durée de conservation</strong><br />
                    Les documents des utilisateurs sont conservés tant que le compte est actif.<br />
                    Les données de facturation sont conservées selon les obligations légales (ex. 10 ans pour la comptabilité).
                </li>
                <li style={{ marginBottom: "18px" }}>
                    <strong>Sécurité</strong><br />
                    <ul style={{ marginTop: "8px", marginBottom: "8px" }}>
                        <li>Les mots de passe sont stockés de manière chiffrée,</li>
                        <li>Les communications passent par le protocole sécurisé HTTPS,</li>
                        <li>Les documents sensibles (ex : licence chauffeur) sont stockés de manière sécurisée et accessibles uniquement à l’équipe habilitée.</li>
                    </ul>
                </li>
                <li style={{ marginBottom: "18px" }}>
                    <strong>Vos droits</strong><br />
                    Conformément au RGPD, vous disposez des droits suivants :
                    <ul style={{ marginTop: "8px", marginBottom: "8px" }}>
                        <li>Accéder à vos données,</li>
                        <li>Rectifier vos informations,</li>
                        <li>Supprimer votre compte et vos données,</li>
                        <li>Limiter ou vous opposer à certains traitements.</li>
                    </ul>
                </li>
                <li style={{ marginBottom: "18px" }}>
                    <strong>Contact</strong><br />
                    Pour toute question relative à cette politique de confidentialité :<br />
                    <span role="img" aria-label="email">📧</span> <a href="mailto:contact@taxit.fr">contact@taxit.fr</a>
                </li>
            </ol>
        </div>
    );
}