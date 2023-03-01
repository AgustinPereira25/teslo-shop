import { CartState } from './';
import { ICartProduct } from '@/interfaces';
import { ShippingAddress } from '@/interfaces';

type CartActionType =  
| { type: '[Cart] - LoadCart from cookies | storage', payload: ICartProduct[]}
| { type: '[Cart] - Update products in cart', payload: ICartProduct[]}
| { type: '[Cart] - Change cart quantity', payload: ICartProduct}
| { type: '[Cart] - Remove product in cart', payload: ICartProduct}
| { type: '[Cart] - LoadAddress from Cookies', payload: ShippingAddress}
| { type: '[Cart] - Update Address', payload: ShippingAddress}
| { 
  type: '[Cart] - Update order summary',
  payload: {
    numberOfItems: number;
    subTotal: number;
    taxRate: number;
    total: number;
  }
}
| { type: '[Cart] - Order complete' }


export const cartReducer = (state: CartState, action: CartActionType): CartState => {

    switch (action.type) {
      case '[Cart] - LoadCart from cookies | storage':
        return {
          ...state,
          isLoaded: true,
          cart:[...action.payload]
        }

      case '[Cart] - Update products in cart':
        return {
          ...state,
          cart:[...action.payload]
        }

      case '[Cart] - Change cart quantity':
        return {
          ...state,
          cart: state.cart.map( product => {
            if ( product._id !== action.payload._id ) return product;
            if ( product.size !== action.payload.size ) return product;

            //Actualiza cantidad
            return action.payload;
          })
        }

        case '[Cart] - Remove product in cart':
          return {
            ...state,
            cart: state.cart.filter( product => !(product._id === action.payload._id && product.size === action.payload.size) )
          }

        case '[Cart] - Update order summary':
          return {
            ...state,
            ...action.payload
          }

        case '[Cart] - LoadAddress from Cookies':
        case '[Cart] - Update Address':
          return {
            ...state,
            shippingAddress: action.payload
          }

        case '[Cart] - Order complete':
          return {
            ...state,
            cart:[],
            numberOfItems: 0,
            subTotal: 0,
            taxRate: 0,
            total: 0
          }

       default:
           return state;
    }

}