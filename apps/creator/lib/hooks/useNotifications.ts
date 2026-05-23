import { InfiniteData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type NotificationType = "CAMPAIGN" | "PAYMENT" | "SYSTEM" | "CHAT";
export type NotificationFilter = NotificationType | "ALL";

export type CreatorNotification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  deepLink?: string | null;
  isRead: boolean;
  createdAt: string;
};

type NotificationPage = {
  notifications: CreatorNotification[];
  page: number;
  totalPages: number;
  last: boolean;
};

const PAGE_SIZE = 20;

export function useNotifications(typeFilter: NotificationFilter = "ALL") {
  const query = useInfiniteQuery({
    queryKey: ["notifications", typeFilter],
    initialPageParam: 0,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
    queryFn: async ({ pageParam }) => {
      const { data } = await api.get("/api/notifications", {
        params: {
          type: typeFilter === "ALL" ? undefined : typeFilter,
          page: pageParam,
          limit: PAGE_SIZE
        }
      });
      return normalizePage(data, Number(pageParam));
    },
    getNextPageParam: (lastPage, pages) => (lastPage.last ? undefined : pages.length)
  });

  return {
    ...query,
    notifications: query.data?.pages.flatMap((page) => page.notifications) ?? []
  };
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ["unread-count"],
    staleTime: 15 * 1000,
    refetchInterval: 30 * 1000,
    queryFn: async () => {
      const { data } = await api.get("/api/notifications/unread-count");
      return { count: Number(data?.count ?? 0) };
    }
  });
}

export function useMarkAllRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.put("/api/notifications/mark-all-read");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
    }
  });
}

export function useMarkOneRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.put(`/api/notifications/${id}/read`);
      return normalizeNotification(data);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      const previous = queryClient.getQueriesData<InfiniteData<NotificationPage>>({ queryKey: ["notifications"] });
      previous.forEach(([queryKey, data]) => {
        if (!data) return;
        queryClient.setQueryData<InfiniteData<NotificationPage>>(queryKey, {
          ...data,
          pages: data.pages.map((page) => ({
            ...page,
            notifications: page.notifications.map((notification) => notification.id === id ? { ...notification, isRead: true } : notification)
          }))
        });
      });
      queryClient.setQueryData<{ count: number }>(["unread-count"], (current) => ({ count: Math.max((current?.count ?? 1) - 1, 0) }));
      return { previous };
    },
    onError: (_error, _id, context) => {
      context?.previous?.forEach(([queryKey, data]) => queryClient.setQueryData(queryKey, data));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
    }
  });
}

function normalizePage(payload: any, fallbackPage: number): NotificationPage {
  const raw = payload?.notifications ?? payload?.content ?? payload?.items ?? payload?.data ?? [];
  const page = Number(payload?.page ?? payload?.number ?? fallbackPage);
  const totalPages = Number(payload?.totalPages ?? payload?.pageCount ?? (payload?.last ? page + 1 : page + 2));
  const last = typeof payload?.last === "boolean" ? payload.last : page + 1 >= totalPages;
  return {
    notifications: Array.isArray(raw) ? raw.map(normalizeNotification) : [],
    page,
    totalPages,
    last
  };
}

function normalizeNotification(value: any): CreatorNotification {
  return {
    id: String(value.id),
    type: normalizeType(value.type),
    title: String(value.title ?? "Notification"),
    message: String(value.message ?? ""),
    deepLink: value.deepLink ?? null,
    isRead: Boolean(value.isRead ?? value.read),
    createdAt: String(value.createdAt ?? new Date().toISOString())
  };
}

function normalizeType(value: unknown): NotificationType {
  const type = String(value ?? "SYSTEM").toUpperCase();
  if (type === "CAMPAIGN" || type === "PAYMENT" || type === "CHAT") return type;
  return "SYSTEM";
}
