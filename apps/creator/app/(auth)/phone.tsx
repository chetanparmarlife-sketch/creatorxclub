import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GlassCard } from "@/components/ui/GlassCard";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { api } from "@/lib/api";
import { colors } from "@/lib/theme";

type Country = {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
  minLength: number;
  maxLength: number;
};

const countries: Country[] = [
  { name: "Argentina", code: "AR", dialCode: "+54", flag: "🇦🇷", minLength: 10, maxLength: 10 },
  { name: "Australia", code: "AU", dialCode: "+61", flag: "🇦🇺", minLength: 9, maxLength: 9 },
  { name: "Bangladesh", code: "BD", dialCode: "+880", flag: "🇧🇩", minLength: 10, maxLength: 10 },
  { name: "Brazil", code: "BR", dialCode: "+55", flag: "🇧🇷", minLength: 10, maxLength: 11 },
  { name: "Canada", code: "CA", dialCode: "+1", flag: "🇨🇦", minLength: 10, maxLength: 10 },
  { name: "China", code: "CN", dialCode: "+86", flag: "🇨🇳", minLength: 11, maxLength: 11 },
  { name: "France", code: "FR", dialCode: "+33", flag: "🇫🇷", minLength: 9, maxLength: 9 },
  { name: "Germany", code: "DE", dialCode: "+49", flag: "🇩🇪", minLength: 10, maxLength: 11 },
  { name: "India", code: "IN", dialCode: "+91", flag: "🇮🇳", minLength: 10, maxLength: 10 },
  { name: "Indonesia", code: "ID", dialCode: "+62", flag: "🇮🇩", minLength: 9, maxLength: 12 },
  { name: "Italy", code: "IT", dialCode: "+39", flag: "🇮🇹", minLength: 9, maxLength: 10 },
  { name: "Japan", code: "JP", dialCode: "+81", flag: "🇯🇵", minLength: 10, maxLength: 10 },
  { name: "Mexico", code: "MX", dialCode: "+52", flag: "🇲🇽", minLength: 10, maxLength: 10 },
  { name: "Netherlands", code: "NL", dialCode: "+31", flag: "🇳🇱", minLength: 9, maxLength: 9 },
  { name: "Pakistan", code: "PK", dialCode: "+92", flag: "🇵🇰", minLength: 10, maxLength: 10 },
  { name: "Singapore", code: "SG", dialCode: "+65", flag: "🇸🇬", minLength: 8, maxLength: 8 },
  { name: "South Africa", code: "ZA", dialCode: "+27", flag: "🇿🇦", minLength: 9, maxLength: 9 },
  { name: "United Arab Emirates", code: "AE", dialCode: "+971", flag: "🇦🇪", minLength: 9, maxLength: 9 },
  { name: "United Kingdom", code: "GB", dialCode: "+44", flag: "🇬🇧", minLength: 10, maxLength: 10 },
  { name: "United States", code: "US", dialCode: "+1", flag: "🇺🇸", minLength: 10, maxLength: 10 }
].sort((a, b) => a.name.localeCompare(b.name));

const topCountryCodes = new Set(["IN", "US", "GB", "AE", "CA", "AU", "SG", "PK", "BD", "ID"]);

