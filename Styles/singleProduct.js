import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../Theme/color.js';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 33,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
  },
  backButton: {
    padding: 4,
  },
  cartButton: {
    padding: 4,
  },
  headerRight: {
    width: 32,
  },
  carouselContainer: {
    width: width,
    height: width * 0.8, 
    position: 'relative',
    backgroundColor: COLORS.lightGray,
  },
  carouselImageContainer: {
    width: width,
    height: width * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselImage: {
    width: width,
    height: width * 0.8,
  },
  imagePlaceholder: {
    width: width,
    height: width * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Pagination Indicators
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  
  // Thumbnail Navigation
  thumbnailContainer: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
  },
  thumbnailWrapper: {
    width: 60,
    height: 60,
    borderRadius: 6,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    overflow: 'hidden',
  },
  activeThumbnail: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  
  // Loading & Error Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.gray,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.danger,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 16,
  },
  
  // Product Info Styles
  productInfoContainer: {
    padding: 16,
  },
  productName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 12,
  },
  priceStockContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockText: {
    marginLeft: 4,
    fontSize: 14,
  },
  inStock: {
    color: COLORS.success,
  },
  lowStock: {
    color: COLORS.warning,
  },
  outOfStock: {
    color: COLORS.danger,
  },
  
  // Metadata Styles
  metadataContainer: {
    marginBottom: 16,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metadataText: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.dark,
  },
  metadataLabel: {
    fontWeight: '600',
  },
  
  // Description Styles
  descriptionContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.gray,
  },
  
  // Sizes & Colors
  sizesContainer: {
    marginBottom: 16,
  },
  sizesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sizeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.lightGray,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  sizeText: {
    fontSize: 14,
    color: COLORS.dark,
  },
  colorsContainer: {
    marginBottom: 16,
  },
  colorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.lightGray,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  colorText: {
    fontSize: 14,
    color: COLORS.dark,
  },
  
  // Action Bar Styles
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
  },
  wishlistButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 24,
    marginRight: 12,
  },
  addToCartButton: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    marginRight: 10,
  },
  buttonText: {
    marginLeft: 8,
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  buyNowButton: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingHorizontal: 5,
  },
  buyNowText: {
    marginLeft: 4,
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
});