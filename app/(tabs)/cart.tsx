import CashPaymentModal from '@/src/features/cart/components/CashPaymentModal';
import PaymentMethodModal from '@/src/features/cart/components/PaymentMethodModal';
import { useCart } from '@/src/features/cart/context/CartContext';
import { CartItem } from '@/src/features/cart/types/cart.types';
import { useHistory } from '@/src/features/history/context/HistoryContext';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function Cart() {
    const {
        cartItems,
        updateQuantity,
        removeFromCart,
        clearCart,
        getTotalPrice,
        getTotalItems,
    } = useCart();

    const { addTransaction } = useHistory();

    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showCashPaymentModal, setShowCashPaymentModal] = useState(false);

    const formatPrice = (price: number) => {
        return `Rp ${price.toLocaleString('id-ID')}`;
    };

    const handleRemoveItem = (productId: number) => {
        removeFromCart(productId);
    };

    const handleClearCart = () => {
        Alert.alert(
            'Kosongkan Keranjang',
            'Apakah Anda yakin ingin menghapus semua item dari keranjang?',
            [
                { text: 'Batal', style: 'cancel' },
                {
                    text: 'Kosongkan',
                    style: 'destructive',
                    onPress: () => clearCart(),
                },
            ]
        );
    };

    const handleCheckout = () => {
        setShowPaymentModal(true);
    };

    const handlePaymentMethodSelect = (method: string) => {
        setShowPaymentModal(false);
        if (method === 'Tunai') {
            setShowCashPaymentModal(true);
        } else {
            Alert.alert(
                'Konfirmasi Pembayaran',
                `Metode Pembayaran: ${method}\nTotal: ${formatPrice(getTotalPrice())}\n\nProses pembayaran akan segera diimplementasikan!`,
                [{ text: 'OK' }]
            );
        }
    };

    const handleCashPaymentSuccess = async (paidAmount: number, change: number) => {
        setShowCashPaymentModal(false);

        // Save transaction to history before clearing cart
        try {
            await addTransaction({
                items: [...cartItems],
                totalAmount: getTotalPrice(),
                paidAmount,
                change,
                paymentMethod: 'Tunai',
            });
        } catch (error) {
            console.error('Error saving transaction:', error);
        }

        clearCart();
    };

    const handleCloseCashPaymentModal = () => {
        setShowCashPaymentModal(false);
    };

    const handleCloseModal = () => {
        setShowPaymentModal(false);
    };

    const renderCartItem = ({ item }: { item: CartItem }) => (
        <View style={styles.cartItem}>
            <Image
                source={{ uri: item.product.image }}
                style={styles.productImage}
                resizeMode="cover"
            />
            <View style={styles.itemDetails}>
                <Text style={styles.productName} numberOfLines={2}>
                    {item.product.name}
                </Text>
                <Text style={styles.productPrice}>
                    {formatPrice(item.product.price)}
                </Text>
                <Text style={styles.subtotal}>
                    Subtotal: {formatPrice(item.product.price * item.quantity)}
                </Text>
            </View>
            <View style={styles.itemActions}>
                <View style={styles.quantityContainer}>
                    <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                        }
                    >
                        <Ionicons name="remove" size={18} color="#6366F1" />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                        }
                    >
                        <Ionicons name="add" size={18} color="#6366F1" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() =>
                        handleRemoveItem(item.product.id)
                    }
                >
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
            </View>
        </View>
    );

    if (cartItems.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Ionicons name="cart-outline" size={80} color="#CBD5E1" />
                <Text style={styles.emptyTitle}>Keranjang Kosong</Text>
                <Text style={styles.emptySubtitle}>
                    Tambahkan produk dari halaman Products
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.headerTitle}>Keranjang Belanja</Text>
                    <Text style={styles.headerSubtitle}>
                        {getTotalItems()} item
                    </Text>
                </View>
                <TouchableOpacity
                    style={styles.clearButton}
                    onPress={handleClearCart}
                >
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                    <Text style={styles.clearButtonText}>Kosongkan</Text>
                </TouchableOpacity>
            </View>

            {/* Cart Items */}
            <FlatList
                data={cartItems}
                renderItem={renderCartItem}
                keyExtractor={(item) => item.product.id.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />

            {/* Footer - Summary & Checkout */}
            <View style={styles.footer}>
                <View style={styles.summaryContainer}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Total Item:</Text>
                        <Text style={styles.summaryValue}>
                            {getTotalItems()} item
                        </Text>
                    </View>
                    <View style={styles.summaryDivider} />
                    <View style={styles.summaryRow}>
                        <Text style={styles.totalLabel}>Total Harga:</Text>
                        <Text style={styles.totalValue}>
                            {formatPrice(getTotalPrice())}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.checkoutButton}
                    onPress={handleCheckout}
                    activeOpacity={0.8}
                >
                    <Text style={styles.checkoutButtonText}>
                        Lanjut ke Pembayaran
                    </Text>
                    <Ionicons
                        name="arrow-forward"
                        size={20}
                        color="#FFFFFF"
                    />
                </TouchableOpacity>
            </View>

            <PaymentMethodModal
                visible={showPaymentModal}
                onClose={handleCloseModal}
                onSelectPayment={handlePaymentMethodSelect}
                totalAmount={getTotalPrice()}
            />

            <CashPaymentModal
                visible={showCashPaymentModal}
                onClose={handleCloseCashPaymentModal}
                onPaymentSuccess={handleCashPaymentSuccess}
                totalAmount={getTotalPrice()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 32,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1E293B',
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#64748B',
        textAlign: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    headerLeft: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#64748B',
    },
    clearButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#FEE2E2',
        borderRadius: 8,
    },
    clearButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#EF4444',
        marginLeft: 4,
    },
    listContent: {
        padding: 16,
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        elevation: 2,
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: '#E2E8F0',
    },
    itemDetails: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
    },
    productName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 4,
    },
    productPrice: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 4,
    },
    subtotal: {
        fontSize: 15,
        fontWeight: '700',
        color: '#6366F1',
    },
    itemActions: {
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginLeft: 8,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        borderRadius: 8,
        padding: 4,
    },
    quantityButton: {
        width: 28,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 6,
    },
    quantityText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1E293B',
        marginHorizontal: 12,
        minWidth: 20,
        textAlign: 'center',
    },
    removeButton: {
        padding: 8,
        backgroundColor: '#FEE2E2',
        borderRadius: 8,
    },
    footer: {
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        padding: 16,
    },
    summaryContainer: {
        marginBottom: 16,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 15,
        color: '#64748B',
    },
    summaryValue: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1E293B',
    },
    summaryDivider: {
        height: 1,
        backgroundColor: '#E2E8F0',
        marginVertical: 12,
    },
    totalLabel: {
        fontSize: 17,
        fontWeight: '600',
        color: '#1E293B',
    },
    totalValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#6366F1',
    },
    checkoutButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#6366F1',
        paddingVertical: 16,
        borderRadius: 12,
        boxShadow: '0 4px 8px rgba(99, 102, 241, 0.3)',
        elevation: 4,
    },
    checkoutButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        marginRight: 8,
    },
});
