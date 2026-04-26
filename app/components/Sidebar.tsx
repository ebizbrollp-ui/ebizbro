"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  FileText,
  Receipt,
  ClipboardList,
  Briefcase,
  Settings,
  LogOut
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menu = [
    { name: "Home", path: "/dashboard", icon: Home },
    { name: "My Documents & Details", path: "/documents", icon: FileText },
    { name: "My Income Tax Return", path: "/itr", icon: Receipt },
    { name: "My GST", path: "/gst", icon: ClipboardList },
    { name: "My Notices & Replies", path: "/notices", icon: FileText },
    { name: "My Virtual CFO", path: "/cfo", icon: Briefcase },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <div className="w-64 h-screen fixed top-0 left-0 bg-[#f4f6fb] border-r flex flex-col px-4 pt-2 pb-4">

      {/* 🔷 Logo */}
      <div className="flex justify-left pt-2 pb-4">
        <Image
          src="/logo.png"
          alt="logo"
          width={180}
          height={40}
          className="h-10 w-auto object-contain"
        />
      </div>

      {/* 📌 Menu */}
      <div className="flex flex-col gap-2">

        {menu.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.path;

          return (
            <Link key={item.name} href={item.path}>
              <div
                className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
                ${
                  active
                    ? "bg-blue-100 text-blue-600 shadow-sm"
                    : "text-gray-600 hover:bg-white hover:shadow-sm"
                }`}
              >
                {/* 🔵 Active Indicator */}
                {active && (
                  <div className="absolute left-0 top-2 bottom-2 w-1 bg-blue-600 rounded-r"></div>
                )}

                <Icon
                  size={20}
                  className={`transition ${
                    active
                      ? "text-blue-600"
                      : "text-gray-500 group-hover:text-blue-500"
                  }`}
                />

                <span className="text-sm font-medium">
                  {item.name}
                </span>
              </div>
            </Link>
          );
        })}

      </div>

      {/* 🔻 Logout */}
      <div className="mt-auto pt-6 border-t">

        <div className="flex items-center gap-3 px-4 py-3 text-gray-500 cursor-pointer transition hover:text-red-500 hover:translate-x-1">
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </div>

      </div>

    </div>
  );
}