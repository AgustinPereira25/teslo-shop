import React from 'react'
import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'
import { dbOrders } from '@/database'
import { AdminLayout } from '@/components/layouts'
import { IOrder } from '@/interfaces'
import { CartList, OrderSummary } from '@/components/cart'
import { CreditScoreOutlined, CreditCardOffOutlined, AirplaneTicketOutlined } from '@mui/icons-material'
import { Typography, Chip, Grid, Card, CardContent, Divider, Box, CircularProgress } from '@mui/material'


interface Props {
    order: IOrder;
}

const AdminOrderPage:NextPage<Props> = ({ order }) => {

    const { shippingAddress } = order;

    return (
        <AdminLayout 
            title='Resumen de la orden' 
            subTitle= { `OrdenId: ${order._id}` }
            icon={ <AirplaneTicketOutlined/> }
        >
            <Grid container className='fadeIn'>
                <Grid item xs= { 12 } sm={ 7 }>
                    <CartList products={ order.orderItems }/>
                </Grid>
                <Grid item xs= { 12 } sm={ 5 }>
                    <Card className='summary-card'>
                        <CardContent>
                            <Typography variant='h2'>Resumen ({ order.numberOfItems } { order.numberOfItems > 1 ? 'productos' : 'producto'} )</Typography>
                            <Divider sx={{ my:1 }} />
                            
                            <Box display='flex' justifyContent={'space-between'}>
                                <Typography variant='subtitle1'>Dirección de entrega</Typography>
                            </Box>

                            <Typography>{ shippingAddress.firstName } { shippingAddress.lastName }</Typography>
                            <Typography>{ shippingAddress.address } { shippingAddress.address2 ? `, ${ shippingAddress.address2 }` : '' } </Typography>
                            <Typography>{ shippingAddress.city }, { shippingAddress.zip }</Typography>
                            <Typography>{ shippingAddress.country }</Typography>
                            <Typography>{ shippingAddress.phone }</Typography>

                            <Divider />

                            <OrderSummary 
                                orderValues={{
                                    numberOfItems: order.numberOfItems,
                                    subTotal: order.subTotal,
                                    taxRate: order.taxRate,
                                    total: order.total,
                                }}
                            />

                            <Box sx={{ mt:3 }} display={'flex'} flexDirection={'column'}>
                                <Box display={'flex'} flexDirection='column'>
                                    {
                                        order.isPaid
                                        ? (
                                            <Chip
                                                sx={{ my: 2 }}
                                                label="Orden ya fue pagada"
                                                variant='outlined'
                                                color="success"
                                                icon={ <CreditScoreOutlined /> }
                                            />
                                        ):
                                        (
                                            <Chip
                                                sx={{ my: 2 }}
                                                label="Pendiente de pago"
                                                variant='outlined'
                                                color="error"
                                                icon={ <CreditCardOffOutlined/> }
                                            />
                                        )
                                    }
                                </Box>
                            </Box>

                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </AdminLayout>
    )
}




export const getServerSideProps: GetServerSideProps = async ({ req, query }) => { 

    const { id = '' } = query;

    const order = await dbOrders.getOrderById( id.toString() );

    if ( !order ){
        return {
            redirect: {
                destination: `/admin/orders`,
                permanent: false,
                
            }
        }
    }


    return {
        props: {
            order: order,
        }
    }
}

export default AdminOrderPage