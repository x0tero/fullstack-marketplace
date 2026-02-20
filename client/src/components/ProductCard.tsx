import { ShoppingBag } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Link } from 'react-router-dom';

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    type: 'PHYSICAL' | 'DIGITAL';
    images: string[];
    tags: string[];
    avgRating: number;
    currency: string;
}

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { addItem, currency } = useStore();

    const getCurrencySymbol = (code: string) => {
        switch (code) {
            case 'EUR': return '€';
            case 'GBP': return '£';
            default: return '$';
        }
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400',
        });
    };

    return (
        <Link
            to={`/products/${product.id}`}
            className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-lg hover:ring-primary-500"
        >
            {/* Thumbnail Container */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                <img
                    src={product.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400'}
                    alt={product.name}
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.type === 'DIGITAL' && (
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 backdrop-blur-md">
                            Digital
                        </span>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-4">
                    <h3 className="text-base font-bold text-gray-900 line-clamp-2">
                        {product.name}
                    </h3>
                    <p className="flex-shrink-0 text-lg font-black text-primary-600">
                        {getCurrencySymbol(currency)}{product.price.toFixed(2)}
                    </p>
                </div>

                <p className="mt-2 text-sm text-gray-500 line-clamp-2 flex-1">
                    {product.description}
                </p>

                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        {product.avgRating > 0 ? (
                            <span className="flex items-center gap-1 text-sm font-medium text-amber-500">
                                ★ {product.avgRating.toFixed(1)}
                            </span>
                        ) : (
                            <span className="text-sm text-gray-400">No reviews</span>
                        )}
                    </div>

                    <button
                        onClick={handleAddToCart}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 text-gray-600 ring-1 ring-gray-200 transition-all hover:bg-primary-500 hover:text-white hover:ring-primary-500"
                    >
                        <ShoppingBag className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </Link>
    );
}
