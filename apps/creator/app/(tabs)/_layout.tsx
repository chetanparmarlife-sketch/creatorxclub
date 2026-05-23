import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useUnreadCount } from "@/lib/hooks/useNotifications";
import { colors } from "@/lib/theme";

const chatUnreadCount = 0;

export default function TabsLayout() {
  const unreadCount = useUnreadCount();
  const notificationCount = unreadCount.data?.count ?? 0;

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
            <TabIconWithBadge icon="chatbubble-ellipses-outline" color={color} size={size} count={chatUnreadCount} />
          )
        }}
      />
      <Tabs.Screen name="wallet" options={{ title: "Wallet", tabBarIcon: ({ color, size }) => <Ionicons name="wallet-outline" color={color} size={size} /> }} />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Alerts",
          tabBarIcon: ({ color, size }) => <TabIconWithBadge icon="notifications-outline" color={color} size={size} count={notificationCount} />
        }}
      />
      <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: ({ color, size }) => <Ionicons name="person-circle-outline" color={color} size={size} /> }} />
    </Tabs>
  );
}

function TabIconWithBadge({ icon, color, size, count }: { icon: keyof typeof Ionicons.glyphMap; color: string; size: number; count: number }) {
  return (
    <View>
      <Ionicons name={icon} color={color} size={size} />
      {count > 0 ? (
        <View style={[styles.badge, count > 9 ? styles.badgeWide : null]}>
          <Text style={styles.badgeText}>{count > 9 ? "9+" : count}</Text>
        </View>
      ) : null}
    </View>
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
    fontSize: 10,
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
  badgeWide: {
    minWidth: 24
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900"
  }
});
