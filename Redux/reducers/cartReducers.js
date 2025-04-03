import {
    ADD_TO_CART,
    GET_CART,
    UPDATE_CART_ITEM,
    UPDATE_CART_QUANTITY, 
    REMOVE_FROM_CART,
    CLEAR_CART,
} from '../constants';

const initialState = {
    cartItems: [], // Array to store cart items
    totalQuantity: 0, // Total quantity of items in the cart
    totalPrice: 0, // Total price of items in the cart
};

export const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_CART: {
            const newItem = action.payload;
            const existingItem = state.cartItems.find(item => item.productId === newItem.productId);

            if (existingItem) {
                // If the item already exists, update its quantity
                const updatedCartItems = state.cartItems.map(item =>
                    item.productId === newItem.productId
                        ? { ...item, quantity: item.quantity + newItem.quantity }
                        : item
                );
                return {
                    ...state,
                    cartItems: updatedCartItems,
                    totalQuantity: state.totalQuantity + newItem.quantity,
                    totalPrice: state.totalPrice + newItem.price * newItem.quantity,
                };
            } else {
                // If the item is new, add it to the cart
                return {
                    ...state,
                    cartItems: [...state.cartItems, newItem],
                    totalQuantity: state.totalQuantity + newItem.quantity,
                    totalPrice: state.totalPrice + newItem.price * newItem.quantity,
                };
            }
        }

        case GET_CART: {
            const cartItems = action.payload;

            // Calculate total quantity and total price
            const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
            const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

            return {
                ...state,
                cartItems,
                totalQuantity,
                totalPrice,
            };
        }

        case UPDATE_CART_ITEM: {
            const { productId, size, color } = action.payload;

            // Update only the size and color of the specific cart item
            const updatedCartItems = state.cartItems.map(item =>
                item.productId === productId
                    ? { ...item, size, color } // Update size and color
                    : item
            );

            return {
                ...state,
                cartItems: updatedCartItems,
            };
        }

        case UPDATE_CART_QUANTITY: {
            const { productId, quantity } = action.payload;

            // Update the quantity of the specific cart item
            const updatedCartItems = state.cartItems.map(item =>
                item.productId === productId
                    ? { ...item, quantity } // Update quantity
                    : item
            );

            // Recalculate total quantity and total price
            const totalQuantity = updatedCartItems.reduce((sum, item) => sum + item.quantity, 0);
            const totalPrice = updatedCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

            return {
                ...state,
                cartItems: updatedCartItems,
                totalQuantity,
                totalPrice,
            };
        }

        case REMOVE_FROM_CART: {
            const productId = action.payload;

            // Filter out the item to be removed
            const updatedCartItems = state.cartItems.filter(item => item.productId !== productId);

            // Recalculate total quantity and total price
            const totalQuantity = updatedCartItems.reduce((sum, item) => sum + item.quantity, 0);
            const totalPrice = updatedCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

            return {
                ...state,
                cartItems: updatedCartItems,
                totalQuantity,
                totalPrice,
            };
        }

        case CLEAR_CART:
            return {
                ...state,
                cartItems: [],
                totalQuantity: 0,
                totalPrice: 0,
            };

        default:
            return state;
    }
};