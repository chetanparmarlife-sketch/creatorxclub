import { Text, View } from "react-native";
import { GlassCard } from "@/components/ui/GlassCard";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { colors } from "@/lib/theme";

export default function ChatRoute() {
  return (
    <ScreenShell>
      <View style={{ flex: 1, gap: 20, paddingBottom: 90 }}>
        <ScreenHeader title="Chat" subtitle="Campaign conversations and Team CreatorX support." />
        <GlassCard>
          <Text style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 22 }}>Real-time chat threads will connect here through the WebSocket layer.</Text>
        </GlassCard>
      </View>
    </ScreenShell>
  );
}
