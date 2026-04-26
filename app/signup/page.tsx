"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(res.user, {
        displayName: name,
      });

      // ✅ FINAL STRUCTURE
      await setDoc(doc(db, "users", res.user.uid), {
        name,
        email,
        pan: "",

        services: {
          itr: false,
          gst: false,
          vcfo: false,
          legal: false,
        },

        documents: {
          panCard: [],
          form16: [],
          bankStatement: [],
          investmentProof: [],
          others: [],

          gstCert: [],
          invoices: [],

          ais: [],
          tis: [],
          form26as: [],
        },

        itr: {},
        gst: {},
        notices: [],
        vcfo: {},
      });

      router.push("/dashboard");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white/70 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md">

          <h2 className="text-2xl font-semibold mb-6 text-center">
            Create Account
          </h2>

          <input
            placeholder="Full Name"
            className="w-full p-3 border rounded-lg mb-4"
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Email"
            className="w-full p-3 border rounded-lg mb-4"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            placeholder="Password"
            type="password"
            className="w-full p-3 border rounded-lg mb-6"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleSignup}
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}