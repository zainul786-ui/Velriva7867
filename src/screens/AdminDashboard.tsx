import React, { useState } from 'react';
import { useAppState } from '../context/AppContext';
import { Product, Order, PromoBanner, Coupon } from '../types';
import { CATEGORIES } from '../data/mockData';
import { BarChart3, Package, Truck, LayoutGrid, Plus, Edit3, Trash2, X, Search, Check, Save, Smartphone, Laptop, Tablet, TrendingUp, Sparkles, UserCheck, Megaphone, Percent, Tag, FileImage, Upload } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    products, 
    orders, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    updateOrderStatus, 
    logoutAdmin,
    promoBanners,
    updatePromoBanners,
    coupons,
    addCoupon,
    deleteCoupon,
    accounts,
    navigateTo,
    logo,
    updateLogo,
    showToast
  } = useAppState();

  // Internal tab choice
  const [activeTab, setActiveTab ] = useState<'analytics' | 'products' | 'orders' | 'marketing' | 'users'>('analytics');
  
  // Use live accounts list or fallback
  const registeredAccounts = accounts && accounts.length > 0 ? accounts : [];

  // Selected user account detail drawer/modal state
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  
  // Search parameters inside dashboard
  const [dbSearch, setDbSearch ] = useState('');

  // Marketing states
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('20');

  // Editing/Adding fields state
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Product | null>(null);
  
  // Form fields
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formOldPrice, setFormOldPrice] = useState('');
  const [formCategory, setFormCategory] = useState('headphones');
  const [formImage, setFormImage] = useState('');
  const [formImages, setFormImages] = useState<string[]>([]);
  const [formStock, setFormStock] = useState('10');
  const [formDesc, setFormDesc] = useState('');
  const [formSizes, setFormSizes] = useState<string[]>(['S', 'M', 'L']);

  // Analytics helper datasets
  const mockTotalUsersCount = 1420;
  const mockDAUCount = 389;

  // Handle opening modal for Adding
  const openAddFlow = () => {
    setEditingItem(null);
    setFormName('');
    setFormPrice('50');
    setFormOldPrice('100');
    setFormCategory('headphones');
    setFormImage('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop');
    setFormImages([]);
    setFormStock('20');
    setFormDesc('Velriva dropship collection spec file.');
    setFormSizes(['S', 'M', 'L']);
    setShowItemModal(true);
  };

  // Handle opening modal for Editing
  const openEditFlow = (prod: Product) => {
    setEditingItem(prod);
    setFormName(prod.name);
    setFormPrice(String(prod.price));
    setFormOldPrice(String(prod.oldPrice));
    setFormCategory(prod.category);
    setFormImage(prod.image);
    setFormImages(Array.isArray(prod.images) ? prod.images.filter(x => x !== prod.image) : []);
    setFormStock(String(prod.stock));
    setFormDesc(prod.description);
    setFormSizes(prod.sizes || []);
    setShowItemModal(true);
  };

  // Handle Form Submission CRUD (Add/Edit)
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim() || !formImage.trim()) {
      alert('Required parameters missing. Fill item details.');
      return;
    }

    const payload: Product = {
      id: editingItem ? editingItem.id : `prod_${Date.now()}`,
      name: formName,
      price: Number(formPrice) || 0,
      oldPrice: Number(formOldPrice) || 0,
      discount: Math.round(((Number(formOldPrice) - Number(formPrice)) / (Number(formOldPrice) || 1)) * 100) || 0,
      rating: editingItem ? editingItem.rating : 5,
      image: formImage,
      images: Array.from(new Set([formImage, ...formImages.filter(img => img.trim() !== '')])),
      category: formCategory,
      description: formDesc,
      stock: Number(formStock) || 0,
      viewsCount: editingItem ? editingItem.viewsCount : 1,
      likesCount: editingItem ? editingItem.likesCount : 0,
      ordersCount: editingItem ? editingItem.ordersCount : 0,
      sizes: formSizes,
      reviews: editingItem ? editingItem.reviews : [],
    };

    if (editingItem) {
      updateProduct(payload);
    } else {
      addProduct(payload);
    }

    setShowItemModal(false);
  };

  const handleSizeToggle = (sz: string) => {
    if (formSizes.includes(sz)) {
      setFormSizes(formSizes.filter(s => s !== sz));
    } else {
      setFormSizes([...formSizes, sz]);
    }
  };

  // Filters catalog matching searching words
  const queriedProducts = products.filter(p =>
    p.name.toLowerCase().includes(dbSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(dbSearch.toLowerCase())
  );

  // Filters orders matching searching id or name
  const queriedOrders = orders.filter(o =>
    o.id.toLowerCase().includes(dbSearch.toLowerCase()) ||
    o.shippingAddress.name.toLowerCase().includes(dbSearch.toLowerCase())
  );

  return (
    <div id="admin-dashboard-layout" className="pb-24 pt-2">
      {/* 1. Header Banner */}
      <div className="px-4 flex items-center justify-between border-b border-slate-50 pb-4">
        <div>
          <span className="text-[9px] bg-slate-950 text-amber-400 px-2 py-0.5 rounded-md font-black tracking-widest uppercase block w-fit mb-1">
            CONTROL TOWER
          </span>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900">Velriva Dashboard</h2>
          <p className="text-xs text-slate-400 font-medium">Control live catalog files & shipping logistics.</p>
        </div>

        <div className="flex gap-2">
          <button
            id="admin-shopview-trigger"
            onClick={() => navigateTo('home')}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[10px] font-black text-slate-700 hover:bg-slate-50 active:scale-95 transition flex items-center gap-1 shrink-0"
          >
            <span>← Go to Shop</span>
          </button>
          
          <button
            id="admin-logout-trigger"
            onClick={logoutAdmin}
            className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[10px] font-black text-rose-500 hover:bg-rose-100 active:scale-95 transition shrink-0"
          >
            Staff Logout
          </button>
        </div>
      </div>

      {/* 2. Horizontal Panel Navigation Tabs */}
      <div className="flex px-4 mt-4 text-xs font-bold font-sans border-b border-slate-100 overflow-x-auto scrollbar-none">
        <button
          id="admin-tab-analytics"
          onClick={() => { setActiveTab('analytics'); setDbSearch(''); }}
          className={`flex items-center gap-1.5 pb-2.5 transition border-b-2 px-3 shrink-0 ${
            activeTab === 'analytics' ? 'border-slate-950 text-slate-900 font-extrabold' : 'border-transparent text-slate-400'
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          <span>Analytics</span>
        </button>

        <button
          id="admin-tab-products"
          onClick={() => { setActiveTab('products'); setDbSearch(''); }}
          className={`flex items-center gap-1.5 pb-2.5 transition border-b-2 px-3 shrink-0 ${
            activeTab === 'products' ? 'border-slate-950 text-slate-900 font-extrabold' : 'border-transparent text-slate-400'
          }`}
        >
          <Package className="h-4 w-4" />
          <span>Products CRUD</span>
        </button>

        <button
          id="admin-tab-marketing"
          onClick={() => { setActiveTab('marketing'); setDbSearch(''); }}
          className={`flex items-center gap-1.5 pb-2.5 transition border-b-2 px-3 shrink-0 ${
            activeTab === 'marketing' ? 'border-slate-950 text-slate-900 font-extrabold' : 'border-transparent text-slate-400'
          }`}
        >
          <Megaphone className="h-4 w-4" />
          <span>Marketing Banners</span>
        </button>

        <button
          id="admin-tab-orders"
          onClick={() => { setActiveTab('orders'); setDbSearch(''); }}
          className={`flex items-center gap-1.5 pb-2.5 transition border-b-2 px-3 shrink-0 ${
            activeTab === 'orders' ? 'border-slate-950 text-slate-900 font-extrabold' : 'border-transparent text-slate-400'
          }`}
        >
          <Truck className="h-4 w-4" />
          <span>COD Orders</span>
          {orders.filter(o => o.status === 'Pending').length > 0 && (
            <span className="h-2 w-2 rounded-full bg-rose-505 bg-rose-500 animate-ping shrink-0" />
          )}
        </button>

        <button
          id="admin-tab-users"
          onClick={() => { setActiveTab('users'); setDbSearch(''); }}
          className={`flex items-center gap-1.5 pb-2.5 transition border-b-2 px-3 shrink-0 ${
            activeTab === 'users' ? 'border-slate-950 text-slate-900/90 font-extrabold' : 'border-transparent text-slate-400'
          }`}
        >
          <UserCheck className="h-4 w-4 text-indigo-505 text-indigo-500" />
          <span>Resellers DB ({registeredAccounts.length})</span>
        </button>
      </div>

      {/* 3. Search Bar for Products/Orders lists */}
      {activeTab !== 'analytics' && activeTab !== 'marketing' && (
        <div className="px-4 mt-4">
          <div className="relative flex items-center rounded-2xl border border-slate-100 bg-white p-1">
            <Search className="absolute left-4 h-4 w-4 text-slate-400" />
            <input
              id="admin-search-field"
              type="text"
              value={dbSearch}
              onChange={(e) => setDbSearch(e.target.value)}
              placeholder={activeTab === 'products' ? "Search products catalog..." : "Search orders ID or contact..."}
              className="h-10 w-full pl-10 pr-4 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden"
            />
          </div>
        </div>
      )}

      {/* 4. TAB CONTENTS DISPLAY */}

      {/* TAB A: ANALYTICS FRAMEWORK */}
      {activeTab === 'analytics' && (
        <div className="px-4 mt-5 space-y-4">
          {/* Bento stats list */}
          <div className="grid grid-cols-2 gap-3">
            {/* Total Sales sum metric computation */}
            <div 
              onClick={() => setActiveTab('orders')}
              className="bg-white border border-slate-100 rounded-[20px] p-4 shadow-xs text-left cursor-pointer hover:bg-slate-50/80 active:scale-95 transition-all group"
            >
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 group-hover:text-slate-600 transition">Dropship Revenue</span>
              <h4 className="font-mono text-xl font-black text-slate-950 mt-1">
                ${orders.reduce((acc, o) => (o.status !== 'Cancelled' ? acc + o.total : acc), 0)}
              </h4>
              <span className="text-[9.5px] font-bold text-indigo-600 block mt-1">View financial ledgers ➜</span>
            </div>

            {/* Total Orders */}
            <div 
              onClick={() => setActiveTab('orders')}
              className="bg-white border border-slate-100 rounded-[20px] p-4 shadow-xs text-left cursor-pointer hover:bg-slate-50/80 active:scale-95 transition-all group"
            >
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 group-hover:text-slate-600 transition">Total COD Orders</span>
              <h4 className="font-mono text-xl font-black text-slate-950 mt-1">
                {orders.length}
              </h4>
              <span className="text-[9.5px] font-bold text-emerald-600 block mt-1">▲ Browse {orders.length} orders today ➜</span>
            </div>

            {/* Total active customers */}
            <div 
              onClick={() => setActiveTab('users')}
              className="bg-white border border-slate-100 rounded-[20px] p-4 shadow-xs text-left cursor-pointer hover:bg-indigo-50/50 hover:border-indigo-100 active:scale-95 transition-all group"
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 group-hover:text-indigo-600 transition">Total Users</span>
                <span className="text-[8px] bg-indigo-100 text-indigo-700 px-1 py-0.2 rounded-sm font-black">ACTIVE</span>
              </div>
              <h4 className="font-mono text-xl font-black text-slate-900 mt-1">{registeredAccounts.length} profiles</h4>
              <div className="flex items-center gap-1 mt-1 text-[9px] font-bold text-indigo-600">
                <UserCheck className="h-3 w-3" />
                <span>Browse & audit records ➜</span>
              </div>
            </div>

            {/* Total Products file count */}
            <div 
              onClick={() => setActiveTab('products')}
              className="bg-white border border-slate-100 rounded-[20px] p-4 shadow-xs text-left cursor-pointer hover:bg-slate-50/80 active:scale-95 transition-all group"
            >
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 group-hover:text-slate-600 transition">Product Items</span>
              <h4 className="font-mono text-xl font-black text-slate-950 mt-1">{products.length} Items</h4>
              <span className="text-[9.5px] font-bold text-slate-500 block mt-1">Across {CATEGORIES.length - 1} sections ➜</span>
            </div>
          </div>

          {/* Sparkline line curves chart visualization */}
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-xs">
            <h4 className="text-xs font-black uppercase tracking-wide text-slate-400">Demo Order Frequencies Grid</h4>
            
            <div className="mt-4 aspect-[21/9] w-full bg-slate-50 rounded-2xl flex items-end p-2 relative">
              {/* SVG vector chart line */}
              <svg className="absolute inset-0 h-full w-full p-2 text-indigo-100 stroke-indigo-500 fill-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M 0,90 Q 20,40 40,80 T 80,20 T 100,60" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              {/* Guide grids */}
              <div className="absolute left-2 top-2 text-[8px] font-mono font-semibold text-slate-400">Peak: 81 orders</div>
              <div className="absolute right-2 bottom-2 text-[8px] font-mono font-semibold text-slate-400">Timeline: 7 days</div>
            </div>
          </div>

          {/* User statistics analytics device split list */}
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Mobile Device Demographics</h4>

            <div className="space-y-2.5 text-xs">
              {/* Mobile PWA */}
              <div className="space-y-1">
                <div className="flex justify-between items-center font-bold text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <Smartphone className="h-3.5 w-3.5 text-indigo-500" />
                    <span>Android / iOS Mobile PWAs</span>
                  </span>
                  <span className="font-mono">85%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>

              {/* Desktop */}
              <div className="space-y-1">
                <div className="flex justify-between items-center font-bold text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <Laptop className="h-3.5 w-3.5 text-slate-500" />
                    <span>Safari / Chrome Desktop</span>
                  </span>
                  <span className="font-mono">10%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-500 rounded-full" style={{ width: '10%' }} />
                </div>
              </div>

              {/* Tablet */}
              <div className="space-y-1">
                <div className="flex justify-between items-center font-bold text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <Tablet className="h-3.5 w-3.5 text-slate-400" />
                    <span>Tablet Viewports</span>
                  </span>
                  <span className="font-mono">5%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-400 rounded-full" style={{ width: '5%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Most viewed / Most Liked listing grids */}
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-xs space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-50">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">TRENDING PRODUCT VIEWS</h4>
              <span className="text-[9.5px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase">Traffic Leaderboard</span>
            </div>
            
            <div className="space-y-4 pt-1">
              {[...products].sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0)).slice(0, 5).map((prod, idx) => {
                const maxViews = Math.max(...products.map(p => p.viewsCount || 1));
                const percentage = Math.round(((prod.viewsCount || 0) / maxViews) * 100) || 12;
                return (
                  <div key={prod.id} className="space-y-1">
                    <div className="flex gap-2.5 items-center justify-between text-xs font-medium">
                      <div className="flex items-center gap-2 overflow-hidden flex-1">
                        <span className={`font-mono text-xs font-black text-center w-5 h-5 flex items-center justify-center rounded-full ${
                          idx === 0 ? 'bg-amber-100 text-amber-700 font-extrabold' :
                          idx === 1 ? 'bg-slate-100 text-slate-700' :
                          idx === 2 ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-400'
                        }`}>
                          {idx + 1}
                        </span>
                        <img src={prod.image} alt={prod.name} className="h-8 w-7 object-cover rounded-lg shrink-0 border border-slate-100" />
                        <span className="truncate text-slate-800 font-extrabold text-left">{prod.name}</span>
                      </div>
                      <div className="text-right font-mono text-[10.5px] font-bold text-slate-700 shrink-0">
                        <span>{prod.viewsCount || 0} clicks</span>
                      </div>
                    </div>
                    {/* Visual Progress percentage bar */}
                    <div className="h-1.5 w-[calc(100%-32px)] ml-7 bg-slate-50 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          idx === 0 ? 'bg-amber-400' :
                          idx === 1 ? 'bg-slate-400' :
                          idx === 2 ? 'bg-indigo-400' : 'bg-slate-300'
                        }`} 
                        style={{ width: `${percentage}%` }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB B: PRODUCTS CRUD LISTINGS */}
      {activeTab === 'products' && (
        <div className="px-4 mt-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Products Catalog ({queriedProducts.length})</h3>
            
            <button
              id="admin-add-product-btn"
              onClick={openAddFlow}
              className="flex items-center gap-1 rounded-xl bg-slate-100 text-slate-900 border border-slate-200 hover:bg-slate-200 px-3 py-2 text-xs font-extrabold active:scale-95 shadow-xs transition"
            >
              <Plus className="h-4 w-4" />
              <span>Add Stock item</span>
            </button>
          </div>

          <div className="space-y-3">
            {queriedProducts.map(prod => (
              <div
                key={prod.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-xs hover:border-slate-300 transition"
              >
                <div className="flex gap-2.5 items-center overflow-hidden">
                  <img src={prod.image} alt={prod.name} className="h-11 w-9 rounded-lg object-cover bg-slate-50" />
                  <div className="overflow-hidden">
                    <h4 className="truncate text-xs font-bold text-slate-800">{prod.name}</h4>
                    <div className="flex gap-3 text-[10px] font-bold text-slate-400 mt-1">
                      <span>Price: <strong className="text-slate-900">${prod.price}</strong></span>
                      <span>Stock: <strong className="text-slate-900">{prod.stock}</strong></span>
                      <span className="uppercase">{prod.category}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-1.5 shrink-0">
                  <button
                    id={`crud-edit-${prod.id}`}
                    onClick={() => openEditFlow(prod)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition active:scale-90"
                    title="Edit Item details"
                  >
                    <Edit3 className="h-4.5 w-4.5" />
                  </button>

                  <button
                    id={`crud-delete-${prod.id}`}
                    onClick={() => {
                      if (confirm(`Verify deleting item: ${prod.name}?`)) {
                        deleteProduct(prod.id);
                      }
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-500 transition active:scale-90"
                    title="Delete item"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB C: MANAGE ORDERS PANEL */}
      {activeTab === 'orders' && (
        <div className="px-4 mt-5 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Manage COD Deliveries ({queriedOrders.length})</h3>

          <div className="space-y-4">
            {queriedOrders.length === 0 ? (
              <p className="py-12 text-center text-xs font-medium text-slate-400">
                No orders discovered matching typed search filters.
              </p>
            ) : (
              queriedOrders.map(order => (
                <div
                  key={order.id}
                  className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm"
                >
                  <div className="flex justify-between items-start border-b border-slate-50 pb-3 mb-3">
                    <div>
                      <span className="text-[9px] uppercase font-black tracking-wider text-slate-400">COD Code ID</span>
                      <p className="font-mono text-sm font-black text-slate-950 mt-0.5">{order.id}</p>
                    </div>

                    {/* Quick status dropdown selector */}
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] uppercase font-black tracking-wider text-slate-400">Modify Status</span>
                      <select
                        id={`order-status-select-${order.id}`}
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                        className="mt-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-black text-slate-850 uppercase focus:border-slate-500 focus:outline-hidden"
                      >
                        <option value="Pending">Approval Pending</option>
                        <option value="Shipped">Dispatched Shipped</option>
                        <option value="Out for Delivery">Out For Delivery</option>
                        <option value="Delivered">Completed Delivered</option>
                        <option value="Cancelled">Rejected Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Recipient Client details summary */}
                  {order.customerEmail && (
                    <div className="mb-2 bg-indigo-50/40 border border-indigo-100 p-2 rounded-xl flex items-center justify-between text-[11px] font-sans">
                      <span className="font-semibold text-slate-600">Account login: <strong className="text-indigo-700 font-bold">{order.customerEmail}</strong></span>
                      <button
                        type="button"
                        onClick={() => {
                          const foundAcc = registeredAccounts.find(acc => acc.email.toLowerCase() === order.customerEmail?.toLowerCase());
                          if (foundAcc) {
                            setSelectedUser(foundAcc);
                            setActiveTab('users');
                          } else {
                            alert(`Account details not found for: ${order.customerEmail}`);
                          }
                        }}
                        className="text-[10px] bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-0.5 rounded-md font-black transition active:scale-95"
                      >
                        Audit Profile ➜
                      </button>
                    </div>
                  )}

                  <div className="text-xs space-y-1 bg-slate-50/50 p-2.5 rounded-2xl border border-slate-100">
                    <p className="font-extrabold text-slate-800">{order.shippingAddress.name}</p>
                    <p className="text-slate-500 leading-normal">{order.shippingAddress.address}, {order.shippingAddress.city} - {order.shippingAddress.pincode}</p>
                    <p className="font-mono text-[10.5px] font-bold text-slate-500">Tel contact: {order.shippingAddress.phone}</p>
                  </div>

                  {/* Item summaries list */}
                  <div className="mt-3.5 space-y-2.5">
                    {order.items.map((it, i) => (
                      <div key={i} className="flex gap-2.5 items-center text-xs font-medium text-slate-800">
                        <img src={it.product.image} className="h-9 w-7 rounded-md object-cover" />
                        <div className="overflow-hidden flex-1 leading-normal select-none">
                          <p className="truncate text-slate-800 font-bold">{it.product.name}</p>
                          <span className="text-[10px] text-slate-400 font-bold">Qty: {it.quantity} | Col: {it.selectedColor || 'N/A'}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-50 mt-3 pt-2.5 flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-400">Submission payload sum:</span>
                    <span className="font-mono font-black text-slate-905 text-sm">${order.total}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB D: MARKETING CONTROL PANEL (COUPONS AND BANNERS) */}
      {activeTab === 'marketing' && (
        <div className="px-4 mt-5 space-y-6">
          
          {/* Section 0: Website Official Branding LOGO Management */}
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm space-y-4 animate-fadeIn">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
              <FileImage className="h-4.5 w-4.5 text-indigo-500" />
              <div>
                <h3 className="text-xs font-black uppercase text-slate-900">Website Custom Logo Upload</h3>
                <p className="text-[10px] text-slate-400 font-medium">Set official branding logo for splash, login screens and headers</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              {/* Current Logo Preview */}
              <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <span className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8] mb-0.5">Current Logo</span>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 font-black text-amber-100 text-xl shadow-md overflow-hidden p-0 border border-slate-200">
                  {logo ? (
                    <img src={logo} className="h-full w-full object-cover" referrerPolicy="no-referrer" alt="Velora logo" />
                  ) : (
                    <span className="text-amber-400">VL</span>
                  )}
                </div>
              </div>

              {/* Upload Controls */}
              <div className="flex-1 space-y-2 w-full text-center sm:text-left">
                <p className="text-[10.5px] text-slate-500 font-medium leading-relaxed">
                  Upload an image (PNG, JPG, or SVG) to replace the default <strong className="text-slate-800">VL</strong> monogram logo on all active user screens instantly.
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  <label className="relative flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-[10px] font-black uppercase tracking-wider transition cursor-pointer active:scale-95 shadow-xs">
                    <Upload className="h-3.5 w-3.5" />
                    <span>Choose Image</span>
                    <input
                      type="file"
                      id="admin-logo-upload-input"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          showToast('Reading brand image file...', 'info');
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const result = event.target?.result;
                            if (typeof result === 'string') {
                              showToast('Optimizing and scaling logo down...', 'info');
                              const img = new Image();
                              img.onload = () => {
                                try {
                                  // Draw image to canvas to scale down
                                  const canvas = document.createElement('canvas');
                                  const maxDim = 160;
                                  let width = img.width;
                                  let height = img.height;
                                  
                                  if (width > height) {
                                    if (width > maxDim) {
                                      height *= maxDim / width;
                                      width = maxDim;
                                    }
                                  } else {
                                    if (height > maxDim) {
                                      width *= maxDim / height;
                                      height = maxDim;
                                    }
                                  }
                                  
                                  canvas.width = width;
                                  canvas.height = height;
                                  const ctx = canvas.getContext('2d');
                                  if (ctx) {
                                    ctx.drawImage(img, 0, 0, width, height);
                                    const base64Png = canvas.toDataURL('image/png');
                                    updateLogo(base64Png);
                                  } else {
                                    updateLogo(result);
                                  }
                                } catch (err) {
                                  console.error("Canvas compression failed, using direct base64:", err);
                                  updateLogo(result);
                                }
                              };
                              img.onerror = () => {
                                updateLogo(result);
                              };
                              img.src = result;
                            }
                          };
                          reader.onerror = () => {
                            showToast('Failed to read image file', 'error');
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>

                  {logo && (
                    <button
                      type="button"
                      id="reset-brand-logo-btn"
                      onClick={() => updateLogo('')}
                      className="flex items-center gap-1 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-2 text-[10px] font-black uppercase tracking-wider transition active:scale-95 cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                      <span>Reset Default</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Supabase SQL Instructions Integration to help Admin run table initialization */}
            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 space-y-3">
              <div className="flex items-start gap-2.5">
                <span className="text-base">💡</span>
                <div>
                  <h4 className="text-[11px] font-extrabold text-blue-950 uppercase tracking-wide">
                    Supabase Setup Instruction (Required)
                  </h4>
                  <p className="text-[10px] text-blue-800 leading-relaxed mt-1">
                    To save and show this Logo permanently for all visitors, go to your <strong className="text-blue-950">Supabase Dashboard</strong>, open the <strong className="text-blue-950">SQL Editor</strong>, paste this query and click <strong className="text-blue-950">Run</strong>:
                  </p>
                </div>
              </div>

              {/* Read-only Query code container */}
              <div className="relative">
                <pre className="text-[9px] font-mono bg-slate-900 text-slate-100 p-3.5 rounded-xl block max-w-full overflow-x-auto leading-relaxed border border-slate-950 select-all whitespace-pre-wrap">
{`CREATE TABLE IF NOT EXISTS app_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn off RLS restrictions for settings configuration so that it updates from Admin
ALTER TABLE app_settings DISABLE ROW LEVEL SECURITY;`}
                </pre>
                
                <button
                  type="button"
                  onClick={() => {
                    const sqlText = `CREATE TABLE IF NOT EXISTS app_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn off RLS restrictions for settings configuration so that it updates from Admin
ALTER TABLE app_settings DISABLE ROW LEVEL SECURITY;`;
                    navigator.clipboard.writeText(sqlText);
                    showToast('SQL Script copied to clipboard!', 'success');
                  }}
                  className="absolute right-2.5 top-2.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white/90 rounded-lg px-2 py-1 text-[8px] font-bold uppercase transition"
                >
                  Copy SQL code
                </button>
              </div>

              <div className="flex items-center gap-1 text-[9.5px] font-bold text-blue-900">
                <span>🔄</span>
                <span>Once the table is created, logos will instantly sync & save to Supabase permanently.</span>
              </div>
            </div>
          </div>
          
          {/* Section 1: Promo Banners Management */}
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
              <Megaphone className="h-4.5 w-4.5 text-amber-500" />
              <div>
                <h3 className="text-xs font-black uppercase text-slate-900">Manage Front Banners & Ads</h3>
                <p className="text-[10px] text-slate-400 font-medium">Banners are rendered dynamically on the front page</p>
              </div>
            </div>

            <div className="space-y-5">
              {promoBanners.map((banner, index) => (
                <div key={banner.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-slate-950 text-white px-2.5 py-0.5 font-mono text-[9px] font-black">
                      Ad Slot #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = promoBanners.filter(b => b.id !== banner.id);
                        updatePromoBanners(updated);
                      }}
                      className="text-rose-500 hover:text-rose-700 text-[10px] font-black uppercase flex items-center gap-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete Ad</span>
                    </button>
                  </div>

                  {/* Banner Image Preview */}
                  <div className="relative h-20 w-full overflow-hidden rounded-xl bg-slate-200">
                    <img src={banner.img} alt="Preview" className="h-full w-full object-cover" />
                    <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1.5 text-center">
                      <span className="font-mono text-[8px] text-slate-300 truncate block">{banner.img}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5 text-xs">
                    <div>
                      <label className="text-[9px] uppercase font-black text-slate-400 mb-0.5 block">Ad Headline Title</label>
                      <input
                        type="text"
                        value={banner.title}
                        onChange={(e) => {
                          const updated = promoBanners.map(b => b.id === banner.id ? { ...b, title: e.target.value } : b);
                          updatePromoBanners(updated);
                        }}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="text-[9px] uppercase font-black text-slate-400 mb-0.5 block">Subheading Description</label>
                      <input
                        type="text"
                        value={banner.sub}
                        onChange={(e) => {
                          const updated = promoBanners.map(b => b.id === banner.id ? { ...b, sub: e.target.value } : b);
                          updatePromoBanners(updated);
                        }}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      <div>
                        <label className="text-[9px] uppercase font-black text-slate-400 mb-0.5 block">Image URL link</label>
                        <input
                          type="text"
                          value={banner.img}
                          onChange={(e) => {
                            const updated = promoBanners.map(b => b.id === banner.id ? { ...b, img: e.target.value } : b);
                            updatePromoBanners(updated);
                          }}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-850"
                        />
                      </div>

                      <div className="mt-1">
                        <label className="text-[9px] uppercase font-black text-slate-400 mb-0.5 block">Category Route</label>
                        <select
                          value={banner.category}
                          onChange={(e) => {
                            const updated = promoBanners.map(b => b.id === banner.id ? { ...b, category: e.target.value } : b);
                            updatePromoBanners(updated);
                          }}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800"
                        >
                          <option value="headphones">headphones</option>
                          <option value="charger">charger</option>
                          <option value="airpods">airpods</option>
                          <option value="watches">watches</option>
                          <option value="perfume">perfume</option>
                          <option value="all">all products</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {promoBanners.length === 0 && (
                <p className="text-center text-xs text-slate-400 py-4 font-medium">No active banners. Click Add below to publish one.</p>
              )}

              {/* Add New Ad Button */}
              <button
                type="button"
                onClick={() => {
                  const newB = {
                    id: `banner_${Date.now()}`,
                    title: 'SUPER FESTIVE DROP',
                    sub: 'Save flat 30% discount on boutique perfume collections',
                    img: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop',
                    category: 'perfume',
                  };
                  updatePromoBanners([...promoBanners, newB]);
                }}
                className="w-full flex items-center justify-center gap-1.5 rounded-2xl bg-slate-900 text-white font-sans font-black py-3 text-xs active:scale-95 transition"
              >
                <Plus className="h-4 w-4" />
                <span>Inject New Banner Advertisement</span>
              </button>
            </div>
          </div>

          {/* Section 2: Coupons Management */}
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
              <Tag className="h-4.5 w-4.5 text-indigo-500" />
              <div>
                <h3 className="text-xs font-black uppercase text-slate-900">Configure Promo Coupon Codes</h3>
                <p className="text-[10px] text-slate-400 font-medium">Create vouchers customers can reference at checkout</p>
              </div>
            </div>

            {/* Quick Coupon Creator Form */}
            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-3">
              <span className="text-[10px] uppercase font-black text-indigo-700 tracking-wider">Coupon Creator Module</span>
              
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[9px] font-black uppercase text-slate-400 mb-0.5 block">Voucher Code</label>
                  <input
                    type="text"
                    placeholder="E.g. VELORA786"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase text-slate-400 mb-0.5 block">Discount %</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    placeholder="30"
                    value={newCouponDiscount}
                    onChange={(e) => setNewCouponDiscount(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!newCouponCode.trim()) {
                    alert('Please enter a valid coupon code string');
                    return;
                  }
                  const percent = parseInt(newCouponDiscount);
                  if (isNaN(percent) || percent < 1 || percent > 100) {
                    alert('Discount must be between 1% and 100%');
                    return;
                  }
                  addCoupon({
                    code: newCouponCode.substring(0, 15),
                    discount: percent,
                    isActive: true
                  });
                  setNewCouponCode('');
                }}
                className="w-full flex items-center justify-center gap-1 bg-indigo-600 text-white font-sans font-extrabold py-2.5 text-xs rounded-xl active:scale-95 transition"
              >
                <span>Authorize & Activate Coupon</span>
              </button>
            </div>

            {/* Coupons List */}
            <div className="space-y-2.5">
              <span className="text-[9px] uppercase font-black text-slate-400 block">Database coupon listings ({coupons.length})</span>
              
              {coupons.map((coupon) => (
                <div key={coupon.code} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-650 text-indigo-600">
                      <Percent className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 font-sans">
                        <span className="font-mono text-xs font-black text-slate-900">{coupon.code}</span>
                        <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[8px] font-bold text-emerald-600">Active</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">Deducts flat {coupon.discount}% from checkout subtotal</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteCoupon(coupon.code)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-rose-50 text-rose-500 transition active:scale-90"
                    title="Revoke voucher"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}

              {coupons.length === 0 && (
                <p className="text-center text-xs text-slate-400 py-3 font-medium">No valid active coupons found.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. CRUD ITEM DRAWER MODAL SHEET */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 backdrop-blur-xs">
          <div className="absolute inset-0" onClick={() => setShowItemModal(false)} />
          
          <form
            onSubmit={handleFormSubmit}
            className="relative w-full max-w-sm rounded-t-[32px] bg-white p-5 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-sm">
                {editingItem ? `Alter details for: ${editingItem.name.slice(0, 16)}...` : 'Inject New Catalog Product'}
              </h3>
              <button
                id="close-modal-sheet"
                type="button"
                onClick={() => setShowItemModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-3 text-xs font-bold text-slate-700">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Item Title</label>
                <input
                  id="form-item-name"
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Apollo Tech Fleece"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Final Price ($)</label>
                  <input
                    id="form-item-price"
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="50"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Old Price Comparison ($)</label>
                  <input
                    id="form-item-old-price"
                    type="number"
                    value={formOldPrice}
                    onChange={(e) => setFormOldPrice(e.target.value)}
                    placeholder="100"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Primary Image Address (Unsplash URL)</label>
                <input
                  id="form-item-image"
                  type="text"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  placeholder="e.g. https://images.unsplash.com/..."
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-hidden mb-2"
                />
              </div>

              {/* Dynamic list for multiple product slide images */}
              <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-slate-500 block">Additional Slide Images ({formImages.length})</span>
                  <button
                    type="button"
                    onClick={() => setFormImages([...formImages, ''])}
                    className="text-[10px] font-black text-indigo-600 hover:text-indigo-850 px-2 py-1 rounded bg-indigo-50 border border-indigo-100 transition active:scale-95 cursor-pointer"
                  >
                    + Add New Slide
                  </button>
                </div>
                {formImages.map((img, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={img}
                      onChange={(e) => {
                        const copy = [...formImages];
                        copy[idx] = e.target.value;
                        setFormImages(copy);
                      }}
                      placeholder={`Slide Image #${idx + 1} URL`}
                      className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-hidden bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setFormImages(formImages.filter((_, i) => i !== idx))}
                      className="text-xs text-rose-500 font-extrabold px-2.5 py-2 hover:bg-rose-50 border border-rose-100 bg-white rounded-xl active:scale-95 transition"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Stocks Count</label>
                  <input
                    id="form-item-stock"
                    type="number"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    placeholder="10"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Category Classification</label>
                  <select
                    id="form-item-category"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-hidden"
                  >
                    <option value="headphones">Headphones</option>
                    <option value="charger">Charger</option>
                    <option value="airpods">AirPods</option>
                    <option value="watches">Watches</option>
                    <option value="perfume">Perfume</option>
                  </select>
                </div>
              </div>

              {/* Sizes checking list */}
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Sizes Available Options</label>
                <div className="flex gap-2 flex-wrap">
                  {['S', 'M', 'L', 'XL', 'US 8', 'US 9', 'US 10', 'US 11'].map(sz => {
                    const isChecked = formSizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => handleSizeToggle(sz)}
                        className={`px-3 py-1.5 rounded-lg text-[10.5px] font-bold border transition duration-150 ${
                          isChecked
                            ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-400'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Product Full Description</label>
                <textarea
                  id="form-item-description"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  rows={3}
                  placeholder="Engineered dropship garment with..."
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-hidden"
                />
              </div>
            </div>

            <button
              id="submit-crud-form"
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-slate-950 py-3.5 text-xs font-black text-white hover:bg-slate-900 active:scale-95 shadow-md"
            >
              <Save className="h-4.5 w-4.5" />
              <span>Commit Inventory details</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB E: MANAGE REGISTERED USERS */}
      {activeTab === 'users' && (
        <div className="px-4 mt-5 space-y-4 font-sans">
          <div className="flex justify-between items-center pb-1">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Registered Resellers ({registeredAccounts.length})</h3>
            <span className="text-[9.5px] font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">CRM Portal</span>
          </div>

          <p className="text-[10px] text-slate-400 font-medium">Click on any reseller profile below to view their complete lifetime purchases, total spend, and audit their active order history panels.</p>

          <div className="space-y-3.5 mt-2">
            {registeredAccounts.filter(acc => 
              dbSearch === '' || 
              acc.name.toLowerCase().includes(dbSearch.toLowerCase()) || 
              acc.email.toLowerCase().includes(dbSearch.toLowerCase()) ||
              acc.phone.toLowerCase().includes(dbSearch.toLowerCase())
            ).length === 0 ? (
              <p className="py-12 text-center text-xs font-medium text-slate-400 border border-slate-100 bg-white rounded-3xl">
                No reseller account discovery matched: "{dbSearch}"
              </p>
            ) : (
              registeredAccounts.filter(acc => 
                dbSearch === '' || 
                acc.name.toLowerCase().includes(dbSearch.toLowerCase()) || 
                acc.email.toLowerCase().includes(dbSearch.toLowerCase()) ||
                acc.phone.toLowerCase().includes(dbSearch.toLowerCase())
              ).map((acc: any) => {
                // Find all lifetime orders for this email
                const userOrders = orders.filter(o => o.customerEmail?.toLowerCase() === acc.email.toLowerCase());
                const lifetimeSpend = userOrders.reduce((sum, o) => o.status !== 'Cancelled' ? sum + o.total : sum, 0);
                const hasOrdered = userOrders.length > 0;
                
                return (
                  <div 
                    key={acc.id}
                    onClick={() => setSelectedUser(acc)}
                    className="rounded-3xl border border-slate-100 bg-white p-4 shadow-xs hover:border-indigo-200 cursor-pointer transition relative group text-left"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 transition">{acc.name}</h4>
                        <p className="text-xs font-semibold text-slate-400 mt-0.5">{acc.email}</p>
                        <p className="text-[11px] font-mono font-bold text-indigo-500 mt-1">📞 {acc.phone}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-mono font-black text-slate-900 block">${lifetimeSpend} spent</span>
                        <span className="text-[9.5px] font-bold text-slate-400 block mt-0.5">{userOrders.length} orders placed</span>
                      </div>
                    </div>

                    <div className="border-t border-slate-50 mt-3 pt-2.5 flex justify-between items-center">
                      {/* Lifetime checker: is Insan ne aaj tak jindagi mein order kara hai ya nahi? */}
                      {hasOrdered ? (
                        <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1 font-bold">
                          <Check className="h-3 w-3" /> Active Reseller Account
                        </span>
                      ) : (
                        <span className="text-[10px] font-black uppercase text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md font-bold">
                          ⚠️ No orders placed yet
                        </span>
                      )}

                      <span className="text-[11px] font-extrabold text-indigo-600 group-hover:translate-x-1 transition-transform">
                        Audit Profile ➜
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* 5. INDIVIDUAL RESELLER DRILL DOWN MODAL */}
      {selectedUser && (
        <div id="reseller-detail-portal" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs font-sans">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="bg-slate-950 text-white p-5 flex justify-between items-center shadow-md">
              <div className="text-left">
                <span className="text-[9px] font-black uppercase tracking-widest text-amber-400 text-left block">RESELLER DETAILED AUDIT</span>
                <h3 className="text-base font-black tracking-tight text-white text-left block mt-0.5">{selectedUser.name}</h3>
              </div>
              <button 
                type="button"
                onClick={() => setSelectedUser(null)} 
                className="h-8 w-8 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition active:scale-90"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 flex-1 overflow-y-auto space-y-5 leading-normal">
              
              {/* Profile card metadata info */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 space-y-2 text-xs text-left">
                <div className="flex justify-between items-center border-b border-slate-200/50 pb-2">
                  <span className="text-slate-450 text-slate-500 font-bold uppercase text-[9px]">Registered ID</span>
                  <span className="font-mono font-bold text-slate-800">{selectedUser.id}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-200/50 pb-2">
                  <span className="text-slate-450 text-slate-500 font-bold uppercase text-[9px]">Electronic Mail</span>
                  <span className="font-bold text-slate-800 select-all">{selectedUser.email}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-200/50 pb-2">
                  <span className="text-slate-450 text-slate-500 font-bold uppercase text-[9px]">Contact Phone</span>
                  <span className="font-mono font-bold text-indigo-600 select-all">{selectedUser.phone}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-450 text-slate-500 font-bold uppercase text-[9px]">Account Status</span>
                  {orders.filter(o => o.customerEmail?.toLowerCase() === selectedUser.email.toLowerCase()).length > 0 ? (
                    <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-md">Active Purchaser</span>
                  ) : (
                    <span className="text-[10px] font-black uppercase text-rose-500 bg-rose-100 px-2 py-0.5 rounded-md">Inactive Browsing Only</span>
                  )}
                </div>
              </div>

              {/* Lifetime aggregate stats metrics cards */}
              <div className="text-left">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Reseller Engagement Aggregates</h4>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                    <span className="text-[9px] text-slate-500 font-bold block uppercase leading-none">Lifetime Spend</span>
                    <span className="font-mono text-base font-black text-emerald-700 block mt-1.5">
                      ${orders.filter(o => o.customerEmail?.toLowerCase() === selectedUser.email.toLowerCase() && o.status !== 'Cancelled').reduce((sum, o) => sum + o.total, 0)}
                    </span>
                  </div>
                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3">
                    <span className="text-[9px] text-slate-500 font-bold block uppercase leading-none">Orders Submitted</span>
                    <span className="font-mono text-base font-black text-indigo-700 block mt-1.5">
                      {orders.filter(o => o.customerEmail?.toLowerCase() === selectedUser.email.toLowerCase()).length} orders
                    </span>
                  </div>
                </div>
              </div>

              {/* Breakdown of ordered items detail list */}
              <div className="text-left">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Item Purchase History List</h4>
                
                {orders.filter(o => o.customerEmail?.toLowerCase() === selectedUser.email.toLowerCase()).length === 0 ? (
                  <p className="py-6 text-center text-xs font-semibold text-rose-500 bg-rose-50/50 border border-rose-100 rounded-2xl leading-normal">
                    This reseller has placed 0 orders in their lifetime. No entries discovered in database.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {orders.filter(o => o.customerEmail?.toLowerCase() === selectedUser.email.toLowerCase()).map((o) => (
                      <div key={o.id} className="border border-slate-100 rounded-2xl p-3 bg-white space-y-2.5 text-left">
                        <div className="flex justify-between items-center text-[10.5px] border-b border-slate-100 pb-1.5">
                          <div>
                            <span className="text-slate-450 text-slate-500 font-bold">ID: </span>
                            <span className="font-mono font-black text-slate-800">{o.id}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                            o.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700 font-extrabold' :
                            o.status === 'Cancelled' ? 'bg-rose-100 text-rose-700 font-extrabold' :
                            'bg-amber-100 text-amber-700 font-extrabold'
                          }`}>
                            {o.status}
                          </span>
                        </div>

                        {/* List individual sub-items ordered in this receipt */}
                        <div className="space-y-2">
                          {o.items.map((it, idx) => (
                            <div key={idx} className="flex gap-2 items-center text-xs">
                              <img src={it.product.image} className="h-8 w-6 object-cover rounded-md border border-slate-100 shrink-0" />
                              <div className="flex-1 min-w-0 font-medium">
                                <p className="truncate text-slate-800 font-bold text-left">{it.product.name}</p>
                                <p className="text-[10px] text-slate-400 font-bold text-left">
                                  Qty: {it.quantity} | Size: {it.selectedSize || 'N/A'} | Price: ${it.product.price}
                                </p>
                              </div>
                              <span className="font-mono text-xs font-bold text-slate-800 shrink-0">${it.product.price * it.quantity}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between items-center text-[11px] font-bold border-t border-slate-100 pt-1.5 mt-1">
                          <span className="text-slate-400">{o.date}</span>
                          <span className="font-mono font-black text-slate-900">Charged: ${o.total}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
              <button 
                type="button"
                onClick={() => setSelectedUser(null)} 
                className="w-full bg-slate-950 text-white rounded-2xl py-3 text-xs font-black shadow-md hover:bg-slate-900 transition active:scale-95"
              >
                Close Audit Record Folder
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
