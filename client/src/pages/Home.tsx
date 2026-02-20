import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PackageX, Loader2 } from 'lucide-react';
import api from '../services/api';
import { ProductCard } from '../components/ProductCard';
import type { Product } from '../components/ProductCard';

export function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Real-time search from URL or Local state
    const [searchParams, setSearchParams] = useSearchParams();
    const search = searchParams.get('search') || '';
    const tag = searchParams.get('tag') || '';

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                // Build query string
                const params = new URLSearchParams();
                if (search) params.append('search', search);
                if (tag) params.append('tag', tag);

                const response = await api.get<Product[]>(`/products?${params.toString()}`);
                setProducts(response.data);
            } catch (err) {
                console.error('Failed to fetch products', err);
                setError('Failed to load products. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        // Debounce search slightly for better performance
        const timeoutId = setTimeout(() => {
            fetchProducts();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [search, tag]);

    // Categories placeholder for tags
    const POPULAR_TAGS = ['Electronics', 'Digital', 'Home', 'Office', 'Accessories', 'Template', 'Web Design'];

    const handleTagClick = (selectedTag: string) => {
        if (tag === selectedTag) {
            searchParams.delete('tag');
        } else {
            searchParams.set('tag', selectedTag);
        }
        setSearchParams(searchParams);
    };

    return (
        <div className="flex flex-col gap-8 pb-12">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-900 to-primary-700 px-6 py-16 sm:px-12 sm:py-24 animate-fade-in-up">
                <div className="relative z-10 mx-auto max-w-2xl text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                        Discover Premium <span className="text-primary-300">Digital & Physical</span> Goods
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-primary-100">
                        Carefully curated assets, components, and physical products to elevate your next project or workspace.
                    </p>
                </div>
                {/* Decorative background shapes */}
                <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary-600 opacity-20 blur-3xl" />
                <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-primary-500 opacity-20 blur-3xl" />
            </section>

            {/* Filters / Tags */}
            <section className="flex flex-wrap items-center justify-center gap-2">
                {POPULAR_TAGS.map((t) => (
                    <button
                        key={t}
                        onClick={() => handleTagClick(t)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${tag === t
                            ? 'bg-primary-600 text-white shadow-md'
                            : 'bg-white text-gray-600 hover:bg-primary-50 hover:text-primary-600 ring-1 ring-inset ring-gray-200'
                            }`}
                    >
                        {t}
                    </button>
                ))}
            </section>

            {/* Main Content Area */}
            <section>
                {error && (
                    <div className="rounded-xl bg-red-50 p-4 text-center text-red-600 ring-1 ring-inset ring-red-100">
                        {error}
                    </div>
                )}

                {isLoading ? (
                    <div className="flex min-h-[400px] flex-col items-center justify-center text-primary-600">
                        <Loader2 className="h-10 w-10 animate-spin" />
                        <p className="mt-4 font-medium">Loading amazing products...</p>
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center">
                        <div className="rounded-full bg-gray-50 p-4">
                            <PackageX className="h-10 w-10 text-gray-400" />
                        </div>
                        <h3 className="mt-4 text-lg font-bold text-gray-900">No products found</h3>
                        <p className="mt-2 text-sm text-gray-500 max-w-sm">
                            We couldn't find anything matching your current filters. Try adjusting your search or selecting a different category.
                        </p>
                        {(search || tag) && (
                            <button
                                onClick={() => setSearchParams({})}
                                className="mt-6 font-semibold text-primary-600 hover:text-primary-500"
                            >
                                Clear all filters
                            </button>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}
