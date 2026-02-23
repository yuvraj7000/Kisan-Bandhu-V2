import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Modal } from 'react-native';
import statesData from '../context/i18n/state_district.json';
import Mandi_Data from './mandi_data';
import { useTranslation } from 'react-i18next';

const CustomDropdown = ({ items, placeholder, onValueChange, value, style }) => {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

  const selectedLabel = items.find(item => item.value === value)?.label || placeholder;

  return (
    <View style={[styles.dropdownContainer, style]}>
      <TouchableOpacity 
        style={styles.dropdownHeader} 
        onPress={() => setVisible(!visible)}
      >
        <Text style={styles.dropdownHeaderText}>
          {selectedLabel}
        </Text>
        <Text style={styles.arrow}>{visible ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setVisible(false)}
        >
          <View style={styles.dropdownList}>
            <ScrollView>
              {items.map((item, index) => (
                <TouchableOpacity
                  key={item.value}
                  style={styles.dropdownItem}
                  onPress={() => {
                    onValueChange(item.value);
                    setVisible(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const Dropdown = () => {
  const { t, i18n } = useTranslation();
  const [selectedState, setSelectedState] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [search, setSearch] = useState(false);
  const [key, setKey] = useState(0);
  const [language, setLanguage] = useState(i18n.language);

  useEffect(() => {
    setLanguage(i18n.language);
  }, [i18n.language, language]);

  const stateItems = statesData.states.map((item) => ({
    label: item.state[language],
    value: item.state.en,
  }));

  const districtItems = selectedState
    ? statesData.states
        .find((item) => item.state.en === selectedState)
        ?.districts.map((district) => ({
          label: district[language],
          value: district.en,
        })) || []
    : [];

  const handleSearch = () => {
    if (selectedState && selectedDistrict) {
      setKey((prevKey) => prevKey + 1);
      setSearch(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t("Select State")} - </Text>
      <CustomDropdown
        items={stateItems}
        placeholder={t("Select State")}
        onValueChange={(value) => {
          setSelectedState(value);
          setSelectedDistrict(null);
        }}
        value={selectedState}
        style={styles.dropdown}
      />

      {selectedState && (
        <>
          <Text style={styles.label}>{t("Select District")} - </Text>
          <CustomDropdown
            items={districtItems}
            placeholder={t("Select District")}
            onValueChange={(value) => setSelectedDistrict(value)}
            value={selectedDistrict}
            style={styles.dropdown}
          />
        </>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>{t("Search")}</Text>
      </TouchableOpacity>

      {!search && (
        <View style={styles.notSelected}>
          <Image 
            source={require('../assets/icons/no_mandi_data.png')} 
            style={styles.noimage} 
          />
          <Text style={styles.notext}>
            {t("Select State and District to see Mandi Prices")}
          </Text>
        </View>
      )}

      {search && (
        <Mandi_Data
          key={key}
          state={selectedState}
          district={selectedDistrict}
          transDistrict={
            statesData.states
              .find((s) => s.state.en === selectedState)
              ?.districts.find((d) => d.en === selectedDistrict)?.[language] || ''
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    marginTop: 8,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    margin: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  notSelected: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 400,
  },
  notext: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  noimage: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  dropdownContainer: {
    marginHorizontal: 15,
    marginVertical: 2,
  },
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    backgroundColor: 'white',
  },
  dropdownHeaderText: {
    fontSize: 16,
    color: '#333',
  },
  arrow: {
    fontSize: 12,
    color: '#666',
  },
  dropdownList: {
    maxHeight: 700,
    height: '80%',
    backgroundColor: 'white',
    borderRadius: 4,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemText: {
    fontSize: 18,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  dropdown: {
    marginHorizontal: 15,
  },
});

export default Dropdown;