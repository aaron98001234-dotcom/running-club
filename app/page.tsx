import Link from "next/link";
import Card from "./components/card";

export default function Home() {
  return (
    <div className="grid w-full gap-6">
      <Card>
        <p className="text-sm font-semibold uppercase tracking-wider text-amber-600">
          Train Club
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
          火車嘟嘟嘟
        </h1>
        <p className="mt-4 text-zinc-600">
          歡迎來到火車嘟嘟嘟社團網站。你可以使用 Email 登入，新增每次練習紀錄，
          並從 Supabase 載入歷史資料，像列車時刻表一樣穩定追蹤進度。
        </p>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <h2 className="text-xl font-semibold text-zinc-900">車站入口</h2>
          <p className="mt-2 text-sm text-zinc-600">
            透過 Supabase Email 登入，開始你的火車旅程。
          </p>
          <Link
            href="/login"
            className="train-button mt-4 inline-flex rounded-lg px-4 py-2 text-sm font-semibold text-white transition"
          >
            前往登入
          </Link>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-zinc-900">行車紀錄</h2>
          <p className="mt-2 text-sm text-zinc-600">
            新增距離與時間，並從資料庫載入所有歷史紀錄。
          </p>
          <Link
            href="/records"
            className="mt-4 inline-flex rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-400"
          >
            開啟紀錄
          </Link>
        </Card>
      </div>
    </div>
  );
}
