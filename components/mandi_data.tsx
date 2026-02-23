import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Mandi from './mandi';
import LottieView from 'lottie-react-native';
import { useTranslation } from 'react-i18next';

const Mandi_Data = ({ district, state, transDistrict }) => {
    const { t } = useTranslation();
    const [response, setResponse] = useState()
    const [transD, setTransD] = useState(null)
    const animation = useRef<LottieView>(null);

    function getDateArray() {
        const dates = [];
        const today = new Date();

        for (let i = 0; i < 5; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
            const year = date.getFullYear();

            dates.push(`${day}/${month}/${year}`);
        }

        return dates;
    }

    const dates = getDateArray();

    const API_KEY = '579b464db66ec23bdd0000010a5d8d330fe04faf5faa8fe9223be9d4';

    const UrlByDate = (encodedState, encodedDistrict, encodedDate) => {
        return `${process.env.EXPO_PUBLIC_GOV_API}/35985678-0d79-46b4-9ed6-6f13308a1d24?` +
            `api-key=${process.env.EXPO_PUBLIC_GOV_API_KEY}&format=json&limit=1000&` +
            `filters%5BState%5D=${encodedState}&` +
            `filters%5BDistrict%5D=${encodedDistrict}&` +
            `filters%5BArrival_Date%5D=${encodedDate}`;
    }

    const getUrls = (dates, state, district) => {
        let urls = [];
        const encodedState = encodeURIComponent(state);
        const encodedDistrict = encodeURIComponent(district); // Use the first date for the additional API
        urls.push(`${process.env.EXPO_PUBLIC_GOV_API}/9ef84268-d588-465a-a308-a864a43d0070?api-key=${process.env.EXPO_PUBLIC_GOV_API_KEY}&format=json&limit=1000&filters%5Bstate.keyword%5D=${encodedState}&filters%5Bdistrict%5D=${encodedDistrict}`);
        console.log("today- url--", `${process.env.EXPO_PUBLIC_GOV_API}/9ef84268-d588-465a-a308-a864a43d0070?api-key=${process.env.EXPO_PUBLIC_GOV_API_KEY}&format=json&limit=1000&filters%5Bstate.keyword%5D=${encodedState}&filters%5Bdistrict%5D=${encodedDistrict}`)
        for (let i = 0; i < 5; i++) {
            // const date = dates[i];
            const encodedDate = encodeURIComponent(dates[i]);
            const url = UrlByDate(encodedState, encodedDistrict, encodedDate);
            console.log("url --", url);
            urls.push(url);
        }

        return urls;
    }



    const request = async (urls) => {
        try {
            // Create fetch requests with error handling
            const requests = urls.map(url =>
                fetch(url)
                    .then(response => response.json())
                    .catch(error => {
                        console.error(`Failed to fetch ${url}:`, error);
                        return { records: [] }; // Return empty records on error
                    })
            );

            // Wait for all responses
            const responses = await Promise.all(requests);

            // Process and combine all records
            const allRecords = responses.reduce((acc, response) => {
                if (response?.records) {
                    // Normalize field names for the additional API endpoint
                    const normalizedRecords = response.records.map(record => {
                        // Check if it's from the additional API (has lowercase fields)
                        if ('state' in record) {
                            return {
                                State: record.state,
                                District: record.district,
                                Market: record.market,
                                Commodity: record.commodity,
                                Variety: record.variety,
                                Grade: record.grade,
                                Arrival_Date: record.arrival_date,
                                Min_Price: record.min_price,
                                Max_Price: record.max_price,
                                Modal_Price: record.modal_price
                            };
                        }
                        return record;
                    });
                    return [...acc, ...normalizedRecords];
                }
                return acc;
            }, []);
            console.log('Total records fetched:', allRecords);
            return allRecords;
        } catch (error) {
            console.error('Error in request function:', error);
            return [];
        }
    };

    const minimizeData = (data) => {
        // Helper to convert DD/MM/YYYY to comparable YYYYMMDD
        const dateToComparable = (dateStr) => {
            const [day, month, year] = dateStr.split('/');
            return parseInt(`${year}${month.padStart(2, '0')}${day.padStart(2, '0')}`);
        };

        // Map to track latest records
        const recordMap = new Map();

        data.forEach(record => {
            const key = `${record.Market}|${record.Commodity}|${record.Variety}`;
            const recordDate = dateToComparable(record.Arrival_Date);

            const existing = recordMap.get(key);

            if (!existing || recordDate > existing.date) {
                recordMap.set(key, {
                    date: recordDate,
                    data: record
                });
            }
        });

        // Return only the latest records
        return Array.from(recordMap.values()).map(item => item.data);
    };



    const getData = async () => {
        const urls = getUrls(dates, state, district);
        const allRecords = await request(urls);
        const minimized = minimizeData(allRecords);
        // console.log('Unique records:', minimized.length);


        return minimized;
    };
    const handleSearch = async () => {
        const dd = await getData();
        setResponse(dd)

    }
    useEffect(() => {
        handleSearch();
        setTransD(transDistrict)
    }, []);

    if (response) {
        console.log("mandi response --", response);


        return <Mandi data={response} transDistrict={transD} />
    }






    return (
        <View style={styles.animationContainer}>
            <LottieView
                autoPlay
                ref={animation}
                style={styles.lottie}
                source={require('../assets/animations/market.json')}
            />
            <Text style={styles.loadingText}>
                {transDistrict} {t("district : Finding markets ...")}
            </Text>
        </View>
    );
};


export default Mandi_Data;


const styles = StyleSheet.create({
    animationContainer: {
        marginTop: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    lottie: {
        width: 300,
        height: 300,
    },
    loadingText: {
        fontWeight: '600',
        fontSize: 20,
        // color: '#333',
    },



})




