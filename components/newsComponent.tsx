import { StyleSheet, Text, View, FlatList, Image, ActivityIndicator, RefreshControl, TouchableOpacity, Modal, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import YoutubePlayer from 'react-native-youtube-iframe';

const NewsComponent = () => {
  const { i18n } = useTranslation();
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalNews, setTotalNews] = useState(0);
  const [selectedNews, setSelectedNews] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // For full image modal
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState('');

  const limit = 5;

  const extractYoutubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const fetchNews = async (currentPage = 1) => {
    try {
      console.log('usl - ', `${process.env.EXPO_PUBLIC_BACKEND_URL}/news/get`)
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/news/get`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          language_code: i18n.language,
          page: currentPage,
          limit: limit
        }),
      });
      
      const data = await response.json();
      
      if (currentPage === 1) {
        setNewsData(data.news);
      } else {
        setNewsData(prev => [...prev, ...data.news]);
      }
      
      setTotalNews(data.total);
      setPage(currentPage);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [i18n.language]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNews(1);
  };

  const handleLoadMore = () => {
    if (newsData.length < totalNews && !loading) {
      fetchNews(page + 1);
    }
  };

  const openNewsDetail = (newsItem) => {
    setSelectedNews(newsItem);
    setModalVisible(true);
  };

  const closeNewsDetail = () => {
    setModalVisible(false);
    setSelectedNews(null);
  };

  const openImageModal = (imageUrl: string) => {
    setModalImageUrl(imageUrl);
    setImageModalVisible(true);
  };

  const closeImageModal = () => {
    setImageModalVisible(false);
    setModalImageUrl('');
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.newsItem}
      onPress={() => openNewsDetail(item)}
      activeOpacity={0.8}
    >
      {
      item.image_url ? (
        <View style={{backgroundColor:'#000', height: 200, width: '100%'}}>
          <Text style={{color:'#fff', position:'absolute', fontSize: 20, top: '40%', left:'40%'}}>Loading...</Text>
          <Image 
            source={{ uri: item.image_url }} 
            style={styles.newsImage}
            resizeMode="cover"
          />
        </View>
      ) : item.youtube_url ? (
        <View style={styles.youtubeContainer}>
          <Text style={{color:'#fff', position:'absolute',fontSize:20, top: '40%', left:'40%'}}>Loading...</Text>
          <YoutubePlayer
            height={250}
            play={false}
            videoId={extractYoutubeId(item.youtube_url)}
          />
        </View>
      ) : null}
      
      <View style={styles.newsContent}>
        <Text style={styles.newsTitle}>{item.title}</Text>
        <Text style={styles.newsSource}>{item.source} • {new Date(item.date).toLocaleDateString()}</Text>
        <Text style={styles.newsText} numberOfLines={3}>{item.content}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && page === 1) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={newsData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <View style={{ padding: 10, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333' }}>
              {i18n.t('Latest News')}
            </Text>
          </View>
        }
        ListFooterComponent={
          loading && page > 1 ? (
            <ActivityIndicator size="small" style={styles.footerLoader} />
          ) : null
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Text> {i18n.t('No news available')}</Text>
            </View>
          )
        }
      />

      {/* News Detail Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={closeNewsDetail}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={closeNewsDetail}
          >
            <Ionicons name="close" size={28} color="#333" />
          </TouchableOpacity>
          
          {selectedNews && (
            <ScrollView contentContainerStyle={styles.modalContent}>
              {selectedNews.image_url ? (
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => openImageModal(selectedNews.image_url)}
                >
                  <Image 
                    source={{ uri: selectedNews.image_url }} 
                    style={styles.modalImagemain}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              ) : null}

              <View style={styles.modalTextContainer}>
                <Text style={styles.modalTitle}>{selectedNews.title}</Text>
                <Text style={styles.modalSource}>{selectedNews.source} • {new Date(selectedNews.date).toLocaleDateString()}</Text>
                {selectedNews.youtube_url ? (
                  <View style={styles.youtubeContainer}>
                    <Text style={{color:'#fff', position:'absolute', fontSize: 20, top: '40%', left:'40%'}}>Loading...</Text>
                    <YoutubePlayer
                      height={250}
                      play={false}
                      videoId={extractYoutubeId(selectedNews.youtube_url)}
                    />
                  </View>
                ) : null}
                <Text style={styles.modalText}>{selectedNews.content}</Text>
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>

      {/* Full Image Modal */}
      <Modal
        visible={imageModalVisible}
        transparent={true}
        onRequestClose={closeImageModal}
      >
        <View style={styles.fullImageModalContainer}>
          <TouchableOpacity
            style={styles.fullImageCloseButton}
            onPress={closeImageModal}
          >
            <Ionicons name="close" size={32} color="#fff" />
          </TouchableOpacity>
          <Image
            source={{ uri: modalImageUrl }}
            style={styles.fullImage}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </View>
  );
};

export default NewsComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 10,
  },
  newsItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  youtubeContainer: {
   
    marginVertical: 20,
    width: '100%',
    maxWidth: 600,
    
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
  },
  newsImage: {
    width: '100%',
    height: 200,
  },
  newsContent: {
    padding: 15,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  newsSource: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  newsText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  footerLoader: {
    marginVertical: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
    padding: 5,
  },
  modalContent: {
    paddingBottom: 40,
  },
  modalImage: {
    width: '100%',
    height: 250,
  },
  modalImagemain: {
    width: '100%',
    height: 250,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: '#000',
  },
  modalTextContainer: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalSource: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
  // Full image modal styles
  fullImageModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  fullImageCloseButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 2,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 5,
  },
});