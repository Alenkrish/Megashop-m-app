import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Image,
    Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import API from "../api/api";

const { width } = Dimensions.get("window");

export default function ProductDetailScreen({ route, navigation }) {
    const { product } = route.params;

    const addToCart = async () => {
        try {
            await API.post("/cart", { product_id: product.id, quantity: 1 });
            Alert.alert(
                "Success",
                "Added to cart",
                [
                    { text: "Continue Shopping" },
                    { text: "View Cart", onPress: () => navigation.navigate("Cart") }
                ]
            );
        } catch (err) {
            Alert.alert("Error", "Failed to add to cart");
        }
    };

    const addToWishlist = async () => {
        try {
            await API.post("/wishlist", { product_id: product.id });
            Alert.alert("Success", "Added to wishlist");
        } catch (err) {
            Alert.alert("Error", "Failed to add to wishlist");
        }
    };

    const imageUrl = product.images && product.images[0];

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.imageContainer}>
                    {imageUrl ? (
                        <Image source={{ uri: imageUrl }} style={styles.productImage} />
                    ) : (
                        <View style={styles.placeholderImage}>
                            <Ionicons name="image-outline" size={80} color="#9CA3AF" />
                        </View>
                    )}
                    <LinearGradient
                        colors={["transparent", "rgba(0,0,0,0.4)"]}
                        style={styles.imageGradient}
                    />
                </View>

                <View style={styles.contentContainer}>
                    <View style={styles.headerRow}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.productName}>{product.name}</Text>
                            {product.rating && (
                                <View style={styles.ratingContainer}>
                                    <Ionicons name="star" size={16} color="#F59E0B" />
                                    <Text style={styles.ratingText}>
                                        {product.rating} ({product.review_count || 0} reviews)
                                    </Text>
                                </View>
                            )}
                        </View>
                        <Text style={styles.productPrice}>Rs.{product.price}</Text>
                    </View>

                    <View style={styles.divider} />

                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.description}>
                        {product.description || "No description available for this product."}
                    </Text>

                    <View style={styles.featuresContainer}>
                        <View style={styles.featureItem}>
                            <View style={styles.featureIcon}>
                                <Ionicons name="timer-outline" size={24} color="#0F766E" />
                            </View>
                            <Text style={styles.featureText}>Fast Delivery</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <View style={styles.featureIcon}>
                                <Ionicons name="shield-checkmark-outline" size={24} color="#0F766E" />
                            </View>
                            <Text style={styles.featureText}>Genuine Product</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <View style={styles.featureIcon}>
                                <Ionicons name="refresh-circle-outline" size={24} color="#0F766E" />
                            </View>
                            <Text style={styles.featureText}>7 Days Return</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.wishlistButton} onPress={addToWishlist}>
                    <Ionicons name="heart-outline" size={24} color="#0F766E" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.cartButton} onPress={addToCart}>
                    <Ionicons name="cart" size={24} color="#FFFFFF" />
                    <Text style={styles.buttonText}>Add to Cart</Text>
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
    scrollContent: {
        paddingBottom: 100,
    },
    imageContainer: {
        width: width,
        height: 350,
        backgroundColor: "#FFFFFF",
        position: "relative",
    },
    productImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    placeholderImage: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F3F4F6",
    },
    imageGradient: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
    },
    contentContainer: {
        backgroundColor: "#FFFFFF",
        marginTop: -20,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
    },
    headerRow: {
        marginBottom: 16,
    },
    titleContainer: {
        marginBottom: 8,
    },
    productName: {
        fontSize: 24,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 8,
    },
    productPrice: {
        fontSize: 28,
        fontWeight: "700",
        color: "#0F766E",
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FEF3C7",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: "flex-start",
    },
    ratingText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#92400E",
        marginLeft: 4,
    },
    divider: {
        height: 1,
        backgroundColor: "#E5E7EB",
        marginVertical: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        color: "#4B5563",
        lineHeight: 24,
        marginBottom: 24,
    },
    featuresContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#F9FAFB",
        padding: 16,
        borderRadius: 16,
    },
    featureItem: {
        alignItems: "center",
    },
    featureIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#F0FDFA",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
    },
    featureText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#0F766E",
        textAlign: "center",
    },
    bottomBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#FFFFFF",
        padding: 16,
        paddingBottom: 24,
        flexDirection: "row",
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 8,
    },
    wishlistButton: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: "#F0FDFA",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
        borderWidth: 1,
        borderColor: "#CCFBF1",
    },
    cartButton: {
        flex: 1,
        backgroundColor: "#0F766E",
        borderRadius: 16,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#0F766E",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "700",
        marginLeft: 8,
    },
});
