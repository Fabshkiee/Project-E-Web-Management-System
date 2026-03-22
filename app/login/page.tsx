"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  //State: Track user types
  const router = useRouter();
  const supabase = createClient();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setSHowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  //Login Logic
  const handleLogin = async (e: React.SubmitEvent) => {
    e.preventDefault(); //prevent from refreshing
    setLoading(true);
    setError("");

    //fake email for supabaseuath
    const fakeEmail = `${loginId.trim()}@projecte.local`;

    //call supabase
    const { error } = await supabase.auth.signInWithPassword({
      email: fakeEmail,
      password,
    });
  };

  return (
    <section>
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold">Login</h1>
        </div>
      </div>
    </section>
  );
}
