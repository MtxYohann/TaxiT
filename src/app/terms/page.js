"use client";

export default function TermsPage() {
    return (
        <div style={{
            maxWidth: "800px",
            margin: "40px auto",
            padding: "30px",
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
            fontFamily: "Arial, sans-serif"
        }}>
            <h1 style={{ fontSize: "2rem", marginBottom: "25px" }}>Conditions Générales d’Utilisation (CGU)</h1>
            <p style={{ color: "#666", marginBottom: "18px" }}>
                Dernière mise à jour : <strong>26/09/2025</strong>
            </p>
            <p>
                Bienvenue sur Taxit, notre plateforme de mise en relation entre clients et chauffeurs professionnels.<br />
                En utilisant notre application, vous acceptez pleinement et sans réserve les présentes Conditions Générales d’Utilisation (CGU).
            </p>
            <ol style={{ paddingLeft: "18px", color: "#222", fontSize: "1.05rem", marginTop: "20px" }}>
                <li style={{ marginBottom: "18px" }}>
                    <strong>Objet</strong><br />
                    Les présentes CGU définissent les conditions dans lesquelles :
                    <ul>
                        <li>Les clients peuvent réserver un chauffeur via la plateforme,</li>
                        <li>Les chauffeurs peuvent recevoir et gérer des commandes,</li>
                        <li>Et les deux parties peuvent interagir via l’application.</li>
                    </ul>
                </li>
                <li style={{ marginBottom: "18px" }}>
                    <strong>Accès au service</strong><br />
                    L'accès à la plateforme nécessite la création d’un compte utilisateur, en tant que client ou chauffeur.
                    <ul>
                        <li>
                            <strong>a) Pour les clients :</strong><br />
                            Une inscription classique est demandée (nom, email, téléphone, mot de passe).<br />
                            L’utilisateur peut ensuite accéder à l’interface de réservation.
                        </li>
                        <li>
                            <strong>b) Pour les chauffeurs :</strong><br />
                            Une inscription avec informations personnelles et professionnelles est requise.<br />
                            Les chauffeurs doivent impérativement fournir une copie valide de leur permis de conduire et de leur carte professionnelle de taxi.<br />
                            Les documents sont vérifiés manuellement par notre équipe avant activation du compte.
                        </li>
                    </ul>
                </li>
                <li style={{ marginBottom: "18px" }}>
                    <strong>Validation des chauffeurs</strong><br />
                    Afin de garantir la sécurité des clients et la conformité du service :
                    <ul>
                        <li>Chaque chauffeur est vérifié manuellement avant d’avoir accès aux fonctionnalités de la plateforme.</li>
                        <li>En cas de documents falsifiés, périmés ou non conformes, le compte chauffeur sera suspendu sans préavis.</li>
                        <li>Nous nous réservons le droit de demander des documents supplémentaires à tout moment.</li>
                    </ul>
                </li>
                <li style={{ marginBottom: "18px" }}>
                    <strong>Fonctionnement du service</strong><br />
                    <ul>
                        <li>Les clients peuvent rechercher un chauffeur, réserver un trajet, et consulter l’historique de leurs commandes.</li>
                        <li>Les chauffeurs reçoivent des demandes, qu’ils peuvent accepter ou refuser.</li>
                        <li>Une fois la course acceptée, les informations du trajet sont affichées sur une carte interactive (Google Maps).</li>
                    </ul>
                </li>
                <li style={{ marginBottom: "18px" }}>
                    <strong>Obligations des utilisateurs</strong>
                    <ul>
                        <li>
                            <strong>a) Clients :</strong>
                            <ul>
                                <li>Fournir des informations exactes lors de l'inscription,</li>
                                <li>Ne pas effectuer de réservations abusives ou frauduleuses,</li>
                                <li>Respecter le chauffeur et les conditions du trajet.</li>
                            </ul>
                        </li>
                        <li>
                            <strong>b) Chauffeurs :</strong>
                            <ul>
                                <li>Être titulaire d’un permis de conduire en cours de validité,</li>
                                <li>Exercer légalement en tant que chauffeur professionnel,</li>
                                <li>Fournir un service conforme aux attentes, ponctuel et sécurisé.</li>
                            </ul>
                        </li>
                    </ul>
                </li>
                <li style={{ marginBottom: "18px" }}>
                    <strong>Responsabilités</strong><br />
                    TAXIT est un intermédiaire entre clients et chauffeurs.<br />
                    Nous ne sommes pas responsables du comportement des utilisateurs en dehors de l’application.<br />
                    Toutefois, tout comportement frauduleux ou dangereux doit être signalé immédiatement.
                </li>
                <li style={{ marginBottom: "18px" }}>
                    <strong>Sécurité et confidentialité</strong><br />
                    Toutes les données utilisateurs sont stockées de manière sécurisée.<br />
                    Les mots de passe sont chiffrés.<br />
                    Nous respectons le RGPD. La politique de confidentialité complète est consultable <a href="/privacy" style={{ color: "#0070f3", textDecoration: "underline" }}>ici</a>.
                </li>
                <li style={{ marginBottom: "18px" }}>
                    <strong>Suspension de compte</strong><br />
                    Tout utilisateur (client ou chauffeur) peut voir son compte suspendu temporairement ou définitivement en cas de :
                    <ul>
                        <li>Fraude,</li>
                        <li>Violation des présentes CGU,</li>
                        <li>Activité suspecte ou dangereuse.</li>
                    </ul>
                </li>
                <li style={{ marginBottom: "18px" }}>
                    <strong>Propriété intellectuelle</strong><br />
                    L’ensemble du contenu de la plateforme (code, design, marque, logo, etc.) est protégé par les lois en vigueur.<br />
                    Toute reproduction ou utilisation non autorisée est interdite.
                </li>
                <li style={{ marginBottom: "18px" }}>
                    <strong>Modification des CGU</strong><br />
                    TAXIT se réserve le droit de modifier à tout moment les présentes conditions.<br />
                    Les utilisateurs seront informés en cas de changements majeurs.
                </li>
                <li style={{ marginBottom: "18px" }}>
                    <strong>Contact</strong><br />
                    Pour toute question ou demande liée aux présentes CGU :<br />
                    <span role="img" aria-label="email">📧</span> <a href="mailto:contact@taxit.fr">contact@taxit.fr</a>
                </li>
            </ol>
        </div>
    );
}