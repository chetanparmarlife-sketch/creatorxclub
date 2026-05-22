import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/lib/theme";

type ProgressDotsProps = {
  steps: string[];
  currentIndex: number;
};

export function ProgressDots({ steps, currentIndex }: ProgressDotsProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.topRow}>
        <Text style={styles.stepText}>Step {currentIndex + 1} of {steps.length}</Text>
        <View style={styles.dots}>
          {steps.map((step, index) => {
            const active = index <= currentIndex;
            return <View key={step} style={[styles.dot, active ? styles.activeDot : null]} />;
          })}
        </View>
      </View>
      <Text style={styles.label}>{steps[currentIndex]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    gap: 10
  },
  topRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  stepText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1
  },
  dots: {
    flexDirection: "row",
    gap: 8
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.borderSoft
  },
  activeDot: {
    width: 24,
    backgroundColor: colors.primary
  },
  label: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center"
  }
});
