"use client";

type Props = {
  title: string;
  active: boolean;
};

export default function ServiceCard({ title, active }: Props) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg flex flex-col justify-between">

      {/* TOP: ICON + STATUS */}
      <div className="flex justify-between items-start">

        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
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