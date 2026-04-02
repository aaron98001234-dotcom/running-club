"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "../../lib/supabase/client";

type RunRecord = {
  id: string;
  distance_km: number;
  duration_min: number;
  created_at: string;
};

function formatDateTime(isoString: string) {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${year}/${month}/${day} ${hour}:${minute}`;
}

function formatTotalDuration(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours} 小時 ${minutes} 分`;
}

export default function RecordsManager() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [records, setRecords] = useState<RunRecord[]>([]);
  const [distanceKm, setDistanceKm] = useState("");
  const [durationMin, setDurationMin] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const totalDistance = useMemo(
    () => records.reduce((sum, item) => sum + item.distance_km, 0),
    [records],
  );

  const totalDuration = useMemo(
    () => records.reduce((sum, item) => sum + item.duration_min, 0),
    [records],
  );

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      setStatus("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setUserId(null);
        setRecords([]);
        setLoading(false);
        return;
      }

      setUserId(user.id);

      const { data, error } = await supabase
        .from("running_records")
        .select("id, distance_km, duration_min, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        setStatus(error.message);
        setRecords([]);
        setLoading(false);
        return;
      }

      setRecords(data ?? []);
      setLoading(false);
    };

    void initialize();
  }, [supabase]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedDistance = Number(distanceKm);
    const parsedDuration = Number(durationMin);

    const isDistanceValid = Number.isFinite(parsedDistance) && parsedDistance > 0;
    const isDurationValid = Number.isFinite(parsedDuration) && parsedDuration > 0;

    if (!isDistanceValid || !isDurationValid) {
      setStatus("距離與時間都必須是大於 0 的有效數字");
      return;
    }

    if (!userId) {
      setStatus("請先登入");
      return;
    }

    setStatus("");
    setIsSubmitting(true);

    const { data, error } = await supabase
      .from("running_records")
      .insert({
        user_id: userId,
        distance_km: parsedDistance,
        duration_min: parsedDuration,
      })
      .select("id, distance_km, duration_min, created_at")
      .single();

    setIsSubmitting(false);

    if (error) {
      setStatus(error.message);
      return;
    }

    setRecords((prev) => [data, ...prev]);
    setDistanceKm("");
    setDurationMin("");
    setStatus("已新增一筆行車紀錄");
  };

  const onDelete = async (recordId: string) => {
    if (!userId) {
      setStatus("請先登入");
      return;
    }

    setStatus("");
    setDeletingId(recordId);

    const { error } = await supabase
      .from("running_records")
      .delete()
      .eq("id", recordId)
      .eq("user_id", userId);

    setDeletingId(null);

    if (error) {
      setStatus(error.message);
      return;
    }

    setRecords((prev) => prev.filter((record) => record.id !== recordId));
    setStatus("已刪除一筆行車紀錄");
  };

  if (loading) {
    return <p className="text-sm text-zinc-600">列車資料載入中...</p>;
  }

  if (!userId) {
    return (
      <div className="grid gap-3">
        <p className="text-sm text-zinc-600">
          尚未登入，請先登入才能查看與新增紀錄。
        </p>
        <Link
          href="/login"
          className="train-button w-fit rounded-lg px-4 py-2 text-sm font-semibold text-white transition"
        >
          前往登入站
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <section className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
          <p className="text-sm text-zinc-600">總里程數</p>
          <p className="mt-1 text-2xl font-bold text-zinc-900">{totalDistance.toFixed(1)} km</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
          <p className="text-sm text-zinc-600">總時間</p>
          <p className="mt-1 text-2xl font-bold text-zinc-900">{formatTotalDuration(totalDuration)}</p>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <h2 className="text-lg font-semibold text-zinc-900">新增紀錄</h2>
        <p className="mt-1 text-sm text-zinc-600">輸入本次訓練的距離與時間。</p>

        <form onSubmit={onSubmit} className="mt-4 grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-zinc-700">距離（km）</span>
              <input
                type="number"
                min="0"
                step="0.1"
                required
                value={distanceKm}
                onChange={(event) => setDistanceKm(event.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-amber-400 transition focus:ring-2"
                placeholder="5.0"
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-zinc-700">時間（分鐘）</span>
              <input
                type="number"
                min="0"
                step="1"
                required
                value={durationMin}
                onChange={(event) => setDurationMin(event.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-amber-400 transition focus:ring-2"
                placeholder="30"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="train-button w-fit rounded-lg px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSubmitting ? "傳送中..." : "新增行車紀錄"}
          </button>

          {status ? <p className="text-sm text-zinc-600">{status}</p> : null}
        </form>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <h2 className="text-lg font-semibold text-zinc-900">歷史紀錄</h2>
        <p className="mt-1 text-sm text-zinc-600">查看你過去所有訓練資料。</p>

        <div className="mt-4 grid gap-3">
          {records.length === 0 ? (
            <p className="text-sm text-zinc-500">尚無紀錄，先新增第一趟。</p>
          ) : (
            records.map((record) => (
              <article
                key={record.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <div>
                  <p className="font-semibold text-zinc-900">{record.distance_km} km</p>
                  <p className="text-sm text-zinc-600">{record.duration_min} 分鐘</p>
                  <p className="text-xs text-zinc-500">{formatDateTime(record.created_at)}</p>
                </div>

                <button
                  type="button"
                  onClick={() => onDelete(record.id)}
                  disabled={deletingId === record.id}
                  className="rounded-lg border border-rose-200 bg-white p-2 text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label="刪除紀錄"
                  title="刪除紀錄"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-4 w-4"
                  >
                    <path d="M3 6h18" />
                    <path d="M8 6V4h8v2" />
                    <path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                  </svg>
                </button>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
