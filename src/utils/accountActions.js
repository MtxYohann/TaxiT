// Fonction pour récupérer les données utilisateur
export const fetchUserData = async (email, setUser, setError) => {
    try {
        console.log("email", email);
        const res = await fetch("http://localhost:4000/api/user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        if (!res.ok) {
            throw new Error("Impossible de récupérer les informations utilisateur.");
        }

        const data = await res.json();
        setUser(data);
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

