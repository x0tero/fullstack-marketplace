import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Loader2, Star } from 'lucide-react';
import api from '../services/api';
import { useStore } from '../store/useStore';
import type { Product } from '../components/ProductCard';

export function ProductOverview() {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeImage, setActiveImage] = useState(0);

    const { addItem, currency } = useStore();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setIsLoading(true);
                const response = await api.get<Product>(`/products/${id}`);
                setProduct(response.data);
            } catch (err) {
                console.error('Failed to fetch product', err);
                setError('Failed to load product details.');
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchProduct();
    }, [id]);

    const getCurrencySymbol = (code: string) => {
        switch (code) {
            case 'EUR': return '€';
            case 'GBP': return '£';
            default: return '$';
        }
    };

    const handleAddToCart = () => {
        if (!product) return;
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400',
        });
    };

    if (isLoading) {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center text-primary-600">
                <Loader2 className="h-10 w-10 animate-spin" />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <p className="text-xl text-red-600">{error || 'Product not found'}</p>
                <Link to="/" className="mt-4 flex items-center gap-2 text-primary-600 hover:text-primary-800">
                    <ArrowLeft className="h-4 w-4" /> Back to Shop
                </Link>
            </div>
        );
    }

    // Calculate Average Rating manually if not provided
    // The API already includes reviews but we might need to parse it if avgRating isn't top-level
    const avgRating = product.avgRating || 5.0;

    return (
        <div className="animate-fade-in mx-auto max-w-6xl">
            <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary-600">
                <ArrowLeft className="h-4 w-4" /> Back to Products
            </Link>

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                {/* Image Gallery */}
                <div className="flex flex-col gap-4">
                    <div className="aspect-square w-full overflow-hidden rounded-3xl bg-gray-100 ring-1 ring-gray-200">
                        <img
                            src={product.images[activeImage] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400'}
                            alt={product.name}
                            className="h-full w-full object-cover object-center"
                        />
                    </div>
                    {/* Thumbnails */}
                    {product.images.length > 1 && (
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all ${activeImage === idx ? 'border-primary-500 ring-2 ring-primary-500 ring-offset-2' : 'border-transparent opacity-70 hover:opacity-100'
                                        }`}
                                >
                                    <img src={img} alt="" className="h-full w-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="flex flex-col pt-4">
                    <div className="flex items-center gap-3">
                        {product.type === 'DIGITAL' ? (
                            <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold tracking-wide text-blue-800 uppercase">
                                Digital Artifact
                            </span>
                        ) : (
                            <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-800 uppercase">
                                Physical Goods
                            </span>
                        )}

                        <div className="flex items-center gap-1 text-amber-500">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="text-sm font-medium text-gray-700">{avgRating.toFixed(1)}</span>
                        </div>
                    </div>

                    <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                        {product.name}
                    </h1>

                    <p className="mt-4 text-3xl font-black text-primary-600">
                        {getCurrencySymbol(currency)}{product.price.toFixed(2)}
                    </p>

                    <div className="mt-8">
                        <h3 className="text-sm font-medium text-gray-900">Description</h3>
                        <div className="mt-4 prose prose-sm text-gray-500">
                            <p>{product.description}</p>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-2">
                        {product.tags.map(tag => (
                            <span key={tag} className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <div className="mt-10 border-t border-gray-100 pt-10 flex gap-4">
                        <button
                            onClick={handleAddToCart}
                            className="flex max-w-xs flex-1 items-center justify-center rounded-full bg-primary-600 px-8 py-4 text-base font-semibold text-white hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all shadow-xl shadow-primary-500/20"
                        >
                            <ShoppingBag className="mr-2 h-5 w-5" />
                            Add to cart
                        </button>
                    </div>

                    {/* Support / Assurances */}
                    <div className="mt-8 flex flex-col gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-3">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            Secure payment via Stripe
                        </div>
                        <div className="flex items-center gap-3">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                            </svg>
                            Quality guaranteed
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
