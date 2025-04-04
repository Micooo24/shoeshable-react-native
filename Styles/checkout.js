import { StyleSheet } from 'react-native';
import { COLORS } from '../Theme/color';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background || '#f5f5f5',
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: COLORS.textDark || '#333',
  },
  cartItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 10,
  },
  itemHeader: {
    flexDirection: 'row',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    color: COLORS.textDark || '#333',
  },
  itemPrice: {
    fontWeight: 'bold',
    marginTop: 5,
    color: COLORS.primary,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textDark || '#333',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#999',
    marginVertical: 20,
  },
  addressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginTop: 5,
  },
  addressButtonText: {
    marginLeft: 10,
    color: COLORS.primary,
    fontWeight: '500',
  },
  paymentMethodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginTop: 5,
  },
  paymentMethodText: {
    marginLeft: 10,
    fontWeight: '500',
  },
  paymentButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
    opacity: 0.7,
  },
  paymentButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemMeta: {
    fontSize: 14,
    color: COLORS.textLight || '#666',
    marginBottom: 2,
  },
  itemQuantity: {
    fontSize: 14,
    color: COLORS.textLight || '#666',
    marginBottom: 2,
  },
  addressSaved: {
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 6,
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  addressName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  addressDetails: {
    color: COLORS.textLight || '#666',
    fontSize: 14,
    lineHeight: 20,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    margin: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  addressForm: {
    marginTop: 10,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8,
  },
  formLabel: {
    width: 80,
    fontWeight: 'bold',
    color: COLORS.textLight || '#666',
  },
  formValue: {
    flex: 1,
    color: COLORS.textDark || '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  updateButton: {
    backgroundColor: COLORS.primary,
    marginLeft: 10,
  },
  buttonText: {
    fontWeight: 'bold',
    color: COLORS.primary,
  },
    nameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    nameColumn: {
        flex: 1,
        marginRight: 8,
    },
    nameLabel: {
        fontSize: 12,
        color: COLORS.textLight || '#666',
        marginBottom: 2,
    },
    nameValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textDark || '#333',
    },
    // Add these new styles to your StyleSheet

addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressIcon: {
    marginRight: 10,
    width: 22,
  },
  addressName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textDark || '#333',
  },
});