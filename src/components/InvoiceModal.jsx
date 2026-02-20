import React from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Printer, CheckCircle2, ShoppingBag, Calendar, User } from 'lucide-react';

export default function InvoiceModal({ isOpen, onClose, sale }) {
  if (!sale) return null;
  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="အရောင်းဘောင်ချာ အကျဉ်းချုပ်">
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center text-center space-y-2 py-2">
          <div className="bg-green-100 p-3 rounded-full ring-4 ring-green-50 mb-2">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">ငွေရှင်းခြင်း အောင်မြင်ပါသည်</h3>
          <p className="text-sm text-gray-500 font-medium">ဘောင်ချာနံပါတ်: #{sale?.id}</p>
        </div>

        {/* Invoice Body */}
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-4" id="printable-invoice">
          <div className="text-center mb-6 hidden print:block">
            <h2 className="text-2xl font-black text-primary">သူရစားသောက်ဆိုင်</h2>
            <p className="text-sm font-medium text-gray-600">ရန်ကုန်မြို့</p>
            <div className="mt-4 border-t border-b border-dashed py-2 flex justify-between text-xs">
              <span className="flex items-center gap-1">
                <Calendar size={12} /> {new Date().toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <User size={12} /> 
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <ShoppingBag size={14} /> ပစ္စည်းစာရင်း
            </h4>
            <div className="space-y-2.5">
              {sale.items?.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800">{item.name}</span>
                    <span className="text-[10px] text-gray-500">
                      {item.price.toLocaleString()} x {item.quantity}
                    </span>
                  </div>
                  <span className="font-bold text-gray-900">{(item.price * item.quantity).toLocaleString()} ကျပ်</span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="border-t border-dashed border-gray-300 pt-4 mt-4 space-y-2">
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>စုစုပေါင်း</span>
              <span>{(sale.total_amount / 1.05).toLocaleString()} ကျပ်</span>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>အခွန် (၅%)</span>
              <span>{(sale.total_amount - sale.total_amount / 1.05).toLocaleString()} ကျပ်</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <span className="text-sm font-bold text-gray-700">စုစုပေါင်း ကျသင့်ငွေ</span>
              <div className="text-right">
                <span className="text-lg font-bold text-primary">{sale.total_amount.toLocaleString()} ကျပ်</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1 h-12 rounded-xl font-bold" onClick={onClose}>
            ပိတ်မည်
          </Button>
          <Button className="flex-1 gap-2 h-12 rounded-xl font-bold shadow-lg shadow-primary/20" onClick={handlePrint}>
            <Printer size={18} />
            ဘောင်ချာထုတ်မည်
          </Button>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-invoice, #printable-invoice * {
            visibility: visible;
          }
          #printable-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white;
            padding: 20px;
            border: none;
          }
        }
      `,
        }}
      />
    </Modal>
  );
}
