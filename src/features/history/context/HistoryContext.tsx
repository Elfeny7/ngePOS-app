import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { HistoryContextType, Transaction } from '../types/history.types';

const HISTORY_STORAGE_KEY = '@ngePOS_transaction_history';

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider = ({ children }: { children: ReactNode }) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getTransactions();
    }, []);

    const getTransactions = async () => {
        try {
            setIsLoading(true);
            const storedHistory = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
            if (storedHistory) {
                const parsedHistory: Transaction[] = JSON.parse(storedHistory);
                // Sort by date descending (newest first)
                parsedHistory.sort((a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setTransactions(parsedHistory);
            }
        } catch (error) {
            console.error('Error loading transaction history:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'createdAt'>) => {
        try {
            const newTransaction: Transaction = {
                ...transactionData,
                id: `TRX-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                createdAt: new Date().toISOString(),
            };

            const updatedTransactions = [newTransaction, ...transactions];
            await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedTransactions));
            setTransactions(updatedTransactions);
        } catch (error) {
            console.error('Error saving transaction:', error);
            throw error;
        }
    };

    const clearHistory = async () => {
        try {
            await AsyncStorage.removeItem(HISTORY_STORAGE_KEY);
            setTransactions([]);
        } catch (error) {
            console.error('Error clearing history:', error);
            throw error;
        }
    };

    return (
        <HistoryContext.Provider
            value={{
                transactions,
                addTransaction,
                getTransactions,
                clearHistory,
                isLoading,
            }}
        >
            {children}
        </HistoryContext.Provider>
    );
};

export const useHistory = () => {
    const context = useContext(HistoryContext);
    if (context === undefined) {
        throw new Error('useHistory must be used within a HistoryProvider');
    }
    return context;
};
