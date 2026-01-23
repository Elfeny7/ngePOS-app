import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Animated,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface CashPaymentModalProps {
    visible: boolean;
    onClose: () => void;
    onPaymentSuccess: (paidAmount: number, change: number) => void;
    totalAmount: number;
}

const CashPaymentModal: React.FC<CashPaymentModalProps> = ({
    visible,
    onClose,
    onPaymentSuccess,
    totalAmount,
}) => {
    const [paidAmount, setPaidAmount] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [changeAmount, setChangeAmount] = useState(0);
    const [scaleAnim] = useState(new Animated.Value(0));

    const formatPrice = (price: number) => {
        return `Rp ${price.toLocaleString('id-ID')}`;
    };

    const formatInputPrice = (value: string) => {
        // Remove non-numeric characters
        const numericValue = value.replace(/[^0-9]/g, '');
        return numericValue;
    };

    const displayFormattedInput = (value: string) => {
        if (!value) return '';
        const num = parseInt(value, 10);
        if (isNaN(num)) return '';
        return num.toLocaleString('id-ID');
    };

    const handleInputChange = (text: string) => {
        const numericValue = formatInputPrice(text);
        setPaidAmount(numericValue);
        setError('');
    };

    const handleQuickAmount = (amount: number) => {
        setPaidAmount(amount.toString());
        setError('');
    };

    const getQuickAmounts = () => {
        const amounts: number[] = [];
        const roundedTotal = Math.ceil(totalAmount / 10000) * 10000;

        // Add exact amount if less than rounded
        if (totalAmount < roundedTotal) {
            amounts.push(totalAmount);
        }

        // Add rounded amounts
        amounts.push(roundedTotal);
        if (roundedTotal + 10000 <= totalAmount * 2) {
            amounts.push(roundedTotal + 10000);
        }
        if (roundedTotal + 20000 <= totalAmount * 2) {
            amounts.push(roundedTotal + 20000);
        }

        // Add common denominations
        const commonAmounts = [50000, 100000, 200000, 500000];
        for (const amount of commonAmounts) {
            if (amount >= totalAmount && !amounts.includes(amount)) {
                amounts.push(amount);
                if (amounts.length >= 4) break;
            }
        }

        return amounts.slice(0, 4);
    };

    const handlePayment = () => {
        const paid = parseInt(paidAmount, 10);

        if (!paidAmount || isNaN(paid)) {
            setError('Masukkan nominal pembayaran');
            return;
        }

        if (paid < totalAmount) {
            setError(`Nominal kurang. Minimal ${formatPrice(totalAmount)}`);
            return;
        }

        const change = paid - totalAmount;
        setChangeAmount(change);
        setShowSuccess(true);

        // Animate success icon
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            tension: 100,
            useNativeDriver: true,
        }).start();
    };

    const handleComplete = () => {
        const paid = parseInt(paidAmount, 10);
        onPaymentSuccess(paid, changeAmount);
        // Reset state
        setPaidAmount('');
        setError('');
        setShowSuccess(false);
        setChangeAmount(0);
        scaleAnim.setValue(0);
    };

    const handleClose = () => {
        setPaidAmount('');
        setError('');
        setShowSuccess(false);
        setChangeAmount(0);
        scaleAnim.setValue(0);
        onClose();
    };

    const renderPaymentInput = () => (
        <>
            <View style={styles.modalHeader}>
                <TouchableOpacity onPress={handleClose} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#64748B" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Pembayaran Tunai</Text>
                <View style={styles.placeholder} />
            </View>

            <View style={styles.modalBody}>
                <View style={styles.totalSection}>
                    <Text style={styles.totalLabel}>Total yang harus dibayar</Text>
                    <Text style={styles.totalValue}>{formatPrice(totalAmount)}</Text>
                </View>

                <View style={styles.inputSection}>
                    <Text style={styles.inputLabel}>Nominal Uang dari Customer</Text>
                    <View style={[styles.inputContainer, error ? styles.inputError : null]}>
                        <Text style={styles.currencyPrefix}>Rp</Text>
                        <TextInput
                            style={styles.input}
                            value={displayFormattedInput(paidAmount)}
                            onChangeText={handleInputChange}
                            placeholder="0"
                            placeholderTextColor="#CBD5E1"
                            keyboardType="numeric"
                            autoFocus
                        />
                    </View>
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                </View>

                <View style={styles.quickAmountSection}>
                    <Text style={styles.quickAmountLabel}>Uang Pas / Pecahan:</Text>
                    <View style={styles.quickAmountContainer}>
                        {getQuickAmounts().map((amount, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.quickAmountButton,
                                    paidAmount === amount.toString() && styles.quickAmountButtonActive,
                                ]}
                                onPress={() => handleQuickAmount(amount)}
                            >
                                <Text
                                    style={[
                                        styles.quickAmountText,
                                        paidAmount === amount.toString() && styles.quickAmountTextActive,
                                    ]}
                                >
                                    {formatPrice(amount)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <TouchableOpacity
                    style={[
                        styles.payButton,
                        (!paidAmount || parseInt(paidAmount, 10) < totalAmount) && styles.payButtonDisabled,
                    ]}
                    onPress={handlePayment}
                    activeOpacity={0.8}
                >
                    <Ionicons name="cash" size={24} color="#FFFFFF" />
                    <Text style={styles.payButtonText}>Proses Pembayaran</Text>
                </TouchableOpacity>
            </View>
        </>
    );

    const renderSuccessScreen = () => (
        <View style={styles.successContainer}>
            <Animated.View
                style={[
                    styles.successIconContainer,
                    { transform: [{ scale: scaleAnim }] },
                ]}
            >
                <Ionicons name="checkmark-circle" size={80} color="#10B981" />
            </Animated.View>

            <Text style={styles.successTitle}>Pembayaran Berhasil!</Text>

            <View style={styles.successDetails}>
                <View style={styles.successRow}>
                    <Text style={styles.successLabel}>Total Belanja</Text>
                    <Text style={styles.successValue}>{formatPrice(totalAmount)}</Text>
                </View>
                <View style={styles.successRow}>
                    <Text style={styles.successLabel}>Dibayar</Text>
                    <Text style={styles.successValue}>
                        {formatPrice(parseInt(paidAmount, 10))}
                    </Text>
                </View>
                <View style={styles.successDivider} />
                <View style={styles.successRow}>
                    <Text style={styles.changeLabel}>Kembalian</Text>
                    <Text style={styles.changeValue}>{formatPrice(changeAmount)}</Text>
                </View>
            </View>

            <TouchableOpacity
                style={styles.completeButton}
                onPress={handleComplete}
                activeOpacity={0.8}
            >
                <Text style={styles.completeButtonText}>Selesai</Text>
                <Ionicons name="checkmark" size={20} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    );

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.modalOverlay}
            >
                <View style={styles.modalContent}>
                    {showSuccess ? renderSuccessScreen() : renderPaymentInput()}
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default CashPaymentModal;

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
        borderRadius: 20,
        width: '100%',
        maxWidth: 500,
        maxHeight: '90%',
        overflow: 'hidden',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    backButton: {
        padding: 4,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1E293B',
    },
    placeholder: {
        width: 32,
    },
    modalBody: {
        padding: 24,
    },
    totalSection: {
        backgroundColor: '#F1F5F9',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        marginBottom: 24,
    },
    totalLabel: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 8,
    },
    totalValue: {
        fontSize: 32,
        fontWeight: '700',
        color: '#6366F1',
    },
    inputSection: {
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 12,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderWidth: 2,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 4,
    },
    inputError: {
        borderColor: '#EF4444',
    },
    currencyPrefix: {
        fontSize: 20,
        fontWeight: '600',
        color: '#6366F1',
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 24,
        fontWeight: '700',
        color: '#1E293B',
        paddingVertical: 12,
    },
    errorText: {
        fontSize: 13,
        color: '#EF4444',
        marginTop: 8,
    },
    quickAmountSection: {
        marginBottom: 24,
    },
    quickAmountLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 12,
    },
    quickAmountContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    quickAmountButton: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#F1F5F9',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#E2E8F0',
    },
    quickAmountButtonActive: {
        backgroundColor: '#EEF2FF',
        borderColor: '#6366F1',
    },
    quickAmountText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
    },
    quickAmountTextActive: {
        color: '#6366F1',
    },
    payButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#6366F1',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 10,
    },
    payButtonDisabled: {
        backgroundColor: '#94A3B8',
    },
    payButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    successContainer: {
        padding: 32,
        alignItems: 'center',
    },
    successIconContainer: {
        marginBottom: 20,
    },
    successTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#10B981',
        marginBottom: 24,
    },
    successDetails: {
        width: '100%',
        backgroundColor: '#F8FAFC',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
    },
    successRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    successLabel: {
        fontSize: 15,
        color: '#64748B',
    },
    successValue: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1E293B',
    },
    successDivider: {
        height: 1,
        backgroundColor: '#E2E8F0',
        marginVertical: 12,
    },
    changeLabel: {
        fontSize: 17,
        fontWeight: '600',
        color: '#1E293B',
    },
    changeValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#10B981',
    },
    completeButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#10B981',
        paddingVertical: 16,
        paddingHorizontal: 48,
        borderRadius: 12,
        gap: 10,
        width: '100%',
    },
    completeButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});
