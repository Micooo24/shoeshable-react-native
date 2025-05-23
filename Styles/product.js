import { COLORS } from '../Theme/color';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    marginTop: 33
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 8,
    paddingVertical: 4,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 1000,
  },
  productList: {
    padding: 16,
    paddingBottom: 24,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  productCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    elevation: 3,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  productCardHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  productThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  productThumbnailPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: COLORS.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
  },
  waterproofBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    marginLeft: 8,
  },
  waterproofText: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: 'bold',
    marginLeft: 3,
  },
  productDescription: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  productMetadata: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 4,
  },
  metadataText: {
    fontSize: 13,
    color: COLORS.textLight,
    marginLeft: 4,
  },
  productStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginLeft: 2,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockValue: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
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
  productAttributesContainer: {
    marginBottom: 12,
  },
  attributeSection: {
    marginBottom: 8,
  },
  attributeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  attributeChipsScroll: {
    flexDirection: 'row',
  },
  attributeChip: {
    backgroundColor: COLORS.light,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 6,
    marginBottom: 6,
  },
  attributeChipText: {
    fontSize: 12,
    color: COLORS.text,
  },
  additionalImagesContainer: {
    marginBottom: 12,
  },
  additionalImagesContent: {
    paddingVertical: 8,
  },
  additionalImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.light,
  },
  productIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  productId: {
    fontSize: 12,
    color: COLORS.darkGrey,
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: 'rgba(148, 69, 53, 0.1)',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 4,
  },
  deleteButton: {
    backgroundColor: 'rgba(211, 94, 77, 0.1)',
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.danger,
    marginLeft: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '85%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    padding: 16,
    maxHeight: '70%',
  },
  formSection: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light,
    paddingBottom: 16,
  },
  formSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  formLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 6,
  },
  requiredMark: {
    color: COLORS.danger,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.grey,
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
  inputIcon: {
    padding: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    paddingVertical: 12,
    paddingRight: 12,
  },
  textAreaContainer: {
    borderWidth: 1,
    borderColor: COLORS.grey,
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
  textArea: {
    width: '100%',
    height: 100,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: COLORS.text,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.grey,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
    color: COLORS.text,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  addAttributeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  addAttributeButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addAttributeButtonText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  orText: {
    textAlign: 'center',
    color: COLORS.textLight,
    marginVertical: 8,
  },
  customSizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  customSizeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.grey,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 16,
    color: COLORS.text,
  },
  addCustomSizeButton: {
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedAttributesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectedAttributeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(148, 69, 53, 0.1)',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
  },
  selectedAttributeText: {
    color: COLORS.primary,
    marginRight: 6,
    fontSize: 14,
  },
  removeAttributeButton: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noAttributesText: {
    textAlign: 'center',
    color: COLORS.darkGrey,
    marginTop: 8,
  },
  imagePickerButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  imagePickerButtonText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: '600',
    marginLeft: 8,
  },
  noImagesContainer: {
    height: 120,
    borderWidth: 1,
    borderColor: COLORS.grey,
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImagesText: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.darkGrey,
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imagePreviewWrapper: {
    position: 'relative',
    margin: 6,
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.grey,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.danger,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.light,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },

  productGrid: {
    padding: 10,
    paddingBottom: 100, // Added extra padding for bottom navigator
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 220, // Increased from 180 to 220
  },
});