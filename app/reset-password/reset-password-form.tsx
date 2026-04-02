"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "../../lib/supabase/client";

const MIN_PASSWORD_LENGTH = 6;

export default function ResetPasswordForm() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setMessage("");
    setIsError(false);

    if (password.length < MIN_PASSWORD_LENGTH) {
      setMessage(`密碼至少需要 ${MIN_PASSWORD_LENGTH} 個字元。`);
      setIsError(true);
      return;
    }

    if (password !== confirmPassword) {
      setMessage("兩次輸入的密碼不一致。");
      setIsError(true);
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setMessage(error.message);
      setIsError(true);
      setLoading(false);
      return;
    }

    setLoading(false);
    setMessage("密碼已更新，3 秒後回到登入頁...");

    window.setTimeout(() => {
      router.push("/login");
      router.refresh();
    }, 3000);
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <label className="grid gap-1 text-sm">
        <span className="font-medium text-zinc-700">新密碼</span>
        <input
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-amber-400 transition focus:ring-2"
          placeholder="********"
        />
      </label>

      <label className="grid gap-1 text-sm">
        <span className="font-medium text-zinc-700">確認新密碼</span>
        <input
          type="password"
          required
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-amber-400 transition focus:ring-2"
          placeholder="********"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="train-button rounded-lg px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {loading ? "密碼更新中..." : "更新密碼"}
      </button>

      {message ? (
        <p className={`text-sm ${isError ? "text-rose-600" : "text-emerald-700"}`}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
