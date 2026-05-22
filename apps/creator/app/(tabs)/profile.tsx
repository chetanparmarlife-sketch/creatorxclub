import { Text, View } from "react-native";
import { Badge } from "@/components/ui/Badge";
import { GlassCard } from "@/components/ui/GlassCard";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { colors } from "@/lib/theme";
import { useAuthStore } from "@/store/auth";

export default function ProfileRoute() {
  const user = useAuthStore((state) => state.user);

  return (
    <ScreenShell>
      <View style={{ flex: 1, gap: 20, paddingBottom: 90 }}>
        <ScreenHeader title="Profile" subtitle={user?.displayName ?? "Creator settings and verification."} />
        <GlassCard style={{ gap: 14 }}>
          <Badge label={user?.kycStatus ?? "PENDING"} variant={user?.kycStatus === "APPROVED" ? "approved" : user?.kycStatus === "REJECTED" ? "rejected" : "pending"} />
          <Text style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 22 }}>Profile, connected accounts, notifications, and KYC status controls will be built here.</Text>
        </GlassCard>
      </View>
    </ScreenShell>
  );
}
