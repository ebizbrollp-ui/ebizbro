"use client";

import ServiceCard from "../components/ServiceCard";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { useUserData } from "@/app/context/UserDataContext";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function Dashboard() {
  const { userData, loading } = useUserData();
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      }
    });
    return () => unsub();
  }, []);

  if (loading || !userData) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Loading dashboard...
      </div>
    );
  }

  const servicesData = userData?.services || {};

  // ✅ FIX: VCFO global override
  const isVCFOActive =
    servicesData.cfo === true ||
    servicesData.vcfo === true ||
    servicesData.VCFO === true;

  const services = [
    {
      title: "Startup Services",
      key: "startup",
      active: isVCFOActive || servicesData.startup === true,
    },
    {
      title: "Taxation Services",
      key: "taxation",
      active: isVCFOActive || servicesData.taxation === true,
    },
    {
      title: "Virtual CFO",
      key: "cfo",
      active: isVCFOActive,
    },
    {
      title: "Consultancy Services",
      key: "consultancy",
      active: isVCFOActive || servicesData.consultancy === true,
    },
    {
      title: "Financial Services",
      key: "financial",
      active: isVCFOActive || servicesData.financial === true,
    },
    {
      title: "Legal Services",
      key: "legal",
      active: isVCFOActive || servicesData.legal === true,
    },
  ];

  return (
    <div className="flex bg-[#f6f8fc]">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="flex-1 min-h-screen ml-64">

        {/* HEADER */}
        <Header title="Dashboard" />

        {/* CONTENT */}
        <div className="p-10 pr-20">

          {/* GRID */}
          <div className="grid grid-cols-3 gap-8">

            {/* LEFT SERVICES */}
            <div className="col-span-2 grid grid-cols-2 gap-8">

              {services.map((service) => (
                <ServiceCard
                  key={service.key}
                  title={service.title}
                  active={service.active}
                />
              ))}

            </div>

            {/* RIGHT PANEL */}
            <div className="flex flex-col gap-8">

              {/* INSIGHT CARD */}
              <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">

                <div className="absolute inset-0 opacity-10 bg-[url('/grid.svg')]"></div>

                <h3 className="text-sm opacity-80">Welcome back 👋</h3>
                <h2 className="text-lg font-semibold mt-1">
                  Your business insights
                </h2>

                <div className="flex justify-between mt-6 text-sm">
                  <div>
                    <p className="text-2xl font-bold">
                      {Object.values(servicesData).filter(Boolean).length}
                    </p>
                    <p className="opacity-80">Services</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {userData?.alerts || 0}
                    </p>
                    <p className="opacity-80">Alerts</p>
                  </div>
                </div>
              </div>

              {/* STATS CARD */}
              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 text-sm">

                <div className="flex justify-between mb-3">
                  <span className="text-gray-600">Services Purchased</span>
                  <span className="font-semibold text-blue-600">
                    {Object.values(servicesData).filter(Boolean).length}
                  </span>
                </div>

                <div className="flex justify-between mb-3">
                  <span className="text-gray-600">Pending Tasks</span>
                  <span className="text-yellow-500 font-semibold">
                    {userData?.pendingTasks || 0}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Alerts</span>
                  <span className="text-red-500 font-semibold">
                    {userData?.alerts || 0}
                  </span>
                </div>

              </div>

            </div>
          </div>

          {/* CTA */}
          <div className="mt-14 flex justify-center">
            <div className="w-full max-w-5xl">

              <div className="flex items-center justify-between bg-white rounded-full px-8 py-4 shadow-lg border border-gray-100 hover:shadow-xl transition">

                <p className="text-sm font-medium text-gray-700">
                  Want to know more about our services?
                </p>

                <a
                  href="https://wa.me/919875426592?text=I want to know more about your services"
                  target="_blank"
                  className="bg-green-500 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-green-600 transition"
                >
                  Chat on WhatsApp
                </a>

              </div>
            </div>
          </div>

        </div>
      </div>

      {/* SOCIAL FLOAT */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50">
        <div className="bg-white rounded-2xl shadow-xl p-2 flex flex-col gap-3 border border-gray-100">

          <a href="https://www.facebook.com/share/1C6xgmnJZm/?mibextid=wwXIfr" target="_blank">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-blue-100 transition">
              <FaFacebookF className="text-blue-600 text-sm" />
            </div>
          </a>

          <a href="https://www.instagram.com/ebizbro?igsh=MTF1eXQxemg1Z3Y1Nw%3D%3D&utm_source=qr" target="_blank">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-pink-100 transition">
              <FaInstagram className="text-pink-500 text-sm" />
            </div>
          </a>

          <a href="https://linkedin.com/YOURPAGE" target="_blank">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-blue-200 transition">
              <FaLinkedinIn className="text-blue-700 text-sm" />
            </div>
          </a>

        </div>
      </div>

    </div>
  );
}