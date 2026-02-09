import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import API from "../api/api";

export default function HomeScreen({ navigation }) {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sortBy, setSortBy] = useState("default");

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [searchQuery, minPrice, maxPrice, sortBy, products]);

    const fetchProducts = async () => {
        try {
            const res = await API.get("/products");
            setProducts(res.data);
        } catch (err) {
            console.error("Failed to fetch products:", err);
            Alert.alert("Error", "Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...products];

        if (searchQuery) {
            filtered = filtered.filter((product) =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (minPrice) {
            filtered = filtered.filter((product) => product.price >= parseFloat(minPrice));
        }
        if (maxPrice) {
            filtered = filtered.filter((product) => product.price <= parseFloat(maxPrice));
        }

        if (sortBy === "price_low") {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortBy === "price_high") {
            filtered.sort((a, b) => b.price - a.price);
        }

        setFilteredProducts(filtered);
    };

    const addToCart = async (productId) => {
        try {
            await API.post("/cart", { product_id: productId, quantity: 1 });
            Alert.alert("Success", "Added to cart");
        } catch (err) {
            console.error("Add to cart error:", err);
            Alert.alert("Error", "Failed to add to cart");
        }
    };

    const addToWishlist = async (productId) => {
        try {
            await API.post("/wishlist", { product_id: productId });
            Alert.alert("Success", "Added to wishlist");
        } catch (err) {
            console.error("Add to wishlist error:", err);
            Alert.alert("Error", "Failed to add to wishlist");
        }
    };

    const renderProduct = ({ item }) => {
        const imageUrl = item.images && item.images[0];

        return (
            <View style={styles.productCard}>
                <TouchableOpacity
                    onPress={() => navigation.navigate("ProductDetail", { product: item })}
                    activeOpacity={0.9}
                >
                    {imageUrl && (
                        <Image source={{ uri: imageUrl }} style={styles.productImage} />
                    )}
                    <View style={styles.productInfo}>
                        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                        <View style={styles.priceRow}>
                            <Text style={styles.productPrice}>Rs.{item.price}</Text>
                            {item.rating && (
                                <View style={styles.ratingContainer}>
                                    <Ionicons name="star" size={14} color="#F59E0B" />
                                    <Text style={styles.productRating}>{item.rating}</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </TouchableOpacity>

                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={styles.cartButton}
                        onPress={() => addToCart(item.id)}
                    >
                        <Ionicons name="cart-outline" size={18} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.wishlistButton}
                        onPress={() => addToWishlist(item.id)}
                    >
                        <Ionicons name="heart-outline" size={18} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0F766E" />
                <Text style={styles.loadingText}>Loading products...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Search */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#0F766E" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search products..."
                    placeholderTextColor="#9CA3AF"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery ? (
                    <TouchableOpacity onPress={() => setSearchQuery("")}>
                        <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                ) : null}
            </View>

            {/* Filters */}
            <View style={styles.filtersContainer}>
                <View style={styles.priceFilters}>
                    <TextInput
                        style={styles.priceInput}
                        placeholder="Min"
                        placeholderTextColor="#9CA3AF"
                        value={minPrice}
                        onChangeText={setMinPrice}
                        keyboardType="numeric"
                    />
                    <Text style={styles.priceSeparator}>-</Text>
                    <TextInput
                        style={styles.priceInput}
                        placeholder="Max"
                        placeholderTextColor="#9CA3AF"
                        value={maxPrice}
                        onChangeText={setMaxPrice}
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.sortContainer}>
                    <TouchableOpacity
                        style={[styles.sortButton, sortBy === "default" && styles.sortButtonActive]}
                        onPress={() => setSortBy("default")}
                    >
                        <Text style={[styles.sortText, sortBy === "default" && styles.sortTextActive]}>
                            Default
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.sortButton, sortBy === "price_low" && styles.sortButtonActive]}
                        onPress={() => setSortBy("price_low")}
                    >
                        <Ionicons
                            name="arrow-up"
                            size={14}
                            color={sortBy === "price_low" ? "#FFFFFF" : "#6B7280"}
                        />
                        <Text style={[styles.sortText, sortBy === "price_low" && styles.sortTextActive]}>
                            Price
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.sortButton, sortBy === "price_high" && styles.sortButtonActive]}
                        onPress={() => setSortBy("price_high")}
                    >
                        <Ionicons
                            name="arrow-down"
                            size={14}
                            color={sortBy === "price_high" ? "#FFFFFF" : "#6B7280"}
                        />
                        <Text style={[styles.sortText, sortBy === "price_high" && styles.sortTextActive]}>
                            Price
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={filteredProducts}
                renderItem={renderProduct}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.listContainer}
                columnWrapperStyle={styles.row}
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
        color: "#6B7280",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        margin: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: "#111827",
    },
    filtersContainer: {
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    priceFilters: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    priceInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        backgroundColor: "#F9FAFB",
        padding: 10,
        borderRadius: 8,
        fontSize: 14,
        color: "#111827",
    },
    priceSeparator: {
        marginHorizontal: 12,
        fontSize: 16,
        fontWeight: "600",
        color: "#6B7280",
    },
    sortContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    sortButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        backgroundColor: "#F9FAFB",
        marginHorizontal: 4,
    },
    sortButtonActive: {
        backgroundColor: "#0F766E",
        borderColor: "#0F766E",
    },
    sortText: {
        fontSize: 13,
        color: "#6B7280",
        fontWeight: "600",
        marginLeft: 4,
    },
    sortTextActive: {
        color: "#FFFFFF",
    },
    listContainer: {
        paddingHorizontal: 8,
        paddingBottom: 16,
    },
    row: {
        justifyContent: "space-between",
    },
    productCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        margin: 8,
        flex: 1,
        maxWidth: "47%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        overflow: "hidden",
    },
    productImage: {
        width: "100%",
        height: 160,
        backgroundColor: "#F3F4F6",
    },
    productInfo: {
        padding: 12,
    },
    productName: {
        fontSize: 14,
        fontWeight: "600",
        color: "#111827",
        marginBottom: 8,
        height: 36,
    },
    priceRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    productPrice: {
        fontSize: 18,
        fontWeight: "700",
        color: "#0F766E",
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FEF3C7",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    productRating: {
        fontSize: 12,
        fontWeight: "600",
        color: "#92400E",
        marginLeft: 2,
    },
    buttonRow: {
        flexDirection: "row",
        borderTopWidth: 1,
        borderTopColor: "#F3F4F6",
    },
    cartButton: {
        flex: 1,
        backgroundColor: "#0F766E",
        padding: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    wishlistButton: {
        flex: 1,
        backgroundColor: "#10B981",
        padding: 12,
        alignItems: "center",
        justifyContent: "center",
    },
});
