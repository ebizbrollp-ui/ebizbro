"use client";

import {
  Briefcase,
  Calculator,
  Building2,
  LineChart,
  Scale,
  Users,
} from "lucide-react";

type Props = {
  title: string;
  active: boolean;
};

export default function ServiceCard({ title, active }: Props) {

  const getIcon = () => {
    switch (title) {
      case "Startup Services":
        return <Briefcase size={18} />;
      case "Taxation Services":
        return <Calculator size={18} />;
      case "Virtual CFO":
        return <Building2 size={18} />;
      case "Consultancy Services":
        return <Users size={18} />;
      case "Financial Services":
        return <LineChart size={18} />;
      case "Legal Services":
        return <Scale size={18} />;
      default:
        return <Briefcase size={18} />;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg flex flex-col justify-between">

      {/* TOP: ICON + STATUS */}
      <div className="flex justify-between items-start">

        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
          {getIcon()}
        </div>

        <span
          className={`text-xs font-semibold ${
            active ? "text-green-600" : "text-red-500"
          }`}
        >
          {active ? "Purchased" : "Not Purchased"}
        </span>

      </div>

      {/* TEXT */}
      <div className="mt-4">
        <h3 className="font-semibold text-gray-800 text-sm">
          {title}
        </h3>

        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
          Explore services and manage tasks efficiently
        </p>
      </div>

    </div>
  );
}