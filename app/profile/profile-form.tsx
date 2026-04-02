"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "../../lib/supabase/client";

type Gender = "male" | "female" | "other";

type ProfileFormProps = {
  email: string;
  nickname: string;
  gender: string;
  age: string;
  runningYears: string;
};

export default function ProfileForm({
  email,
  nickname,
  gender,
  age,
  runningYears,
}: ProfileFormProps) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const router = useRouter();

  const [nicknameValue, setNicknameValue] = useState(nickname);
  const [genderValue, setGenderValue] = useState<Gender | "">(
    gender === "male" || gender === "female" || gender === "other"
      ? gender
      : "",
  );
  const [ageValue, setAgeValue] = useState(age);
  const [runningYearsValue, setRunningYearsValue] = useState(runningYears);
  const [status, setStatus] = useState("");
  const [isError, setIsError] = useState(false);
  const [saving, setSaving] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedAge = Number(ageValue);
    const parsedRunningYears = Number(runningYearsValue);

    if (!nicknameValue.trim()) {
      setStatus("請填寫暱稱。");
      setIsError(true);
      return;
    }

    if (!genderValue) {
      setStatus("請選擇性別。");
      setIsError(true);
      return;
    }

    if (!Number.isInteger(parsedAge) || parsedAge < 1 || parsedAge > 120) {
      setStatus("年齡請輸入 1 到 120 的整數。");
      setIsError(true);
      return;
    }

    if (
      !Number.isFinite(parsedRunningYears) ||
      parsedRunningYears < 0 ||
      parsedRunningYears > 120
    ) {
      setStatus("跑齡請輸入 0 到 120 的數字。");
      setIsError(true);
      return;
    }

    setSaving(true);
    setStatus("");
    setIsError(false);

    const { error } = await supabase.auth.updateUser({
      data: {
        nickname: nicknameValue.trim(),
        gender: genderValue,
        age: parsedAge,
        running_years: parsedRunningYears,
      },
    });

    setSaving(false);

    if (error) {
      setStatus(error.message);
      setIsError(true);
      return;
    }

    setStatus("個人資料已更新。");
    setIsError(false);
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-4 rounded-xl border border-slate-200 bg-white p-4">
      <label className="grid gap-1 text-sm">
        <span className="font-medium text-zinc-700">Email</span>
        <input
          type="email"
          value={email}
          disabled
          className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-zinc-500"
        />
      </label>

      <label className="grid gap-1 text-sm">
        <span className="font-medium text-zinc-700">暱稱</span>
        <input
          type="text"
          required
          value={nicknameValue}
          onChange={(event) => setNicknameValue(event.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-amber-400 transition focus:ring-2"
          placeholder="例如：追風列車"
        />
      </label>

      <label className="grid gap-1 text-sm">
        <span className="font-medium text-zinc-700">性別</span>
        <select
          required
          value={genderValue}
          onChange={(event) => setGenderValue(event.target.value as Gender)}
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
            value={ageValue}
            onChange={(event) => setAgeValue(event.target.value)}
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
            value={runningYearsValue}
            onChange={(event) => setRunningYearsValue(event.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-amber-400 transition focus:ring-2"
            placeholder="2"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="train-button w-fit rounded-lg px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {saving ? "儲存中..." : "儲存個人資料"}
      </button>

      {status ? (
        <p className={`text-sm ${isError ? "text-rose-600" : "text-emerald-700"}`}>
          {status}
        </p>
      ) : null}
    </form>
  );
}
