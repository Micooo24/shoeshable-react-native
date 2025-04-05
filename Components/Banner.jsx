import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export const Banner = ({ onExplorePress, primaryColor = '#162B4D', secondaryColor = '#E8ECF2' }) => {
  return (
    <View style={[styles.bannerContainer, { borderColor: secondaryColor }]}>
      {/* Premium corner accent */}
      <View style={[styles.cornerAccent, { backgroundColor: primaryColor }]} />
      
      <View style={styles.bannerContent}>
        <View style={styles.headerSection}>
          <View style={styles.logoContainer}>
            <Text style={[styles.bannerTitle, { color: primaryColor }]}>SHOESHABLE</Text>
            <View style={styles.titleDecoration}>
              <View style={[styles.accentLine, { backgroundColor: primaryColor }]} />
              <View style={styles.accentDot} />
              <View style={[styles.accentLine, { backgroundColor: primaryColor }]} />
            </View>
          </View>
          
          <Text style={styles.bannerDescription}>
            Premium Footwear For Every Journey
          </Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.footerSection}>
          <TouchableOpacity 
            style={[styles.exploreButton, { backgroundColor: primaryColor }]} 
            activeOpacity={0.8}
            onPress={onExplorePress}
          >
            <Text style={styles.exploreText}>EXPLORE COLLECTION</Text>
            <View style={styles.buttonArrowContainer}>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          
          <View style={styles.taglineContainer}>
            <View style={styles.tagDot} />
            <Text style={styles.taglineText}>QUALITY</Text>
            <View style={styles.tagDot} />
            <Text style={styles.taglineText}>STYLE</Text>
            <View style={styles.tagDot} />
            <Text style={styles.taglineText}>COMFORT</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    marginHorizontal: width * 0.04,
    marginVertical: width * 0.04,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    overflow: 'hidden',
    height: width * 0.5,
    position: 'relative',
  },
  cornerAccent: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: width * 0.15,
    height: width * 0.15,
    transform: [
      { rotate: '45deg' },
      { translateX: width * 0.05 },
      { translateY: -width * 0.05 },
    ],
  },
  bannerContent: {
    flex: 1,
    padding: width * 0.05,
    justifyContent: 'space-between',
  },
  headerSection: {
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: width * 0.025,
  },
  bannerTitle: {
    fontSize: Math.min(28, width * 0.07),
    fontWeight: '800',
    letterSpacing: 3,
    textAlign: 'center',
  },
  titleDecoration: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: width * 0.015,
    width: width * 0.3,
    justifyContent: 'center',
  },
  accentLine: {
    width: width * 0.1,
    height: 2,
  },
  accentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#162B4D',
    marginHorizontal: 8,
  },
  bannerDescription: {
    fontSize: Math.min(15, width * 0.038),
    color: '#555555',
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: '#E8ECF2',
    marginVertical: width * 0.025,
  },
  footerSection: {
    alignItems: 'center',
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Math.min(12, width * 0.03),
    paddingHorizontal: Math.min(22, width * 0.055),
    borderRadius: 6,
    marginBottom: width * 0.025,
  },
  exploreText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: Math.min(13, width * 0.033),
    letterSpacing: 1.2,
    marginRight: 12,
  },
  buttonArrowContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  taglineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  taglineText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#777777',
    letterSpacing: 1,
  },
  tagDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#AAAAAA',
    marginHorizontal: 8,
  },
});