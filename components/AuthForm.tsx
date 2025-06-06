import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useState } from "react";

interface Inputs {
  email: string;
  password: string;
}

export default function AuthForm({ callbackUrl = "/" }: { callbackUrl?: string }) {
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
  const [loading, setLoading] = useState(false);

  async function onSubmit(data: Inputs) {
    setLoading(true);
    const res = await signIn("credentials", { ...data, callbackUrl, redirect: true });
    if (res?.error) alert("Invalid credentials");
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
      <div>
        <label className="label">Email</label>
        <input {...register("email", { required: true })}
               className="input" type="email" autoComplete="email" />
        {errors.email && <p className="text-red-500 text-sm">Email required</p>}
      </div>
      <div>
        <label className="label">Password</label>
        <input {...register("password", { required: true })}
               className="input" type="password" autoComplete="current-password" />
      </div>
      <button disabled={loading}
              className="btn-primary w-full">{loading ? "…" : "Sign in"}</button>
    </form>
  );
}
