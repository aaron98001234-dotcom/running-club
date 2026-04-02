"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "../../lib/supabase/client";

type AuthMode = "login" | "signup" | "forgot";
type Gender = "male" | "female" | "other";

const MIN_PASSWORD_LENGTH = 6;

export default function LoginForm() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState<Gender | "">("");
  const [age, setAge] = useState("");
  const [runningYears, setRunningYears] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setMessage("");
    setIsError(false);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setIsError(false);

    const origin = typeof window !== "undefined" ? window.location.origin : "";

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
        setIsError(true);
        setLoading(false);
        return;
      }

      setLoading(false);
      router.push("/records");
      router.refresh();
      return;
    }

    if (mode === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/callback?next=/reset-password`,
      });

      if (error) {
        setMessage(error.message);
        setIsError(true);
        setLoading(false);
        return;
      }

      setLoading(false);
      setMessage("重設密碼信已寄出，請到信箱點擊連結。\n若沒看到，請檢查垃圾郵件。");
      return;
    }

    if (!nickname.trim()) {
      setMessage("註冊時請填寫暱稱。");
      setIsError(true);
      setLoading(false);
      return;
    }

    if (!gender) {
      setMessage("註冊時請選擇性別。");
      setIsError(true);
      setLoading(false);
      return;
    }

    const parsedAge = Number(age);
    const parsedRunningYears = Number(runningYears);

    if (!Number.isInteger(parsedAge) || parsedAge < 1 || parsedAge > 120) {
      setMessage("年齡請輸入 1 到 120 的整數。");
      setIsError(true);
      setLoading(false);
      return;
    }

    if (
      !Number.isFinite(parsedRunningYears) ||
      parsedRunningYears < 0 ||
      parsedRunningYears > 120
    ) {
      setMessage("跑齡請輸入 0 到 120 的數字。");
      setIsError(true);
      setLoading(false);
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      setMessage(`密碼至少需要 ${MIN_PASSWORD_LENGTH} 個字元。`);
      setIsError(true);
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setMessage("兩次輸入的密碼不一致。");
      setIsError(true);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=/records`,
        data: {
          nickname: nickname.trim(),
          gender,
          age: parsedAge,
          running_years: parsedRunningYears,
        },
      },
    });

    if (error) {
      setMessage(error.message);
      setIsError(true);
      setLoading(false);
      return;
    }

    setLoading(false);

    if (data.session) {
      router.push("/records");
      router.refresh();
      return;
    }

    setMessage("註冊成功，請到信箱完成驗證後再登入。");
  };

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-3 gap-2 rounded-xl bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => switchMode("login")}
          className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
            mode === "login"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          登入
        </button>
        <button
          type="button"
          onClick={() => switchMode("signup")}
          className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
            mode === "signup"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          註冊
        </button>
        <button
          type="button"
          onClick={() => switchMode("forgot")}
          className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
            mode === "forgot"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          忘記密碼
        </button>
      </div>

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

        {mode !== "forgot" ? (
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
        ) : null}

        {mode === "signup" ? (
          <>
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-zinc-700">暱稱</span>
              <input
                type="text"
                required
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-amber-400 transition focus:ring-2"
                placeholder="例如：追風列車"
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span className="font-medium text-zinc-700">性別</span>
              <select
                required
                value={gender}
                onChange={(event) => setGender(event.target.value as Gender)}
                className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-amber-400 transition focus:ring-2"
              >
                <option value="">請選擇</option>
                <option value="male">男性</option>
                <option value="female">女性</option>
                <option value="other">其他</option>
              </select>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1 text-sm">
                <span className="font-medium text-zinc-700">年齡</span>
                <input
                  type="number"
                  min="1"
                  max="120"
                  required
                  value={age}
                  onChange={(event) => setAge(event.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-amber-400 transition focus:ring-2"
                  placeholder="25"
                />
              </label>

              <label className="grid gap-1 text-sm">
                <span className="font-medium text-zinc-700">跑齡（年）</span>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  required
                  value={runningYears}
                  onChange={(event) => setRunningYears(event.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-amber-400 transition focus:ring-2"
                  placeholder="2"
                />
              </label>
            </div>

            <label className="grid gap-1 text-sm">
              <span className="font-medium text-zinc-700">確認密碼</span>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-amber-400 transition focus:ring-2"
                placeholder="********"
              />
            </label>
          </>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="train-button rounded-lg px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {loading
            ? "列車進站中..."
            : mode === "login"
              ? "嘟嘟登入"
              : mode === "signup"
                ? "建立新帳號"
                : "寄送重設密碼信"}
        </button>

        {message ? (
          <p
            className={`whitespace-pre-line text-sm ${
              isError ? "text-rose-600" : "text-emerald-700"
            }`}
          >
            {message}
          </p>
        ) : null}
      </form>
    </div>
  );
}
