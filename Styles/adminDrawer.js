import { COLORS } from '../Theme/color';
import { StyleSheet } from 'react-native';

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
  