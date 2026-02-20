import { useState, useEffect } from 'react';
import { ShoppingCart, Loader2, Eye } from 'lucide-react';
import api from '../services/api';

interface Order {
    id: string;
    total: number;
    status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
    customerEmail: string;
    createdAt: string;
    items: {
        id: string;
        quantity: number;
        price: number;
        product: {
            name: string;
        }
    }[];
}

export function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setIsLoading(true);
                const response = await api.get<Order[]>('/admin/orders');
                setOrders(response.data);
            } catch (err: any) {
                console.error('Failed to fetch orders:', err);
                setError('Failed to load orders table.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="animate-fade-in-up">
            <div className="flex items-center justify-between pb-6 border-b border-gray-200">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Orders</h1>
                    <p className="mt-1 text-sm text-gray-500">View and manage customer transactions.</p>
                </div>
            </div>

            {error && (
                <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-600 ring-1 ring-inset ring-red-200">
                    {error}
                </div>
            )}

            <div className="mt-8 flex flex-col">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-2xl">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                            Order ID / Date
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Customer
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Total
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Status
                                        </th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={5} className="py-12 text-center text-gray-500">
                                                <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary-600" />
                                                <span className="mt-2 block">Loading orders...</span>
                                            </td>
                                        </tr>
                                    ) : orders.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-12 text-center text-gray-500">
                                                <ShoppingCart className="mx-auto h-8 w-8 text-gray-300" />
                                                <span className="mt-2 block font-medium">No orders found</span>
                                                <span>Waiting for your first customer.</span>
                                            </td>
                                        </tr>
                                    ) : (
                                        orders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                                    <div className="font-medium text-gray-900">
                                                        #{order.id.slice(0, 8).toUpperCase()}
                                                    </div>
                                                    <div className="text-gray-500 text-xs mt-1">{formatDate(order.createdAt)}</div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {order.customerEmail}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm font-semibold text-gray-900">
                                                    ${order.total.toFixed(2)}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                    {order.status === 'COMPLETED' ? (
                                                        <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/10">Paid</span>
                                                    ) : order.status === 'PENDING' ? (
                                                        <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/10">Pending</span>
                                                    ) : (
                                                        <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">Canceled</span>
                                                    )}
                                                </td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                    <button
                                                        className="text-primary-600 hover:text-primary-900 transition-colors flex justify-end w-full"
                                                        title="View Details"
                                                    >
                                                        <span className="sr-only">View</span>
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
