import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/lib/theme";

type ProgressDotsProps = {
  steps: string[];
  currentIndex: number;
};

export function ProgressDots({ steps, currentIndex }: ProgressDotsProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.dots}>
        {steps.map((step, index) => {
          const active = index <= currentIndex;
          return <View key={step} style={[styles.dot, active ? styles.activeDot : null]} />;
        })}
      </View>
      <Text style={styles.label}>{steps[currentIndex]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    gap: 10
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
    fontWeight: "700"
  }
});
