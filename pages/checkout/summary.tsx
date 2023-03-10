import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { CartList, OrderSummary } from "@/components/cart";
import { ShopLayout } from "@/components/layouts"
import { Card, CardContent, Divider, Grid, Typography, Box, Button, Link, Chip } from '@mui/material';
import { CartContext } from '../../context';
import { countries } from "@/utils";
import Cookies from 'js-cookie';

const SummaryPage = () => {

    const router = useRouter();
    const { shippingAddress, numberOfItems, createOrder } = useContext(CartContext);

    const [isPosting, setIsPosting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    
    useEffect(() => {
        if ( !Cookies.get('firstName') ){
            router.push('/checkout/address');
        }
    }, [ router ])
    
    
    const onCreateOrder = async() => {
        setIsPosting(true);

        const { hasError, message } = await createOrder(); // todo: depende del resultado 

        if ( hasError ){
           setIsPosting(false);
           setErrorMessage( message );
           return;
        }

        router.replace(`/orders/${ message }`);
    }


    if (!shippingAddress){
        return <></>
    }


    return (
        <ShopLayout title='Resumen de orden' pageDescription={'Resumen de la orden'}>
            <Typography variant='h1' component='h1'>Resumen de la orden</Typography>

            <Grid container>
            <Grid item xs= { 12 } sm={ 7 }>
                <CartList editable={ false } />
                </Grid>
                <Grid item xs= { 12 } sm={ 5 }>
                    <Card className='summary-card'>
                        <CardContent>
                            <Typography variant='h2'>Resumen ({numberOfItems} { numberOfItems === 1 ? 'producto' : 'productos' })</Typography>
                            <Divider sx={{ my:1 }} />
                            
                            <Box display='flex' justifyContent={'space-between'}>
                                <Typography variant='subtitle1'>Direcci??n de entrega</Typography>
                                <NextLink href={"/checkout/address"} passHref legacyBehavior>
                                    <Link underline="always">
                                        Editar
                                    </Link>
                                </NextLink>
                            </Box>

                            <Typography>{ shippingAddress?.firstName } { shippingAddress?.lastName }</Typography>
                            <Typography>{ shippingAddress?.address } { shippingAddress?.address2 ? `, ${shippingAddress?.address2}` : '' }</Typography>
                            <Typography>{ shippingAddress?.city }, { shippingAddress?.zip }</Typography>
                            {/* <Typography>{ countries.find( country => country.code === shippingAddress?.country )?.name }</Typography> */}
                            <Typography>{ shippingAddress.country }</Typography>
                            <Typography>{ shippingAddress?.phone }</Typography>

                            <Divider />
                            
                            <Box display='flex' justifyContent={'end'}>
                                <NextLink href={"/cart"} passHref legacyBehavior>
                                    <Link underline="always">
                                        Editar
                                    </Link>
                                </NextLink>
                            </Box>

                            <OrderSummary />

                            <Box sx={{ mt:3 }} display="flex" flexDirection={'column'} >
                                <Button 
                                    color="secondary" 
                                    className="circular-btn" 
                                    fullWidth
                                    onClick = { onCreateOrder }
                                    disabled= { isPosting }
                                >
                                    Confirmar orden
                                </Button>

                                <Chip 
                                    color="error"
                                    label={ errorMessage }
                                    sx={{ display: errorMessage ? 'flex' : 'none', mt: 2 }}
                                />

                                
                            </Box>

                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    )
}

export default SummaryPage;