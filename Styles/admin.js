import { StyleSheet, Dimensions, Platform } from 'react-native';
import { COLORS } from '../Theme/color';

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafd', // Lighter, more refined background
  },
  
  // Header Styles - Enhanced with better shadows and refined proportions
  header: {
    width: '100%',
    height: Platform.OS === 'android' ? 110 : 90,
    paddingTop: Platform.OS === 'android' ? 40 : 35,
    backgroundColor: COLORS.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    shadowOpacity: 0.18,
    zIndex: 10,
  },
  headerGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 0.7,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    padding: 9,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  iconButton: {
    padding: 9,
    marginRight: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ff3b30',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  profileButton: {
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    overflow: 'hidden',
  },
  headerProfileImage: {
    width: 34,
    height: 34,
    borderRadius: 12,
  },
  
  // Content Styles - More refined spacing
  content: {
    flex: 1,
    backgroundColor: '#f8fafd',
  },
  contentContainer: {
    paddingHorizontal: 22,
    paddingBottom: 90,
    paddingTop: 18,
  },
  
  // Welcome Section - Enhanced shadows and spacing
  welcomeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
    backgroundColor: 'white',
    padding: 22,
    borderRadius: 20,
    shadowColor: '#2c3e50',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 4,
  },
  welcomeText: {
    fontSize: 15,
    color: '#7f8c8d',
    marginBottom: 6,
    fontWeight: '400',
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2c3e50',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(189, 195, 199, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  calendarIcon: {
    marginRight: 8,
  },
  dateText: {
    fontSize: 13,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  
  // Quick Stats - Improved contrast and shadows
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  statItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    shadowColor: '#2c3e50',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 4,
  },
  statIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2c3e50',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 13,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  
  // Widgets Styles - Enhanced with better shadows and spacing
  widgetsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 26,
  },
  widget: {
    width: '48%',
    marginBottom: 18,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 6,
  },
  widgetSmall: {
    width: '100%',
    marginBottom: 16,
  },
  widgetGradient: {
    borderRadius: 20,
    padding: 18,
  },
  widgetContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  widgetLeft: {
    flex: 1,
    marginRight: 10,
  },
  widgetTitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.92)',
    marginBottom: 8,
    fontWeight: '500',
  },
  widgetValue: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  widgetChange: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
    marginLeft: 5,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Chart Styles - Enhanced with more refined appearance
  chartContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 26,
    shadowColor: '#2c3e50',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 4,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    letterSpacing: 0.3,
  },
  chartTabs: {
    flexDirection: 'row',
    backgroundColor: '#f5f7fa',
    borderRadius: 12,
    padding: 4,
  },
  chartTab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
  },
  chartTabActive: {
    backgroundColor: COLORS.primary,
  },
  chartTabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#7f8c8d',
  },
  chartTabTextActive: {
    color: COLORS.white,
  },
  chartWrapper: {
    alignItems: 'center',
    marginVertical: 18,
  },
  chart: {
    borderRadius: 20,
    paddingRight: 16,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 14,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  legendText: {
    fontSize: 13,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  
  // Order Status Section - Refined layout
  orderStatusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  orderStatusItem: {
    width: '48%',
    backgroundColor: '#f8fafd',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 13,
    color: '#7f8c8d',
    marginBottom: 4,
    fontWeight: '500',
  },
  statusCount: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2c3e50',
  },
  
  // Orders Styles - Improved shadows and layout
  ordersContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 26,
    shadowColor: '#2c3e50',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 4,
  },
  ordersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  ordersTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    letterSpacing: 0.3,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
    marginRight: 3,
  },
  orderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8fafd',
    borderRadius: 16,
    marginBottom: 14,
  },
  lastOrderCard: {
    marginBottom: 0,
  },
  orderLeft: {
    marginRight: 16,
  },
  orderIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(46, 204, 113, 0.15)',
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 4,
  },
  orderCustomer: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
    fontWeight: '500',
  },
  orderDate: {
    fontSize: 12,
    color: '#bdc3c7',
    fontWeight: '400',
  },
  orderDetails: {
    alignItems: 'flex-end',
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2c3e50',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: 'rgba(46, 204, 113, 0.15)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#27ae60',
  },
  seeMoreButton: {
    backgroundColor: '#f8fafd',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  seeMoreText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
  },
  
  // Additional Stats Styles - More refined
  additionalStatsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 26,
    shadowColor: '#2c3e50',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 4,
  },
  statCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  statCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    letterSpacing: 0.3,
  },
  
  // Product List Styles - Enhanced visuals
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafd',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  productIconContainer: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    overflow: 'hidden',
  },
  productImage: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 5,
  },
  productStats: {
    fontSize: 13,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  productAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2c3e50',
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 15,
    color: '#95a5a6',
    fontWeight: '500',
    marginVertical: 20,
  },
  
  // Payment Methods Chart Styles
  channelContainer: {
    marginTop: 10,
  },
  channelItem: {
    marginBottom: 18,
  },
  channelInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  channelLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2c3e50',
  },
  channelValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2c3e50',
  },
  progressBackground: {
    height: 8,
    backgroundColor: '#ecf0f1',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  
  // FAB Styles - More prominent
  fab: {
    position: 'absolute',
    bottom: 26,
    right: 26,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  fabButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Loading and error states
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafd',
  },
  loadingText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 12,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafd',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    marginTop: 12,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '500',
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 10,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});