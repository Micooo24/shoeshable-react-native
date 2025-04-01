import { COLORS } from '../Theme/color';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    bottomNav: {
      flexDirection: 'row',
      height: 60,
      borderTopWidth: 1,
      borderTopColor: COLORS.grey,
      backgroundColor: COLORS.white,
      elevation: 8,
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: -3 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
    },
    tabItem: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 8,
    },
    activeTabItem: {
      borderTopWidth: 3,
      borderTopColor: COLORS.primary,
    },
    tabIcon: {
      marginBottom: 4,
    },
    tabLabel: {
      fontSize: 12,
      color: COLORS.darkGrey,
      fontWeight: '400',
    },
    activeTabLabel: {
      color: COLORS.primary,
      fontWeight: '600',
    },
  });