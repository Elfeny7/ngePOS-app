export interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
}

export interface UseProductsReturn {
    products: Product[];
    loading: boolean;
    error: string | null;
}

