"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { createUserIfNotExists } from "@/app/lib/createUserIfNotExists";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);

      if (!userCred.user.emailVerified) {
        alert("Please verify your email before logging in.");
        return;
      }

      // 🔥 Ensure Firestore structure exists
      await createUserIfNotExists(userCred.user);

      router.push("/dashboard");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // 🔥 Ensure Firestore structure exists
      await createUserIfNotExists(result.user);

      router.push("/dashboard");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your email first.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent.");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-gray-100 to-blue-300">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border">

        {/* LOGO */}
        <div className="flex flex-col items-center mb-6">
          <img src="/logo.png" className="h-10 mb-2" />
          <h1 className="text-2xl font-semibold">Welcome to Ebizbro</h1>
          <p className="text-sm text-gray-600">
            The Business Services Platform
          </p>
        </div>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-2 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="text-right mb-4">
          <button
            onClick={handleForgotPassword}
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800 transition"
        >
          Sign In
        </button>

        <div className="flex items-center my-5">
          <div className="flex-1 border-t"></div>
          <span className="px-3 text-sm text-gray-500">Or Sign in With</span>
          <div className="flex-1 border-t"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 border py-2 rounded-md hover:bg-gray-100"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="h-5"
          />
          Continue with Google
        </button>

        <p className="text-center mt-6 text-sm text-gray-600">
          New to Ebizbro?{" "}
          <Link href="/signup" className="text-blue-600 font-medium">
            Create a New Account
          </Link>
        </p>
      </div>
    </div>
  );
}