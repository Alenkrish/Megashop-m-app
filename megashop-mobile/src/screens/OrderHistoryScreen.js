import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import API from "../api/api";

export default function OrderHistoryScreen({ navigation }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await API.get("/orders");
            setOrders(res.data);
        } catch (err) {
            console.error("Failed to fetch orders:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchOrders();
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "completed":
                return "#10B981"; // Success Green
            case "pending":
                return "#F59E0B"; // Warning Yellow/Orange
            case "cancelled":
                return "#EF4444"; // Error Red
            default:
                return "#6B7280"; // Gray
        }
    };

    const renderOrder = ({ item }) => (
        <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
                <View style={styles.orderIdContainer}>
                    <Ionicons name="receipt-outline" size={20} color="#0F766E" />
                    <Text style={styles.orderNumber}>Order #{item.order_number}</Text>
                </View>
                <Text style={styles.orderDate}>
                    {new Date(item.created_at).toLocaleDateString()}
                </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.orderDetails}>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Total Amount</Text>
                    <Text style={styles.orderTotal}>Rs.{item.total}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Status</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                        <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                            {item.status.toUpperCase()}
                        </Text>
                    </View>
                </View>
            </View>

            <TouchableOpacity
                style={styles.viewDetailsButton}
                onPress={() => console.log("View Order Details", item.id)}
            >
                <Text style={styles.viewDetailsText}>View Details</Text>
                <Ionicons name="chevron-forward" size={16} color="#0F766E" />
            </TouchableOpacity>
        </View>
    );

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0F766E" />
                <Text style={styles.loadingText}>Loading your orders...</Text>
            </View>
        );
    }

    if (orders.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <View style={styles.iconContainer}>
                    <Ionicons name="bag-handle-outline" size={60} color="#0F766E" />
                </View>
                <Text style={styles.emptyText}>No orders yet</Text>
                <Text style={styles.emptySubtext}>Looks like you haven't made any purchases yet.</Text>
                <TouchableOpacity
                    style={styles.shopButton}
                    onPress={() => navigation.navigate("Products")}
                >
                    <Text style={styles.shopButtonText}>Start Shopping</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={["#0F766E", "#115E59"]}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>Order History</Text>
                <Text style={styles.headerSubtitle}>Track your past purchases</Text>
            </LinearGradient>

            <FlatList
                data={orders}
                renderItem={renderOrder}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#0F766E"]} />
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
        marginBottom: 8,
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
    shopButton: {
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
    shopButtonText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#FFFFFF",
    },
    listContainer: {
        padding: 16,
        paddingTop: 8,
    },
    orderCard: {
        backgroundColor: "#FFFFFF",
        marginTop: 8,
        marginBottom: 16,
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    orderHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    orderIdContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    orderNumber: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111827",
        marginLeft: 8,
    },
    orderDate: {
        fontSize: 14,
        color: "#6B7280",
    },
    divider: {
        height: 1,
        backgroundColor: "#F3F4F6",
        marginBottom: 12,
    },
    orderDetails: {
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    detailLabel: {
        fontSize: 14,
        color: "#6B7280",
    },
    orderTotal: {
        fontSize: 18,
        fontWeight: "700",
        color: "#0F766E",
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
    },
    statusText: {
        fontSize: 12,
        fontWeight: "700",
    },
    viewDetailsButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "#F3F4F6",
    },
    viewDetailsText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#0F766E",
        marginRight: 4,
    },
});
