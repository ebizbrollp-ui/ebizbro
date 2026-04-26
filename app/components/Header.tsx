export default function Header({ title }: { title: string }) {
  return (
    <div className="bg-white px-6 py-4 border-b flex justify-between items-center">
      <h1 className="text-xl font-semibold">{title}</h1>

      <button className="bg-gray-100 px-4 py-2 rounded-md">
        Profile ▼
      </button>
    </div>
  );
}