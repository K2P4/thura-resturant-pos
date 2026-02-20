import { memo } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, Loader2, Save, CreditCard } from 'lucide-react';
import { Button } from './ui/Button';

function CartItem({ item, onUpdateQuantity, onRemove }) {
  return (
    <div className="flex flex-col gap-2 p-3 bg-gray-50/50 rounded-xl border border-gray-100 hover:border-primary/30 transition-all group">
      <div className="flex justify-between items-start">
        <h4 className="font-semibold text-sm text-gray-900 line-clamp-2">{item.name}</h4>
        <span className="text-sm font-bold text-primary">{(item.price * item.quantity).toLocaleString()} ကျပ်</span>
      </div>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className="py-0.5 rounded-full">{item.price.toLocaleString()} ကျပ်</span>
        <div className="flex items-center gap-1.5">
          <Button variant="icon" size="icon" onClick={() => onUpdateQuantity(item.id, -1)} className="hover:bg-white hover:shadow-sm rounded-lg border bg-white/50 transition-all">
            <Minus className="h-3.5 w-3.5" />
          </Button>
          <span className="w-6 text-center font-bold text-gray-900">{item.quantity}</span>
          <Button variant="icon" size="icon" onClick={() => onUpdateQuantity(item.id, 1)} className="hover:bg-white hover:shadow-sm rounded-lg border bg-white/50 transition-all">
            <Plus className="h-3.5 w-3.5" />
          </Button>
          <Button variant="icon" size="icon" onClick={() => onRemove(item.id)} className="text-red-500 hover:bg-red-50 hover:border-red-100 rounded-lg bg-white/50 ml-1 transition-all">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

const MemoizedCartItem = memo(CartItem);

export default function CartPanel({ cart, pendingSaleId, subtotal, tax, total, isSaving, isCheckingOut, onUpdateQuantity, onRemove, onClear, onSave, onCheckout }) {
  const isEmpty = cart.length === 0;

  return (
    <div className="w-full lg:w-[350px] flex flex-col bg-white border border-gray-200 rounded-xl overflow-auto shadow-lg lg:h-full max-h-[70vh] lg:max-h-none transition-all duration-300">
      {/* Header */}
      <div className="p-4 border-b bg-primary flex items-center justify-between shadow-sm">
        <h2 className="font-bold text-white flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" /> ခြင်း
          <span className="text-xs font-normal opacity-80">({cart.length} မျိုး)</span>
        </h2>
        <div className="flex items-center gap-2">
          {pendingSaleId && <span className="text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full">#အော်ဒါ-{pendingSaleId}</span>}
          <Button variant="ghost" size="sm" onClick={onClear} className="h-8 text-white hover:bg-white/20 px-2" disabled={isEmpty}>
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] custom-scrollbar">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 py-10">
            <ShoppingCart size={64} className="mb-4 opacity-10" />
            <p className="text-sm font-medium">ခြင်းထဲတွင် ဘာမှမရှိသေးပါ</p>
          </div>
        ) : (
          cart.map((item) => <MemoizedCartItem key={item.id} item={item} onUpdateQuantity={onUpdateQuantity} onRemove={onRemove} />)
        )}
      </div>

      {/* Totals + Actions */}
      <div className="p-5 border-t bg-gray-50/50 space-y-4">
        <div className="space-y-1.5 border-b border-dashed pb-3">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>စုစုပေါင်း</span>
            <span>{subtotal.toLocaleString()} ကျပ်</span>
          </div>
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>အခွန် ( ၅% )</span>
            <span>{tax.toLocaleString()} ကျပ်</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">ကျသင့်ငွေ</span>
          <span className="text-xl font-bold text-primary">{total.toLocaleString()} ကျပ်</span>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="md" className="flex-1 text-sm font-bold h-12 transition-all active:scale-[0.98]" disabled={isEmpty || isSaving} onClick={onSave}>
            {isSaving ? (
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
              အော်ဒါတင်မည်
              </>
            )}
          </Button>
          <Button size="md" className="flex-1 text-sm font-bold h-12 shadow-md hover:shadow-lg transition-all active:scale-[0.98]" disabled={isEmpty || isCheckingOut} onClick={onCheckout}>
            {isCheckingOut ? (
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                ငွေရှင်းမည်
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
