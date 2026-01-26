import {
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CheckoutButtonProps {
    onPress: () => void;
    text: string;
}

export const CheckoutButton: React.FC<CheckoutButtonProps> = ({ onPress, text }) => {
    return (
        <TouchableOpacity
            style={styles.checkoutButton}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <Text style={styles.checkoutButtonText}>
                {text}
            </Text>
            <Ionicons
                name="arrow-forward"
                size={20}
                color="#FFFFFF"
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
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
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        marginRight: 8,
    },
});