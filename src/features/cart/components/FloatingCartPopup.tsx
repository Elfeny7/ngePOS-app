import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Animated,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types/cart.types';

interface FloatingCartPopupProps {
    visible: boolean;
    onToggle: () => void;
}

const FloatingCartPopup: React.FC<FloatingCartPopupProps> = ({
    visible,
    onToggle,
}) => {
    const router = useRouter();
    const {
        cartItems,
        getTotalItems,
        getTotalPrice,
        updateQuantity,
        removeFromCart,
    } = useCart();

    const formatPrice = (price: number) => {
        return `Rp ${price.toLocaleString('id-ID')}`;
    };

    const handleGoToCart = () => {
        router.push('/cart');
    };

    const renderCartItem = (item: CartItem) => (
        <View key={item.product.id} style={styles.cartItem}>
            <View style={styles.cartItemInfo}>
                <Text style={styles.cartItemName} numberOfLines={1}>
                    {item.product.name}
                </Text>
                <Text style={styles.cartItemPrice}>
                    {formatPrice(item.product.price * item.quantity)}
                </Text>
            </View>
            <View style={styles.quantityContainer}>
                <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                    }
                >
                    <Ionicons name="remove" size={16} color="#6366F1" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                    }
                >
                    <Ionicons name="add" size={16} color="#6366F1" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeFromCart(item.product.id)}
                >
                    <Ionicons name="trash-outline" size={16} color="#EF4444" />
                </TouchableOpacity>
            </View>
        </View>
    );

    const totalItems = getTotalItems();

    if (totalItems === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            {/* Collapsed View - Floating Bar */}
            {!visible && (
                <TouchableOpacity
                    style={styles.floatingBar}
                    onPress={onToggle}
                    activeOpacity={0.9}
                >
                    <View style={styles.floatingBarLeft}>
                        <View style={styles.cartIconContainer}>
                            <Ionicons name="cart" size={24} color="#FFFFFF" />
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>
                                    {totalItems}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.floatingBarInfo}>
                            <Text style={styles.floatingBarTitle}>
                                {totalItems} item(s) in cart
                            </Text>
                            <Text style={styles.floatingBarSubtitle}>
                                Tap to view details
                            </Text>
                        </View>
                    </View>
                    <Text style={styles.floatingBarTotal}>
                        {formatPrice(getTotalPrice())}
                    </Text>
                </TouchableOpacity>
            )}

            {/* Expanded View - Cart Popup */}
            {visible && (
                <Animated.View style={styles.popup}>
                    {/* Header */}
                    <View style={styles.popupHeader}>
                        <View style={styles.popupHeaderLeft}>
                            <Ionicons name="cart" size={24} color="#6366F1" />
                            <Text style={styles.popupTitle}>
                                Cart ({totalItems})
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={onToggle}
                            style={styles.closeButton}
                        >
                            <Ionicons
                                name="chevron-down"
                                size={24}
                                color="#64748B"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Cart Items */}
                    <ScrollView
                        style={styles.cartItemsContainer}
                        showsVerticalScrollIndicator={false}
                    >
                        {cartItems.map(renderCartItem)}
                    </ScrollView>

                    {/* Footer */}
                    <View style={styles.popupFooter}>
                        <View style={styles.totalContainer}>
                            <Text style={styles.totalLabel}>Total</Text>
                            <Text style={styles.totalAmount}>
                                {formatPrice(getTotalPrice())}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.checkoutButton}
                            onPress={handleGoToCart}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.checkoutButtonText}>
                                Go to Cart
                            </Text>
                            <Ionicons
                                name="arrow-forward"
                                size={20}
                                color="#FFFFFF"
                            />
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    // Floating Bar Styles
    floatingBar: {
        backgroundColor: '#6366F1',
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#6366F1',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    floatingBarLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cartIconContainer: {
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: '#EF4444',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
    },
    floatingBarInfo: {
        marginLeft: 12,
    },
    floatingBarTitle: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    floatingBarSubtitle: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 12,
    },
    floatingBarTotal: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
    },
    // Popup Styles
    popup: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: 400,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 12,
    },
    popupHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    popupHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    popupTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E293B',
        marginLeft: 8,
    },
    closeButton: {
        padding: 4,
    },
    cartItemsContainer: {
        maxHeight: 200,
        paddingHorizontal: 20,
    },
    cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    cartItemInfo: {
        flex: 1,
        marginRight: 12,
    },
    cartItemName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 4,
    },
    cartItemPrice: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6366F1',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: '#EEF2FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1E293B',
        marginHorizontal: 12,
        minWidth: 20,
        textAlign: 'center',
    },
    removeButton: {
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: '#FEF2F2',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    popupFooter: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    totalLabel: {
        fontSize: 16,
        color: '#64748B',
    },
    totalAmount: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1E293B',
    },
    checkoutButton: {
        backgroundColor: '#6366F1',
        borderRadius: 12,
        paddingVertical: 14,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkoutButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        marginRight: 8,
    },
});

export default FloatingCartPopup;
