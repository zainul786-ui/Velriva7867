import React from 'react';
import { useAppState } from '../context/AppContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart, HelpCircle, PackageCheck, ChevronRight } from 'lucide-react';

export const CartScreen: React.FC = () => {
  const { cart, updateCartQuantity, removeFromCart, navigateTo, orders } = useAppState();

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  
  // Reseller calculations
  const codFee = 0; // standard nationwide free COD shipping
  const shippingFee = 0; 
  const grandTotal = subtotal + codFee + shippingFee;

  const handleCheckoutRedirect = () => {
    navigateTo('checkout');
  };

  return (
    <div id="cart-screen-container" className="pb-36 pt-2">
      <div className="px-4 mt-2 text-slate-900">
        <h2 className="text-xl font-extrabold tracking-tight">Shopping Bag</h2>
        <p className="text-xs text-slate-400 font-medium">Verify your sizes and attributes before checkout.</p>
      </div>

      {cart.length === 0 ? (
        <div className="flex h-96 flex-col items-center justify-center text-center gap-4 px-4 mt-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <ShoppingCart className="h-7 w-7 text-slate-400" />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-slate-900 text-sm">Your Bag is empty</h3>
            <p className="text-xs text-slate-400 max-w-[210px] mx-auto leading-relaxed">
              Looks like you haven&apos;t added any items to your shopping cart yet.
            </p>
          </div>
          
          <button
            id="cart-browse-cta"
            onClick={() => navigateTo('home')}
            className="mt-2 rounded-2xl bg-slate-950 px-6 py-3 text-xs font-black text-white hover:bg-slate-900 active:scale-95 shadow-md"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        /* Cart List */
        <div className="mt-5 px-3 space-y-3">
          {cart.map((item, index) => (
            <div
              key={`${item.product.id}-${item.selectedSize || ''}-${item.selectedColor || ''}-${index}`}
              className="flex gap-3.5 rounded-2xl border border-slate-100/80 bg-white p-3 shadow-xs"
            >
              {/* Product thumb representation */}
              <div
                onClick={() => navigateTo('productDetails', { productId: item.product.id })}
                className="h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-50 cursor-pointer"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Title & modifications */}
              <div className="flex-1 flex flex-col justify-between overflow-hidden">
                <div>
                  <h4
                    onClick={() => navigateTo('productDetails', { productId: item.product.id })}
                    className="truncate text-xs font-bold text-slate-800 hover:text-slate-950 cursor-pointer"
                  >
                    {item.product.name}
                  </h4>
                  
                  {/* Selected configuration parameters */}
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    {item.selectedSize && (
                      <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-mono font-bold text-slate-500 uppercase">
                        Size: {item.selectedSize}
                      </span>
                    )}
                    {item.selectedColor && (
                      <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-500 uppercase">
                        Col: {item.selectedColor}
                      </span>
                    )}
                  </div>
                </div>

                {/* Pricing & Control row */}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-extrabold text-slate-900">
                    ₹{item.product.price}
                  </span>

                  <div className="flex items-center gap-3">
                    {/* Quantity controls */}
                    <div className="flex items-center gap-1.5 border border-slate-200 rounded-lg p-0.5.5 bg-white shadow-xs">
                      <button
                        id={`qty-minus-${item.product.id}`}
                        onClick={() =>
                          updateCartQuantity(
                            item.product.id,
                            item.quantity - 1,
                            item.selectedSize,
                            item.selectedColor
                          )
                        }
                        className="flex h-6 w-6 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 active:scale-75"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      
                      <span className="w-5 text-center font-mono text-xs font-bold text-slate-800">
                        {item.quantity}
                      </span>

                      <button
                        id={`qty-plus-${item.product.id}`}
                        onClick={() =>
                          updateCartQuantity(
                            item.product.id,
                            item.quantity + 1,
                            item.selectedSize,
                            item.selectedColor
                          )
                        }
                        className="flex h-6 w-6 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 active:scale-75"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Trash remove icon */}
                    <button
                      id={`cart-remove-${item.product.id}`}
                      onClick={() =>
                        removeFromCart(
                          item.product.id,
                          item.selectedSize,
                          item.selectedColor
                        )
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 transition active:scale-90"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Checkout Total Computations */}
          <div className="mt-5 rounded-3xl bg-slate-50 border border-slate-100 p-4 space-y-2.5 mx-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-500">Order Subtotal</span>
              <span className="font-mono font-bold text-slate-800">₹{subtotal}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-500">Delivery Processing (COD)</span>
              <span className="font-mono font-bold text-emerald-600">FREE</span>
            </div>
            
            <div className="h-[1px] w-full bg-slate-200 mt-2" />
            
            <div className="flex justify-between items-center text-sm pt-1">
              <span className="font-extrabold text-slate-900">Total Amount Payable</span>
              <span className="font-mono font-black text-slate-900 text-base">₹{grandTotal}</span>
            </div>
          </div>

          {/* Sticky checkout banner layout */}
          <div className="fixed bottom-16 left-0 right-0 z-30 mx-auto max-w-sm border-t border-slate-100 bg-white pb-3 pt-2.5 px-4 shadow-[0_-8px_24px_rgba(0,0,0,0.04)]">
            <button
              id="cart-checkout-direct-button"
              onClick={handleCheckoutRedirect}
              className="flex w-full items-center justify-between rounded-2xl bg-slate-950 px-5 py-3.5 text-xs font-extrabold text-white transition hover:bg-slate-900 active:scale-95 shadow-md"
            >
              <div className="text-left font-mono">
                <span className="text-[10px] text-slate-400 block font-sans tracking-wide">Final price with COD</span>
                <span>₹{grandTotal}</span>
              </div>
              
              <div className="flex items-center gap-1 leading-none text-amber-400 font-bold">
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-4.5 w-4.5 text-amber-400" />
              </div>
            </button>
          </div>
        </div>
      )}

      {/* 4. Historic Past Orders Section */}
      {orders && orders.length > 0 && (
        <div className="mt-8 px-4 border-t border-slate-100 pt-6">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">Order History ({orders.length})</h3>
            </div>
            <span className="text-[10px] font-bold text-slate-400 font-sans">Scroll to view all</span>
          </div>

          <div className="space-y-3 pb-8">
            {orders.map(order => {
              const getStatusColor = (status: string) => {
                switch (status) {
                  case 'Delivered': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
                  case 'Shipped': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
                  case 'Out for Delivery': return 'bg-amber-50 text-amber-700 border-amber-100';
                  case 'Cancelled': return 'bg-rose-50 text-rose-700 border-rose-100';
                  default: return 'bg-slate-50 text-slate-600 border-slate-150';
                }
              };

              return (
                <div
                  key={order.id}
                  className="rounded-2xl border border-slate-150 bg-white p-3.5 shadow-xs hover:border-slate-300 transition duration-350"
                >
                  {/* Item top ref row */}
                  <div className="flex items-center justify-between border-b border-slate-50 pb-2 mb-2">
                    <div>
                      <span className="text-[8px] uppercase font-black text-slate-400 tracking-wider">REF ID: {order.id.slice(0, 10).toUpperCase()}</span>
                      <p className="text-[10px] font-bold text-slate-500">{order.date}</p>
                    </div>
                    <span className={`rounded-lg border px-2 py-0.5 text-[8.5px] font-black uppercase tracking-wide bg-white ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>

                  {/* Items listed */}
                  <div className="space-y-2">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <img
                          src={it.product.image}
                          alt={it.product.name}
                          className="h-8 w-7 rounded-sm object-cover bg-slate-50 border border-slate-100"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-[11px] font-bold text-slate-800">{it.product.name}</p>
                          <span className="text-[9px] text-slate-400 font-bold block">
                            Qty: {it.quantity} {it.selectedSize ? `| Size: ${it.selectedSize}` : ''}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action elements */}
                  <div className="flex justify-between items-center border-t border-slate-50 pt-2.5 mt-2.5">
                    <span className="text-xs font-black text-slate-900">Paid Amount: <strong className="font-mono text-slate-950">₹{order.total}</strong></span>
                    
                    <button
                      id={`cart-track-order-history-btn-${order.id}`}
                      onClick={() => navigateTo('trackOrder', { orderId: order.id })}
                      className="flex items-center gap-1 px-3 py-1.5 text-[9.5px] font-black text-slate-800 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition active:scale-95 cursor-pointer"
                    >
                      <PackageCheck className="h-3 w-3 text-slate-500" />
                      <span>Track Shipment</span>
                      <ChevronRight className="h-2.5 w-2.5 text-slate-400" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
