import { StyleSheet, Dimensions, Platform } from 'react-native';
import { COLORS } from '../Theme/color';

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f7fa', // Softer background color
  },
  
  header: {
    width: '100%',
    height: Platform.OS === 'android' ? 110 : 90,
    paddingTop: Platform.OS === 'android' ? 40 : 35,
    backgroundColor: COLORS.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    zIndex: 10,
  },
  headerGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  iconButton: {
    padding: 8,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#e74c3c',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.white,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  profileButton: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    overflow: 'hidden',
  },
  headerProfileImage: {
    width: 32,
    height: 32,
    borderRadius: 10,
  },
  
  // Content Styles
  content: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 80,
    paddingTop: 16,
  },
  
  // Welcome Section
  welcomeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  welcomeText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2c3e50',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(189, 195, 199, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  calendarIcon: {
    marginRight: 6,
  },
  dateText: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  
  // Quick Stats
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  
  // Widgets Styles
  widgetsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  widget: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  widgetSmall: {
    width: '100%',
    marginBottom: 15,
  },
  widgetGradient: {
    borderRadius: 16,
    padding: 16,
  },
  widgetContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  widgetLeft: {
    flex: 1,
    marginRight: 8,
  },
  widgetTitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 6,
    fontWeight: '500',
  },
  widgetValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 6,
  },
  widgetChange: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  changeText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.white,
    marginLeft: 4,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Chart Styles
  chartContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
  },
  chartTabs: {
    flexDirection: 'row',
    backgroundColor: '#f5f7fa',
    borderRadius: 10,
    padding: 3,
  },
  chartTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  chartTabActive: {
    backgroundColor: '#2196F3',
  },
  chartTabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#7f8c8d',
  },
  chartTabTextActive: {
    color: COLORS.white,
  },
  chartWrapper: {
    alignItems: 'center',
    marginVertical: 16,
  },
  chart: {
    borderRadius: 16,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  
  // Orders Styles
  ordersContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  ordersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ordersTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 13,
    color: '#2196F3',
    fontWeight: '500',
    marginRight: 2,
  },
  orderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#f5f7fa',
    borderRadius: 12,
    marginBottom: 12,
  },
  lastOrderCard: {
    marginBottom: 0,
  },
  orderLeft: {
    marginRight: 14,
  },
  orderIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(46, 204, 113, 0.15)',
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 3,
  },
  orderCustomer: {
    fontSize: 13,
    color: '#7f8c8d',
    marginBottom: 3,
  },
  orderDate: {
    fontSize: 12,
    color: '#bdc3c7',
  },
  orderDetails: {
    alignItems: 'flex-end',
  },
  orderAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 6,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(46, 204, 113, 0.15)',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#27ae60',
  },
  seeMoreButton: {
    backgroundColor: '#f5f7fa',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginTop: 14,
  },
  seeMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196F3',
  },
  
  // Additional Stats Styles
  additionalStatsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
  },
  
  // Product List Styles
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  productIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  productStats: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  productAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2c3e50',
  },
  
  // Channel Stats Styles
  channelContainer: {
    marginTop: 8,
  },
  channelItem: {
    marginBottom: 14,
  },
  channelInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  channelLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
  },
  channelValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2c3e50',
  },
  progressBackground: {
    height: 6,
    backgroundColor: '#ecf0f1',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  
  // FAB Styles
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
});