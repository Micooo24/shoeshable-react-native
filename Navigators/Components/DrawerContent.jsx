import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList
} from '@react-navigation/drawer';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../Theme/color';

const { width } = Dimensions.get('window');
const isSmallDevice = width < 375;

const DrawerContent = (props) => {
  return (
    <View style={styles.container}>
      {/* Drawer Header with Profile */}
      <LinearGradient
        colors={[COLORS.primaryDark, COLORS.primary]}
        style={styles.headerContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.profileSection}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>John Doe</Text>
            <Text style={styles.profileRole}>Administrator</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.closeButton} onPress={() => props.navigation.closeDrawer()}>
          <Ionicons name="close" size={24} color={COLORS.light} />
        </TouchableOpacity>
      </LinearGradient>

      {/* Drawer Items */}
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.drawerContent}
        showsVerticalScrollIndicator={false}
      >
        <DrawerItemList {...props} />
        
        {/* Divider */}
        <View style={styles.divider} />
        
        {/* Additional Navigation Items */}
        <View style={styles.extraItemsSection}>
          <Text style={styles.sectionTitle}>MANAGEMENT</Text>
          
          <TouchableOpacity style={styles.drawerItem}>
            <View style={styles.drawerItemIcon}>
              <Ionicons name="gift-outline" size={22} color={COLORS.textDark} />
            </View>
            <Text style={styles.drawerItemText}>Promotions</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.drawerItem}>
            <View style={styles.drawerItemIcon}>
              <Ionicons name="cart-outline" size={22} color={COLORS.textDark} />
            </View>
            <Text style={styles.drawerItemText}>Orders</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.drawerItem}>
            <View style={styles.drawerItemIcon}>
              <Ionicons name="chatbubble-ellipses-outline" size={22} color={COLORS.textDark} />
            </View>
            <Text style={styles.drawerItemText}>Messages</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>5</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.extraItemsSection}>
          <Text style={styles.sectionTitle}>OTHER</Text>
          
          <TouchableOpacity style={styles.drawerItem}>
            <View style={styles.drawerItemIcon}>
              <Ionicons name="help-circle-outline" size={22} color={COLORS.textDark} />
            </View>
            <Text style={styles.drawerItemText}>Help & Support</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.drawerItem}>
            <View style={styles.drawerItemIcon}>
              <Ionicons name="settings-outline" size={22} color={COLORS.textDark} />
            </View>
            <Text style={styles.drawerItemText}>Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.drawerItem}>
            <View style={styles.drawerItemIcon}>
              <Ionicons name="document-text-outline" size={22} color={COLORS.textDark} />
            </View>
            <Text style={styles.drawerItemText}>Documentation</Text>
          </TouchableOpacity>
        </View>
      </DrawerContentScrollView>
      
      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={22} color={COLORS.danger} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>App Version 1.0.0</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  headerContainer: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 50 : 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  profileInfo: {
    marginLeft: 15,
  },
  profileName: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
  },
  profileRole: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: 3,
  },
  closeButton: {
    padding: 8,
  },
  drawerContent: {
    paddingTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginVertical: 12,
    marginHorizontal: 20,
  },
  extraItemsSection: {
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  sectionTitle: {
    color: COLORS.grey,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 10,
    marginLeft: 10,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 5,
  },
  drawerItemIcon: {
    width: 26,
    alignItems: 'center',
  },
  drawerItemText: {
    marginLeft: 10,
    fontSize: 15,
    color: COLORS.textDark,
    fontWeight: '500',
    flex: 1,
  },
  badge: {
    backgroundColor: COLORS.accent1,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
  },
  logoutText: {
    marginLeft: 10,
    color: COLORS.danger,
    fontWeight: '600',
    fontSize: 15,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  versionText: {
    fontSize: 12,
    color: COLORS.grey,
  },
});

export default DrawerContent;