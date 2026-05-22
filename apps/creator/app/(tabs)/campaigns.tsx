import { Text, View } from "react-native";
import { GlassCard } from "@/components/ui/GlassCard";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { colors } from "@/lib/theme";

export default function CampaignsRoute() {
  return (
    <ScreenShell>
      <View style={{ flex: 1, gap: 20, paddingBottom: 90 }}>
        <ScreenHeader title="Campaigns" subtitle="Active and completed campaigns." />
        <GlassCard>
          <Text style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 22 }}>Your approved campaigns and SLA countdowns will live here.</Text>
        </GlassCard>
      </View>
    </ScreenShell>
  );
}
