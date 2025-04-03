import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const { email, password } = credentials;
                console.log("Données envoyées à l'API backend :", { email, password });
                const res = await fetch("http://localhost:4000/api/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });

                if (!res.ok) {
                    throw new Error("Invalid credentials");
                }

                const user = await res.json();

                if (user && user.token) {
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                        token: user.token, // Ajoute le token si nécessaire
                    };
                }
                return null; // Retourne null si l'authentification échoue
            },
        }),
    ],
    session: {
        strategy: "jwt",
    }, callbacks: {
        async jwt({ token, user }) {
            // Si un utilisateur est connecté, ajoute ses données au token
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                token.role = user.role;
                token.token = user.token; // Ajoute le token JWT si nécessaire
            }
            return token;
        },
        async session({ session, token }) {
            // Ajoute les données du token à la session
            session.user = {
                id: token.id,
                email: token.email,
                name: token.name,
                role: token.role,
                token: token.token, // Ajoute le token JWT si nécessaire
            };
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };