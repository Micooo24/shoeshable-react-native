import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../../Theme/color';

const { width } = Dimensions.get('window');
const cardWidth = (width - 50) / 2;

export const productCardStyles = StyleSheet.create({
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
});