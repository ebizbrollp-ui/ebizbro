"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { createUserIfNotExists } from "@/app/lib/createUserIfNotExists";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async () => {
    if (!fullName) {
      alert("Please enter your full name");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // ✅ Save name
      await updateProfile(userCred.user, {
        displayName: fullName,
      });

      // 🔥 Create Firestore structure
      await createUserIfNotExists({
        ...userCred.user,
        displayName: fullName,
      });

      await sendEmailVerification(userCred.user);

      alert("Verification email sent. Please verify before login.");

      router.push("/login");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // 🔥 Create Firestore structure
      await createUserIfNotExists(result.user);

      router.push("/dashboard");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-gray-100 to-blue-300">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border">

        <div className="flex flex-col items-center mb-6">
          <img src="/logo.png" className="h-10 mb-2" />
          <h1 className="text-2xl font-semibold">Create Your Account</h1>
          <p className="text-sm text-gray-600">Join Ebizbro today</p>
        </div>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full mb-4 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

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
          className="w-full mb-4 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full mb-4 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          onClick={handleSignup}
          className="w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800 transition"
        >
          Sign Up
        </button>

        <div className="flex items-center my-5">
          <div className="flex-1 border-t"></div>
          <span className="px-3 text-sm text-gray-500">Or Sign up With</span>
          <div className="flex-1 border-t"></div>
        </div>

        <button
          onClick={handleGoogleSignup}
          className="w-full flex items-center justify-center gap-3 border py-2 rounded-md hover:bg-gray-100"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="h-5"
          />
          Continue with Google
        </button>

        <p className="text-center mt-6 text-sm text-gray-600">
          Already registered?{" "}
          <Link href="/login" className="text-blue-600 font-medium">
            Login here
          </Link>
        </p>

      </div>
    </div>
  );
}