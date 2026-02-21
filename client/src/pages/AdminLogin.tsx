import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Loader2 } from 'lucide-react';
import api from '../services/api';
import { useStore } from '../store/useStore';

export function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useStore();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await api.post('/auth/admin/login', { email, password });

            if (response.data.token) {
                setUser(response.data.user, response.data.token);
                // Successful login, navigate to dashboard
                navigate('/admin/dashboard');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-[80vh] flex-col items-center justify-center p-4">
            <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-gray-100 animate-fade-in-up">

                <div className="bg-primary-900 px-8 py-10 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-800 mb-6 shadow-inner shadow-primary-950/50">
                        <Lock className="h-8 w-8 text-primary-300" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Admin Secure Area</h1>
                    <p className="mt-2 text-sm text-primary-200">Sign in to manage products and orders.</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleLogin} className="flex flex-col gap-6">

                        {error && (
                            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 ring-1 ring-red-200">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-gray-900" htmlFor="email">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-2 block w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 shadow-sm focus:border-primary-500 focus:bg-white focus:ring-primary-500 transition-colors sm:text-sm"
                                placeholder="admin@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-900" htmlFor="password">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-2 block w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 shadow-sm focus:border-primary-500 focus:bg-white focus:ring-primary-500 transition-colors sm:text-sm"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="mt-4 flex w-full items-center justify-center rounded-xl bg-primary-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-70 transition-all"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Authenticating...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}
