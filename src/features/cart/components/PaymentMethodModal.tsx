import { Ionicons } from '@expo/vector-icons';
import { formatPrice } from '@/src/shared/utils/formatPrice';
import React from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface PaymentMethodModalProps {
    visible: boolean;
    onClose: () => void;
    onSelectPayment: (method: string) => void;
    totalAmount: number;
}

const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({
    visible,
    onClose,
    onSelectPayment,
    totalAmount,
}) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Pilih Metode Pembayaran</Text>
                        <TouchableOpacity
                            onPress={onClose}
                            style={styles.closeButton}
                        >
                            <Ionicons name="close" size={24} color="#64748B" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.modalBody}>
                        <Text style={styles.totalPaymentLabel}>Total Pembayaran:</Text>
                        <Text style={styles.totalPaymentValue}>
                            {formatPrice(totalAmount)}
                        </Text>

                        <View style={styles.paymentMethodsContainer}>
                            <TouchableOpacity
                                style={styles.paymentMethodButton}
                                onPress={() => onSelectPayment('Tunai')}
                                activeOpacity={0.7}
                            >
                                <View style={styles.paymentMethodIcon}>
                                    <Ionicons name="cash-outline" size={32} color="#6366F1" />
                                </View>
                                <View style={styles.paymentMethodInfo}>
                                    <Text style={styles.paymentMethodName}>Tunai</Text>
                                    <Text style={styles.paymentMethodDesc}>Pembayaran dengan uang tunai</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
                            </TouchableOpacity>

                            {/* Placeholder untuk metode pembayaran lain (coming soon) */}
                            <View style={[styles.paymentMethodButton, styles.disabledButton]}>
                                <View style={styles.paymentMethodIcon}>
                                    <Ionicons name="card-outline" size={32} color="#CBD5E1" />
                                </View>
                                <View style={styles.paymentMethodInfo}>
                                    <Text style={[styles.paymentMethodName, styles.disabledText]}>
                                        Kartu Debit/Kredit
                                    </Text>
                                    <Text style={styles.paymentMethodDesc}>Segera hadir</Text>
                                </View>
                            </View>

                            <View style={[styles.paymentMethodButton, styles.disabledButton]}>
                                <View style={styles.paymentMethodIcon}>
                                    <Ionicons name="qr-code-outline" size={32} color="#CBD5E1" />
                                </View>
                                <View style={styles.paymentMethodInfo}>
                                    <Text style={[styles.paymentMethodName, styles.disabledText]}>
                                        QRIS
                                    </Text>
                                    <Text style={styles.paymentMethodDesc}>Segera hadir</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default PaymentMethodModal;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        width: '100%',
        maxWidth: 500,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1E293B',
    },
    closeButton: {
        padding: 4,
    },
    modalBody: {
        padding: 20,
    },
    totalPaymentLabel: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 4,
    },
    totalPaymentValue: {
        fontSize: 28,
        fontWeight: '700',
        color: '#6366F1',
        marginBottom: 24,
    },
    paymentMethodsContainer: {
        gap: 12,
    },
    paymentMethodButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E2E8F0',
    },
    paymentMethodIcon: {
        width: 56,
        height: 56,
        backgroundColor: '#EEF2FF',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    paymentMethodInfo: {
        flex: 1,
    },
    paymentMethodName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 4,
    },
    paymentMethodDesc: {
        fontSize: 14,
        color: '#64748B',
    },
    disabledButton: {
        opacity: 0.5,
    },
    disabledText: {
        color: '#94A3B8',
    },
});
