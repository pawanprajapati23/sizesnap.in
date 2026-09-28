// app/admin/components/StatCard.tsx
export default function StatCard({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="bg-white p-4 rounded shadow-sm text-center">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
