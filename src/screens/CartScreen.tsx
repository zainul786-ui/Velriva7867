import React from 'react';
import { useAppState } from '../context/AppContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart, HelpCircle } from 'lucide-react';

export const CartScreen: React.FC = () => {
  const { cart, updateCartQuantity, removeFromCart, navigateTo } = useAppState();

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
                    ${item.product.price}
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
              <span className="font-mono font-bold text-slate-800">${subtotal}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-500">Delivery Processing (COD)</span>
              <span className="font-mono font-bold text-emerald-600">FREE</span>
            </div>
            
            <div className="h-[1px] w-full bg-slate-200 mt-2" />
            
            <div className="flex justify-between items-center text-sm pt-1">
              <span className="font-extrabold text-slate-900">Total Amount Payable</span>
              <span className="font-mono font-black text-slate-900 text-base">${grandTotal}</span>
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
                <span>${grandTotal}</span>
              </div>
              
              <div className="flex items-center gap-1 leading-none text-amber-400 font-bold">
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-4.5 w-4.5 text-amber-400" />
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
