import { 
  CREATE_REVIEW,
  GET_REVIEWS, 
  GET_REVIEW,
  UPDATE_REVIEW,
  DELETE_REVIEW,
  SET_CURRENT_REVIEW,
  CLEAR_REVIEW
} from '../constants';

import axios from 'axios';
import baseURL from '../../assets/common/baseurl';
import { getToken } from '../../sqlite_db/Auth';

// Get all reviews
export const getAllReviews = () => {
  return async (dispatch) => {
      try {
          const tokenData = await getToken();
          if (!tokenData || !tokenData.authToken) {
              throw new Error('Authentication required');
          }
          
          const config = {
              headers: {
                  'Authorization': `Bearer ${tokenData.authToken}`
              }
          };
          
          const response = await axios.get(
              `${baseURL}/api/reviews/allReviews`, 
              config
          );
          
          if (response.data && response.data.success) {
              dispatch({
                  type: GET_REVIEWS,
                  payload: response.data.data
              });
              
              return response.data.data;
          } else {
              throw new Error('Failed to fetch reviews');
          }
      } catch (error) {
          console.error('Get Reviews Error:', error);
          throw error;
      }
  };
};

// Get reviews for a specific product
export const getProductReviews = (productId) => {
  return async (dispatch) => {
      try {
          const tokenData = await getToken();
          if (!tokenData || !tokenData.authToken) {
              throw new Error('Authentication required');
          }
          
          const config = {
              headers: {
                  'Authorization': `Bearer ${tokenData.authToken}`
              }
          };
          
          const response = await axios.get(
              `${baseURL}/api/reviews/product/${productId}`, 
              config
          );
          
          if (response.data && response.data.success) {
              // Not dispatching to avoid overwriting all reviews
              return response.data.data;
          } else {
              throw new Error('Failed to fetch product reviews');
          }
      } catch (error) {
          console.error('Get Product Reviews Error:', error);
          throw error;
      }
  };
};

// Get a single review by ID
export const getReviewDetails = (reviewId) => {
  return async (dispatch) => {
      try {
          const tokenData = await getToken();
          if (!tokenData || !tokenData.authToken) {
              throw new Error('Authentication required');
          }
          
          const config = {
              headers: {
                  'Authorization': `Bearer ${tokenData.authToken}`
              }
          };
          
          const response = await axios.get(
              `${baseURL}/api/reviews/${reviewId}`, 
              config
          );
          
          if (response.data && response.data.success) {
              dispatch({
                  type: GET_REVIEW,
                  payload: response.data.data
              });
              
              return response.data.data;
          } else {
              throw new Error('Failed to fetch review details');
          }
      } catch (error) {
          console.error('Get Review Details Error:', error);
          throw error;
      }
  };
};

// Create a new review
export const createReview = (reviewData) => {
  return async (dispatch) => {
      try {
          const tokenData = await getToken();
          if (!tokenData || !tokenData.authToken) {
              throw new Error('Authentication required');
          }
          
          const config = {
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${tokenData.authToken}`
              }
          };
          
          console.log('Sending review data:', reviewData);
          
          const response = await axios.post(
              `${baseURL}/api/reviews/create`, 
              reviewData, 
              config
          );
          
          if (response.data && response.data.success) {
              dispatch({
                  type: CREATE_REVIEW,
                  payload: response.data.data
              });
              
              return response.data.data;
          } else {
              throw new Error('Failed to create review');
          }
      } catch (error) {
          console.error('Create Review Error:', error.response?.data || error.message);
          throw error.response?.data || error;
      }
  };
};

// Update review
export const updateReview = (reviewId, reviewData) => {
  return async (dispatch) => {
      try {
          const tokenData = await getToken();
          if (!tokenData || !tokenData.authToken) {
              throw new Error('Authentication required');
          }
          
          const config = {
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${tokenData.authToken}`
              }
          };
          
          const response = await axios.put(
              `${baseURL}/api/reviews/update/${reviewId}`, 
              reviewData, 
              config
          );
          
          if (response.data && response.data.success) {
              dispatch({
                  type: UPDATE_REVIEW,
                  payload: response.data.data
              });
              
              return response.data.data;
          } else {
              throw new Error('Failed to update review');
          }
      } catch (error) {
          console.error('Update Review Error:', error.response?.data || error.message);
          throw error.response?.data || error;
      }
  };
};

// Delete review
export const deleteReview = (reviewId) => {
  return async (dispatch) => {
      try {
          const tokenData = await getToken();
          if (!tokenData || !tokenData.authToken) {
              throw new Error('Authentication required');
          }
          
          const config = {
              headers: {
                  'Authorization': `Bearer ${tokenData.authToken}`
              }
          };
          
          const response = await axios.delete(
              `${baseURL}/api/reviews/delete/${reviewId}`, 
              config
          );
          
          if (response.data && response.data.success) {
              dispatch({
                  type: DELETE_REVIEW,
                  payload: reviewId
              });
              
              return response.data;
          } else {
              throw new Error('Failed to delete review');
          }
      } catch (error) {
          console.error('Delete Review Error:', error.response?.data || error.message);
          throw error.response?.data || error;
      }
  };
};

// Set current selected review (for UI purposes)
export const setCurrentReview = (review) => {
  return {
      type: SET_CURRENT_REVIEW,
      payload: review
  };
};

// Clear current review
export const clearReview = () => {
  return {
      type: CLEAR_REVIEW
  };
};