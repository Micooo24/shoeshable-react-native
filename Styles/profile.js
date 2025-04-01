import { COLORS } from '../Theme/color';
import { StyleSheet } from 'react-native';

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
  settingsButton: {
    padding: 6,
  },
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 80, // Extra padding at bottom for the nav bar
  },
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
});