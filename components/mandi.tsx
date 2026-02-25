import React, { useState } from 'react';
import i18next from 'i18next';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import commodity from '../context/i18n/commodity_Translation.json';
import market_translation from '../context/i18n/market_Translation.json';
import { useTranslation } from 'react-i18next';

const Mandi = ({ data, transDistrict, tt }) => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [marketDetails, setMarketDetails] = useState([]);

  console.log("trans -- ", transDistrict)

  const uniqueMarkets = [...new Set(data.map(item => item.Market))];

  // const cleanMarkets = uniqueMarkets.map(market => market.replace(" APMC", ""));

  console.log("unique markets -- ", uniqueMarkets)

  const handleMarketClick = (market) => {
    const details = data.filter(item => item.Market === market);
    setSelectedMarket(market);
    setMarketDetails(details);
  };

  if (!data || data.length === 0) {
    return (
      <View style={styles.nocontainer}>
        <Image
          source={require('../assets/icons/no_mandi_data.png')}
          style={
            styles.noDataImage
          }
        />
        <Text style={styles.notext}>{transDistrict} {t("District")} : {t("No data available")} </Text>
        <Text style={styles.notext}>{t("Reason – The mandi may be closed or the data may not have been updated by the mandi. Please try again tomorrow.")}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.marketTitle}>
        {t("All Markets of")} <Text style={styles.boldText}>{transDistrict ? transDistrict : data[0].District}</Text> {t("District")}
      </Text>

      <View style={styles.marketContainer}>
        {uniqueMarkets.map((market, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.marketButton,
              selectedMarket === market && styles.selectedMarketButton, // Apply selected style
            ]}
            onPress={() => handleMarketClick(market)}
          >
            <Text
              style={[
                styles.marketButtonText,
                selectedMarket === market && styles.selectedMarketButtonText, // Apply selected text style
              ]}
            >
              {market_translation[market.replace(" APMC", "")]?.[language] || market.replace(" APMC", "")}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {
        !selectedMarket && (
          <View style={styles.tableContainer}>
            <Text style={styles.tableTitle}>{t("Please select a market to view commodity prices")}</Text>
          </View>
        )
      }


      {selectedMarket && (
        <View style={styles.tableContainer}>
          <Text style={styles.tableTitle}>
            {t("Market Data for")} <Text style={styles.boldText}>{market_translation[selectedMarket.replace(" APMC", "")]?.[language] || selectedMarket.replace(" APMC", "")}</Text>

          </Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableCommodity}>{t("Commodity")}</Text>
              <Text style={styles.tableHeader}>{t("Min Price")}</Text>
              <Text style={styles.tableHeader}>{t("Max Price")}</Text>
              <Text style={styles.tableHeader}>{t("Modal Price")}</Text>
            </View>
            {marketDetails.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <View style={styles.tableCellLarge}>
                  <Text style={styles.CommodityText}>
                    {commodity[item.Commodity] && commodity[item.Commodity].translations[i18next.language]
                      ? commodity[item.Commodity].translations[i18next.language]
                      : item.Commodity}
                  </Text>
                  <Text style={styles.varietyText}>{item.Variety}</Text>
                  <Text style={styles.dateText}>{item.Arrival_Date}</Text>
                </View>
                <Text style={styles.tableCell}>{item.Min_Price}</Text>
                <Text style={styles.tableCell}>{item.Max_Price}</Text>
                <Text style={styles.tableCell}>{item.Modal_Price}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  marketContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 5,
  },
  marketTitle: {
    marginTop: 20,
    fontSize: 16,
    marginBottom: 10,
  },
  marketButton: {
    backgroundColor: '#394D68',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 2,
    marginHorizontal: 2,
  },
  marketButtonText: {
    color: 'white',
    fontSize: 16,
  },
  selectedMarketButton: {
    padding: 6,
    borderWidth: 2,
    borderColor: 'orange',
  },
  selectedMarketButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tableContainer: {
    marginTop: 20,
  },
  tableTitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  boldText: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  table: {
    borderWidth: 1,
    borderColor: '#ddd',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableCommodity: {
    flex: 2.5,
    fontSize: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    fontWeight: 'bold',
    backgroundColor: '#f1f1f1',
  },
  tableHeader: {
    flex: 1.1,
    fontSize: 16,
    paddingVertical: 5,
    borderColor: '#ddd',
    borderLeftWidth: 0.7,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    backgroundColor: '#f1f1f1',
  },
  tableCell: {
    flex: 1.1,
    padding: 5,
    textAlign: 'center',
    borderColor: '#ddd',
    borderLeftWidth: 0.7,
  },
  tableCellLarge: {
    flex: 2.97,
    padding: 5,

  },
  CommodityText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  varietyText: {
    fontSize: 11,
    color: '#555',
  },
  dateText: {
    fontSize: 10,
    color: '#888',
  },
  nocontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  notext: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  noDataImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginTop: 20,
    marginBottom: 10,
  }
});

export default Mandi;