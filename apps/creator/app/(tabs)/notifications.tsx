import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { ScreenShell } from "@/components/ui/ScreenShell";
import {
  CreatorNotification,
  NotificationFilter,
  NotificationType,
  useMarkAllRead,
  useMarkOneRead,
  useNotifications,
  useUnreadCount
} from "@/lib/hooks/useNotifications";
import { colors } from "@/lib/theme";

const filters: Array<{ label: string; value: NotificationFilter; icon: string }> = [
  { label: "All", value: "ALL", icon: "🔔" },
  { label: "Campaigns", value: "CAMPAIGN", icon: "📢" },
  { label: "Payments", value: "PAYMENT", icon: "💰" },
  { label: "System", value: "SYSTEM", icon: "⚙️" },
  { label: "Chat", value: "CHAT", icon: "💬" }
];

export default function NotificationsRoute() {
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>("ALL");
  const notificationsQuery = useNotifications(activeFilter);
  const allNotificationsQuery = useNotifications("ALL");
  const unreadCount = useUnreadCount();
  const markAllRead = useMarkAllRead();
  const markOneRead = useMarkOneRead();
  const notifications = notificationsQuery.notifications;
  const count = unreadCount.data?.count ?? 0;
  const unreadByType = allNotificationsQuery.notifications.reduce<Record<NotificationType, number>>(
    (acc, notification) => {
      if (!notification.isRead) {
        acc[notification.type] += 1;
      }
      return acc;
    },
    { CAMPAIGN: 0, PAYMENT: 0, SYSTEM: 0, CHAT: 0 }
  );

  const openNotification = (notification: CreatorNotification) => {
    if (!notification.isRead) {
      markOneRead.mutate(notification.id);
    }
    navigateDeepLink(notification.deepLink);
  };

  return (
    <ScreenShell>
      <View style={styles.root}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Notifications</Text>
            <Text style={styles.subtitle}>{count} new notifications</Text>
          </View>
          {count > 0 ? (
            <Pressable disabled={markAllRead.isPending} onPress={() => markAllRead.mutate()} style={styles.markAllButton}>
              <Ionicons name="checkmark-done-outline" size={16} color={colors.primarySoft} />
              <Text style={styles.markAllText}>Mark all read</Text>
            </Pressable>
          ) : null}
        </View>

        <FlatList
          horizontal
          data={filters}
          keyExtractor={(item) => item.value}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => (
            <Pressable onPress={() => setActiveFilter(item.value)} style={styles.filterTab}>
              <Text style={[styles.filterText, activeFilter === item.value ? styles.filterTextActive : null]}>{item.label}</Text>
              {activeFilter === item.value ? <View style={styles.filterUnderline} /> : null}
              {filterBadgeCount(item.value, count, unreadByType) > 0 ? (
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>{filterBadgeCount(item.value, count, unreadByType) > 9 ? "9+" : filterBadgeCount(item.value, count, unreadByType)}</Text>
                </View>
              ) : null}
            </Pressable>
          )}
        />

        {notificationsQuery.isLoading ? (
          <View style={styles.loading}>
            <ActivityIndicator color={colors.primarySoft} />
          </View>
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={notifications.length ? styles.listContent : styles.emptyContent}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            refreshControl={<RefreshControl refreshing={notificationsQuery.isRefetching} onRefresh={notificationsQuery.refetch} tintColor={colors.primarySoft} />}
            onEndReached={() => {
              if (notificationsQuery.hasNextPage && !notificationsQuery.isFetchingNextPage) {
                notificationsQuery.fetchNextPage();
              }
            }}
            onEndReachedThreshold={0.45}
            ListFooterComponent={notificationsQuery.isFetchingNextPage ? <ActivityIndicator color={colors.primarySoft} style={styles.footerLoader} /> : null}
            ListEmptyComponent={<EmptyState filter={activeFilter} />}
            renderItem={({ item }) => <NotificationRow notification={item} onPress={() => openNotification(item)} />}
          />
        )}
      </View>
    </ScreenShell>
  );
}

