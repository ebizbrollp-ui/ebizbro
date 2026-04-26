"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const ADMIN_EMAIL = "ebizbrollp@gmail.com";

  const handleLogin = async () => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);

      // 🔐 restrict to admin only
      if (res.user.email !== ADMIN_EMAIL) {
        alert("Not authorized");
        return;
      }

      router.push("/admin");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">

      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur p-8 rounded-2xl shadow-xl w-full max-w-md">

          <h2 className="text-2xl font-semibold mb-6 text-center">
            Admin Login
          </h2>

          <input
            placeholder="Email"
            className="w-full p-3 border rounded-lg mb-4"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg mb-6"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >
            Login
          </button>

        </div>
      </div>
    </div>
  );
}