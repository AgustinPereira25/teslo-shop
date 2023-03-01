import { useEffect, useReducer } from 'react';
import { ICartProduct, IOrder, ShippingAddress } from '@/interfaces';
import { CartContext, cartReducer } from './';
import Cookie from 'js-cookie';
import { tesloApi } from '@/api';
import axios from 'axios';

export interface CartState {
    isLoaded: boolean;
    cart: ICartProduct[];
    numberOfItems: number;
    subTotal: number;
    taxRate: number;
    total: number;

    shippingAddress?: ShippingAddress,
}


const CART_INITIAL_STATE: CartState = {
    isLoaded: false,
    //cart:[] (no funciona, renderiza 2 veces el cart y la primera muestra todo cargado, la segunda vacía el carrito)
    cart: Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : [],
    numberOfItems: 0,
    subTotal: 0,
    taxRate: 0,
    total: 0,
    shippingAddress: undefined,
}

interface Props{
    children: React.ReactNode
}

export const CartProvider: React.FC<Props> = ({ children }) => {


    const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE)

    //Levanta el carrito de las cookies y lo almacena en el CartContext
    useEffect(() => {
        try {
            var cartInCookie = Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : [];
            console.log({ cartInCookie })
            dispatch({ type: '[Cart] - LoadCart from cookies | storage', payload: cartInCookie });
        } catch (error) {
            dispatch({ type: '[Cart] - LoadCart from cookies | storage', payload: [] });
        }
    }, [])
    
    useEffect(() => {
        if ( Cookie.get('firstName') ){
            const shippingAddress:ShippingAddress = {
                firstName: Cookie.get('firstName') ? Cookie.get('firstName')! : '',
                lastName : Cookie.get('lastName')  ? Cookie.get('lastName')! : '',
                address  : Cookie.get('address')   ? Cookie.get('address')! : '',
                address2 : Cookie.get('address2')  ? Cookie.get('address2')! : '',
                zip      : Cookie.get('zip')       ? Cookie.get('zip')! : '',
                city     : Cookie.get('city')      ? Cookie.get('city')! : '',
                country  : Cookie.get('country')   ? Cookie.get('country')! : '',
                phone    : Cookie.get('phone')     ? Cookie.get('phone')! : '',
            };
            // console.log({shippingAddress})
            dispatch({ type: '[Cart] - LoadAddress from Cookies', payload: shippingAddress });
        }
        
    }, [])
    


    //Almacena el carrito en las Cookies
    useEffect(() => {
      Cookie.set('cart', JSON.stringify( state.cart ));
    
    }, [state.cart])


    useEffect(() => {

        const numberOfItems = state.cart.reduce( (prev, current) => current.quantity + prev ,0 ) //"itera" sobre el cart y va sumando las quantities.
        const subTotal = state.cart.reduce( (prev, current) => (current.price * current.quantity) + prev ,0 ) //"itera" sobre el cart y va sumando las quantities.
        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

        const OrderSummary = {
            numberOfItems, 
            subTotal,
            taxRate: subTotal * taxRate,
            total: subTotal * (taxRate + 1 )

        }

        // console.log({ OrderSummary })
        dispatch( {type: '[Cart] - Update order summary', payload: OrderSummary });
      
      }, [state.cart])
    
      
    const addProductToCart = ( product: ICartProduct) => {
        // dispatch({ type: '[Cart] - Update products in cart', payload: product });

        //Solucion definitiva
        const productInCart = state.cart.some(p => p._id === product._id); //controla si existe en el contexto el ID

        if( !productInCart ) return dispatch({ type: '[Cart] - Update products in cart', payload: [...state.cart, product] });
        
        const productInCartButDifferentSize = state.cart.some(p => p._id === product._id && p.size == product.size); //controla si existe en el contexto el ID
        if( !productInCartButDifferentSize ) return dispatch({ type: '[Cart] - Update products in cart', payload: [...state.cart, product] });

        //Acumular
        const updatedProducts = state.cart.map( p => {
            if ( p._id !== product._id ) return p;
            if ( p.size !== product.size ) return p;

            // Actualizar la cantidad de prendas con igual talle y id.
            p.quantity += product.quantity;

            return p;
        });
        dispatch({ type: '[Cart] - Update products in cart', payload: updatedProducts });


    }

    const updateCartQuantity = ( product: ICartProduct ) => {
        dispatch({ type: '[Cart] - Change cart quantity', payload: product });
    }

    const removeCartProduct = ( product: ICartProduct ) => {
        dispatch({ type: '[Cart] - Remove product in cart', payload: product });
    }

    const updateAddress = ( address: ShippingAddress) => {
        //Guardo la data en cookies
        Cookie.set('firstName',address.firstName);
        Cookie.set('lastName',address.lastName);
        Cookie.set('address',address.address);
        Cookie.set('address2',address.address2);
        Cookie.set('zip',address.zip);
        Cookie.set('city',address.city);
        Cookie.set('country',address.country);
        Cookie.set('phone',address.phone);
        
        dispatch({ type: '[Cart] - Update Address', payload: address });
    }


    const createOrder = async():Promise<{ hasError: boolean; message: string; }> => {

        if (!state.shippingAddress ){
            throw new Error('No hay dirección de entrega');
        }

        const body:IOrder = {
            orderItems: state.cart.map( p => ({
                ...p,
                size: p.size!
            })),
            shippingAddress: state.shippingAddress,
            numberOfItems: state.numberOfItems,
            subTotal: state.subTotal,
            taxRate: state.taxRate,
            total: state.total,
            isPaid: false,
        }


        try {
            const { data } = await tesloApi.post<IOrder>('/orders', body);
            
            dispatch({ type: '[Cart] - Order complete' });

            return {
                hasError: false,
                message: data._id!
            }

            // console.log({ data });

        } catch (error) {
            if( axios.isAxiosError(error) ){
                return {
                    hasError: true,
                    message: error.response?.data.message
                }
            }

            return {
                hasError: true,
                message: 'Error no controlado, hable con el administrador'
            }
        }
    }

    return (

        <CartContext.Provider value={{
            ...state,

            //Methods
            addProductToCart,
            updateCartQuantity,
            removeCartProduct,
            updateAddress,

            //Orders
            createOrder,
        }}>
                { children }
        </CartContext.Provider>
    )
}