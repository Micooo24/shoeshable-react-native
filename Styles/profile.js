import { StyleSheet } from 'react-native';

// Color palette
const COLORS = {
  primary: "#2c3e50", // Dark blue-gray
  primaryLight: "#34495e", 
  primaryDark: "#1a2530", // Darker blue-gray
  white: "#ffffff", // Pure white
  light: "#ecf0f1", // Light gray
  grey: "#bdc3c7", // Medium gray
  darkGrey: "#7f8c8d", // Darker gray
  text: "#2c3e50", // Text in dark blue-gray
  textLight: "#7f8c8d", // Light text in gray
  success: "#2ecc71", // Success green
  warning: "#f39c12", // Warning orange
  danger: "#e74c3c", // Danger red
  shadow: "rgba(44, 62, 80, 0.15)", // Shadow based on primary color
  accent: "#3498db", // Accent blue
};

export const styles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  
  // Header section
  header: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
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
    alignItems: "center",
    width: "23%",
  },
  statusIconContainer: {
    backgroundColor: COLORS.light,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    elevation: 1,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statusText: {
    fontSize: 12,
    color: COLORS.text,
    textAlign: "center",
    fontWeight: "500",
  },
  
  // Orders list
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
  },
  modalContent: {
    backgroundColor: COLORS.white,
    width: '90%',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: COLORS.primary,
    textAlign: 'center',
  },
  
  // Form elements
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: COLORS.text,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.grey,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  
  // Button styles
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: COLORS.light,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  cancelButtonText: {
    color: COLORS.text,
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  // Add to c:\Users\ACER\Downloads\React-Native\shoeshable-android\Styles\profile.js

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


export { COLORS };