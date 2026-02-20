import { useState, useMemo, useEffect, useCallback, useRef } from 'react';

function getStorageKey(tableId) {
  return `pos_cart_${tableId}`;
}

function loadCartFromStorage(tableId) {
  const raw = localStorage.getItem(getStorageKey(tableId));
  if (raw) return JSON.parse(raw);
  return null;
}

function saveCartToStorage(tableId, cart) {
  if (cart.length > 0) {
    localStorage.setItem(getStorageKey(tableId), JSON.stringify(cart));
  } else {
    localStorage.removeItem(getStorageKey(tableId));
  }
}

export function useCart(pendingSale, tableId) {
  const [cart, setCart] = useState([]);
  const [pendingSaleId, setPendingSaleId] = useState(null);
  const pendingHydration = useRef(true);

  useEffect(() => {
    if (pendingSale) {
      setPendingSaleId(pendingSale.id);
      setCart(
        pendingSale.sale_items.map((si) => ({
          id: si.product_id,
          saleItemId: si.id,
          name: si.products?.name || 'Unknown',
          price: si.products?.price || 0,
          image_url: si.products?.image_url || '',
          quantity: si.quantity,
        })),
      );
    } else {
      setPendingSaleId(null);

      if (tableId) {
        const cached = loadCartFromStorage(tableId);
        setCart(cached && cached.length > 0 ? cached : []);
      } else {
        setCart([]);
      }
    }

    pendingHydration.current = true;
  }, [pendingSale, tableId]);

  useEffect(() => {
    if (pendingHydration.current) {
      pendingHydration.current = false;
      return;
    }
    if (!tableId) return;
    saveCartToStorage(tableId, cart);
  }, [cart, tableId]);

  const addToCart = useCallback((product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, delta) => {
    setCart((prev) => prev.map((item) => (item.id === productId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item)));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setPendingSaleId(null);
    if (tableId) localStorage.removeItem(getStorageKey(tableId));
  }, [tableId]);

  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

  const tax = useMemo(() => subtotal * 0.05, [subtotal]);
  const total = useMemo(() => subtotal + tax, [subtotal, tax]);

  return {
    cart,
    pendingSaleId,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    tax,
    total,
  };
}
