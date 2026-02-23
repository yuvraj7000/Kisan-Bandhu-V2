import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import NewsComponent from '@/components/newsComponent'
import SchemesComponent from '@/components/schemsComponent'
import { useTranslation } from 'react-i18next'

const News = () => {
  const { t } = useTranslation()

  const [activeTab, setActiveTab] = useState<'news' | 'schemes'>('news')

  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, activeTab === 'news' && styles.activeButton]}
          onPress={() => setActiveTab('news')}
        >
          <Text style={[styles.toggleText, activeTab === 'news' && styles.activeText]}>{t('News')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, activeTab === 'schemes' && styles.activeButton]}
          onPress={() => setActiveTab('schemes')}
        >
          <Text style={[styles.toggleText, activeTab === 'schemes' && styles.activeText]}>{t('Schemes')}</Text>
        </TouchableOpacity>
      </View>
      {activeTab === 'news' ? (
        <NewsComponent />
      ) : (
        <SchemesComponent />
      )}
    </View>
  )
}

export default News

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
   
    alignItems: 'center',
    // borderBottomColor: '#ccc',
    // borderBottomWidth: 2,
  },
  toggleButton: {
    width: '50%',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 24,
    
    backgroundColor: '#e0e0e0',
    borderWidth: 2,
    borderBottomWidth: 4,
    borderTopWidth: 4,
    borderColor: '#ccc',
    
  },
  activeButton: {
    backgroundColor: '#2b50ed',

  },
  toggleText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 18,
  },
  activeText: {
    color: '#fff',
  },
})