import { StyleSheet } from 'react-native';

// Define colors directly in the file
export const COLORS = {
  primary: '#2c3e50',   
  primaryLight: '#34495e', 
  primaryDark: '#1a2530',  
  white: '#ffffff',        
  light: '#ecf0f1',        
  grey: '#bdc3c7',         
  darkGrey: '#7f8c8d',    
  text: '#2c3e50',        
  textLight: '#7f8c8d',    
  success: '#2ecc71',     
  warning: '#f39c12',      
  danger: '#e74c3c',       
  shadow: 'rgba(44, 62, 80, 0.15)', 
  accent: '#3498db',
  error: '#e74c3c',     
  
  transparent: 'transparent',
  headerBackground: '#ffffff',
  categoryBackground: '#f5f7fa',
  border: '#e1e8ed',
  selectedCategoryBackground: '#e6f2ff',
  selectedBorder: '#3498db',
  selectedText: '#3498db'
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    marginTop: 33,
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  userTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  welcomeText: {
    color: COLORS.light,
    fontSize: 13,
    fontWeight: "500",
  },
  username: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  
  // Edit profile button
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    elevation: 1,
  },
  editProfileText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 4,
  },
  
  // Log out button
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.danger,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    elevation: 1,
  },
  logoutText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 4,
  },
  
  // Authentication section
  authContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  authTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  authText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "500",
  },
  authButtonsContainer: {
    flexDirection: "row",
    gap: 10,
  },
  authButton: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 6,
    elevation: 1,
  },
  registerButton: {
    backgroundColor: COLORS.white,
  },
  authButtonText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 14,
  },
  registerButtonText: {
    color: COLORS.accent,
    fontWeight: "600",
    fontSize: 14,
  },
  
  // Content scroll view
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 80, // Extra padding at bottom for nav bar
  },
  
  // Purchases and sections
  purchasesContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitleWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginLeft: 8,
  },
  viewAllText: {
    color: COLORS.accent,
    fontSize: 13,
    fontWeight: "600",
  },
  
  // Purchase status items
  purchaseStatusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statusItem: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    minWidth: 60,
    position: 'relative',
  },
  statusIconContainer: {
    position: 'relative',
    width: 50, 
    height: 50, 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  statusText: {
    fontSize: 12,
    color: COLORS.text,
    textAlign: "center",
    fontWeight: "500",
  },

  countBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#e74c3c', // COLORS.error - hardcoded for clarity
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100, // Increased to ensure visibility
    borderWidth: 1.5, // Slightly thicker border
    borderColor: 'white',
    // Add elevation for Android
    elevation: 5,
    // Add shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  
  countText: {
    color: 'white', // Explicitly white for better contrast
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  zeroCountBadge: {
    backgroundColor: COLORS.gray || '#CCCCCC',
  },


  ordersList: {
    marginTop: 4,
  },
  orderItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  orderIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  orderDetails: {
    flex: 1,
  },
  orderTitle: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "600",
  },
  orderSubtitle: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  orderPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.primary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.light,
    marginVertical: 4,
  },
  
  // Wishlist section
  wishlistPreview: {
    alignItems: "center",
    paddingVertical: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: COLORS.darkGrey,
    marginBottom: 12,
  },
  browseButton: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  browseButtonText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 14,
  },
  emptySpace: {
    height: 40,
  },
  
  // Bottom navigation
  bottomNavContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    borderTopWidth: 1,
    borderTopColor: COLORS.light,
  },
  
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    width: '100%',
    maxHeight: '90%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  closeButton: {
    padding: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  modalScrollView: {
    padding: 15,
  },
  loadingContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.primary,
    fontSize: 16,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImagePreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    backgroundColor: '#eee',
  },
  imagePickerButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginTop: 5,
  },
  imageButtonText: {
    color: COLORS.white,
    marginLeft: 5,
    fontSize: 14,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: COLORS.dark,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    marginLeft: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc',
    opacity: 0.7,
  },
  cancelButtonText: {
    color: COLORS.dark,
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  profileInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginRight: 8,
    width: 70,
  },
  profileValue: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  profileImagePreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  imageButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  imageButtonText: {
    color: COLORS.white,
    fontSize: 12,
    marginLeft: 4,
  },
  
  // Camera styles
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  cameraControlsContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  cameraButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  takePictureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  takePictureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.white,
  },
  cameraPermissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraPermissionText: {
    color: COLORS.white,
    fontSize: 18,
    marginBottom: 20,
  },
});