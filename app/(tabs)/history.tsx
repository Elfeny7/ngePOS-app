import { useHistory } from '@/src/features/history/context/HistoryContext';
import { Transaction } from '@/src/features/history/types/history.types';
import { Ionicons } from '@expo/vector-icons';
import { Alert, FlatList, Image, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function History() {
    const { transactions, clearHistory, getTransactions, isLoading } = useHistory();

    const formatPrice = (price: number) => {
        return `Rp ${price.toLocaleString('id-ID')}`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleClearHistory = () => {
        Alert.alert(
            'Hapus Semua Histori',
            'Apakah Anda yakin ingin menghapus semua histori transaksi?',
            [
                { text: 'Batal', style: 'cancel' },
                {
                    text: 'Hapus',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await clearHistory();
                        } catch (error) {
                            Alert.alert('Error', 'Gagal menghapus histori');
                        }
                    },
                },
            ]
        );
    };

    const renderTransactionItem = ({ item }: { item: Transaction }) => (
        <View style={styles.transactionCard}>
            <View style={styles.transactionHeader}>
                <View style={styles.transactionIdContainer}>
                    <Ionicons name="receipt-outline" size={18} color="#6366F1" />
                    <Text style={styles.transactionId}>{item.id}</Text>
                </View>
                <Text style={styles.transactionDate}>{formatDate(item.createdAt)}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.itemsContainer}>
                {item.items.slice(0, 3).map((cartItem, index) => (
                    <View key={index} style={styles.itemRow}>
                        <Image
                            source={{ uri: cartItem.product.image }}
                            style={styles.itemImage}
                            resizeMode="cover"
                        />
                        <View style={styles.itemInfo}>
                            <Text style={styles.itemName} numberOfLines={1}>
                                {cartItem.product.name}
                            </Text>
                            <Text style={styles.itemQty}>
                                {cartItem.quantity} x {formatPrice(cartItem.product.price)}
                            </Text>
                        </View>
                    </View>
                ))}
                {item.items.length > 3 && (
                    <Text style={styles.moreItems}>
                        +{item.items.length - 3} item lainnya
                    </Text>
                )}
            </View>

            <View style={styles.divider} />

            <View style={styles.paymentInfo}>
                <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>Metode Pembayaran</Text>
                    <View style={styles.paymentMethodBadge}>
                        <Ionicons name="cash-outline" size={14} color="#059669" />
                        <Text style={styles.paymentMethodText}>{item.paymentMethod}</Text>
                    </View>
                </View>
                <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>Total</Text>
                    <Text style={styles.totalValue}>{formatPrice(item.totalAmount)}</Text>
                </View>
                <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>Dibayar</Text>
                    <Text style={styles.paymentValue}>{formatPrice(item.paidAmount)}</Text>
                </View>
                <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>Kembalian</Text>
                    <Text style={styles.changeValue}>{formatPrice(item.change)}</Text>
                </View>
            </View>
        </View>
    );

    if (transactions.length === 0 && !isLoading) {
        return (
            <View style={styles.emptyContainer}>
                <Ionicons name="receipt-outline" size={80} color="#CBD5E1" />
                <Text style={styles.emptyTitle}>Belum Ada Transaksi</Text>
                <Text style={styles.emptySubtitle}>
                    Histori transaksi Anda akan muncul di sini
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.headerTitle}>Histori Transaksi</Text>
                    <Text style={styles.headerSubtitle}>
                        {transactions.length} transaksi
                    </Text>
                </View>
                {transactions.length > 0 && (
                    <TouchableOpacity
                        style={styles.clearButton}
                        onPress={handleClearHistory}
                    >
                        <Ionicons name="trash-outline" size={20} color="#EF4444" />
                        <Text style={styles.clearButtonText}>Hapus Semua</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Transaction List */}
            <FlatList
                data={transactions}
                renderItem={renderTransactionItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading}
                        onRefresh={getTransactions}
                        colors={['#6366F1']}
                    />
                }
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
    transactionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    transactionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    transactionIdContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    transactionId: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6366F1',
        marginLeft: 6,
    },
    transactionDate: {
        fontSize: 12,
        color: '#64748B',
    },
    divider: {
        height: 1,
        backgroundColor: '#E2E8F0',
        marginVertical: 12,
    },
    itemsContainer: {
        gap: 8,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemImage: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#E2E8F0',
    },
    itemInfo: {
        flex: 1,
        marginLeft: 12,
    },
    itemName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1E293B',
    },
    itemQty: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 2,
    },
    moreItems: {
        fontSize: 12,
        color: '#6366F1',
        fontWeight: '500',
        marginTop: 4,
    },
    paymentInfo: {
        gap: 8,
    },
    paymentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    paymentLabel: {
        fontSize: 14,
        color: '#64748B',
    },
    paymentMethodBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#D1FAE5',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 6,
    },
    paymentMethodText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#059669',
        marginLeft: 4,
    },
    totalValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#6366F1',
    },
    paymentValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1E293B',
    },
    changeValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#059669',
    },
});