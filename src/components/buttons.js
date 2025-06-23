"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export function LoginButton() {
  const { data: session } = useSession();
  if (session) {
    return (
      <div>
        <a onClick={() => signOut()}>Se déconnecter</a>
      </div>
    );
  }
  return (
    <Link href="/login" style={{ marginRight: 10 }}>
      Se connecter
    </Link>

  );
}

export const RegisterButton = () => {
  const { data: session } = useSession();
  if (!session) {
    return (
      <Link href="/register" style={{ marginRight: 10 }}>
        Register
      </Link>
    );
  }
};


export const ProfileButton = () => {
  return <Link href="/account">Profile</Link>;
};