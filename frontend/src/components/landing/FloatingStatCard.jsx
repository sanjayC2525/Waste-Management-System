export default function FloatingStatCard({ title, value }) {
  return (
    <div className="bg-white shadow-lg rounded-xl p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
