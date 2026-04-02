import { redirect } from "next/navigation";
import Card from "../components/card";
import { createSupabaseServerClient } from "../../lib/supabase/server";
import SignOutButton from "./sign-out-button";

type UserMetadata = {
  nickname?: string;
  gender?: string;
  age?: number;
  running_years?: number;
};

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const metadata = (user.user_metadata ?? {}) as UserMetadata;
  const genderMap: Record<string, string> = {
    male: "男性",
    female: "女性",
    other: "其他",
  };

  const profileComplete = Boolean(
    metadata.nickname &&
      metadata.gender &&
      metadata.age !== undefined &&
      metadata.running_years !== undefined,
  );

  return (
    <div className="w-full">
      <Card className="mx-auto w-full max-w-2xl">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">個人資料</h1>
        <p className="mt-2 text-sm text-zinc-600">
          這裡會顯示你註冊時填寫的基本資料。
        </p>

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          資料完整度：
          <span className={profileComplete ? "font-semibold text-emerald-700" : "font-semibold text-amber-700"}>
            {profileComplete ? " 已完整" : " 尚未完整"}
          </span>
        </div>

        <div className="mt-6 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm">
          <p>
            <span className="font-semibold text-zinc-800">Email：</span>
            <span className="text-zinc-600">{user.email ?? "-"}</span>
          </p>
          <p>
            <span className="font-semibold text-zinc-800">暱稱：</span>
            <span className="text-zinc-600">{metadata.nickname ?? "未填寫"}</span>
          </p>
          <p>
            <span className="font-semibold text-zinc-800">性別：</span>
            <span className="text-zinc-600">
              {metadata.gender ? (genderMap[metadata.gender] ?? metadata.gender) : "未填寫"}
            </span>
          </p>
          <p>
            <span className="font-semibold text-zinc-800">年齡：</span>
            <span className="text-zinc-600">{metadata.age ?? "未填寫"}</span>
          </p>
          <p>
            <span className="font-semibold text-zinc-800">跑齡：</span>
            <span className="text-zinc-600">
              {metadata.running_years !== undefined
                ? `${metadata.running_years} 年`
                : "未填寫"}
            </span>
          </p>
        </div>

        <div className="mt-6">
          <SignOutButton />
        </div>
      </Card>
    </div>
  );
}
