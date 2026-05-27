import React, { useState, useEffect } from 'react';
import { useAppState } from '../context/AppContext';
import { Truck, CheckCircle2, ShieldCheck, ShoppingBag } from 'lucide-react';

export const CheckoutScreen: React.FC = () => {
  const { cart, placeOrder, navigateTo, currentUser, appliedCoupon, applyCoupon, removeCoupon } = useAppState();

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Voucher inputs state
  const [couponInput, setCouponInput] = useState('');

  // Address fields state
  const [formData, setFormData] = useState({
    name: currentUser.name || '',
    phone: currentUser.phone || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [errorMsg, setErrorMsg] = useState('');

  const discountRate = appliedCoupon ? appliedCoupon.discount : 0;
  const discountAmount = Math.round(subtotal * (discountRate / 100));
  const finalTotalAmount = Math.max(0, subtotal - discountAmount);

  // Fallback to home if cart is empty (e.g. page refreshed)
  useEffect(() => {
    if (cart.length === 0) {
      navigateTo('home');
    }
  }, [cart, navigateTo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg('');
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    // Verification
    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.state.trim() ||
      !formData.pincode.trim()
    ) {
      setErrorMsg('Please populate all shipping form fields correctly.');
      return;
    }

    if (formData.phone.length < 8) {
      setErrorMsg('Please enter a valid telephone contact number.');
      return;
    }

    // Submit Cash on Delivery order
    const orderDetails = placeOrder(formData);
    
    // Jump straight to success screen with param
    navigateTo('success', { order: orderDetails });
  };

  return (
    <div id="checkout-screen-container" className="pb-24 pt-2">
      <div className="px-4 mt-2">
        <h2 className="text-xl font-extrabold tracking-tight">Express Checkout</h2>
        <p className="text-xs text-slate-400 font-medium">Paying with Cash on Delivery (COD). Zero card or deposit needed.</p>
      </div>

      <form onSubmit={handlePlaceOrder} className="mt-5 px-4 space-y-4">
        {/* Core items summary scrollable */}
        <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-xs space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Order Summary</h3>
          <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
            {cart.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-xs font-medium text-slate-800">
                <span className="truncate max-w-[200px]">
                  {item.product.name} <span className="text-slate-400 text-[10px]">x{item.quantity}</span>
                </span>
                <span className="font-mono font-bold">${item.product.price * item.quantity}</span>
              </div>
            ))}
          </div>

          {/* Coupon Code Entry & Apply section */}
          <div className="border-t border-slate-50 pt-2.5 space-y-2">
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">Apply Discount Voucher</span>
            {appliedCoupon ? (
              <div className="flex items-center justify-between rounded-xl bg-indigo-50 border border-indigo-100 px-3 py-2 text-xs">
                <div className="flex items-center gap-1.5 font-sans">
                  <span className="font-mono font-black text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md text-[10.5px]">{appliedCoupon.code}</span>
                  <span className="text-indigo-800 font-bold">-{appliedCoupon.discount}% Off</span>
                </div>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-indigo-500 hover:text-indigo-700 text-[11px] font-black uppercase"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Enter code e.g. VEL50"
                  id="checkout-coupon-input-field"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 uppercase placeholder-slate-400 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!couponInput.trim()) return;
                    applyCoupon(couponInput);
                    setCouponInput('');
                  }}
                  className="rounded-xl bg-slate-950 hover:bg-slate-900 px-4 py-2 text-xs font-black text-white active:scale-95 transition"
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 pt-2.5 text-xs font-semibold text-slate-500 space-y-1">
            <div className="flex justify-between">
              <span>Cart Subtotal:</span>
              <span className="font-mono font-bold text-slate-800">${subtotal}</span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-emerald-600">
                <span>Voucher Discount ({appliedCoupon.discount}%):</span>
                <span className="font-mono">-${discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-slate-950 font-black text-sm pt-2 border-t border-slate-100">
              <span>Total payable amount:</span>
              <span className="font-mono text-base text-slate-950 font-black">${finalTotalAmount}</span>
            </div>
          </div>
        </div>

        {/* COD banner info check */}
        <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-100 p-3 text-xs text-emerald-800">
          <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
          <span className="font-semibold leading-relaxed">
            COD Payment Approved: Complete shipping address details below to initiate dropship dispatch.
          </span>
        </div>

        {/* Inputs */}
        <div className="space-y-3.5">
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Customer Full Name</label>
            <input
              id="checkout-name-input"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Sophia Vance"
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-xs font-bold text-slate-800 focus:border-slate-800 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Mobile Telephone Contact</label>
            <input
              id="checkout-phone-input"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +1 (415) 555-2633"
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-xs font-bold text-slate-800 focus:border-slate-800 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Complete Street Residence Address</label>
            <input
              id="checkout-address-input"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Building, Street, Suite number"
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-xs font-bold text-slate-800 focus:border-slate-800 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">City / Region</label>
              <input
                id="checkout-city-input"
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. San Francisco"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-xs font-bold text-slate-800 focus:border-slate-800 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">State / Zip State</label>
              <input
                id="checkout-state-input"
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="e.g. CA"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-xs font-bold text-slate-800 focus:border-slate-800 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Postal Code (Pincode)</label>
            <input
              id="checkout-pincode-input"
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="e.g. 94105"
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-xs font-bold text-slate-800 focus:border-slate-800 focus:outline-hidden"
            />
          </div>
        </div>

        {errorMsg && (
          <p className="text-xs font-bold text-rose-500 bg-rose-50 border border-rose-100 p-2.5 rounded-xl">
            ⚠️ {errorMsg}
          </p>
        )}

        {/* Security Seals */}
        <div className="pt-2 flex items-center gap-2 text-[10px] font-bold text-slate-500">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>VELRIVA Buyer Protection policy enforced</span>
        </div>

        {/* Checkout Place Order action Button */}
        <button
          id="checkout-submit-order-button"
          type="submit"
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-slate-950 py-4 text-xs font-black text-white hover:bg-slate-900 transition active:scale-95 shadow-md mt-4"
        >
          <Truck className="h-4 w-4" />
          <span>Place Cash On Delivery Order (${finalTotalAmount})</span>
        </button>
      </form>
    </div>
  );
};
