"use client";

export default function ContactPage() {
    return (
        <div style={{
            maxWidth: "600px",
            margin: "40px auto",
            padding: "30px",
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
            fontFamily: "Arial, sans-serif"
        }}>
            <h1 style={{ fontSize: "2rem", marginBottom: "25px" }}>Contact</h1>
            <p style={{ fontSize: "1.1rem", color: "#222", marginBottom: "18px" }}>
                En cas de problème sur le site, de litige ou pour toute autre demande, veuillez envoyer un mail à&nbsp;
                <a href="mailto:contact@taxit.fr" style={{ color: "#0070f3", textDecoration: "underline" }}>
                    contact@taxit.fr
                </a>
                .
            </p>
            <p style={{ color: "#666", fontSize: "1rem" }}>
                Notre équipe vous répondra dans les meilleurs délais.
            </p>
        </div>
    );
}