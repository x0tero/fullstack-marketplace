import { ShoppingBag, X, Plus, Minus, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Link } from 'react-router-dom';

export function CartDrawer() {
    const { items, isOpen, setIsOpen, updateQuantity, removeItem, currency, totalPrice } = useStore();

    const handleCheckout = () => {
        setIsOpen(false);
    };

    const getCurrencySymbol = (code: string) => {
        switch (code) {
            case 'EUR': return '€';
            case 'GBP': return '£';
            default: return '$';
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-[60] bg-gray-900/40 backdrop-blur-sm transition-opacity"
                onClick={() => setIsOpen(false)}
            />

            {/* Drawer */}
            <div className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform transform translate-x-0">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5 text-primary-600" />
                        <h2 className="text-lg font-semibold text-gray-900">Your Cart</h2>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                    {items.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center gap-4 text-gray-500">
                            <ShoppingBag className="h-12 w-12 text-gray-200" />
                            <p>Your cart is empty</p>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="mt-4 rounded-full bg-primary-50 px-6 py-2 text-sm font-medium text-primary-600 hover:bg-primary-100 transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="h-full w-full object-cover object-center"
                                        />
                                    </div>
                                    <div className="flex flex-1 flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between">
                                                <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</h3>
                                                <p className="ml-4 text-sm font-semibold text-gray-900">
                                                    {getCurrencySymbol(currency)}{item.price.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-end justify-between">
                                            <div className="flex items-center rounded-full border border-gray-200">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="p-1 px-2 text-gray-500 hover:text-primary-600"
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </button>
                                                <span className="w-8 text-center text-sm font-medium">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-1 px-2 text-gray-500 hover:text-primary-600"
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t border-gray-100 bg-gray-50 px-6 py-6">
                        <div className="flex justify-between text-base font-semibold text-gray-900 mb-4">
                            <p>Subtotal</p>
                            <p>{getCurrencySymbol(currency)}{totalPrice().toFixed(2)}</p>
                        </div>
                        <p className="text-sm text-gray-500 mb-6">Shipping and taxes calculated at checkout.</p>
                        <Link
                            to="/checkout"
                            onClick={handleCheckout}
                            className="flex w-full items-center justify-center rounded-full bg-primary-600 px-6 py-4 text-base font-semibold text-white shadow-lg hover:bg-primary-500 transition-colors"
                        >
                            Checkout ({items.reduce((acc, curr) => acc + curr.quantity, 0)} items)
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
