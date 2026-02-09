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
import { LinearGradient } from "expo-linear-gradient";

export default function WishlistScreen({ navigation }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            fetchWishlist();
        }, [])
    );

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const res = await API.get("/wishlist");
            setItems(res.data);
        } catch (err) {
            console.error("Failed to load wishlist:", err);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productId) => {
        try {
            await API.post("/cart", { product_id: productId, quantity: 1 });
            Alert.alert("Success", "Added to cart");
        } catch (err) {
            Alert.alert("Error", "Failed to add to cart");
        }
    };

    const removeItem = async (productId) => {
        Alert.alert(
            "Remove Item",
            "Remove this item from your wishlist?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Remove",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await API.delete(`/wishlist/product/${productId}`);
                            setItems((prev) =>
                                prev.filter((item) => item.product_id !== productId)
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

    const renderItem = ({ item }) => {
        const imageUrl = item.images && item.images[0];

        return (
            <View style={styles.wishlistItem}>
                {imageUrl ? (
                    <Image source={{ uri: imageUrl }} style={styles.productImage} />
                ) : (
                    <View style={styles.placeholderImage}>
                        <Ionicons name="image-outline" size={30} color="#9CA3AF" />
                    </View>
                )}

                <View style={styles.itemInfo}>
                    <Text style={styles.itemName} numberOfLines={2}>{item.product_name}</Text>
                    <Text style={styles.itemPrice}>Rs.{item.price}</Text>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => addToCart(item.product_id)}
                        >
                            <Ionicons name="cart-outline" size={18} color="#FFFFFF" />
                            <Text style={styles.buttonText}>Add to Cart</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.removeButton}
                            onPress={() => removeItem(item.product_id)}
                        >
                            <Ionicons name="trash-outline" size={18} color="#EF4444" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0F766E" />
                <Text style={styles.loadingText}>Loading wishlist...</Text>
            </View>
        );
    }

    if (items.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <View style={styles.iconContainer}>
                    <Ionicons name="heart-outline" size={60} color="#0F766E" />
                </View>
                <Text style={styles.emptyText}>Your wishlist is empty</Text>
                <Text style={styles.emptySubtext}>Save items you love here</Text>
                <TouchableOpacity
                    style={styles.browseButton}
                    onPress={() => navigation.navigate("Products")}
                >
                    <Text style={styles.browseButtonText}>Browse Products</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
            />
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
        color: "#0F766E",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 32,
        backgroundColor: "#F9FAFB",
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "#F0FDFA",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 24,
        borderWidth: 1,
        borderColor: "#CCFBF1",
    },
    emptyText: {
        fontSize: 24,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 16,
        color: "#6B7280",
        marginBottom: 32,
        textAlign: "center",
    },
    browseButton: {
        backgroundColor: "#0F766E",
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12,
        shadowColor: "#0F766E",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    browseButtonText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#FFFFFF",
    },
    listContainer: {
        padding: 16,
    },
    wishlistItem: {
        backgroundColor: "#FFFFFF",
        padding: 16,
        marginBottom: 16,
        borderRadius: 16,
        flexDirection: "row",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    productImage: {
        width: 100,
        height: 100,
        borderRadius: 12,
        marginRight: 16,
        backgroundColor: "#F3F4F6",
    },
    placeholderImage: {
        width: 100,
        height: 100,
        borderRadius: 12,
        marginRight: 16,
        backgroundColor: "#F3F4F6",
        justifyContent: "center",
        alignItems: "center",
    },
    itemInfo: {
        flex: 1,
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
        marginBottom: 12,
    },
    buttonRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    addButton: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#0F766E",
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
    },
    removeButton: {
        padding: 10,
        borderRadius: 8,
        backgroundColor: "#FEE2E2",
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "700",
        marginLeft: 6,
    },
});
