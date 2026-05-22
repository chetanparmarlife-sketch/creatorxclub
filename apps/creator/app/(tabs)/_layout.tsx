import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/lib/theme";

const unreadCount = 3;

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: styles.label,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.item
      }}
    >
      <Tabs.Screen name="explore" options={{ title: "Explore", tabBarIcon: ({ color, size }) => <Ionicons name="sparkles-outline" color={color} size={size} /> }} />
      <Tabs.Screen name="campaigns" options={{ title: "Campaigns", tabBarIcon: ({ color, size }) => <Ionicons name="briefcase-outline" color={color} size={size} /> }} />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color, size }) => (
            <View>
              <Ionicons name="chatbubble-ellipses-outline" color={color} size={size} />
              {unreadCount > 0 ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              ) : null}
            </View>
          )
        }}
      />
      <Tabs.Screen name="wallet" options={{ title: "Wallet", tabBarIcon: ({ color, size }) => <Ionicons name="wallet-outline" color={color} size={size} /> }} />
      <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: ({ color, size }) => <Ionicons name="person-circle-outline" color={color} size={size} /> }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 14,
    height: 72,
    borderRadius: 24,
    borderTopWidth: 0,
    borderWidth: 1,
    borderColor: colors.borderGlass,
    backgroundColor: "rgba(255,255,255,0.90)",
    shadowColor: colors.primary,
    shadowOpacity: 0.12,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
    paddingTop: 10,
    paddingBottom: 10
  },
  item: {
    borderRadius: 18
  },
  label: {
    fontSize: 11,
    fontWeight: "700"
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -10,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.error,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900"
  }
});
