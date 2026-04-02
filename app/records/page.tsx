import { redirect } from "next/navigation";
import Card from "../components/card";
import { createSupabaseServerClient } from "../../lib/supabase/server";
import RecordsManager from "./records-manager";

export default async function RecordsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="w-full">
      <Card className="mx-auto w-full max-w-3xl">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          火車嘟嘟嘟行車紀錄
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          新增每趟訓練里程，並從 Supabase 載入完整紀錄。
        </p>
        <div className="mt-6">
          <RecordsManager />
        </div>
      </Card>
    </div>
  );
}
