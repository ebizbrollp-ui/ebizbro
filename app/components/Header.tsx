"use client";

import { usePathname } from "next/navigation";
import { FaInstagram, FaFacebookF, FaLinkedinIn } from "react-icons/fa";

export default function Header({ title }: { title: string }) {
  const pathname = usePathname();

  const isDashboard = pathname === "/dashboard";

  return (
    <div className="bg-[#f4f6fb] px-6 py-4 border-b flex justify-between items-center">
      <h1 className="text-xl font-semibold text-gray-800">{title}</h1>

      {/* ❌ No icons on Dashboard */}
      {!isDashboard && (
        <div className="flex items-center gap-2">

          <a
            href="https://www.instagram.com/ebizbro?igsh=MTF1eXQxemg1Z3Y1Nw%3D%3D&utm_source=qr"
            target="_blank"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow hover:bg-pink-100 transition"
          >
            <FaInstagram className="text-pink-500 text-sm" />
          </a>

          <a
            href="https://www.facebook.com/share/1C6xgmnJZm/?mibextid=wwXIfr"
            target="_blank"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow hover:bg-blue-100 transition"
          >
            <FaFacebookF className="text-blue-600 text-sm" />
          </a>

          <a
            href="https://linkedin.com/YOURPAGE"
            target="_blank"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow hover:bg-blue-200 transition"
          >
            <FaLinkedinIn className="text-blue-700 text-sm" />
          </a>

        </div>
      )}
    </div>
  );
}