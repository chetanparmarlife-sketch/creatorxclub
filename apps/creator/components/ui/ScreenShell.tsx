import { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/lib/theme";

export function ScreenShell({ children }: PropsWithChildren) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.meshOne} />
      <View style={styles.meshTwo} />
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 18
  },
  meshOne: {
    position: "absolute",
    top: 80,
    left: -48,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: colors.primarySoft,
    opacity: 0.05
  },
  meshTwo: {
    position: "absolute",
    right: -80,
    bottom: 100,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: colors.errorSoft,
    opacity: 0.06
  }
});
