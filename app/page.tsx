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
          歡迎來到火車嘟嘟嘟社團網站。你可以使用 Email 登入或註冊，
          新增每次練習紀錄，並從 Supabase 載入歷史資料，像列車時刻表一樣穩定追蹤進度。
        </p>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold text-zinc-900">網站自介</h2>
        <p className="mt-2 text-sm leading-7 text-zinc-600">
          火車嘟嘟嘟是一個以「列車旅程」為主題的訓練紀錄平台，
          希望讓每位成員都能把每天的努力，累積成看得見的里程碑。
          我們把登入、註冊、忘記密碼、重設密碼、紀錄新增與歷史查詢整合在同一站，
          讓你用最少步驟完成訓練管理。
        </p>
        <p className="mt-3 text-sm leading-7 text-zinc-600">
          不管你是剛起步的新手，或是固定訓練的進階跑者，
          這個網站都會像準時發車的列車一樣，陪你穩定前進。
        </p>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <h2 className="text-xl font-semibold text-zinc-900">車站入口</h2>
          <p className="mt-2 text-sm text-zinc-600">
            透過 Supabase Email 登入或註冊，開始你的火車旅程。
          </p>
          <Link
            href="/login"
            className="train-button mt-4 inline-flex rounded-lg px-4 py-2 text-sm font-semibold text-white transition"
          >
            前往登入中心
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
