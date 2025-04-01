import { COLORS } from '../Theme/color';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.light,
    },
    header: {
      backgroundColor: COLORS.primary,
      paddingTop: 45,
      paddingBottom: 15,
      paddingHorizontal: 16,
      elevation: 4,
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: COLORS.white,
      letterSpacing: 1,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    emptyText: {
      fontSize: 16,
      color: COLORS.textLight,
    },
    bottomNavContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: COLORS.white,
      elevation: 10,
      shadowColor: COLORS.primary,
      shadowOffset: { width: 0, height: -3 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      borderTopWidth: 1,
      borderTopColor: COLORS.light,
    }
  });