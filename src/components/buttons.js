"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export function LoginButton() {
  const { data: session } = useSession();
  if (session) {
    return (
      <div>
        <p>Connecté en tant que {session.user.name}</p>
        <button onClick={() => signOut()}>Se déconnecter</button>
      </div>
    );
  }
  return (
    <div>
      <button onClick={() => (window.location.href = "/login")}>Se connecter</button>
    </div>
  );
}

export const RegisterButton = () => {
  return (
    <Link href="/register" style={{ marginRight: 10 }}>
      Register
    </Link>
  );
};


export const ProfileButton = () => {
  return <Link href="/profile">Profile</Link>;
};