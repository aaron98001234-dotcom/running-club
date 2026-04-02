import { redirect } from "next/navigation";
import Card from "../components/card";
import { createSupabaseServerClient } from "../../lib/supabase/server";
import ProfileForm from "./profile-form";
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
          你可以直接在下方編輯並儲存個人資料。
        </p>

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          資料完整度：
          <span
            className={
              profileComplete
                ? "font-semibold text-emerald-700"
                : "font-semibold text-amber-700"
            }
          >
            {profileComplete ? " 已完整" : " 尚未完整"}
          </span>
        </div>

        <ProfileForm
          email={user.email ?? ""}
          nickname={metadata.nickname ?? ""}
          gender={metadata.gender ?? ""}
          age={metadata.age !== undefined ? String(metadata.age) : ""}
          runningYears={
            metadata.running_years !== undefined ? String(metadata.running_years) : ""
          }
        />

        <div className="mt-6">
          <SignOutButton />
        </div>
      </Card>
    </div>
  );
}
