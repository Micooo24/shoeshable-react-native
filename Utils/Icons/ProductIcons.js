import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FontAwesome5 } from '@expo/vector-icons';
import { COLORS } from '../../Theme/color.js';

/**
 * Returns the appropriate icon component for a given brand
 * @param {string} brand - The brand name
 * @returns {React.ReactElement} - The icon component
 */
export const getBrandIcon = (brand) => {
  if (!brand) return <FontAwesome5 name="tag" size={18} color={COLORS.primary} />;
  
  switch (brand.toLowerCase()) {
    case 'nike':
      return <Icon name="check-bold" size={14} color={COLORS.primary} />;
    case 'adidas':
      return <Icon name="podium" size={14} color={COLORS.primary} />;
    case 'jordan':
      return <Icon name="basketball" size={18} color={COLORS.primary} />;
    default:
      return <FontAwesome5 name="tag" size={18} color={COLORS.primary} />;
  }
};

/**
 * Returns the appropriate icon component for a given product category
 * @param {string} category - The product category
 * @returns {React.ReactElement} - The icon component
 */
export const getCategoryIcon = (category) => {
  if (!category) return <Icon name="shoe-sneaker" size={18} color={COLORS.primary} />;
  
  switch (category.toLowerCase()) {
    case 'running':
      return <Icon name="run" size={18} color={COLORS.primary} />;
    case 'basketball':
      return <Icon name="basketball" size={18} color={COLORS.primary} />;
    case 'casual':
      return <FontAwesome5 name="shoe-prints" size={18} color={COLORS.primary} />;
    case 'formal':
      return <Icon name="tie" size={18} color={COLORS.primary} />;
    case 'boots':
      return <Icon name="boot-outline" size={18} color={COLORS.primary} />;
    case 'sandals':
      return <Icon name="shoe-sandal" size={18} color={COLORS.primary} />;
    default:
      return <Icon name="shoe-sneaker" size={18} color={COLORS.primary} />;
  }
};

/**
 * Returns the appropriate icon component for a given gender
 * @param {string} gender - The gender (men, women, kids)
 * @returns {React.ReactElement} - The icon component
 */
export const getGenderIcon = (gender) => {
  if (!gender) return <Icon name="gender-male-female" size={18} color={COLORS.primary} />;
  
  switch (gender.toLowerCase()) {
    case 'men':
      return <FontAwesome5 name="male" size={18} color={COLORS.primary} />;
    case 'women':
      return <FontAwesome5 name="female" size={18} color={COLORS.primary} />;
    case 'kids':
      return <FontAwesome5 name="child" size={18} color={COLORS.primary} />;
    default:
      return <Icon name="gender-male-female" size={18} color={COLORS.primary} />;
  }
};