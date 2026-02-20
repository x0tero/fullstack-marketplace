import { useEffect, useState } from 'react';
import { Package, ShoppingCart, DollarSign, ArrowUpRight, Loader2 } from 'lucide-react';
import api from '../services/api';

interface DashboardSummary {
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
}

export function AdminDashboard() {
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                setIsLoading(true);
                const response = await api.get<DashboardSummary>('/admin/orders/summary');
                setSummary(response.data);
            } catch (err: any) {
                console.error('Failed to fetch dashboard summary', err);
                setError('Failed to load dashboard data.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchSummary();
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
        );
    }

    if (error || !summary) {
        return (
            <div className="rounded-lg bg-red-50 p-6 text-red-600 ring-1 ring-inset ring-red-200">
                {error || 'Dashboard data not available.'}
            </div>
        );
    }

    const statCards = [
        {
            name: 'Total Revenue',
            value: `$${(summary.totalRevenue || 0).toFixed(2)}`,
            icon: DollarSign,
            color: 'bg-emerald-500',
        },
        {
            name: 'Total Orders',
            value: summary.totalOrders.toString(),
            icon: ShoppingCart,
            color: 'bg-blue-500',
        },
        {
            name: 'Total Products',
            value: summary.totalProducts.toString(),
            icon: Package,
            color: 'bg-purple-500',
        },
    ];

    return (
        <div className="animate-fade-in-up">
            <div className="flex items-center justify-between pb-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard Overview</h1>
                <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-3 py-1.5 rounded-full ring-1 ring-gray-200 shadow-sm">
                    <span>Live updates</span>
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.name}
                            className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl text-white shadow-sm ${stat.color}`}>
                                    <Icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                                    <p className="mt-1 text-2xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                            </div>
                            <div className="absolute top-6 right-6 text-gray-300">
                                <ArrowUpRight className="h-5 w-5" />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Chart Placeholder Area */}
            <div className="mt-8 overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h2>
                <div className="h-64 w-full rounded-xl bg-gray-50 flex items-center justify-center border border-dashed border-gray-200">
                    <p className="text-gray-400 font-medium">No recent activity detected.</p>
                </div>
            </div>
        </div>
    );
}
