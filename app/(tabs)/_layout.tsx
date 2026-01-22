import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ headerTitle: 'ngePOS' }} >
            <Tabs.Screen name="index" options={{
                title: 'Dashboard', tabBarIcon: ({ color, size }) => (
                    <Ionicons name="grid-outline" size={size} color={color} />
                ),
            }} />
            <Tabs.Screen name="products" options={{
                title: 'Products', tabBarIcon: ({ color, size }) => (
                    <Ionicons name="fast-food" size={size} color={color} />
                ),
            }} />
            <Tabs.Screen name="cart" options={{
                title: 'Cart', tabBarIcon: ({ color, size }) => (
                    <Ionicons name="cart-outline" size={size} color={color} />
                ),
            }} />
            <Tabs.Screen name="history" options={{
                title: 'History', tabBarIcon: ({ color, size }) => (
                    <Ionicons name="time-outline" size={size} color={color} />
                ),
            }} />
        </Tabs>
    );
}
