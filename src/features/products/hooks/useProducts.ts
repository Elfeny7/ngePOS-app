import { dummyProducts } from '@/src/features/products/dummy/dummy.products';
import { Product, UseProductsReturn } from '@/src/features/products/types/product.types';
import { useEffect, useState } from 'react';

export function useProducts(): UseProductsReturn {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                await new Promise(resolve => setTimeout(resolve, 500));
                setProducts(dummyProducts);
                setError(null);
            } catch (err) {
                console.log(err);
                setError('Failed to fetch products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return { products, loading, error };
}
