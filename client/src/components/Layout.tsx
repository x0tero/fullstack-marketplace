import { Link, Outlet } from 'react-router-dom';
import { ShoppingCart, Search, Menu } from 'lucide-react';
import { useStore } from '../store/useStore';

export function Navbar() {
    const { items, setIsOpen, currency, setCurrency } = useStore();

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-primary-100 bg-white/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4">
                    <Link to="/" className="text-xl font-bold tracking-tight text-primary-900">
                        MARKET<span className="text-primary-500">PLACE</span>
                    </Link>
                </div>

                {/* Desktop Search Center */}
                <div className="hidden flex-1 items-center justify-center px-8 md:flex">
                    <div className="relative w-full max-w-md">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full rounded-full border border-gray-200 bg-gray-50 py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors"
                            placeholder="Search products..."
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <select
                        className="hidden rounded-md border-gray-200 py-1 pl-2 pr-8 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:block"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                    >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                    </select>

                    <button
                        onClick={() => setIsOpen(true)}
                        className="group relative flex items-center justify-center rounded-full p-2 text-gray-500 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                    >
                        <ShoppingCart className="h-5 w-5" />
                        {itemCount > 0 && (
                            <span className="absolute top-0 right-0 inline-flex items-center justify-center rounded-full bg-primary-500 px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4">
                                {itemCount}
                            </span>
                        )}
                    </button>

                    <button className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                        <Menu className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </nav>
    );
}

export function Layout() {
    return (
        <div className="min-h-screen bg-secondary-50 font-sans text-secondary-900 selection:bg-primary-100 selection:text-primary-900">
            <Navbar />
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <Outlet />
            </main>

            {/* Footer minimal */}
            <footer className="border-t border-gray-200 bg-white py-8 text-center text-sm text-gray-500 mt-auto">
                <p>© {new Date().getFullYear()} Marketplace. All rights reserved.</p>
            </footer>
        </div>
    );
}
