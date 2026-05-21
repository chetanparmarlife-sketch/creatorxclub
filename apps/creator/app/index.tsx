import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0B0B14",
        padding: 24
      }}
    >
      <Text style={{ color: "#FFFFFF", fontSize: 32, fontWeight: "700" }}>
        CreatorX
      </Text>
      <Text style={{ marginTop: 8, color: "#C4C0D4", textAlign: "center" }}>
        Creator mobile app scaffold. Phase 2 will wire the Mowgli onboarding screens.
      </Text>
    </View>
  );
}
