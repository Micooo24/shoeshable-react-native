import { COLORS } from '../Theme/color';
import { StyleSheet } from 'react-native';
import { Platform, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const cardWidth = (width - 50) / 2;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  mainContent: {
    flex: 1,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 15,
    paddingHorizontal: 16,
    justifyContent: 'flex-end',
    elevation: 8,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  titleContainer: {
    flexDirection: 'column',
  },
  headerTitle: {
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.lightDark,
    letterSpacing: 1,
    marginTop: 2,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  cartButton: {
    padding: 8,
    marginLeft: 8,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: COLORS.danger,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  cartBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  categoryFilterContainer: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: COLORS.white,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    zIndex: 5,
  },
  categoryFilterContent: {
    paddingHorizontal: 10,
  },
  categoryFilterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: COLORS.light,
  },
  categoryFilterItemActive: {
    backgroundColor: COLORS.primary,
  },
  categoryFilterText: {
    marginLeft: 6,
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
  },
  categoryFilterTextActive: {
    marginLeft: 6,
    fontSize: 13,
    color: COLORS.white,
    fontWeight: '600',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  headerTextContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: COLORS.primaryLight,
    marginTop: 4,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: COLORS.light,
    borderRadius: 16,
  },
  viewAllText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
    marginRight: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.light,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '500',
  },
  productGrid: {
    padding: 10,
    paddingBottom: 100, // Added extra padding for bottom navigator
  },
  productCard: {
    width: cardWidth,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    margin: 8,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    position: 'relative',
    marginBottom: 16,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 220, // Increased from 180 to 220
  },
  productImage: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.light,
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'column',
  },
  waterproofBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 6,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 4,
  },
  categoryBadge: {
    backgroundColor: COLORS.primaryTransparent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  productInfo: {
    padding: 14,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  brandText: {
    fontSize: 12,
    color: COLORS.primaryLight,
    marginLeft: 6,
    textTransform: 'capitalize',
    fontWeight: '500',
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
  },
  cartIconButton: {
    backgroundColor: COLORS.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  emptyContainer: {
    padding: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.primaryLight,
    textAlign: 'center',
    marginBottom: 24,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  refreshButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    elevation: 12,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.light,
    zIndex: 1000,
  },

  // New style for filter below banner
  filterBelowBanner: {
    flexDirection: 'row',
    justifyContent: 'left',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 5,
  },
  filterButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    marginBottom: 8,
    zIndex: 2,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 16, // Increased from 12 to 16 for better spacing
    paddingVertical: 10, // Increased from 8 to 10 for better touch target
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterButtonText: {
    marginLeft: 6, // Increased from 4 to 6 for better spacing
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14, // Added font size for consistency
  },
  filterButtonTextActive: {
    color: COLORS.white,
  },
  filterCountBadge: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  filterCountText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  // Clear filters button
  clearFiltersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  clearFiltersText: {
    marginLeft: 4,
    color: COLORS.primary,
    fontWeight: '500',
    fontSize: 12,
  },
  
  // Filter modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 30,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  filterScrollView: {
    marginBottom: 16,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: COLORS.dark,
  },
  filterOptionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  filterChip: {
    backgroundColor: COLORS.backgroundLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
  },
  filterChipText: {
    color: COLORS.dark,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: COLORS.white,
  },
  
  // Price range inputs
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceInputWrapper: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  priceInputLabel: {
    fontSize: 12,
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  priceInput: {
    color: COLORS.dark,
    fontSize: 16,
  },
  priceInputDivider: {
    width: 20,
    height: 1,
    backgroundColor: COLORS.darkGray,
    marginHorizontal: 10,
  },
  
  // Sort options
  sortOptionsContainer: {
    marginTop: 8,
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.backgroundLight,
    marginBottom: 8,
    borderRadius: 8,
  },
  sortOptionActive: {
    backgroundColor: COLORS.primary,
  },
  sortOptionText: {
    color: COLORS.dark,
    fontWeight: '500',
  },
  sortOptionTextActive: {
    color: COLORS.white,
  },
  
  // Filter action buttons
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.backgroundLight,
  },
  resetFilterButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: COLORS.backgroundLight,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  resetFilterText: {
    color: COLORS.dark,
    fontWeight: '600',
  },
  applyFilterButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    flex: 2,
    alignItems: 'center',
  },
  applyFilterText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  productCardContainer: {
    position: 'relative',
    flex: 1,
  },
  quickAddButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  quickAddText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  cartModalScroll: {
    maxHeight: height * 0.5,
  },
  cartProductInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  cartProductImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: COLORS.lightGray,
  },
  cartProductDetails: {
    flex: 1,
    marginLeft: 12,
  },
  cartProductName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkText,
    marginBottom: 4,
  },
  cartProductPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  cartOptionsSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  cartSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkText,
    marginBottom: 12,
  },
  cartOptionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  addToCartButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  cancelCartButton: {
    backgroundColor: COLORS.lightGray,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelCartText: {
    color: COLORS.darkText,
    fontSize: 14,
    fontWeight: '500',
  },
});