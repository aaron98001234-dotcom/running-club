"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "../../lib/supabase/client";

export default function LoginForm() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push("/records");
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <label className="grid gap-1 text-sm">
        <span className="font-medium text-zinc-700">Email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-amber-400 transition focus:ring-2"
          placeholder="conductor@example.com"
        />
      </label>

      <label className="grid gap-1 text-sm">
        <span className="font-medium text-zinc-700">密碼</span>
        <input
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-amber-400 transition focus:ring-2"
          placeholder="********"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="train-button rounded-lg px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {loading ? "列車進站中..." : "嘟嘟登入"}
      </button>

      {message ? <p className="text-sm text-rose-600">{message}</p> : null}
    </form>
  );
}
