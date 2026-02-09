import React, { useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ScrollView,
    Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../context/AuthContext";

export default function UserScreen({ navigation }) {
    const { logout } = useContext(AuthContext);

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: logout,
                },
            ]
        );
    };

    const handleChangePassword = () => {
        Alert.alert(
            "Coming Soon",
            "This feature will be available in the next update!",
            [{ text: "OK" }]
        );
    };

    const MenuOption = ({ icon, title, subtitle, onPress, isDestructive = false }) => (
        <TouchableOpacity
            style={styles.menuOption}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={[styles.iconContainer, isDestructive && styles.destructiveIcon]}>
                <Ionicons
                    name={icon}
                    size={24}
                    color={isDestructive ? "#EF4444" : "#0F766E"}
                />
            </View>
            <View style={styles.menuTextContainer}>
                <Text style={[styles.menuTitle, isDestructive && styles.destructiveText]}>
                    {title}
                </Text>
                {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
            </View>
            <Ionicons
                name="chevron-forward"
                size={20}
                color={isDestructive ? "#EF4444" : "#9CA3AF"}
            />
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container}>
            <LinearGradient
                colors={["#0F766E", "#14B8A6"]}
                style={styles.header}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.profileContainer}>
                    <View style={styles.avatarContainer}>
                        <Ionicons name="person" size={60} color="#0F766E" />
                    </View>
                    <Text style={styles.userName}>Welcome Back</Text>
                    <Text style={styles.userEmail}>Valued Customer</Text>
                </View>
            </LinearGradient>

            <View style={styles.contentContainer}>
                <Text style={styles.sectionTitle}>My Account</Text>

                <View style={styles.section}>
                    <MenuOption
                        icon="receipt-outline"
                        title="Order History"
                        subtitle="View your past purchases"
                        onPress={() => navigation.navigate("OrderHistory")}
                    />
                    <View style={styles.divider} />
                    <MenuOption
                        icon="heart-outline"
                        title="Wishlist"
                        subtitle="Your saved items"
                        onPress={() => navigation.navigate("Wishlist")}
                    />
                    <View style={styles.divider} />
                    <MenuOption
                        icon="location-outline"
                        title="Shipping Addresses"
                        subtitle="Manage delivery locations"
                        onPress={() => Alert.alert("Coming Soon")}
                    />
                </View>

                <Text style={styles.sectionTitle}>Settings</Text>

                <View style={styles.section}>
                    <MenuOption
                        icon="key-outline"
                        title="Change Password"
                        subtitle="Update your security"
                        onPress={handleChangePassword}
                    />
                    <View style={styles.divider} />
                    <MenuOption
                        icon="notifications-outline"
                        title="Notifications"
                        subtitle="Manage app alerts"
                        onPress={() => Alert.alert("Coming Soon")}
                    />
                </View>

                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <Text style={styles.logoutButtonText}>Log Out</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>App Version 1.0.0</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
    header: {
        paddingTop: 60,
        paddingBottom: 40,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        alignItems: "center",
    },
    profileContainer: {
        alignItems: "center",
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    userName: {
        fontSize: 24,
        fontWeight: "700",
        color: "#FFFFFF",
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 16,
        color: "#E0F2F1",
        opacity: 0.9,
    },
    contentContainer: {
        padding: 20,
        marginTop: -20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 12,
        marginTop: 12,
        marginLeft: 4,
    },
    section: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    menuOption: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: "#F0FDFA",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    destructiveIcon: {
        backgroundColor: "#FEF2F2",
    },
    menuTextContainer: {
        flex: 1,
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111827",
        marginBottom: 2,
    },
    menuSubtitle: {
        fontSize: 12,
        color: "#6B7280",
    },
    destructiveText: {
        color: "#EF4444",
    },
    divider: {
        height: 1,
        backgroundColor: "#F3F4F6",
        marginLeft: 72,
    },
    logoutButton: {
        marginTop: 24,
        backgroundColor: "#FEE2E2",
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#FECaca",
    },
    logoutButtonText: {
        color: "#EF4444",
        fontSize: 16,
        fontWeight: "700",
    },
    versionText: {
        textAlign: "center",
        color: "#9CA3AF",
        fontSize: 12,
        marginTop: 24,
        marginBottom: 40,
    },
});
