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

// Helper function to get product ID regardless of data structure
const getProductId = (item) => {
    if (item._id) return item._id;
    if (item.productId && typeof item.productId === 'object') return item.productId._id;
    if (item.productId) return item.productId;
    if (item.product_id) return item.product_id;
    return null;
};

// Helper function to get price regardless of data structure
const getItemPrice = (item) => {
    if (item.price) return parseFloat(item.price);
    if (item.productId && item.productId.price) return parseFloat(item.productId.price);
    return 0;
};

export const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_CART: {
            const newItem = action.payload;
            const newItemId = getProductId(newItem);
            
            if (!newItemId) {
                console.error('Invalid cart item format:', newItem);
                return state;
            }
            
            const existingItemIndex = state.cartItems.findIndex(item => getProductId(item) === newItemId);
            
            if (existingItemIndex !== -1) {
                // If the item already exists, update its quantity
                const updatedCartItems = [...state.cartItems];
                updatedCartItems[existingItemIndex] = {
                    ...updatedCartItems[existingItemIndex],
                    quantity: updatedCartItems[existingItemIndex].quantity + (newItem.quantity || 1)
                };
                
                // Recalculate totals
                const totalQuantity = updatedCartItems.reduce((sum, item) => sum + item.quantity, 0);
                const totalPrice = updatedCartItems.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0);
                
                return {
                    ...state,
                    cartItems: updatedCartItems,
                    totalQuantity,
                    totalPrice,
                };
            } else {
                // If the item is new, add it to the cart
                const updatedCartItems = [...state.cartItems, newItem];
                
                // Recalculate totals
                const totalQuantity = updatedCartItems.reduce((sum, item) => sum + item.quantity, 0);
                const totalPrice = updatedCartItems.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0);
                
                return {
                    ...state,
                    cartItems: updatedCartItems,
                    totalQuantity,
                    totalPrice,
                };
            }
        }

        case GET_CART: {
            const cartItems = action.payload;
            
            // Calculate total quantity and total price
            const totalQuantity = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
            const totalPrice = cartItems.reduce((sum, item) => sum + getItemPrice(item) * (item.quantity || 1), 0);

            return {
                ...state,
                cartItems,
                totalQuantity,
                totalPrice,
            };
        }

        case UPDATE_CART_ITEM: {
            const updatedItem = action.payload;
            const productId = getProductId(updatedItem);
            
            if (!productId) {
                console.error('Invalid cart item format:', updatedItem);
                return state;
            }
            
            // Update only the specified fields of the specific cart item
            const updatedCartItems = state.cartItems.map(item => 
                getProductId(item) === productId
                    ? { ...item, ...updatedItem }
                    : item
            );
            
            // Totals shouldn't change with just size/color update
            return {
                ...state,
                cartItems: updatedCartItems,
            };
        }

        case UPDATE_CART_QUANTITY: {
            const updatedItem = action.payload;
            const productId = getProductId(updatedItem);
            const quantity = updatedItem.quantity;
            
            if (!productId) {
                console.error('Invalid cart item format:', updatedItem);
                return state;
            }
            
            // Update the quantity of the specific cart item
            const updatedCartItems = state.cartItems.map(item =>
                getProductId(item) === productId
                    ? { ...item, quantity }
                    : item
            );

            // Recalculate total quantity and total price
            const totalQuantity = updatedCartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
            const totalPrice = updatedCartItems.reduce((sum, item) => sum + getItemPrice(item) * (item.quantity || 1), 0);

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
            const updatedCartItems = state.cartItems.filter(item => getProductId(item) !== productId);

            // Recalculate total quantity and total price
            const totalQuantity = updatedCartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
            const totalPrice = updatedCartItems.reduce((sum, item) => sum + getItemPrice(item) * (item.quantity || 1), 0);

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