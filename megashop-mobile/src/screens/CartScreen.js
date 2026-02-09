import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Image,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import API from "../api/api";

export default function CartScreen({ navigation }) {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState({});

    useFocusEffect(
        useCallback(() => {
            fetchCart();
        }, [])
    );

    const fetchCart = async () => {
        try {
            setLoading(true);
            const res = await API.get("/cart");
            setCartItems(res.data);
        } catch (err) {
            console.error("Failed to fetch cart:", err);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return;

        setUpdating((prev) => ({ ...prev, [productId]: true }));
        try {
            await API.patch(`/cart/${productId}`, { quantity: newQuantity });
            setCartItems((prev) =>
                prev.map((item) =>
                    item.product_id === productId
                        ? { ...item, quantity: newQuantity }
                        : item
                )
            );
        } catch (err) {
            console.error("Update error:", err);
            Alert.alert("Error", "Failed to update quantity");
        } finally {
            setUpdating((prev) => ({ ...prev, [productId]: false }));
        }
    };

    const removeItem = async (cartItemId) => {
        Alert.alert(
            "Remove Item",
            "Are you sure you want to remove this item from cart?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Remove",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await API.delete(`/cart/${cartItemId}`);
                            setCartItems((prev) =>
                                prev.filter((item) => item.id !== cartItemId)
                            );
                        } catch (err) {
                            console.error("Remove error:", err);
                            Alert.alert("Error", "Failed to remove item");
                        }
                    },
                },
            ]
        );
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    const calculateTax = () => {
        return calculateSubtotal() * 0.1;
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateTax();
    };

    const renderCartItem = ({ item }) => {
        const imageUrl = item.images && item.images[0];

        return (
            <View style={styles.cartItem}>
                {imageUrl && (
                    <Image source={{ uri: imageUrl }} style={styles.productImage} />
                )}

                <View style={styles.itemInfo}>
                    <Text style={styles.itemName} numberOfLines={2}>{item.product_name}</Text>
                    <Text style={styles.itemPrice}>Rs.{item.price}</Text>

                    <View style={styles.quantityContainer}>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => updateQuantity(item.product_id, item.quantity - 1)}
                            disabled={updating[item.product_id]}
                        >
                            <Ionicons name="remove" size={18} color="#0F766E" />
                        </TouchableOpacity>

                        <Text style={styles.quantityText}>{item.quantity}</Text>

                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => updateQuantity(item.product_id, item.quantity + 1)}
                            disabled={updating[item.product_id]}
                        >
                            <Ionicons name="add" size={18} color="#0F766E" />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeItem(item.id)}
                >
                    <Ionicons name="trash-outline" size={22} color="#EF4444" />
                </TouchableOpacity>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0F766E" />
                <Text style={styles.loadingText}>Loading cart...</Text>
            </View>
        );
    }

    if (cartItems.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Ionicons name="cart-outline" size={100} color="#E5E7EB" />
                <Text style={styles.emptyTitle}>Your cart is empty</Text>
                <Text style={styles.emptySubtitle}>Add some products to get started</Text>
                <TouchableOpacity
                    style={styles.shopButton}
                    onPress={() => navigation.navigate("Products")}
                >
                    <Ionicons name="storefront" size={20} color="#FFFFFF" />
                    <Text style={styles.shopButtonText}>Start Shopping</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={cartItems}
                renderItem={renderCartItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                ListFooterComponent={
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryTitle}>Order Summary</Text>

                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Subtotal</Text>
                            <Text style={styles.summaryValue}>Rs.{calculateSubtotal().toFixed(2)}</Text>
                        </View>

                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Tax (10%)</Text>
                            <Text style={styles.summaryValue}>Rs.{calculateTax().toFixed(2)}</Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.summaryRow}>
                            <Text style={styles.totalLabel}>Total</Text>
                            <Text style={styles.totalValue}>Rs.{calculateTotal().toFixed(2)}</Text>
                        </View>
                    </View>
                }
            />

            <View style={styles.checkoutContainer}>
                <View style={styles.totalRow}>
                    <Text style={styles.checkoutTotal}>Rs.{calculateTotal().toFixed(2)}</Text>
                    <Text style={styles.itemCount}>{cartItems.length} items</Text>
                </View>
                <TouchableOpacity
                    style={styles.checkoutButton}
                    onPress={() => navigation.navigate("Checkout")}
                >
                    <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
                    <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F9FAFB",
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: "#6B7280",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 32,
        backgroundColor: "#F9FAFB",
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: "#111827",
        marginTop: 24,
    },
    emptySubtitle: {
        fontSize: 16,
        color: "#6B7280",
        marginTop: 8,
        marginBottom: 32,
    },
    shopButton: {
        flexDirection: "row",
        backgroundColor: "#0F766E",
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        shadowColor: "#0F766E",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    shopButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
        marginLeft: 8,
    },
    listContainer: {
        padding: 16,
    },
    cartItem: {
        flexDirection: "row",
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 12,
        backgroundColor: "#F3F4F6",
    },
    itemInfo: {
        flex: 1,
        marginLeft: 16,
        justifyContent: "space-between",
    },
    itemName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111827",
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 18,
        fontWeight: "700",
        color: "#0F766E",
        marginBottom: 8,
    },
    quantityContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F9FAFB",
        borderRadius: 8,
        alignSelf: "flex-start",
    },
    quantityButton: {
        padding: 8,
    },
    quantityText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111827",
        paddingHorizontal: 16,
    },
    removeButton: {
        padding: 8,
    },
    summaryCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 20,
        marginTop: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    summaryTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 16,
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    summaryLabel: {
        fontSize: 16,
        color: "#6B7280",
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111827",
    },
    divider: {
        height: 1,
        backgroundColor: "#E5E7EB",
        marginVertical: 12,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
    },
    totalValue: {
        fontSize: 20,
        fontWeight: "700",
        color: "#0F766E",
    },
    checkoutContainer: {
        backgroundColor: "#FFFFFF",
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    checkoutTotal: {
        fontSize: 24,
        fontWeight: "700",
        color: "#0F766E",
    },
    itemCount: {
        fontSize: 14,
        color: "#6B7280",
    },
    checkoutButton: {
        flexDirection: "row",
        backgroundColor: "#0F766E",
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#0F766E",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    checkoutButtonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "700",
        marginRight: 8,
    },
});
