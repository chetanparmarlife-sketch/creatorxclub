import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Alert, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { useSubmitKyc } from "@/lib/hooks/useOnboardingMutations";
import { getSupabaseClient, supabaseUrl } from "@/lib/supabase";
import { colors } from "@/lib/theme";
import { useAuthStore } from "@/store/auth";
import { KycAsset, useOnboardingStore } from "@/store/onboarding";

type KycKey = "idFront" | "idBack" | "selfie";

const uploadCards: Array<{ key: KycKey; title: string; cta: string; icon: keyof typeof Ionicons.glyphMap }> = [
  { key: "idFront", title: "Government ID — Front", cta: "Upload", icon: "card-outline" },
  { key: "idBack", title: "Government ID — Back", cta: "Upload", icon: "card-outline" },
  { key: "selfie", title: "Live Selfie", cta: "Take Selfie", icon: "person-outline" }
];

export default function KycRoute() {
  const user = useAuthStore((state) => state.user);
  const updateKycStatus = useAuthStore((state) => state.updateKycStatus);
  const kyc = useOnboardingStore((state) => state.kyc);
  const setKycAsset = useOnboardingStore((state) => state.setKycAsset);
  const submitKyc = useSubmitKyc();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const allReady = Boolean(kyc.idFront && kyc.idBack && kyc.selfie);

  const pickId = (key: "idFront" | "idBack") => {
    Alert.alert("Upload document", "Choose how you want to add this document.", [
      { text: "Camera", onPress: () => pickFromCamera(key) },
      { text: "Gallery", onPress: () => pickFromLibrary(key) },
      { text: "Cancel", style: "cancel" }
    ]);
  };

  const pickFromLibrary = async (key: "idFront" | "idBack") => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.86 });
    if (!result.canceled) {
      setKycAsset(key, toAsset(result.assets[0], key));
    }
  };

  const pickFromCamera = async (key: "idFront" | "idBack") => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.86 });
    if (!result.canceled) {
      setKycAsset(key, toAsset(result.assets[0], key));
    }
  };

  const openSelfieCamera = async () => {
    if (!cameraPermission?.granted) {
      const permission = await requestCameraPermission();
      if (!permission.granted) return;
    }
    setCameraOpen(true);
  };

  const captureSelfie = async () => {
    const picture = await cameraRef.current?.takePictureAsync({ quality: 0.86 });
    if (!picture?.uri) return;
    setKycAsset("selfie", { uri: picture.uri, fileName: "selfie.jpg", mimeType: "image/jpeg" });
    setCameraOpen(false);
  };

  const submit = async () => {
    if (!allReady || !kyc.idFront || !kyc.idBack || !kyc.selfie) return;
    setUploading(true);
    try {
      const userId = user?.id ?? "anonymous";
      const [idFrontUrl, idBackUrl, selfieUrl] = await Promise.all([
        uploadKycAsset(kyc.idFront, `kyc/${userId}/id-front.jpg`),
        uploadKycAsset(kyc.idBack, `kyc/${userId}/id-back.jpg`),
        uploadKycAsset(kyc.selfie, `kyc/${userId}/selfie.jpg`)
      ]);
      await submitKyc.mutateAsync({ idFrontUrl, idBackUrl, selfieUrl });
      await updateKycStatus("PENDING");
      router.replace("/(tabs)/explore");
    } catch {
      Alert.alert("Upload failed", "We couldn't submit your documents. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const skip = () => {
    router.replace("/(tabs)/explore");
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
      <View style={styles.header}>
        <Text style={styles.title}>Verify your identity</Text>
        <Text style={styles.subtitle}>We need to verify who you are before you can start earning. This keeps our community safe.</Text>
      </View>

      <View style={styles.securityNote}>
        <View style={styles.securityIcon}>
          <Ionicons name="shield-checkmark-outline" size={18} color={colors.primary} />
        </View>
        <View style={styles.securityCopy}>
          <Text style={styles.securityTitle}>Your data is secure</Text>
          <Text style={styles.securityText}>Documents are encrypted and only used for verification. They are never shared with brands.</Text>
        </View>
      </View>

      <View style={styles.uploadGrid}>
        {uploadCards.map((card) => {
          const asset = kyc[card.key];
          return (
            <View key={card.key} style={styles.uploadCard}>
              {asset ? (
                <>
                  <Image source={{ uri: asset.uri }} style={styles.preview} />
                  <View style={styles.assetRow}>
                    <View style={styles.assetCopy}>
                      <Text style={styles.assetTitle}>{card.title}</Text>
                      <Text style={styles.assetName} numberOfLines={1}>{asset.fileName}</Text>
                    </View>
                    <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                  </View>
                  <Pressable onPress={() => (card.key === "selfie" ? openSelfieCamera() : pickId(card.key))} style={styles.changeButton}>
                    <Text style={styles.changeText}>{card.key === "selfie" ? "Retake" : "Change"}</Text>
                  </Pressable>
                </>
              ) : (
                <>
                  <View style={styles.emptyIcon}>
                    <Ionicons name={card.icon} size={28} color={colors.primary} />
                  </View>
                  <Text style={styles.uploadTitle}>{card.title}</Text>
                  <Text style={styles.uploadHelp}>{card.key === "selfie" ? "Use your front camera in good light." : "Use a clear, uncropped photo."}</Text>
                  <Pressable onPress={() => (card.key === "selfie" ? openSelfieCamera() : pickId(card.key))} style={styles.uploadButton}>
                    <Ionicons name={card.key === "selfie" ? "camera-outline" : "cloud-upload-outline"} size={16} color="#FFFFFF" />
                    <Text style={styles.uploadButtonText}>{card.cta}</Text>
                  </Pressable>
                </>
              )}
            </View>
          );
        })}
      </View>

      {submitKyc.isError ? <Text style={styles.error}>Could not submit KYC. Please try again.</Text> : null}

      <PrimaryButton label="Submit for Verification" loading={uploading || submitKyc.isPending} disabled={!allReady} onPress={submit} />
      <Pressable accessibilityRole="button" onPress={skip} style={styles.skip}>
        <Text style={styles.skipText}>Skip for now</Text>
      </Pressable>

      <Modal visible={cameraOpen} animationType="slide" onRequestClose={() => setCameraOpen(false)}>
        <View style={styles.cameraScreen}>
          <CameraView ref={cameraRef} facing="front" style={styles.camera} />
          <View style={styles.cameraOverlay}>
            <Pressable onPress={() => setCameraOpen(false)} style={styles.closeCamera}>
              <Ionicons name="close" size={22} color="#FFFFFF" />
            </Pressable>
            <View style={styles.selfieGuide}>
              <Text style={styles.selfieGuideText}>Center your face in the frame</Text>
            </View>
            <Pressable onPress={captureSelfie} style={styles.shutter}>
              <View style={styles.shutterInner} />
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

function toAsset(asset: ImagePicker.ImagePickerAsset, key: KycKey): KycAsset {
  return {
    uri: asset.uri,
    fileName: asset.fileName ?? `${key}.jpg`,
    mimeType: asset.mimeType ?? "image/jpeg"
  };
}

async function uploadKycAsset(asset: KycAsset, path: string) {
  const supabase = getSupabaseClient();
  const response = await fetch(asset.uri);
  const blob = await response.blob();
  const { data, error } = await supabase.storage.from("kyc-documents").upload(path, blob, {
    contentType: asset.mimeType ?? "image/jpeg",
    upsert: true
  });
  if (error) throw error;
  return `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/kyc-documents/${data.path}`;
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 36
  },
  header: {
    marginBottom: 22
  },
  title: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: "900",
    lineHeight: 31,
    letterSpacing: -0.52,
    marginBottom: 10
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "300",
    lineHeight: 22
  },
  securityNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(91,79,233,0.08)",
    backgroundColor: "rgba(91,79,233,0.04)",
    padding: 14,
    marginBottom: 18
  },
  securityIcon: {
    width: 34,
    height: 34,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(91,79,233,0.06)"
  },
  securityCopy: {
    flex: 1
  },
  securityTitle: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 3
  },
  securityText: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 17,
    fontWeight: "300"
  },
  uploadGrid: {
    gap: 14,
    marginBottom: 22
  },
  uploadCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(91,79,233,0.06)",
    backgroundColor: "#FFFFFF",
    padding: 16,
    shadowColor: colors.primary,
    shadowOpacity: 0.06,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2
  },
  emptyIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(91,79,233,0.06)",
    marginBottom: 12
  },
  uploadTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 4
  },
  uploadHelp: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "300",
    lineHeight: 18,
    marginBottom: 14
  },
  uploadButton: {
    alignSelf: "flex-start",
    minHeight: 38,
    borderRadius: 12,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14
  },
  uploadButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800"
  },
  preview: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    backgroundColor: colors.background,
    marginBottom: 12
  },
  assetRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  assetCopy: {
    flex: 1
  },
  assetTitle: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "800"
  },
  assetName: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 3
  },
  changeButton: {
    alignSelf: "flex-start",
    marginTop: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  changeText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "800"
  },
  skip: {
    alignItems: "center",
    paddingVertical: 18
  },
  skipText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "700"
  },
  error: {
    color: colors.error,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 14
  },
  cameraScreen: {
    flex: 1,
    backgroundColor: "#000000"
  },
  camera: {
    flex: 1
  },
  cameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 54
  },
  closeCamera: {
    position: "absolute",
    top: 48,
    left: 24,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(0,0,0,0.36)",
    alignItems: "center",
    justifyContent: "center"
  },
  selfieGuide: {
    marginTop: 54,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.36)",
    paddingHorizontal: 18,
    paddingVertical: 10
  },
  selfieGuideText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700"
  },
  shutter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center"
  },
  shutterInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFFFFF"
  }
});
