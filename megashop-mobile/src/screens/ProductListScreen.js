import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Image,
    TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import API from "../api/api";

// Map category names to proper Ionicons
const getCategoryIcon = (categoryName) => {
    const iconMap = {
        'Electronics': 'phone-portrait-outline',
        'Clothing': 'shirt-outline',
        'Home & Garden': 'home-outline',
        'Sports': 'football-outline',
        'Books': 'book-outline',
        'Toys': 'game-controller-outline',
        'Beauty': 'rose-outline',
        'Food': 'fast-food-outline',
        'Automotive': 'car-outline',
        'Health': 'fitness-outline',
    };

    if (iconMap[categoryName]) {
        return iconMap[categoryName];
    }

    const lowerName = categoryName.toLowerCase();
    for (const [key, icon] of Object.entries(iconMap)) {
        if (lowerName.includes(key.toLowerCase())) {
            return icon;
        }
    }

    return 'grid-outline';
};

export default function ProductListScreen({ navigation }) {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("default");

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            fetchProductsByCategory(selectedCategory);
        }
    }, [selectedCategory]);

    useEffect(() => {
        applyFilters();
    }, [searchQuery, sortBy, products]);

    const fetchCategories = async () => {
        try {
            const res = await API.get("/products/categories");
            setCategories(res.data);
        } catch (err) {
            console.error("Failed to fetch categories:", err);
            Alert.alert("Error", "Failed to load categories");
        } finally {
            setLoading(false);
        }
    };

    const fetchProductsByCategory = async (category) => {
        try {
            setLoading(true);
            const res = await API.get(`/products/category/${category}`);
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

        if (sortBy === "price_low") {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortBy === "price_high") {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sortBy === "rating") {
            filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        }

        setFilteredProducts(filtered);
    };

    const addToCart = async (productId) => {
        try {
            await API.post("/cart", { product_id: productId, quantity: 1 });
            Alert.alert("Success", "Added to cart");
        } catch (err) {
            Alert.alert("Error", "Failed to add to cart");
        }
    };

    const addToWishlist = async (productId) => {
        try {
            await API.post("/wishlist", { product_id: productId });
            Alert.alert("Success", "Added to wishlist");
        } catch (err) {
            Alert.alert("Error", "Failed to add to wishlist");
        }
    };

    const renderCategory = ({ item }) => {
        const iconName = getCategoryIcon(item.name);

        return (
            <TouchableOpacity
                style={styles.categoryCard}
                onPress={() => setSelectedCategory(item.name)}
                activeOpacity={0.9}
            >
                <LinearGradient
                    colors={["#0F766E", "#14B8A6"]}
                    style={styles.categoryGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Ionicons name={iconName} size={32} color="#fff" style={styles.categoryIcon} />
                    <Text style={styles.categoryName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.categoryCount}>
                        {item.product_count || 0} items
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        );
    };

    const renderProduct = ({ item }) => {
        const imageUrl = item.images && item.images[0];

        return (
            <View style={styles.productCard}>
                <TouchableOpacity
                    style={styles.productContent}
                    onPress={() => navigation.navigate("ProductDetail", { product: item })}
                    activeOpacity={0.9}
                >
                    <View style={styles.imageContainer}>
                        {imageUrl ? (
                            <Image source={{ uri: imageUrl }} style={styles.productImage} />
                        ) : (
                            <View style={styles.placeholderImage}>
                                <Ionicons name="image-outline" size={40} color="#9CA3AF" />
                            </View>
                        )}
                        {item.badges && item.badges.length > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{item.badges[0]}</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.productInfo}>
                        <Text style={styles.productName} numberOfLines={2}>
                            {item.name}
                        </Text>

                        <View style={styles.priceRow}>
                            <Text style={styles.productPrice}>Rs.{item.price}</Text>
                            {item.original_price && item.original_price > item.price && (
                                <Text style={styles.originalPrice}>Rs.{item.original_price}</Text>
                            )}
                        </View>

                        {item.rating && (
                            <View style={styles.ratingRow}>
                                <Ionicons name="star" size={14} color="#F59E0B" />
                                <Text style={styles.productRating}>
                                    {item.rating} ({item.review_count || 0})
                                </Text>
                            </View>
                        )}
                    </View>
                </TouchableOpacity>

                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={styles.cartButton}
                        onPress={() => addToCart(item.id)}
                    >
                        <Ionicons name="cart-outline" size={18} color="#fff" />
                        <Text style={styles.buttonText}>Add to Cart</Text>
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
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    // Show categories if no category selected
    if (!selectedCategory) {
        return (
            <View style={styles.container}>
                <LinearGradient
                    colors={["#0F766E", "#115E59"]}
                    style={styles.header}
                >
                    <Text style={styles.headerTitle}>Explore Categories</Text>
                    <Text style={styles.headerSubtitle}>Find what you love</Text>
                </LinearGradient>

                <FlatList
                    data={categories}
                    renderItem={renderCategory}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.categoryContainer}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                />
            </View>
        );
    }

    // Show products for selected category
    return (
        <View style={styles.container}>
            {/* Header with Back Button */}
            <View style={styles.categoryHeader}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => {
                        setSelectedCategory(null);
                        setProducts([]);
                        setSearchQuery("");
                    }}
                >
                    <Ionicons name="arrow-back" size={24} color="#0F766E" />
                </TouchableOpacity>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.selectedCategoryTitle}>{selectedCategory}</Text>
                    <Text style={styles.productCount}>{filteredProducts.length} items</Text>
                </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#0F766E" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search in this category..."
                    placeholderTextColor="#9CA3AF"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery("")}>
                        <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Sort Options */}
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
                        color={sortBy === "price_low" ? "#fff" : "#6B7280"}
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
                        color={sortBy === "price_high" ? "#fff" : "#6B7280"}
                    />
                    <Text style={[styles.sortText, sortBy === "price_high" && styles.sortTextActive]}>
                        Price
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.sortButton, sortBy === "rating" && styles.sortButtonActive]}
                    onPress={() => setSortBy("rating")}
                >
                    <Ionicons
                        name="star"
                        size={14}
                        color={sortBy === "rating" ? "#fff" : "#6B7280"}
                    />
                    <Text style={[styles.sortText, sortBy === "rating" && styles.sortTextActive]}>
                        Rating
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Product List */}
            <FlatList
                data={filteredProducts}
                renderItem={renderProduct}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                numColumns={2}
                columnWrapperStyle={styles.row}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="cube-outline" size={80} color="#E5E7EB" />
                        <Text style={styles.emptyText}>No products found</Text>
                    </View>
                }
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
    header: {
        padding: 24,
        paddingTop: 30,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "700",
        color: "#FFFFFF",
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 16,
        color: "#E0F2F1",
        opacity: 0.9,
    },
    categoryContainer: {
        padding: 12,
    },
    row: {
        justifyContent: "space-between",
    },
    categoryCard: {
        flex: 1,
        margin: 6,
        borderRadius: 16,
        height: 140,
        shadowColor: "#0F766E",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    categoryGradient: {
        flex: 1,
        borderRadius: 16,
        padding: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    categoryIcon: {
        marginBottom: 12,
        backgroundColor: "rgba(255,255,255,0.2)",
        padding: 8,
        borderRadius: 12,
        overflow: "hidden",
    },
    categoryName: {
        fontSize: 16,
        fontWeight: "700",
        color: "#FFFFFF",
        textAlign: "center",
    },
    categoryCount: {
        fontSize: 12,
        color: "#E0F2F1",
        marginTop: 4,
    },
    categoryHeader: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },
    backButton: {
        padding: 8,
        marginRight: 8,
        borderRadius: 8,
        backgroundColor: "#F0FDFA",
    },
    headerTextContainer: {
        flex: 1,
    },
    selectedCategoryTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#111827",
    },
    productCount: {
        fontSize: 13,
        color: "#6B7280",
        marginTop: 2,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        marginHorizontal: 16,
        marginVertical: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: "#F3F4F6",
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: "#111827",
    },
    sortContainer: {
        flexDirection: "row",
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    sortButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: "#FFFFFF",
        marginRight: 8,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    sortButtonActive: {
        backgroundColor: "#0F766E",
        borderColor: "#0F766E",
    },
    sortText: {
        fontSize: 13,
        color: "#6B7280",
        marginLeft: 4,
        fontWeight: "600",
    },
    sortTextActive: {
        color: "#FFFFFF",
    },
    listContainer: {
        paddingHorizontal: 8,
        paddingBottom: 20,
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
    imageContainer: {
        position: "relative",
    },
    productImage: {
        width: "100%",
        height: 150,
        backgroundColor: "#F3F4F6",
    },
    placeholderImage: {
        width: "100%",
        height: 150,
        backgroundColor: "#F3F4F6",
        justifyContent: "center",
        alignItems: "center",
    },
    badge: {
        position: "absolute",
        top: 8,
        left: 8,
        backgroundColor: "#EF4444",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    badgeText: {
        color: "#FFFFFF",
        fontSize: 10,
        fontWeight: "700",
    },
    productContent: {
        paddingBottom: 8,
    },
    productInfo: {
        padding: 12,
        paddingBottom: 0,
    },
    productName: {
        fontSize: 14,
        fontWeight: "600",
        color: "#111827",
        marginBottom: 6,
        height: 36,
    },
    priceRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
    productPrice: {
        fontSize: 16,
        fontWeight: "700",
        color: "#0F766E",
        marginRight: 8,
    },
    originalPrice: {
        fontSize: 12,
        color: "#9CA3AF",
        textDecorationLine: "line-through",
    },
    ratingRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    productRating: {
        fontSize: 12,
        color: "#6B7280",
        marginLeft: 4,
        fontWeight: "500",
    },
    buttonRow: {
        flexDirection: "row",
        borderTopWidth: 1,
        borderTopColor: "#F3F4F6",
    },
    cartButton: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#0F766E",
        padding: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    wishlistButton: {
        backgroundColor: "#10B981",
        padding: 12,
        alignItems: "center",
        justifyContent: "center",
        width: 50,
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "700",
        marginLeft: 6,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 18,
        color: "#9CA3AF",
        marginTop: 16,
    },
});
