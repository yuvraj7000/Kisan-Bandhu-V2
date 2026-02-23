import { StyleSheet, Text, View, ScrollView, SafeAreaView } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

const Privacy = () => {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t("Privacy Policy")}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.section}>
            <Ionicons name="shield-checkmark" size={24} color="#4CAF50" />
            <View style={styles.sectionContent}>
              <Text style={styles.sectionTitle}>{t("Your Privacy Matters")}</Text>
              <Text style={styles.sectionText}>
                {t("We are committed to protecting your personal information and being transparent about what we collect.")}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.section}>
            <Ionicons name="document-text" size={24} color="#4CAF50" />
            <View style={styles.sectionContent}>
              <Text style={styles.sectionTitle}>{t("Data Collection")}</Text>
              <View style={styles.listItem}>
                <Ionicons name="location" size={16} color="#4CAF50" />
                <Text style={styles.listText}>
                  {t("Location data (used solely for weather updates via OpenWeatherMap API)")}
                </Text>
              </View>
              {/* <View style={styles.listItem}>
                <Ionicons name="notifications" size={16} color="#4CAF50" />
                <Text style={styles.listText}>
                  {t("State & District (for personalized notifications)")}
                </Text>
              </View> */}
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.section}>
            <Ionicons name="cloud" size={24} color="#4CAF50" />
            <View style={styles.sectionContent}>
              <Text style={styles.sectionTitle}>{t("Third-Party Services")}</Text>
              <View style={styles.listItem}>
                <Ionicons name="logo-google" size={16} color="#4CAF50" />
                <Text style={styles.listText}>{t("Google Gemini API (plant disease analysis)")}</Text>
              </View>
              <View style={styles.listItem}>
                <Ionicons name="stats-chart" size={16} color="#4CAF50" />
                <Text style={styles.listText}>{t("Government APIs (market price data)")}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.section}>
            <Ionicons name="server" size={24} color="#4CAF50" />
            <View style={styles.sectionContent}>
              <Text style={styles.sectionTitle}>{t("Data Storage")}</Text>
              <Text style={styles.sectionText}>
                {t("We maintain our own secure database for:")}
                {"\n"}• {t("Government & private schemes")}
                {"\n"}• {t("Crop information")}
                {/* {"\n"}• {t("User preferences (state/district)")} */}
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.card, styles.contactCard]}>
          <Text style={styles.contactTitle}>{t("Need More Information?")}</Text>
          <View style={styles.contactItem}>
            <Ionicons name="mail" size={20} color="white" />
            <Text style={styles.contactText}>yuvraj7000raju@gmail.com</Text>
          </View>
          <View style={styles.contactItem}>
            <Ionicons name="globe" size={20} color="white" />
            <Text style={styles.contactText}>yuvraj.works</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    backgroundColor: "#007BFF",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  section: {
    flexDirection: "row",
    gap: 15,
    alignItems: "flex-start",
  },
  sectionContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E7D32",
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
  listItem: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginBottom: 8,
  },
  listText: {
    fontSize: 14,
    color: "#444",
    flex: 1,
  },
  contactCard: {
    backgroundColor: "#2E7D32",
    paddingVertical: 25,
  },
  contactTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
    justifyContent: "center",
  },
  contactText: {
    fontSize: 14,
    color: "white",
    fontWeight: "500",
  },
});

export default Privacy;