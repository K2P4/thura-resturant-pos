import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getTables } from '../services/apiTables';
import { Loader2, UtensilsCrossed, Users, CircleDot } from 'lucide-react';

function TableCard({ table, onSelect }) {
  const occupied = table.is_occupied;

  return (
    <button
      onClick={() => onSelect(table.id)}
      className={`group relative flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer
        ${
          occupied
            ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-300 hover:border-red-400 hover:shadow-lg hover:shadow-red-100'
            : 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-300 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-100'
        }
        hover:scale-[1.03] active:scale-[0.98]
      `}
    >
      <div className={`absolute top-3 right-3 h-3 w-3 rounded-full ring-2 ring-white ${occupied ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />

      <div
        className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-black transition-all
          ${occupied ? 'bg-red-200/80 text-red-700' : 'bg-emerald-200/80 text-emerald-700'}
        `}
      >
        {table.id}
      </div>

      <div className="text-center">
        <p className={`text-sm font-bold ${occupied ? 'text-red-800' : 'text-emerald-800'}`}>စားပွဲဝိုင်း - {table.id}</p>
        <p className={`text-xs mt-0.5 font-medium ${occupied ? 'text-red-500' : 'text-emerald-500'}`}>{occupied ? 'လူရှိနေသည်' : 'အားလပ်ပါသည်'}</p>
      </div>
    </button>
  );
}

export default function Tables() {
  const navigate = useNavigate();

  const { data: tables = [], isLoading } = useQuery({
    queryKey: ['tables'],
    queryFn: getTables,
    refetchInterval: 5000,
  });

  const { occupiedCount, availableCount } = useMemo(() => {
    let occupied = 0;
    let available = 0;
    for (const t of tables) {
      t.is_occupied ? occupied++ : available++;
    }
    return { occupiedCount: occupied, availableCount: available };
  }, [tables]);

  const handleSelectTable = (tableId) => navigate(`/pos/${tableId}`);

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <UtensilsCrossed className="h-6 w-6 text-primary" />
            စားပွဲဝိုင်းများ
          </h1>
          <p className="text-sm text-gray-500 mt-1">စားပွဲဝိုင်းတစ်ခုကို နှိပ်၍ အော်ဒါမှာယူပါ</p>
        </div>

        <div className="flex gap-3">
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl border border-emerald-200">
            <CircleDot className="h-4 w-4" />
            <span className="text-sm font-semibold">အားလပ် {availableCount}</span>
          </div>
          <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-xl border border-red-200">
            <Users className="h-4 w-4" />
            <span className="text-sm font-semibold">လူရှိ {occupiedCount}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {tables.map((table) => (
          <TableCard key={table.id} table={table} onSelect={handleSelectTable} />
        ))}
      </div>

      {tables.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <UtensilsCrossed size={48} className="mb-2 opacity-20" />
          <p className="text-sm font-medium">စားပွဲဝိုင်း မရှိသေးပါ</p>
        </div>
      )}
    </div>
  );
}
