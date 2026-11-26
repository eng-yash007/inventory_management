import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const THEME_OPTIONS = ['light dark', 'light', 'dark'];

function getSavedScheme() {
  try {
    const saved = localStorage.getItem('color-scheme');
    return saved === 'light' || saved === 'dark' ? saved : 'light dark';
  } catch {
    return 'light dark';
  }
}

function applyScheme(scheme) {
  const meta = document.querySelector('meta[name="color-scheme"]');
  if (meta) meta.setAttribute('content', scheme);
  try {
    if (scheme === 'light dark') {
      localStorage.removeItem('color-scheme');
    } else {
      localStorage.setItem('color-scheme', scheme);
    }
  } catch {
    // Ignore storage errors in restricted contexts
  }
}

const NavIcon = ({ name }) => {
  const icons = {
    dashboard: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
    products: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />,
    categories: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />,
    transactions: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />,
    orders: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />,
    warehouses: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />,
    transfers: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
    invoices: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
    suppliers: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />,
    report: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
    notifications: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />,
  };
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      {icons[name] || icons.dashboard}
    </svg>
  );
};

export default function Layout({ children }) {
  const { logout, userEmail, userRole } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scheme, setScheme] = useState(getSavedScheme);

  useEffect(() => {
    applyScheme(scheme);
  }, [scheme]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'color-scheme') {
        setScheme(getSavedScheme());
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const cycleTheme = () => {
    const next = THEME_OPTIONS[(THEME_OPTIONS.indexOf(scheme) + 1) % THEME_OPTIONS.length];
    setScheme(next);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdminOrManager = ['ADMIN', 'MANAGER'].includes(userRole);
  const isStaff = userRole === 'STAFF';
  const isSupplierContact = userRole === 'SUPPLIER_CONTACT';
  const isCustomer = userRole === 'CUSTOMER';

  const initials = (userEmail || 'U').slice(0, 2).toUpperCase();
  const themeLabel = scheme === 'light dark' ? 'Theme: System' : scheme === 'dark' ? 'Theme: Dark' : 'Theme: Light';

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-950/30'
        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
    }`;

  const renderNavContent = () => (
    <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto" aria-label="Primary">
      {(isAdminOrManager || isStaff) && (
        <div>
          <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Core</p>
          <div className="space-y-1">
            <NavLink to="/dashboard" className={navClass} onClick={() => setMobileOpen(false)}>
              <NavIcon name="dashboard" /> Dashboard
            </NavLink>
            <NavLink to="/products" className={navClass} onClick={() => setMobileOpen(false)}>
              <NavIcon name="products" /> Products
            </NavLink>
            <NavLink to="/categories" className={navClass} onClick={() => setMobileOpen(false)}>
              <NavIcon name="categories" /> Categories
            </NavLink>
            <NavLink to="/stock-transactions" className={navClass} onClick={() => setMobileOpen(false)}>
              <NavIcon name="transactions" /> Stock Transactions
            </NavLink>
            <NavLink to="/purchase-orders" className={navClass} onClick={() => setMobileOpen(false)}>
              <NavIcon name="orders" /> Purchase Orders
            </NavLink>
          </div>
        </div>
      )}

      {isAdminOrManager && (
        <div>
          <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Operations</p>
          <div className="space-y-1">
            <NavLink to="/warehouses" className={navClass} onClick={() => setMobileOpen(false)}>
              <NavIcon name="warehouses" /> Warehouses
            </NavLink>
            <NavLink to="/warehouses/transfers" className={navClass} onClick={() => setMobileOpen(false)}>
              <NavIcon name="transfers" /> Warehouse Transfers
            </NavLink>
            <NavLink to="/invoices" className={navClass} onClick={() => setMobileOpen(false)}>
              <NavIcon name="invoices" /> Invoices
            </NavLink>
            <NavLink to="/suppliers" className={navClass} onClick={() => setMobileOpen(false)}>
              <NavIcon name="suppliers" /> Suppliers
            </NavLink>
            <NavLink to="/reports/suppliers" className={navClass} onClick={() => setMobileOpen(false)}>
              <NavIcon name="report" /> Supplier Report
            </NavLink>
            <NavLink to="/notifications" className={navClass} onClick={() => setMobileOpen(false)}>
              <NavIcon name="notifications" /> Notifications
            </NavLink>
          </div>
        </div>
      )}

      {isSupplierContact && (
        <div>
          <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Portal</p>
          <NavLink to="/portal/supplier" className={navClass} onClick={() => setMobileOpen(false)}>
            <NavIcon name="suppliers" /> Supplier Portal
          </NavLink>
        </div>
      )}

      {isCustomer && (
        <div>
          <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Portal</p>
          <NavLink to="/portal/customer" className={navClass} onClick={() => setMobileOpen(false)}>
            <NavIcon name="products" /> Product Catalogue
          </NavLink>
        </div>
      )}
    </nav>
  );

  return (
    <div className="flex h-dvh bg-slate-50 dark:bg-slate-950 font-sans overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-900 text-white flex-col shrink-0 border-r border-slate-800">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-sm">
            SP
          </div>
          <div>
            <div className="text-base font-bold tracking-tight leading-none">StockPulse</div>
            <div className="text-[11px] text-slate-400 mt-1">Inventory OS</div>
          </div>
        </div>

        {renderNavContent()}

        <div className="p-3 border-t border-slate-800 space-y-2">
          <button
            type="button"
            onClick={cycleTheme}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-300 bg-slate-800/70 hover:bg-slate-800 transition-colors"
            title="Cycle color theme (System / Light / Dark)"
          >
            <span>{themeLabel}</span>
            <span className="text-indigo-400">Switch</span>
          </button>

          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 flex items-center justify-center text-xs font-semibold shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium text-slate-200 truncate" title={userEmail}>{userEmail}</div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400">{userRole || 'USER'}</div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full bg-rose-600/90 hover:bg-rose-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* Mobile Header + Drawer */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-sm">SP</div>
            <span className="font-bold tracking-tight">StockPulse</span>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation menu"
            className="px-3 py-1.5 rounded-lg bg-slate-800 text-sm font-medium"
          >
            {mobileOpen ? 'Close' : 'Menu'}
          </button>
        </header>

        {mobileOpen && (
          <div className="md:hidden bg-slate-900 text-white border-b border-slate-800 max-h-[70dvh] overflow-y-auto">
            {renderNavContent()}
            <div className="p-3 border-t border-slate-800 flex items-center gap-2">
              <button
                type="button"
                onClick={cycleTheme}
                className="flex-1 px-3 py-2 rounded-lg text-xs font-medium bg-slate-800 text-slate-200"
              >
                {themeLabel}
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg text-xs font-medium bg-rose-600 text-white"
              >
                Log Out
              </button>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
