"use client";

import ServiceCard from "../components/ServiceCard";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { useUserData } from "@/app/context/UserDataContext";

// ✅ ADDED
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function Dashboard() {
  const { userData, loading } = useUserData();

  // ✅ ADDED: AUTH PROTECTION
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      }
    });

    return () => unsub();
  }, []);

  // ✅ IMPROVED LOADING
  if (loading || !userData) {
    return <div className="p-6">Loading...</div>;
  }

  const services = [
    {
      title: "Startup Services",
      key: "startup",
      active: userData?.services?.startup || false,
    },
    {
      title: "Taxation Services",
      key: "taxation",
      active: userData?.services?.taxation || false,
    },
    {
      title: "Virtual CFO",
      key: "cfo",
      active: userData?.services?.cfo || false,
    },
    {
      title: "Consultancy Services",
      key: "consultancy",
      active: userData?.services?.consultancy || false,
    },
    {
      title: "Financial Services",
      key: "financial",
      active: userData?.services?.financial || false,
    },
    {
      title: "Legal Services",
      key: "legal",
      active: userData?.services?.legal || false,
    },
  ];

  return (
    <div className="flex">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="flex-1 min-h-screen ml-64 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">

        {/* HEADER */}
        <Header />

        {/* PAGE CONTENT */}
        <div className="p-10 pr-24">

          {/* GRID */}
          <div className="grid grid-cols-3 gap-6">

            {/* LEFT */}
            <div className="col-span-2 grid grid-cols-2 gap-6">
              {services.map((service, index) => (
                <ServiceCard key={index} {...service} />
              ))}
            </div>

            {/* RIGHT PANEL */}
            <div className="flex flex-col gap-6">

              {/* INSIGHTS */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-sm opacity-80">Welcome back</h3>
                <h2 className="text-lg font-semibold mt-1">
                  Get your business insights
                </h2>

                <div className="flex justify-between mt-6 text-sm">
                  <div>
                    <p className="text-xl font-bold">
                      {
                        Object.values(userData?.services || {}).filter(Boolean)
                          .length
                      }
                    </p>
                    <p className="opacity-80">Services</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold">
                      {userData?.alerts || 0}
                    </p>
                    <p className="opacity-80">Alerts</p>
                  </div>
                </div>
              </div>

              {/* STATS */}
              <div className="bg-white rounded-2xl p-6 shadow-lg text-sm">
                <div className="flex justify-between mb-2">
                  <span>Services Purchased</span>
                  <span className="font-semibold">
                    {
                      Object.values(userData?.services || {}).filter(Boolean)
                        .length
                    }
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Pending Tasks</span>
                  <span className="text-yellow-500 font-semibold">
                    {userData?.pendingTasks || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Alerts</span>
                  <span className="text-red-500 font-semibold">
                    {userData?.alerts || 0}
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 flex justify-center">
            <div className="w-full max-w-5xl">
              <div className="flex items-center justify-between bg-white/90 backdrop-blur-md rounded-full px-8 py-4 shadow-xl border border-gray-100">

                <p className="text-sm font-medium text-gray-700">
                  Want to know more about any of the above services?
                </p>

                <a
                  href="https://wa.me/919875426592?text=I want to know more about your services"
                  target="_blank"
                  className="bg-green-500 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-green-600 transition shadow"
                >
                  Chat on WhatsApp
                </a>

              </div>
            </div>
          </div>

        </div>
      </div>

      {/* SOCIAL PANEL */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50">
        <div className="bg-white rounded-2xl shadow-xl p-2 flex flex-col gap-3">

          <a href="https://facebook.com/YOURPAGE" target="_blank">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-blue-100">
              <FaFacebookF className="text-blue-600 text-sm" />
            </div>
          </a>

          <a href="https://instagram.com/YOURPAGE" target="_blank">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-pink-100">
              <FaInstagram className="text-pink-500 text-sm" />
            </div>
          </a>

          <a href="https://linkedin.com/YOURPAGE" target="_blank">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-blue-200">
              <FaLinkedinIn className="text-blue-700 text-sm" />
            </div>
          </a>

        </div>
      </div>

    </div>
  );
}