import { useHistory } from '@/src/features/history/context/HistoryContext';
import { Transaction } from '@/src/features/history/types/history.types';
import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { formatPrice } from '@/src/shared/utils/formatPrice';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function Dashboard() {
    const { transactions, getTransactions, isLoading } = useHistory();

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

    const dashboardStats = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayTransactions = transactions.filter((t) => {
            const transactionDate = new Date(t.createdAt);
            transactionDate.setHours(0, 0, 0, 0);
            return transactionDate.getTime() === today.getTime();
        });

        const totalRevenue = transactions.reduce((sum, t) => sum + t.totalAmount, 0);
        const todayRevenue = todayTransactions.reduce((sum, t) => sum + t.totalAmount, 0);
        const averageTransaction = transactions.length > 0 ? totalRevenue / transactions.length : 0;

        // Get transactions for last 7 days
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);

            const dayTransactions = transactions.filter((t) => {
                const transactionDate = new Date(t.createdAt);
                transactionDate.setHours(0, 0, 0, 0);
                return transactionDate.getTime() === date.getTime();
            });

            last7Days.push({
                date: date.toLocaleDateString('id-ID', { weekday: 'short' }),
                count: dayTransactions.length,
                revenue: dayTransactions.reduce((sum, t) => sum + t.totalAmount, 0),
            });
        }

        // Get top selling products
        const productSales: { [key: string]: { name: string; quantity: number; revenue: number } } = {};
        transactions.forEach((t) => {
            t.items.forEach((item) => {
                if (!productSales[item.product.id]) {
                    productSales[item.product.id] = {
                        name: item.product.name,
                        quantity: 0,
                        revenue: 0,
                    };
                }
                productSales[item.product.id].quantity += item.quantity;
                productSales[item.product.id].revenue += item.product.price * item.quantity;
            });
        });

        const topProducts = Object.values(productSales)
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5);

        return {
            totalRevenue,
            todayRevenue,
            totalTransactions: transactions.length,
            todayTransactions: todayTransactions.length,
            averageTransaction,
            last7Days,
            topProducts,
            recentTransactions: transactions.slice(0, 3),
        };
    }, [transactions]);

    const StatCard = ({
        icon,
        iconColor,
        iconBgColor,
        label,
        value,
        subValue,
    }: {
        icon: keyof typeof Ionicons.glyphMap;
        iconColor: string;
        iconBgColor: string;
        label: string;
        value: string;
        subValue?: string;
    }) => (
        <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: iconBgColor }]}>
                <Ionicons name={icon} size={24} color={iconColor} />
            </View>
            <Text style={styles.statLabel}>{label}</Text>
            <Text style={styles.statValue}>{value}</Text>
            {subValue && <Text style={styles.statSubValue}>{subValue}</Text>}
        </View>
    );

    const renderMiniChart = () => {
        const maxCount = Math.max(...dashboardStats.last7Days.map((d) => d.count), 1);

        return (
            <View style={styles.chartContainer}>
                <Text style={styles.sectionTitle}>Transaksi 7 Hari Terakhir</Text>
                <View style={styles.chart}>
                    {dashboardStats.last7Days.map((day, index) => (
                        <View key={index} style={styles.chartBar}>
                            <View style={styles.barContainer}>
                                <View
                                    style={[
                                        styles.bar,
                                        {
                                            height: `${(day.count / maxCount) * 100}%`,
                                            backgroundColor: day.count > 0 ? '#6366F1' : '#E2E8F0',
                                        },
                                    ]}
                                />
                            </View>
                            <Text style={styles.barLabel}>{day.date}</Text>
                            <Text style={styles.barValue}>{day.count}</Text>
                        </View>
                    ))}
                </View>
            </View>
        );
    };

    const renderTopProducts = () => {
        if (dashboardStats.topProducts.length === 0) {
            return null;
        }

        return (
            <View style={styles.topProductsContainer}>
                <Text style={styles.sectionTitle}>Produk Terlaris</Text>
                {dashboardStats.topProducts.map((product, index) => (
                    <View key={index} style={styles.topProductItem}>
                        <View style={styles.topProductRank}>
                            <Text style={styles.topProductRankText}>{index + 1}</Text>
                        </View>
                        <View style={styles.topProductInfo}>
                            <Text style={styles.topProductName} numberOfLines={1}>
                                {product.name}
                            </Text>
                            <Text style={styles.topProductSales}>
                                {product.quantity} terjual • {formatPrice(product.revenue)}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>
        );
    };

    const renderRecentTransactions = () => {
        if (dashboardStats.recentTransactions.length === 0) {
            return null;
        }

        return (
            <View style={styles.recentContainer}>
                <Text style={styles.sectionTitle}>Transaksi Terbaru</Text>
                {dashboardStats.recentTransactions.map((transaction: Transaction) => (
                    <View key={transaction.id} style={styles.recentItem}>
                        <View style={styles.recentIconContainer}>
                            <Ionicons name="receipt-outline" size={20} color="#6366F1" />
                        </View>
                        <View style={styles.recentInfo}>
                            <Text style={styles.recentId} numberOfLines={1}>
                                {transaction.id}
                            </Text>
                            <Text style={styles.recentDate}>
                                {formatDate(transaction.createdAt)}
                            </Text>
                        </View>
                        <Text style={styles.recentAmount}>
                            {formatPrice(transaction.totalAmount)}
                        </Text>
                    </View>
                ))}
            </View>
        );
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={isLoading}
                    onRefresh={getTransactions}
                    colors={['#6366F1']}
                />
            }
        >
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.greeting}>Selamat Datang 👋</Text>
                    <Text style={styles.headerTitle}>Dashboard ngePOS</Text>
                </View>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
                <StatCard
                    icon="wallet-outline"
                    iconColor="#6366F1"
                    iconBgColor="#EEF2FF"
                    label="Total Pendapatan"
                    value={formatPrice(dashboardStats.totalRevenue)}
                    subValue={`${dashboardStats.totalTransactions} transaksi`}
                />
                <StatCard
                    icon="today-outline"
                    iconColor="#059669"
                    iconBgColor="#D1FAE5"
                    label="Pendapatan Hari Ini"
                    value={formatPrice(dashboardStats.todayRevenue)}
                    subValue={`${dashboardStats.todayTransactions} transaksi`}
                />
                <StatCard
                    icon="stats-chart-outline"
                    iconColor="#F59E0B"
                    iconBgColor="#FEF3C7"
                    label="Rata-rata Transaksi"
                    value={formatPrice(dashboardStats.averageTransaction)}
                />
                <StatCard
                    icon="cart-outline"
                    iconColor="#EC4899"
                    iconBgColor="#FCE7F3"
                    label="Total Transaksi"
                    value={dashboardStats.totalTransactions.toString()}
                    subValue="semua waktu"
                />
            </View>

            {/* Mini Chart */}
            {renderMiniChart()}

            {/* Top Products */}
            {renderTopProducts()}

            {/* Recent Transactions */}
            {renderRecentTransactions()}

            {/* Empty State */}
            {transactions.length === 0 && !isLoading && (
                <View style={styles.emptyState}>
                    <Ionicons name="analytics-outline" size={64} color="#CBD5E1" />
                    <Text style={styles.emptyTitle}>Belum Ada Data</Text>
                    <Text style={styles.emptySubtitle}>
                        Mulai transaksi untuk melihat statistik di dashboard
                    </Text>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    contentContainer: {
        paddingBottom: 32,
    },
    header: {
        backgroundColor: '#6366F1',
        paddingTop: 16,
        paddingBottom: 32,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    headerContent: {
        marginTop: 8,
    },
    greeting: {
        fontSize: 16,
        color: '#C7D2FE',
        marginBottom: 4,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        marginTop: -16,
        gap: 12,
    },
    statCard: {
        width: '48%',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    statIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    statLabel: {
        fontSize: 13,
        color: '#64748B',
        marginBottom: 4,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E293B',
    },
    statSubValue: {
        fontSize: 12,
        color: '#94A3B8',
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 16,
    },
    chartContainer: {
        marginHorizontal: 16,
        marginTop: 24,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    chart: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 120,
    },
    chartBar: {
        flex: 1,
        alignItems: 'center',
    },
    barContainer: {
        width: 32,
        height: 80,
        backgroundColor: '#F1F5F9',
        borderRadius: 8,
        justifyContent: 'flex-end',
        overflow: 'hidden',
    },
    bar: {
        width: '100%',
        borderRadius: 8,
        minHeight: 4,
    },
    barLabel: {
        fontSize: 11,
        color: '#64748B',
        marginTop: 8,
    },
    barValue: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1E293B',
        marginTop: 2,
    },
    topProductsContainer: {
        marginHorizontal: 16,
        marginTop: 24,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    topProductItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    topProductRank: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#EEF2FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    topProductRankText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#6366F1',
    },
    topProductInfo: {
        flex: 1,
    },
    topProductName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1E293B',
    },
    topProductSales: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 2,
    },
    recentContainer: {
        marginHorizontal: 16,
        marginTop: 24,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    recentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    recentIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#EEF2FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    recentInfo: {
        flex: 1,
    },
    recentId: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1E293B',
    },
    recentDate: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 2,
    },
    recentAmount: {
        fontSize: 14,
        fontWeight: '700',
        color: '#6366F1',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 48,
        marginHorizontal: 16,
        marginTop: 24,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E293B',
        marginTop: 16,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#64748B',
        marginTop: 8,
        textAlign: 'center',
        paddingHorizontal: 32,
    },
});