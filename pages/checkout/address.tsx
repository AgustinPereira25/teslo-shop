
import { useContext, useEffect } from 'react';
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router';
import { ShopLayout } from '@/components/layouts'
import { FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography, Box, Button } from '@mui/material';
import { countries, jwt } from '@/utils';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import { CartContext } from '../../context/cart';


type FormData = {
    firstName: string;
    lastName : string;
    address  : string;
    address2 : string;
    zip      : string;
    city     : string;
    country  : string;
    phone    : string;
}


const getAddressFromCookies = ():FormData => {
    return {
        firstName: Cookies.get('firstName') || '',
        lastName : Cookies.get('lastName') || '',
        address  : Cookies.get('address') || '',
        address2 : Cookies.get('address2') || '',
        zip      : Cookies.get('zip') || '',
        city     : Cookies.get('city') || '',
        country  : Cookies.get('country') || '',
        phone    : Cookies.get('phone') || '',
    }

}

const AddressPage = () => {

    const router = useRouter()
    const { updateAddress } = useContext(CartContext);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        defaultValues: {
            firstName: '',
            lastName : '',
            address  : '',
            address2 : '',
            zip      : '',
            city     : '',
            country  : countries[0].code,
            phone    : '',
        }
    });

    useEffect( () => {
        //Evita la lectura directa de las cookies porque eso causaba diferencia entre
        //el servidor y lo que renderiza el cliente.
        reset(getAddressFromCookies);
    }, [ reset ])
    
    const onSubmitAddress = ( data:FormData ) => {
        console.log( {data} );

        updateAddress( data );
        router.push('/checkout/summary')
    }
    return (
        <ShopLayout title={'Direccion'} pageDescription={'Confirmar direccion del destino'}>
            <form onSubmit={ handleSubmit( onSubmitAddress ) } noValidate>
                <Typography variant='h1' component='h1'>Direcci??n</Typography>
                <Grid container spacing={ 2 } sx={{ mt:2 }}>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label='Nombre' 
                            variant='filled' 
                            fullWidth
                            { 
                                ...register('firstName',  {
                                    required: 'Este campo es requerido',
                                }) 
                            }
                            error={ !!errors.firstName }
                            helperText={ errors.firstName?.message }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label='Apellido' 
                            variant='filled' 
                            fullWidth
                            { 
                                ...register('lastName',  {
                                    required: 'Este campo es requerido',
                                }) 
                            }
                            error={ !!errors.lastName }
                            helperText={ errors.lastName?.message }
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label='Direcci??n' 
                            variant='filled' 
                            fullWidth
                            { 
                                ...register('address',  {
                                    required: 'Este campo es requerido',
                                }) 
                            }
                            error={ !!errors.address }
                            helperText={ errors.address?.message }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label='Direcci??n 2 (opcional)' 
                            variant='filled' 
                            fullWidth
                            { 
                                ...register('address2') 
                            }
                            error={ !!errors.address2 }
                            helperText={ errors.address2?.message }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label='C??digo Postal' 
                            variant='filled' 
                            fullWidth
                            { 
                                ...register('zip', { required: 'Este campo es requerido'}) 
                            }
                            error={ !!errors.zip }
                            helperText={ errors.zip?.message }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label='Ciudad' 
                            variant='filled' 
                            fullWidth
                            { 
                                ...register('city', { required: 'Este campo es requerido'}) 
                            }
                            error={ !!errors.city }
                            helperText={ errors.city?.message }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {/* <FormControl fullWidth> */}
                            <TextField
                                // select
                                variant='filled'
                                label='Pa??s'
                                // defaultValue={ Cookies.get('country') || countries[0].code }
                                { 
                                    ...register('country', { required: 'Este campo es requerido'}) 
                                }
                                error={ !!errors.country }
                                // helperText={ errors.country?.message }

                            >
                                {/* {
                                    countries.map( country => (
                                        <MenuItem key={country.code} value={country.code}>{ country.name }</MenuItem>
                                    ))
                                } */}
                            </TextField>
                        {/* </FormControl> */}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label='Tel??fono' 
                            variant='filled' 
                            fullWidth 
                            { 
                                ...register('phone', { required: 'Este campo es requerido'}) 
                            }
                            error={ !!errors.phone }
                            helperText={ errors.phone?.message }
                        />
                    </Grid>
                </Grid>


                <Box sx={{ mt:5 }} display='flex' justifyContent={'center'}>
                    <Button type="submit" color='secondary' className="circular-btn" size='large'>
                        Revisar pedido
                    </Button>
                </Box>
            </form>
        </ShopLayout>
    )
}


export const getServerSideProps: GetServerSideProps = async ({ req }) => {


    const { token = '' } = req.cookies;
    let isValidToken = false;

    try {
        await jwt.isValidToken( token );
        isValidToken = true;
    } catch (error) {
        isValidToken = false;
    }

    // if ( !isValidToken ){
    //     return {
    //         redirect: {
    //             destination: '/auth/login?p=/checkout/address',
    //             permanent: false,
    //         }
    //     }
    // }
    return {
        props: {
            
        }
    }
}
export default AddressPage