import { StyleSheet, Text, View, ScrollView, SafeAreaView } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t("About Us")}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.subtitle}>{t("🌱 Empowering Farmers with Technology")}</Text>
          <Text style={styles.description}>
            {t(
              "KisanBandhu is an AI-powered farming assistant designed to help farmers with real-time insights, disease detection, mandi prices, weather updates, and the latest government schemes. It supports 11 Indian languages to ensure accessibility for all."
            )}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.subtitle}>{t("Key Features")}</Text>

          {[
            t("Plant Disease Diagnosis – Upload an image to get AI-driven detection and organic solutions"),
            t("Real-time Mandi Prices – Get daily price updates from all government markets across India"),
            t("Latest News – Stay informed with curated agricultural news and updates"),
            // t("16-Day Weather Forecast – Stay updated on rainfall, temperature, and seasonal trends"),
            t("Active Government & Private Schemes – Find subsidies, loans, and schemes for farmers"),
            t("Comprehensive Crop Information – Learn about different crops, best practices, and farming techniques"),
            t("Multilingual Support – Available in 11 Indian languages for better accessibility"),
            // t("Personalized Notifications – Get weather alerts, mandi updates, and new schemes for your district"),
          ].map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.subtitle}>{t("Our Mission")}</Text>
          <View style={styles.missionContainer}>
            <Ionicons name="leaf" size={24} color="#4CAF50" />
            <Text style={styles.missionText}>
              {t(
                "Empower farmers with the right tools and information for better productivity and profitability through technological innovation and accessible solutions."
              )}
            </Text>
          </View>
        </View>

        <View style={[styles.card, styles.contactCard]}>
          <Text style={styles.subtitlec}>{t("Contact Us")}</Text>
          <View style={styles.contactItem}>
            <Ionicons name="mail" size={20} color="#4CAF50" />
            <Text style={styles.contactText}>yuvraj7000raju@gmail.com</Text>
          </View>
          <View style={styles.contactItem}>
            <Ionicons name="globe" size={20} color="#4CAF50" />
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
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2E7D32",
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
    paddingLeft: 12,
  },
  subtitlec: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
    paddingLeft: 12,
  },
  description: {
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
    marginBottom: 10,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    gap: 10,
  },
  featureText: {
    fontSize: 14,
    color: "#444",
    flex: 1,
    lineHeight: 20,
  },
  missionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    backgroundColor: "#F0F4F8",
    borderRadius: 8,
    padding: 15,
  },
  missionText: {
    fontSize: 14,
    color: "#444",
    flex: 1,
    fontStyle: "italic",
    lineHeight: 20,
  },
  contactCard: {
    backgroundColor: "#2E7D32",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  contactText: {
    fontSize: 14,
    color: "white",
    fontWeight: "500",
  },
});

export default About;