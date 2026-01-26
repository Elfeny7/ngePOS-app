import FloatingCartPopup from '@/src/features/cart/components/FloatingCartPopup';
import { useCart } from '@/src/features/cart/context/CartContext';
import { useProducts } from '@/src/features/products/hooks/useProducts';
import { Product } from '@/src/features/products/types/product.types';
import { formatPrice } from '@/src/shared/utils/formatPrice';
import { useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function Products() {
    const { products, loading, error } = useProducts();
    const { addToCart, getTotalItems } = useCart();
    const [isCartExpanded, setIsCartExpanded] = useState(false);

    const handleProductPress = (product: Product) => {
        addToCart(product);
        console.log('Product added to cart:', product.name);
    };

    const toggleCart = () => {
        setIsCartExpanded(!isCartExpanded);
    };

    const renderProduct = ({ item }: { item: Product }) => (
        <TouchableOpacity
            style={styles.productCard}
            onPress={() => handleProductPress(item)}
            activeOpacity={0.7}
        >
            <Image
                source={{ uri: item.image }}
                style={styles.productImage}
                resizeMode="cover"
            />
            <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>
                    {item.name}
                </Text>
                <Text style={styles.productPrice}>
                    {formatPrice(item.price)}
                </Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#6366F1" />
                <Text style={styles.loadingText}>Loading products...</Text>
            </View>
        );
    }

    if (products.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>No products found</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    const hasItemsInCart = getTotalItems() > 0;

    return (
        <View style={styles.container}>
            <FlatList
                data={products}
                renderItem={renderProduct}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={[
                    styles.listContent,
                    hasItemsInCart && styles.listContentWithCart
                ]}
                showsVerticalScrollIndicator={false}
            />
            <FloatingCartPopup
                visible={isCartExpanded}
                onToggle={toggleCart}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#64748B',
    },
    errorText: {
        fontSize: 16,
        color: '#EF4444',
    },
    listContent: {
        padding: 12,
    },
    listContentWithCart: {
        paddingBottom: 100,
    },
    row: {
        justifyContent: 'space-between',
    },
    productCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginBottom: 12,
        width: '48%',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        elevation: 3,
        overflow: 'hidden',
    },
    productImage: {
        width: '100%',
        height: 120,
        backgroundColor: '#E2E8F0',
    },
    productInfo: {
        padding: 12,
    },
    productName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 6,
    },
    productPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: '#6366F1',
    },
});