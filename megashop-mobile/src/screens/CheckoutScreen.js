import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import API from "../api/api";

export default function CheckoutScreen({ navigation }) {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [phone, setPhone] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("cod");

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const res = await API.get("/cart");
            setCartItems(res.data);
        } catch (err) {
            console.error("Failed to fetch cart:", err);
            Alert.alert("Error", "Failed to load cart");
        } finally {
            setLoading(false);
        }
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    const calculateTax = () => {
        return calculateSubtotal() * 0.1;
    };

    const calculateShipping = () => {
        return calculateSubtotal() > 5000 ? 0 : 100;
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateTax() + calculateShipping();
    };

    const validateForm = () => {
        if (!name.trim()) {
            Alert.alert("Error", "Please enter your name");
            return false;
        }
        if (!address.trim()) {
            Alert.alert("Error", "Please enter your address");
            return false;
        }
        if (!city.trim()) {
            Alert.alert("Error", "Please enter your city");
            return false;
        }
        if (!postalCode.trim()) {
            Alert.alert("Error", "Please enter postal code");
            return false;
        }
        if (!phone.trim()) {
            Alert.alert("Error", "Please enter phone number");
            return false;
        }
        return true;
    };

    const placeOrder = async () => {
        if (!validateForm()) return;

        if (cartItems.length === 0) {
            Alert.alert("Error", "Your cart is empty");
            return;
        }

        setProcessing(true);

        try {
            const orderData = {
                shipping_address: {
                    name,
                    address,
                    city,
                    postal_code: postalCode,
                    phone,
                },
                payment_method: paymentMethod,
            };

            const response = await API.post("/orders", orderData);

            Alert.alert(
                "Order Placed Successfully!",
                `Order #${response.data.order_number}\nTotal: Rs.${calculateTotal().toFixed(2)}\n\nThank you for your order!`,
                [
                    {
                        text: "OK",
                        onPress: () => {
                            navigation.reset({
                                index: 0,
                                routes: [{ name: "Main" }],
                            });
                        },
                    },
                ]
            );
        } catch (err) {
            console.error("Order error:", err);
            Alert.alert("Error", err.response?.data?.message || "Failed to place order");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0F766E" />
            </View>
        );
    }

    if (cartItems.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Ionicons name="cart-outline" size={80} color="#E5E7EB" />
                <Text style={styles.emptyText}>Your cart is empty</Text>
                <TouchableOpacity
                    style={styles.shopButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.shopButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Shipping Address */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Ionicons name="location" size={24} color="#0F766E" />
                    <Text style={styles.sectionTitle}>Shipping Address</Text>
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons name="person-outline" size={20} color="#0F766E" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Full Name"
                        placeholderTextColor="#9CA3AF"
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons name="home-outline" size={20} color="#0F766E" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Address"
                        placeholderTextColor="#9CA3AF"
                        value={address}
                        onChangeText={setAddress}
                        multiline
                    />
                </View>

                <View style={styles.row}>
                    <View style={[styles.inputContainer, styles.halfInput]}>
                        <Ionicons name="business-outline" size={20} color="#0F766E" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="City"
                            placeholderTextColor="#9CA3AF"
                            value={city}
                            onChangeText={setCity}
                        />
                    </View>

                    <View style={[styles.inputContainer, styles.halfInput]}>
                        <Ionicons name="mail-outline" size={20} color="#0F766E" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Postal Code"
                            placeholderTextColor="#9CA3AF"
                            value={postalCode}
                            onChangeText={setPostalCode}
                            keyboardType="numeric"
                        />
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons name="call-outline" size={20} color="#0F766E" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Phone Number"
                        placeholderTextColor="#9CA3AF"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                    />
                </View>
            </View>

            {/* Order Summary */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Ionicons name="receipt" size={24} color="#0F766E" />
                    <Text style={styles.sectionTitle}>Order Summary</Text>
                </View>

                {cartItems.map((item) => (
                    <View key={item.id} style={styles.orderItem}>
                        <Text style={styles.itemName}>
                            {item.product_name} × {item.quantity}
                        </Text>
                        <Text style={styles.itemPrice}>
                            Rs.{(item.price * item.quantity).toFixed(2)}
                        </Text>
                    </View>
                ))}

                <View style={styles.divider} />

                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Subtotal:</Text>
                    <Text style={styles.summaryValue}>Rs.{calculateSubtotal().toFixed(2)}</Text>
                </View>

                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Tax (10%):</Text>
                    <Text style={styles.summaryValue}>Rs.{calculateTax().toFixed(2)}</Text>
                </View>

                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Shipping:</Text>
                    <Text style={styles.summaryValue}>
                        {calculateShipping() === 0 ? "FREE" : `Rs.${calculateShipping().toFixed(2)}`}
                    </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.summaryRow}>
                    <Text style={styles.totalLabel}>Total:</Text>
                    <Text style={styles.totalValue}>Rs.{calculateTotal().toFixed(2)}</Text>
                </View>
            </View>

            {/* Payment Method */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Ionicons name="card" size={24} color="#0F766E" />
                    <Text style={styles.sectionTitle}>Payment Method</Text>
                </View>

                <TouchableOpacity
                    style={[
                        styles.paymentOption,
                        paymentMethod === "cod" && styles.paymentOptionActive,
                    ]}
                    onPress={() => setPaymentMethod("cod")}
                >
                    <Ionicons
                        name={paymentMethod === "cod" ? "radio-button-on" : "radio-button-off"}
                        size={24}
                        color={paymentMethod === "cod" ? "#0F766E" : "#9CA3AF"}
                    />
                    <View style={styles.paymentInfo}>
                        <Text style={styles.paymentTitle}>Cash on Delivery</Text>
                        <Text style={styles.paymentDesc}>Pay when you receive</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.paymentOption,
                        paymentMethod === "card" && styles.paymentOptionActive,
                    ]}
                    onPress={() => setPaymentMethod("card")}
                >
                    <Ionicons
                        name={paymentMethod === "card" ? "radio-button-on" : "radio-button-off"}
                        size={24}
                        color={paymentMethod === "card" ? "#0F766E" : "#9CA3AF"}
                    />
                    <View style={styles.paymentInfo}>
                        <Text style={styles.paymentTitle}>Card Payment</Text>
                        <Text style={styles.paymentDesc}>Debit/Credit Card</Text>
                    </View>
                </TouchableOpacity>
            </View>

            {/* Place Order Button */}
            <TouchableOpacity
                style={[styles.placeOrderButton, processing && styles.buttonDisabled]}
                onPress={placeOrder}
                disabled={processing}
            >
                {processing ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <>
                        <Ionicons name="checkmark-circle" size={24} color="#fff" />
                        <Text style={styles.placeOrderText}>
                            Place Order - Rs.{calculateTotal().toFixed(2)}
                        </Text>
                    </>
                )}
            </TouchableOpacity>

            <View style={styles.bottomPadding} />
        </ScrollView>
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
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#F9FAFB",
    },
    emptyText: {
        fontSize: 18,
        color: "#6B7280",
        marginTop: 16,
        marginBottom: 24,
    },
    shopButton: {
        backgroundColor: "#0F766E",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    shopButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    section: {
        backgroundColor: "#FFFFFF",
        padding: 20,
        margin: 16,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        marginLeft: 12,
        color: "#111827",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F9FAFB",
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 16,
        color: "#111827",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    halfInput: {
        width: "48%",
    },
    orderItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 8,
    },
    itemName: {
        fontSize: 14,
        color: "#6B7280",
        flex: 1,
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: "600",
        color: "#111827",
    },
    divider: {
        height: 1,
        backgroundColor: "#E5E7EB",
        marginVertical: 12,
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 6,
    },
    summaryLabel: {
        fontSize: 14,
        color: "#6B7280",
    },
    summaryValue: {
        fontSize: 14,
        color: "#111827",
        fontWeight: "600",
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
    paymentOption: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        marginBottom: 12,
        backgroundColor: "#F9FAFB",
    },
    paymentOptionActive: {
        borderColor: "#0F766E",
        backgroundColor: "#ECFDF5",
    },
    paymentInfo: {
        marginLeft: 12,
    },
    paymentTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111827",
    },
    paymentDesc: {
        fontSize: 12,
        color: "#6B7280",
        marginTop: 2,
    },
    placeOrderButton: {
        flexDirection: "row",
        backgroundColor: "#0F766E",
        padding: 18,
        margin: 16,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#0F766E",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    placeOrderText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
        marginLeft: 10,
    },
    bottomPadding: {
        height: 20,
    },
});
