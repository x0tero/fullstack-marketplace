import { useState } from 'react';
import { useStore } from '../store/useStore';
import { ArrowLeft, Loader2, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export function Checkout() {
    const { items, totalPrice, currency } = useStore();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const getCurrencySymbol = (code: string) => {
        switch (code) {
            case 'EUR': return '€';
            case 'GBP': return '£';
            default: return '$';
        }
    };

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) {
            setError('Your cart is empty');
            return;
        }
        if (!email) {
            setError('Please enter your email address');
            return;
        }

        try {
            setIsLoading(true);
            setError('');

            const payload = {
                items: items.map(item => ({
                    productId: item.id,
                    quantity: item.quantity
                })),
                customerEmail: email
            };

            const response = await api.post('/stripe/checkout', payload);

            // Redirect to Stripe Checkout
            if (response.data.url) {
                window.location.href = response.data.url;
            } else {
                setError('Failed to initialize checkout session. Please try again.');
            }
        } catch (err: any) {
            console.error('Checkout error:', err);
            setError(err.response?.data?.message || 'An unexpected error occurred during checkout.');
        } finally {
            setIsLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <p className="text-xl text-gray-600">Your cart is empty.</p>
                <Link to="/" className="mt-4 flex items-center gap-2 text-primary-600 hover:text-primary-800 font-medium">
                    <ArrowLeft className="h-4 w-4" /> Return to Shop
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl animate-fade-in">
            <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary-600">
                <ArrowLeft className="h-4 w-4" /> Back to Shop
            </Link>

            <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-gray-100">
                <div className="border-b border-gray-100 bg-gray-50/50 px-8 py-6">
                    <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
                    <p className="mt-1 text-sm text-gray-500">Review your order and enter your details to proceed to secure payment.</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleCheckout} className="flex flex-col gap-8">
                        {/* Order Summary */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Order Summary ({items.length} items)</h2>
                            <div className="mt-4 flex flex-col gap-4">
                                {items.map(item => (
                                    <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                        <div className="flex items-center gap-4">
                                            <div className="h-16 w-16 overflow-hidden rounded-lg bg-gray-100 ring-1 ring-gray-200">
                                                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{item.name}</p>
                                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-semibold text-gray-900">
                                            {getCurrencySymbol(currency)}{(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 flex justify-between border-t border-gray-100 pt-6 text-xl font-bold text-gray-900">
                                <p>Total</p>
                                <p>{getCurrencySymbol(currency)}{totalPrice().toFixed(2)}</p>
                            </div>
                        </div>

                        {/* Email Input */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Delivery Details</h2>
                            <div className="mt-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-2 block w-full rounded-xl border-gray-200 px-4 py-3 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-gray-50 transition-colors"
                                    placeholder="you@example.com"
                                />
                                <p className="mt-2 text-xs text-gray-500">We'll send your order confirmation and digital downloads here.</p>
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 ring-1 ring-red-200">
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex w-full items-center justify-center rounded-xl bg-gray-900 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-gray-900/20 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-70 transition-all"
                            >
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                ) : (
                                    <Lock className="mr-2 h-5 w-5" />
                                )}
                                {isLoading ? 'Processing...' : `Pay ${getCurrencySymbol(currency)}${totalPrice().toFixed(2)}`}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
