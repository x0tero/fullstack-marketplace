import { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';

export function OrderConfirmation() {
    const [searchParams] = useSearchParams();
    const session_id = searchParams.get('session_id');
    const { clearCart } = useStore();

    useEffect(() => {
        // If we land here and there's a session_id, the order was successful.
        // Clear the cart.
        if (session_id) {
            clearCart();
        }
    }, [session_id, clearCart]);

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 animate-fade-in-up">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 mb-8">
                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>

            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl text-center">
                Payment Successful!
            </h1>

            <p className="mt-4 max-w-xl text-center text-lg text-gray-500">
                Thank you for your order. We've received your payment and are processing it right now.
                You will receive an email confirmation shortly with your receipt and any digital downloads.
            </p>

            {session_id && (
                <div className="mt-8 rounded-2xl bg-gray-50 p-6 text-sm text-gray-500 ring-1 ring-inset ring-gray-200">
                    <p className="font-medium text-gray-700">Order Reference:</p>
                    <code className="mt-2 block break-all text-xs text-gray-400 bg-white p-2 rounded border border-gray-100">
                        {session_id}
                    </code>
                </div>
            )}

            <div className="mt-10 flex gap-4">
                <Link
                    to="/"
                    className="inline-flex items-center justify-center rounded-full bg-primary-600 px-8 py-3 text-base font-semibold text-white transition-all hover:bg-primary-500 shadow-md shadow-primary-500/20"
                >
                    Continue Shopping
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </div>
        </div>
    );
}
