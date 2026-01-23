import { CartProvider } from "@/src/features/cart/context/CartContext";
import { HistoryProvider } from "@/src/features/history/context/HistoryContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <CartProvider>
      <HistoryProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </HistoryProvider>
    </CartProvider>
  );
}
