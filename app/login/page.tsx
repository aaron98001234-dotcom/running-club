import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../lib/supabase/server";
import Card from "../components/card";
import LoginForm from "./login-form";

export default async function LoginPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/records");
  }

  return (
    <div className="w-full">
      <Card className="mx-auto w-full max-w-lg">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          列車登入中心
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          這裡提供登入、註冊與忘記密碼。首次註冊需填寫暱稱、性別、年齡與跑齡。
        </p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </Card>
    </div>
  );
}
