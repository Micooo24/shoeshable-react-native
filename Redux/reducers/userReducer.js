import { SET_ORDERS, ORDERS_LOADING, ORDERS_ERROR, CLEAR_ORDERS } from './constants';

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
const categorizeOrders = (orders) => {
  const counts = {
    toPay: 0,
    toShip: 0,
    toDeliver: 0,
    toRate: 0
  };
  
  orders.forEach(order => {
    switch (order.status) {
      case 'processing':
        counts.toPay++;
        break;
      case 'confirmed':
        counts.toShip++;
        break;
      case 'shipped':
        counts.toDeliver++;
        break;
      case 'delivered':
        // Check if the order is delivered but not yet rated
        if (!order.isRated) {
          counts.toRate++;
        }
        break;
      default:
        break;
    }
  });
  
  return counts;
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ORDERS:
      return {
        ...state,
        orders: action.payload,
        orderCounts: categorizeOrders(action.payload),
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