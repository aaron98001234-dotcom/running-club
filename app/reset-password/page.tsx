import { redirect } from "next/navigation";
import Card from "../components/card";
import { createSupabaseServerClient } from "../../lib/supabase/server";
import ResetPasswordForm from "./reset-password-form";

export default async function ResetPasswordPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="w-full">
      <Card className="mx-auto w-full max-w-lg">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          重設密碼
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          請輸入新密碼完成更新，更新後會回到登入頁。
        </p>
        <div className="mt-6">
          <ResetPasswordForm />
        </div>
      </Card>
    </div>
  );
}
