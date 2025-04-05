import { COLORS } from '../Theme/color';
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background || '#F9F9F9',
  },
  scrollView: {
    flex: 1,
  },
  
  // Header styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primary,
    height: 56,
    paddingHorizontal: 8,
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginTop: 34,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Image carousel styles
  imageCarousel: {
    backgroundColor: COLORS.white,
    padding: 8,
  },
  imageSection: {
    width: '100%',
  },
  mainImageContainer: {
    width: '100%',
    height: height * 0.45,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.divider || '#EEEEEE',
  },
  thumbnailScroll: {
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  thumbnailContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  thumbnailWrapper: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginHorizontal: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border || '#E0E0E0',
  },
  selectedThumbnail: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  waterproofBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  waterproofText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 4,
  },
  
  // Product information card styles
  productCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 20,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  productInfoContainer: {
    padding: 16,
  },
  basicInfo: {
    marginBottom: 8,
  },
  productName: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text || '#212121',
    marginBottom: 8,
  },
  priceText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 8,
  },
  stockStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inStockText: {
    color: COLORS.success || '#4CAF50',
    fontSize: 14,
    marginLeft: 4,
  },
  outOfStockText: {
    color: COLORS.error || '#F44336',
    fontSize: 14,
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider || '#EEEEEE',
    marginVertical: 16,
  },
  
  // Metadata styles
  metadataContainer: {
    marginBottom: 8,
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%', // For two-column layout
    marginBottom: 8,
  },
  metadataTextContainer: {
    marginLeft: 8,
  },
  metadataLabel: {
    fontSize: 12,
    color: COLORS.textSecondary || '#757575',
    marginBottom: 2,
  },
  metadataValue: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text || '#212121',
  },
  metadataText: {
    fontSize: 16,
    color: COLORS.text || '#212121',
    marginLeft: 8,
    textTransform: 'capitalize',
  },
  
  // Size and color selection styles
  optionsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text || '#212121',
    marginBottom: 12,
  },
  optionsScrollContent: {
    paddingVertical: 4,
    paddingRight: 16,
  },
  sizesContainer: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider || '#EEEEEE',
  },
  sizesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sizeChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.chip || '#F5F5F5',
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border || '#E0E0E0',
  },
  colorChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.chip || '#F5F5F5',
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border || '#E0E0E0',
  },
  selectedChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  sizeText: {
    fontSize: 14,
    color: COLORS.text || '#212121',
  },
  colorText: {
    fontSize: 14,
    color: COLORS.text || '#212121',
  },
  selectedChipText: {
    color: COLORS.white,
    fontWeight: '500',
  },
  colorsContainer: {
    marginBottom: 24,
  },
  colorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  
  // Description styles
  descriptionSection: {
    marginBottom: 8,
  },
  descriptionContainer: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider || '#EEEEEE',
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textSecondary || '#757575',
  },
  
  // Action bar styles
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider || '#EEEEEE',
    elevation: 8,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  wishlistButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.border || '#E0E0E0',
  },
  actionButtonsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addToCartButton: {
    flex: 1,
    flexDirection: 'row',
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  buyNowButton: {
    flex: 1,
    flexDirection: 'row',
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.accent || '#FF4081',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  disabledButton: {
    backgroundColor: COLORS.disabled || '#BDBDBD',
    elevation: 0,
    shadowOpacity: 0,
  },
  actionButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 8,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 8,
  },
  buyNowText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 8,
  },
  
  // Additional styles for legacy support
  priceStockContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider || '#EEEEEE',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  inStock: {
    color: COLORS.success || '#4CAF50',
  },
  lowStock: {
    color: COLORS.warning || '#FF9800',
  },
  outOfStock: {
    color: COLORS.error || '#F44336',
  },
  additionalImagesContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: COLORS.background || '#F9F9F9',
  },
  additionalImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  reviewsSection: {
    paddingVertical: 20,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  writeReviewButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  writeReviewButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 12,
  },
  loadingText: {
    textAlign: 'center',
    color: COLORS.grayText,
    padding: 20,
  },
  noReviewsText: {
    textAlign: 'center',
    color: COLORS.grayText,
    padding: 20,
  },
  reviewItem: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewUser: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewUserName: {
    marginLeft: 8,
    fontWeight: '600',
    color: COLORS.darkText,
  },
  reviewDate: {
    color: COLORS.grayText,
    fontSize: 12,
  },
  reviewRating: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  reviewText: {
    color: COLORS.darkText,
    lineHeight: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.darkText,
    marginRight: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  reviewCountText: {
    color: COLORS.grayText,
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.darkText,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: COLORS.darkText,
  },
  ratingSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  starButton: {
    padding: 5,
  },
  reviewLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: COLORS.darkText,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 12,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    alignSelf: 'flex-end',
    color: COLORS.grayText,
    marginTop: 5,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  submitButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  reviewUserImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  reviewUserImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  loaderContainer: {
    padding: 20,
    alignItems: 'center',
  },
  reviewActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginRight: 8,
  },
  userBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  userBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  overlayLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    width: 200,
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.darkText,
    fontSize: 14,
  }
});