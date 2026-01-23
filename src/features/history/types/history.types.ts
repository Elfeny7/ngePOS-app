import { CartItem } from '@/src/features/cart/types/cart.types';

export interface Transaction {
    id: string;
    items: CartItem[];
    totalAmount: number;
    paidAmount: number;
    change: number;
    paymentMethod: string;
    createdAt: string;
}

export interface HistoryContextType {
    transactions: Transaction[];
    addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => Promise<void>;
    getTransactions: () => Promise<void>;
    clearHistory: () => Promise<void>;
    isLoading: boolean;
}
