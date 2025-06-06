import { useState } from "react";
import { useLocation } from "wouter";

export default function Login() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    fd.append("username", email);
    fd.append("password", password);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(fd as any),
      credentials: "include",
    });
    if (res.ok) {
      navigate("/dashboard");
    }
  }

  return (
    <form onSubmit={onSubmit} className="p-4 space-y-4">
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        className="border p-2 w-full"
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        className="border p-2 w-full"
      />
      <button type="submit" className="border px-4 py-2 rounded">
        Login
      </button>
    </form>
  );
}
