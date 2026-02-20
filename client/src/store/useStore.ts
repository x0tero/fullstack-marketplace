import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string; // matches Product ID
    name: string;
    price: number;
    quantity: number;
    image: string;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    currency: string;
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    setIsOpen: (isOpen: boolean) => void;
    setCurrency: (currency: string) => void;
    totalPrice: () => number;
}

export const useStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            currency: 'USD',
            addItem: (newItem) => {
                set((state) => {
                    const existingItem = state.items.find((item) => item.id === newItem.id);
                    if (existingItem) {
                        return {
                            items: state.items.map((item) =>
                                item.id === newItem.id
                                    ? { ...item, quantity: item.quantity + newItem.quantity }
                                    : item
                            ),
                        };
                    }
                    return { items: [...state.items, newItem] };
                });
            },
            removeItem: (id) => {
                set((state) => ({
                    items: state.items.filter((item) => item.id !== id),
                }));
            },
            updateQuantity: (id, quantity) => {
                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
                    ),
                }));
            },
            clearCart: () => set({ items: [] }),
            setIsOpen: (isOpen) => set({ isOpen }),
            setCurrency: (currency) => set({ currency }),
            totalPrice: () => {
                return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
            },
        }),
        {
            name: 'marketplace-storage', // name of item in the storage (must be unique)
            partialize: (state) => ({ items: state.items, currency: state.currency }), // selectively persist fields
        }
    )
);
