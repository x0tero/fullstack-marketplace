import { useState, useEffect } from 'react';
import { Package, Plus, Pencil, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
import api from '../services/api';
import type { Product } from '../components/ProductCard';

export function AdminProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // To keep it simple for this slice, we will implement fetching and deletions
    // Product Creation / Editing would ideally open a Modal or a new Route.

    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            const response = await api.get<Product[]>('/products');
            setProducts(response.data);
        } catch (err) {
            console.error('Failed to fetch products', err);
            setError('Failed to load products table.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
            return;
        }

        try {
            await api.delete(`/admin/products/${id}`);
            setProducts(products.filter(p => p.id !== id));
        } catch (err: any) {
            console.error('Delete failed:', err);
            alert(err.response?.data?.message || 'Failed to delete product.');
        }
    };

    return (
        <div className="animate-fade-in-up">
            <div className="flex items-center justify-between pb-6 border-b border-gray-200">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Products</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage your store's inventory and digital assets.</p>
                </div>
                <button className="flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 transition-colors">
                    <Plus className="h-4 w-4" />
                    Add Product
                </button>
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
                                            Product
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Price
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Type
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Images
                                        </th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 hover:text-primary-600 transition-colors">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={5} className="py-12 text-center text-gray-500">
                                                <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary-600" />
                                                <span className="mt-2 block">Loading products...</span>
                                            </td>
                                        </tr>
                                    ) : products.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-12 text-center text-gray-500">
                                                <Package className="mx-auto h-8 w-8 text-gray-300" />
                                                <span className="mt-2 block font-medium">No products found</span>
                                                <span>Click "Add Product" to get started.</span>
                                            </td>
                                        </tr>
                                    ) : (
                                        products.map((product) => (
                                            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-gray-100 overflow-hidden ring-1 ring-gray-200">
                                                            <img className="h-full w-full object-cover" src={product.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=100'} alt="" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="font-medium text-gray-900 max-w-[200px] truncate" title={product.name}>{product.name}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 font-medium">
                                                    ${product.price.toFixed(2)}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {product.type === 'DIGITAL' ? (
                                                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">Digital</span>
                                                    ) : (
                                                        <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/10">Physical</span>
                                                    )}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <div className="flex items-center gap-1.5 text-xs">
                                                        <ImageIcon className="h-4 w-4 text-gray-400" />
                                                        {product.images.length}
                                                    </div>
                                                </td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                    <button className="text-primary-600 hover:text-primary-900 mr-4 transition-colors">
                                                        <span className="sr-only">Edit</span>
                                                        <Pencil className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product.id, product.name)}
                                                        className="text-red-600 hover:text-red-900 transition-colors"
                                                    >
                                                        <span className="sr-only">Delete</span>
                                                        <Trash2 className="h-4 w-4" />
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
