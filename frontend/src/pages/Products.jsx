import React, { useState, useEffect, useMemo } from 'react';
import axiosClient from '../api/axiosClient';
import BarcodeScanner from '../components/BarcodeScanner';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [form, setForm] = useState({ id: null, sku: '', name: '', unit: '', minStockThreshold: '', categoryId: '', barcode: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        axiosClient.get('/products'),
        axiosClient.get('/categories')
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((p) => {
      const matchesQuery =
        !q ||
        p.name?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q) ||
        p.barcode?.toLowerCase().includes(q);
      const matchesCategory = !selectedCategory || String(p.category?.id) === selectedCategory;
      const matchesLowStock = !lowStockOnly || p.currentQuantity < p.minStockThreshold;
      return matchesQuery && matchesCategory && matchesLowStock;
    });
  }, [products, searchQuery, selectedCategory, lowStockOnly]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        sku: form.sku, name: form.name, unit: form.unit, barcode: form.barcode,
        minStockThreshold: Number(form.minStockThreshold),
      };
      if (form.id) {
        await axiosClient.put(`/products/${form.id}?categoryId=${form.categoryId}`, payload);
      } else {
        await axiosClient.post(`/products?categoryId=${form.categoryId}`, payload);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm('Deactivate product?')) return;
    try {
      await axiosClient.patch(`/products/${id}/deactivate`);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to deactivate product');
    }
  };

  const openAdd = () => {
    setForm({ id: null, sku: '', name: '', unit: '', minStockThreshold: '', categoryId: '', barcode: '' });
    setShowModal(true);
  };

  const openEdit = (p) => {
    setForm({ id: p.id, sku: p.sku, name: p.name, unit: p.unit, minStockThreshold: p.minStockThreshold, categoryId: p.category?.id || '', barcode: p.barcode || '' });
    setShowModal(true);
  };

  const handleScan = async (code) => {
    setShowScanner(false);
    setForm(p => ({ ...p, barcode: code }));
    try {
      const res = await axiosClient.get(`/products/by-barcode?code=${code}`);
      if (res.data) {
        setForm({
          id: res.data.id,
          sku: res.data.sku,
          name: res.data.name,
          unit: res.data.unit,
          minStockThreshold: res.data.minStockThreshold,
          categoryId: res.data.category?.id || '',
          barcode: res.data.barcode || code
        });
      }
    } catch {
      // Not found, just keep the barcode in form
    }
    setShowModal(true);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Products</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {filteredProducts.length} of {products.length} items shown
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowScanner(true)}
            className="border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            Scan Barcode
          </button>
          <button
            type="button"
            onClick={openAdd}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition-colors"
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by product name, SKU, or barcode..."
          aria-label="Search products"
          className="flex-1 px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          aria-label="Filter by category"
          className="px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={String(c.id)}>{c.name}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setLowStockOnly((prev) => !prev)}
          aria-pressed={lowStockOnly}
          className={`px-3.5 py-2 rounded-xl text-sm font-medium border transition-colors ${
            lowStockOnly
              ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-300'
              : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Low Stock Only
        </button>
      </div>

      {error && (
        <div role="alert" className="bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-xl p-3.5 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div tabIndex={0} role="region" aria-label="Products inventory" className="table-wrapper">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  {['SKU', 'Barcode', 'Name', 'Category', 'Unit', 'Qty', 'Min', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                      No matching products found.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map(p => {
                    const isLow = p.currentQuantity < p.minStockThreshold;
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3 text-sm font-mono text-slate-800 dark:text-slate-200 whitespace-nowrap">{p.sku}</td>
                        <td className="px-4 py-3 text-sm font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap">{p.barcode || '—'}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white">{p.name}</td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{p.category?.name}</td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{p.unit}</td>
                        <td className={`px-4 py-3 text-sm font-semibold whitespace-nowrap ${isLow ? 'text-red-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'}`}>
                          {p.currentQuantity}
                          {isLow && <span className="ml-1.5 text-[10px] uppercase px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">Low</span>}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{p.minStockThreshold}</td>
                        <td className="px-4 py-3 text-sm whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${p.isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                            {p.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm whitespace-nowrap">
                          <div className="flex gap-3">
                            <button type="button" onClick={() => openEdit(p)} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 font-medium">Edit</button>
                            {p.isActive && (
                              <button type="button" onClick={() => handleDeactivate(p.id)} className="text-rose-600 dark:text-rose-400 hover:text-rose-800 font-medium">Deactivate</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{form.id ? 'Edit Product' : 'Add Product'}</h2>
              <button type="button" onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">SKU *</label>
                  <input type="text" required value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })}
                    className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Barcode</label>
                  <input type="text" value={form.barcode} onChange={e => setForm({ ...form, barcode: e.target.value })}
                    className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name *</label>
                <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category *</label>
                  <select required value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })}
                    className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-sm">
                    <option value="">Select...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Unit *</label>
                  <input type="text" required placeholder="e.g. pcs" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })}
                    className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Min Stock Threshold *</label>
                <input type="number" required min="0" value={form.minStockThreshold} onChange={e => setForm({ ...form, minStockThreshold: e.target.value })}
                  className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-sm" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-2 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 bg-indigo-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50">{submitting ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showScanner && <BarcodeScanner onScan={handleScan} onClose={() => setShowScanner(false)} />}
    </div>
  );
}
