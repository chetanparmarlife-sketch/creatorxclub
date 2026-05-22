import { Text, View } from "react-native";
import { GlassCard } from "@/components/ui/GlassCard";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { colors } from "@/lib/theme";

export default function WalletRoute() {
  return (
    <ScreenShell>
      <View style={{ flex: 1, gap: 20, paddingBottom: 90 }}>
        <ScreenHeader title="Wallet" subtitle="Earnings, withdrawals, and transparent fee history." />
        <GlassCard>
          <Text style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 22 }}>Wallet balances and transactions will bind to Creator finance endpoints.</Text>
        </GlassCard>
      </View>
    </ScreenShell>
  );
}
