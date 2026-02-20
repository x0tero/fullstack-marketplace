import { useEffect } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, LogOut } from 'lucide-react';

export function AdminLayout() {
    const navigate = useNavigate();

    // Guard the route by checking for a token
    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-primary-100 selection:text-primary-900">

            {/* Sidebar sidebar */}
            <aside className="fixed inset-y-0 left-0 w-64 border-r border-gray-200 bg-white">
                <div className="flex h-16 items-center border-b border-gray-200 px-6">
                    <Link to="/" className="text-lg font-bold tracking-tight text-gray-900">
                        MARKET<span className="text-primary-500">PLACE</span> Admin
                    </Link>
                </div>

                <nav className="flex flex-col gap-1 p-4">
                    <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                    </Link>
                    <Link
                        to="/admin/products"
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <Package className="h-4 w-4" />
                        Products
                    </Link>
                    <Link
                        to="/admin/orders"
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <ShoppingCart className="h-4 w-4" />
                        Orders
                    </Link>
                </nav>

                <div className="absolute bottom-0 w-full p-4">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="pl-64 flex-1">
                <div className="p-8">
                    <Outlet />
                </div>
            </main>

        </div>
    );
}
