import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { userEmail, userRole } = useAuth();
  const [stats, setStats] = useState({
    lowStockCount: 0,
    warehouseCount: 0,
    productCount: 0,
    supplierCount: 0,
  });
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [lowStockRes, whRes, prodRes, supRes] = await Promise.all([
          axiosClient.get('/products/low-stock').catch(() => ({ data: [] })),
          axiosClient.get('/warehouses').catch(() => ({ data: [] })),
          axiosClient.get('/products').catch(() => ({ data: [] })),
          axiosClient.get('/suppliers').catch(() => ({ data: [] })),
        ]);

        setLowStockAlerts(lowStockRes.data);
        setStats({
          lowStockCount: lowStockRes.data.length,
          warehouseCount: whRes.data.length,
          productCount: prodRes.data.length,
          supplierCount: supRes.data.length,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const kpiCards = [
    {
      label: 'Total Products',
      value: stats.productCount,
      accent: 'text-indigo-600 dark:text-indigo-400',
      badge: 'Catalog SKUs',
      badgeStyle: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300',
    },
    {
      label: 'Low Stock Items',
      value: stats.lowStockCount,
      accent: stats.lowStockCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400',
      badge: stats.lowStockCount > 0 ? 'Needs restock' : 'Healthy',
      badgeStyle: stats.lowStockCount > 0
        ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
        : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
    },
    {
      label: 'Total Warehouses',
      value: stats.warehouseCount,
      accent: 'text-slate-900 dark:text-white',
      badge: 'Active locations',
      badgeStyle: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    },
    {
      label: 'Active Suppliers',
      value: stats.supplierCount,
      accent: 'text-amber-600 dark:text-amber-400',
      badge: 'Vendor network',
      badgeStyle: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Signed in as <span className="font-medium text-slate-700 dark:text-slate-200">{userEmail}</span> ({userRole || 'USER'})
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/products"
            className="px-3.5 py-2 rounded-xl text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
          >
            Manage Products
          </Link>
          <Link
            to="/stock-transactions"
            className="px-3.5 py-2 rounded-xl text-sm font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Stock In / Out
          </Link>
          <Link
            to="/purchase-orders"
            className="px-3.5 py-2 rounded-xl text-sm font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Purchase Orders
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-28 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {kpiCards.map((card) => (
              <div
                key={card.label}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">{card.label}</dt>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${card.badgeStyle}`}>
                    {card.badge}
                  </span>
                </div>
                <dd className={`mt-3 text-3xl font-bold tracking-tight ${card.accent}`}>{card.value}</dd>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">Low Stock Alerts</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Items at or below their minimum stock threshold</p>
              </div>
              <Link to="/products" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                View all products →
              </Link>
            </div>
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {lowStockAlerts.length === 0 ? (
                <li className="px-5 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                  No low stock items. All inventory levels are healthy.
                </li>
              ) : (
                lowStockAlerts.map((alert) => {
                  const pct = alert.minStockThreshold > 0
                    ? Math.min(100, Math.round((alert.currentQuantity / alert.minStockThreshold) * 100))
                    : 0;
                  return (
                    <li key={alert.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{alert.name}</p>
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-300">
                            {alert.sku}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Min Threshold: {alert.minStockThreshold}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="w-24 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden" aria-hidden="true">
                          <div className="h-full bg-rose-500 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="px-2.5 py-1 inline-flex text-xs font-semibold rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300">
                          Current: {alert.currentQuantity}
                        </span>
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
