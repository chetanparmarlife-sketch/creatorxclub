import { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { colors } from "@/lib/theme";
import { ShippingAddress, useUpdateShippingAddress } from "@/lib/hooks/useActiveCampaigns";

type ShippingAddressModalProps = {
  visible: boolean;
  campaignId: string;
  initialAddress?: ShippingAddress | null;
  onClose: () => void;
};

const emptyAddress: ShippingAddress = {
  street: "",
  city: "",
  state: "",
  pincode: "",
  country: "India"
};

export function ShippingAddressModal({ visible, campaignId, initialAddress, onClose }: ShippingAddressModalProps) {
  const updateShippingAddress = useUpdateShippingAddress();
  const [address, setAddress] = useState<ShippingAddress>(emptyAddress);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setAddress(initialAddress ?? emptyAddress);
      setError(null);
    }
  }, [initialAddress, visible]);

  const updateField = (field: keyof ShippingAddress, value: string) => {
    setAddress((current) => ({
      ...current,
      [field]: field === "pincode" ? value.replace(/\D/g, "").slice(0, 6) : value
    }));
    setError(null);
  };

  const save = async () => {
    const values = Object.values(address).map((value) => value.trim());
    if (values.some((value) => !value)) {
      setError("Please fill all address fields.");
      return;
    }
    await updateShippingAddress.mutateAsync({ ...address, campaignId });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>Shipping Address</Text>
          <Text style={styles.subtitle}>Products for gifting campaigns will be shipped here.</Text>

          <AddressInput label="Street address" value={address.street} onChangeText={(value) => updateField("street", value)} multiline />
          <View style={styles.row}>
            <AddressInput label="City" value={address.city} onChangeText={(value) => updateField("city", value)} style={styles.half} />
            <AddressInput label="State" value={address.state} onChangeText={(value) => updateField("state", value)} style={styles.half} />
          </View>
          <View style={styles.row}>
            <AddressInput label="Pincode" value={address.pincode} onChangeText={(value) => updateField("pincode", value)} keyboardType="number-pad" style={styles.half} />
            <AddressInput label="Country" value={address.country} onChangeText={(value) => updateField("country", value)} style={styles.half} />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}
          {updateShippingAddress.isError ? <Text style={styles.error}>Could not save address. Please try again.</Text> : null}

          <PrimaryButton label="Save Address" loading={updateShippingAddress.isPending} onPress={save} />
        </View>
      </View>
    </Modal>
  );
}

type AddressInputProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  multiline?: boolean;
  keyboardType?: "default" | "number-pad";
  style?: object;
};

function AddressInput({ label, value, onChangeText, multiline, keyboardType = "default", style }: AddressInputProps) {
  return (
    <View style={[styles.field, style]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        keyboardType={keyboardType}
        placeholderTextColor={colors.textFaint}
        style={[styles.input, multiline ? styles.multiline : null]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.55)"
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: colors.borderGlass,
    backgroundColor: colors.surfaceSolid,
    padding: 22,
    paddingBottom: 30
  },
  handle: {
    alignSelf: "center",
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderSoft,
    marginBottom: 18
  },
  title: {
    color: colors.textPrimary,
    fontSize: 21,
    fontWeight: "900"
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 6,
    marginBottom: 18
  },
  row: {
    flexDirection: "row",
    gap: 12
  },
  half: {
    flex: 1
  },
  field: {
    marginBottom: 14
  },
  label: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 7,
    textTransform: "uppercase",
    letterSpacing: 0.6
  },
  input: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderGlass,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    paddingHorizontal: 14,
    fontSize: 14,
    fontWeight: "600"
  },
  multiline: {
    minHeight: 82,
    paddingTop: 13,
    textAlignVertical: "top"
  },
  error: {
    color: colors.error,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 12
  }
});