function NotificationRow({ notification, onPress }: { notification: CreatorNotification; onPress: () => void }) {
  const meta = typeMeta(notification.type);
  return (
    <Pressable onPress={onPress} style={[styles.row, !notification.isRead ? styles.rowUnread : null]}>
      {notification.isRead ? null : <View style={styles.unreadDot} />}
      <View style={[styles.typeIcon, { backgroundColor: meta.background }]}>
        <Text style={styles.typeEmoji}>{meta.emoji}</Text>
      </View>
      <View style={styles.rowContent}>
        <View style={styles.rowTop}>
          <Text numberOfLines={1} style={[styles.rowTitle, !notification.isRead ? styles.rowTitleUnread : null]}>
            {notification.title}
          </Text>
          <Text style={styles.timeText}>{relativeTime(notification.createdAt)}</Text>
        </View>
        <Text numberOfLines={2} style={styles.messageText}>
          {notification.message}
        </Text>
      </View>
    </Pressable>
  );
}

function EmptyState({ filter }: { filter: NotificationFilter }) {
  const meta = filter === "ALL" ? { emoji: "🔕", label: "No notifications yet" } : { emoji: filters.find((item) => item.value === filter)?.icon ?? "🔕", label: "No notifications yet" };
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Text style={styles.emptyEmoji}>{meta.emoji}</Text>
      </View>
      <Text style={styles.emptyTitle}>{meta.label}</Text>
      <Text style={styles.emptyCopy}>You are all caught up. Updates will appear here as soon as something needs your attention.</Text>
    </View>
  );
}

function typeMeta(type: NotificationType) {
  if (type === "CAMPAIGN") return { emoji: "📢", background: "rgba(91,79,233,0.15)" };
  if (type === "PAYMENT") return { emoji: "💰", background: "rgba(73,160,120,0.15)" };
  if (type === "CHAT") return { emoji: "💬", background: "rgba(93,173,226,0.15)" };
  return { emoji: "⚙️", background: "rgba(142,137,166,0.15)" };
}

function filterBadgeCount(filter: NotificationFilter, total: number, counts: Record<NotificationType, number>) {
  return filter === "ALL" ? total : counts[filter];
}

function navigateDeepLink(deepLink?: string | null) {
  if (!deepLink) return;
  if (deepLink.startsWith("/campaigns/")) {
    router.push(deepLink as any);
    return;
  }
  if (deepLink.startsWith("/wallet")) {
    router.push("/(tabs)/wallet" as any);
    return;
  }
  if (deepLink.startsWith("/chat")) {
    router.push("/(tabs)/chat" as any);
  }
}

function relativeTime(value: string) {
  const then = new Date(value).getTime();
  const diff = Math.max(0, Date.now() - then);
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingBottom: 90
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    marginBottom: 14
  },
  title: {
    color: colors.textPrimary,
    fontSize: 25,
    fontWeight: "900"
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 3
  },
  markAllButton: {
    minHeight: 38,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderGlass,
    backgroundColor: colors.surface,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12
  },
  markAllText: {
    color: colors.primarySoft,
    fontSize: 12,
    fontWeight: "900"
  },
  filterList: {
    gap: 16,
    paddingVertical: 10
  },
  filterTab: {
    minHeight: 36,
    justifyContent: "center",
    paddingHorizontal: 2
  },
  filterText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "800"
  },
  filterTextActive: {
    color: colors.primarySoft
  },
  filterUnderline: {
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.primarySoft,
    marginTop: 7
  },
  filterBadge: {
    position: "absolute",
    top: 0,
    right: -16,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.error,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4
  },
  filterBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900"
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 28
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: "center"
  },
  row: {
    position: "relative",
    flexDirection: "row",
    gap: 13,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "transparent",
    backgroundColor: "rgba(255,255,255,0.04)",
    padding: 14
  },
  rowUnread: {
    borderColor: colors.borderGlass,
    backgroundColor: colors.surface
  },
  unreadDot: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#5DADE2"
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center"
  },
  typeEmoji: {
    fontSize: 22
  },
  rowContent: {
    flex: 1,
    paddingRight: 12
  },
  rowTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 4
  },
  rowTitle: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "700"
  },
  rowTitleUnread: {
    color: colors.textPrimary,
    fontWeight: "900"
  },
  timeText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "700"
  },
  messageText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19
  },
  footerLoader: {
    paddingVertical: 18
  },
  emptyState: {
    alignItems: "center",
    paddingHorizontal: 20
  },
  emptyIcon: {
    width: 78,
    height: 78,
    borderRadius: 22,
    backgroundColor: "rgba(91,79,233,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16
  },
  emptyEmoji: {
    fontSize: 32
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 19,
    fontWeight: "900"
  },
  emptyCopy: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 8
  }
});
