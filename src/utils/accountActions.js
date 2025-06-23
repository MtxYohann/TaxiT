// Fonction pour récupérer les données utilisateur
export const fetchUserData = async (email, setUser, setReservations, setError) => {
    try {
        // Récupérer l'utilisateur
        const resUser = await fetch("http://localhost:4000/api/user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
        if (!resUser.ok) throw new Error("Impossible de récupérer les infos utilisateur.");
        const userData = await resUser.json();
        console.log("Données utilisateur récupérées :", userData);
        setUser(userData);

        // Récupérer les réservations
        const resResa = await fetch(`http://localhost:4000/api/reservations/${userData.id}`);
        if (!resResa.ok) throw new Error("Impossible de récupérer les réservations.");
        const reservationsData = await resResa.json();
        console.log("Données réservations :", reservationsData);
        setReservations(reservationsData);

    } catch (err) {
        setError(err.message);
    }
};

// Fonction pour supprimer le compte
export const deleteAccount = async (router, setError, email) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer votre compte ?")) {
        try {
            const res = await fetch("http://localhost:4000/api/delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (!res.ok) {
                throw new Error("Erreur lors de la suppression du compte.");
            }

            alert("Compte supprimé avec succès.");
            router.push("/register");
        } catch (err) {
            setError(err.message);
        }
    }
};

// Fonction pour modifier les données utilisateur
export const editAccount = (router) => {
    router.push("/edit-account"); // Rediriger vers une page d'édition
};

export async function getAddressFromCoords(lat, lng) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
    );
    if (!res.ok) return `${lat}, ${lng}`;
    const data = await res.json();
    if (data.status === "OK" && data.results.length > 0) {
        return data.results[0].formatted_address;
    }
    return `${lat}, ${lng}`;
}

