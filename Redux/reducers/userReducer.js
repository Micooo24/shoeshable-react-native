// Updated orderReducer.js
import { SET_ORDERS, ORDERS_LOADING, ORDERS_ERROR, CLEAR_ORDERS } from '../constants';

const initialState = {
  orders: [],
  loading: false,
  error: null,
  orderCounts: {
    toPay: 0,    // Processing status
    toShip: 0,   // Confirmed status
    toDeliver: 0, // Shipped status
    toRate: 0    // Delivered but not rated status
  }
};

// Helper function to categorize orders and count them
// This is used as a fallback if the API doesn't provide counts directly
const categorizeOrders = (orders) => {
  const counts = {
    toPay: 0,
    toShip: 0,
    toDeliver: 0,
    toRate: 0
  };
  
  if (!Array.isArray(orders)) {
    console.error('Orders is not an array:', orders);
    return counts;
  }
  
  orders.forEach(order => {
    // Get status and normalize it
    const status = (order.orderStatus || '').toLowerCase();
    
    if (status === 'processing' || status === 'pending') {
      counts.toPay++;
    } 
    else if (status === 'confirmed') {
      counts.toShip++;
    } 
    else if (status === 'shipped') {
      counts.toDeliver++;
    } 
    else if (status === 'delivered' && !order.isRated) {
      counts.toRate++;
    }
  });
  
  return counts;
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ORDERS:
      let orders = [];
      let apiProvidedCounts = null;
      
      // Handle different API response formats
      if (action.payload) {
        if (Array.isArray(action.payload)) {
          // If payload is directly an array of orders
          orders = action.payload;
        } 
        else if (typeof action.payload === 'object') {
          // If payload is an object with orders property (standard API response)
          if (action.payload.orders) {
            orders = action.payload.orders;
            
            // If API provides order counts directly, use them
            if (action.payload.orderCounts) {
              apiProvidedCounts = action.payload.orderCounts;
            }
          } 
          // Maybe it's a single order object
          else if (action.payload._id && action.payload.orderStatus) {
            orders = [action.payload];
          }
        }
      }
      
      // Calculate counts if API didn't provide them
      const calculatedCounts = categorizeOrders(orders);
      
      // Prefer API provided counts, fall back to calculated
      const finalCounts = apiProvidedCounts || calculatedCounts;
      
      return {
        ...state,
        orders: orders,
        orderCounts: finalCounts,
        loading: false,
        error: null
      };
      
    case ORDERS_LOADING:
      return {
        ...state,
        loading: true,
        error: null
      };
      
    case ORDERS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
      
    case CLEAR_ORDERS:
      return {
        ...initialState
      };
      
    default:
      return state;
  }
};

export default userReducer;