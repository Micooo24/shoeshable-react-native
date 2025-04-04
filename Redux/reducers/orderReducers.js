import { 
    CREATE_ORDER,
    GET_ORDER, 
    GET_MY_ORDERS,
    GET_ALL_ORDERS,
    UPDATE_ORDER,
    DELETE_ORDER,
    SET_CURRENT_ORDER,
    CLEAR_ORDER
} from '../constants';

const initialState = {
    currentOrder: null,
    myOrders: [],
    allOrders: [],
    loading: false,
    error: null,
    totalAmount: 0
};

export const orderReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_ORDER:
            return {
                ...state,
                currentOrder: action.payload,
                myOrders: [action.payload, ...state.myOrders]
            };
            
        case GET_ORDER:
            return {
                ...state,
                currentOrder: action.payload
            };
            
        case GET_MY_ORDERS:
            return {
                ...state,
                myOrders: action.payload
            };
            
        case GET_ALL_ORDERS:
            return {
                ...state,
                allOrders: action.payload.orders,
                totalAmount: action.payload.totalAmount
            };
            
        case UPDATE_ORDER:
            return {
                ...state,
                currentOrder: state.currentOrder?._id === action.payload._id ? 
                    action.payload : state.currentOrder,
                myOrders: state.myOrders.map(order => 
                    order._id === action.payload._id ? action.payload : order
                ),
                allOrders: state.allOrders.map(order => 
                    order._id === action.payload._id ? action.payload : order
                )
            };
            
        case DELETE_ORDER:
            return {
                ...state,
                currentOrder: state.currentOrder?._id === action.payload ? 
                    null : state.currentOrder,
                myOrders: state.myOrders.filter(order => 
                    order._id !== action.payload
                ),
                allOrders: state.allOrders.filter(order => 
                    order._id !== action.payload
                )
            };
            
        case SET_CURRENT_ORDER:
            return {
                ...state,
                currentOrder: action.payload
            };
            
        case CLEAR_ORDER:
            return {
                ...state,
                currentOrder: null
            };
            
        default:
            return state;
    }
};