export default function PhoneRoute() {
  const india = countries.find((country) => country.code === "IN") ?? countries[0];
  const [country, setCountry] = useState<Country>(india);
  const [phone, setPhone] = useState("");
  const [search, setSearch] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const filteredCountries = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return countries;
    return countries.filter((item) => item.name.toLowerCase().includes(query) || item.dialCode.includes(query));
  }, [search]);

  const topCountries = useMemo(() => countries.filter((item) => topCountryCodes.has(item.code)), []);

  const normalizedDigits = phone.replace(/\D/g, "");
  const phoneNumber = `${country.dialCode}${normalizedDigits}`;

  const validate = () => {
    if (normalizedDigits.length < country.minLength || normalizedDigits.length > country.maxLength) {
      const message =
        country.code === "IN"
          ? "Please enter a valid 10-digit phone number. This format isn't recognized."
          : `Please enter a valid ${country.name} phone number.`;
      setError(message);
      return false;
    }
    return true;
  };

  const submit = async () => {
    if (!validate()) return;
    setLoading(true);
    setError(undefined);
    try {
      await api.post("/api/auth/send-otp", { phoneNumber });
      router.push({ pathname: "/(auth)/otp", params: { phoneNumber } });
    } catch {
      setError("Could not send the code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectCountry = (item: Country) => {
    setCountry(item);
    setSearch("");
    setError(undefined);
    setSheetOpen(false);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.center}>
        <View style={styles.meshTop} />
        <View style={styles.meshBottom} />

        <Pressable accessibilityRole="button" onPress={() => router.replace("/(auth)/launch")} style={styles.backButton}>
          <Ionicons name="chevron-back" size={18} color={colors.textPrimary} />
        </Pressable>

        <GlassCard style={styles.card}>
          <View style={styles.illustration}>
            <View style={styles.illustrationGlow} />
            <Ionicons name="phone-portrait-outline" size={44} color={colors.primary} />
          </View>

          <View style={styles.header}>
            <Text style={styles.title}>What's your number?</Text>
            <Text style={styles.subtitle}>We'll send you a code to verify it's really you.</Text>
          </View>

          <PhoneInput
            countryCode={country.dialCode}
            countryLabel={`${country.flag} ${country.dialCode}`}
            value={phone}
            onChangeText={(value) => {
              setPhone(value.replace(/[^\d\s-]/g, ""));
              setError(undefined);
            }}
            error={error}
            placeholder={country.code === "IN" ? "98765 43210" : "(555) 000-0000"}
            onCountryPress={() => setSheetOpen(true)}
          />

          <Text style={styles.privacy}>By continuing, you agree to receive SMS messages. Message and data rates may apply.</Text>
          <PrimaryButton label="Send OTP" loading={loading} onPress={submit} disabled={Boolean(error)} />
        </GlassCard>

        <CountrySheet
          visible={sheetOpen}
          search={search}
          onSearch={setSearch}
          topCountries={topCountries}
          countries={filteredCountries}
          selectedCode={country.code}
          onSelect={selectCountry}
          onClose={() => setSheetOpen(false)}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type CountrySheetProps = {
  visible: boolean;
  search: string;
  onSearch: (value: string) => void;
  topCountries: Country[];
  countries: Country[];
  selectedCode: string;
  onSelect: (country: Country) => void;
  onClose: () => void;
};

function CountrySheet({ visible, search, onSearch, topCountries, countries: list, selectedCode, onSelect, onClose }: CountrySheetProps) {
  const renderCountry = ({ item }: { item: Country }) => (
    <Pressable accessibilityRole="button" onPress={() => onSelect(item)} style={styles.countryRow}>
      <Text style={styles.countryFlag}>{item.flag}</Text>
      <View style={styles.countryCopy}>
        <Text style={styles.countryName}>{item.name}</Text>
        <Text style={styles.countryDial}>{item.dialCode}</Text>
      </View>
      {selectedCode === item.code ? <Ionicons name="checkmark-circle" size={20} color={colors.primary} /> : null}
    </Pressable>
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.scrim} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.sheetHandle} />
        <Text style={styles.sheetTitle}>Select country code</Text>
        <TextInput value={search} onChangeText={onSearch} placeholder="Search country or code" placeholderTextColor={colors.textMuted} style={styles.searchInput} />
        {!search ? (
          <>
            <Text style={styles.sectionLabel}>Top countries</Text>
            <View style={styles.topGrid}>
              {topCountries.map((item) => (
                <Pressable key={item.code} onPress={() => onSelect(item)} style={styles.topChip}>
                  <Text style={styles.topChipText}>{`${item.flag} ${item.dialCode}`}</Text>
                </Pressable>
              ))}
            </View>
          </>
        ) : null}
        <Text style={styles.sectionLabel}>All countries</Text>
        <FlatList data={list} keyExtractor={(item) => item.code} renderItem={renderCountry} keyboardShouldPersistTaps="handled" />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16
  },
  meshTop: {
    position: "absolute",
    top: -80,
    right: -60,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: colors.primarySoft,
    opacity: 0.06
  },
  meshBottom: {
    position: "absolute",
    bottom: -40,
    left: -40,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: colors.errorSoft,
    opacity: 0.04
  },
  backButton: {
    position: "absolute",
    top: 18,
    left: 20,
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(91,79,233,0.06)",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOpacity: 0.06,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2
  },
  card: {
    maxWidth: 480,
    padding: 32,
    alignItems: "center"
  },
  illustration: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: "rgba(91,79,233,0.06)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32
  },
  illustrationGlow: {
    position: "absolute",
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: "rgba(91,79,233,0.04)"
  },
  header: {
    alignItems: "center",
    marginBottom: 30
  },
  title: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: "900",
    lineHeight: 31,
    letterSpacing: -0.52,
    marginBottom: 12
  },
  subtitle: {
    maxWidth: 300,
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "300",
    lineHeight: 21,
    textAlign: "center"
  },
  privacy: {
    maxWidth: 320,
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "300",
    lineHeight: 19,
    textAlign: "center",
    marginVertical: 24
  },
  scrim: {
    flex: 1,
    backgroundColor: "rgba(26,26,46,0.28)"
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: "78%",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30
  },
  sheetHandle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderSoft,
    alignSelf: "center",
    marginBottom: 18
  },
  sheetTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 14
  },
  searchInput: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingHorizontal: 14,
    color: colors.textPrimary,
    fontSize: 15,
    marginBottom: 18
  },
  sectionLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 10,
    textTransform: "uppercase"
  },
  topGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 18
  },
  topChip: {
    borderRadius: 999,
    backgroundColor: "rgba(91,79,233,0.08)",
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  topChipText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "800"
  },
  countryRow: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(232,228,240,0.7)"
  },
  countryFlag: {
    fontSize: 24
  },
  countryCopy: {
    flex: 1
  },
  countryName: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "700"
  },
  countryDial: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2
  }
});
