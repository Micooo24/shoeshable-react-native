import {
    CREATE_REVIEW,
    GET_REVIEWS,
    GET_REVIEW,
    UPDATE_REVIEW,
    DELETE_REVIEW,
    SET_CURRENT_REVIEW,
    CLEAR_REVIEW
} from '../constants';

const initialState = {
    reviews: [],
    currentReview: null,
    loading: true,
    error: null
};

export default function reviewReducer(state = initialState, action) {
    switch (action.type) {
        case GET_REVIEWS:
            return {
                ...state,
                reviews: action.payload,
                loading: false
            };
            
        case GET_REVIEW:
            return {
                ...state,
                currentReview: action.payload,
                loading: false
            };
            
        case CREATE_REVIEW:
            return {
                ...state,
                reviews: [...state.reviews, action.payload],
                loading: false
            };
            
        case UPDATE_REVIEW:
            return {
                ...state,
                reviews: state.reviews.map(review => 
                    review._id === action.payload._id ? action.payload : review
                ),
                currentReview: state.currentReview && state.currentReview._id === action.payload._id 
                    ? action.payload 
                    : state.currentReview,
                loading: false
            };
            
        case DELETE_REVIEW:
            return {
                ...state,
                reviews: state.reviews.filter(review => review._id !== action.payload),
                currentReview: state.currentReview && state.currentReview._id === action.payload 
                    ? null 
                    : state.currentReview,
                loading: false
            };
            
        case SET_CURRENT_REVIEW:
            return {
                ...state,
                currentReview: action.payload
            };
            
        case CLEAR_REVIEW:
            return {
                ...state,
                currentReview: null
            };
            
        default:
            return state;
    }
}