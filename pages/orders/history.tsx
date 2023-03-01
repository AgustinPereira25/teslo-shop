import React from 'react'
import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react';
import NextLink from 'next/link';
import { ShopLayout } from '@/components/layouts';
import { Chip, Grid, Link, Typography } from '@mui/material';
import { DataGrid, GridValueGetterParams, GridColDef } from '@mui/x-data-grid';
import { dbOrders } from '@/database';
import { IOrder } from '@/interfaces';


const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width:100 },
    { field: 'fullname', headerName: 'Nombre completo', width:300 },

    {
        field: 'paid',
        headerName: 'Pagada',
        description: 'Muestra información si está pagada la orden o no',
        width: 200,
        //renderCell: (params: GridValueGetterParams ) => {
        renderCell: (params: any ) => {
            return (
                params.row.paid
                    ? <Chip color="success" label="Pagada" variant="outlined" />
                    : <Chip color="error" label="No pagada" variant="outlined" />
            )
        }
    },
    {   field: 'orden', 
        headerName: 'Ver Orden', 
        width:90 ,
        sortable:false,
        renderCell: (params: any) => {
            return (
                <NextLink href={`/orders/${params.row.orderId}`} passHref legacyBehavior>
                    <Link underline='always'> Ver Orden </Link>
                </NextLink>
            )
        }

    },
];

//deprecated: datos de relleno
// const rows = [
//     { id: 1, paid:true, fullname: 'Fernando Herrera' },
//     { id: 2, paid:false, fullname: 'Melissa Flores' },
//     { id: 3, paid:true, fullname: 'Hernando Vallejo' },
//     { id: 4, paid:false, fullname: 'Emin Reyes' },
//     { id: 5, paid:false, fullname: 'Eduardo Rios' },
//     { id: 6, paid:true, fullname: 'Natalia Herrera' },
// ]


interface Props {
    orders: IOrder[];
}


const HistoryPage:NextPage<Props> = ({ orders }) => {
    
    // console.log({orders});
    
    // { id: 1, paid:true, fullname: 'Fernando Herrera', orderId: 1312312 }

    const rows = orders.map( (order, index) => ({
        id: index+1, 
        paid: order.isPaid, 
        fullname: `${ order.shippingAddress.firstName } ${ order.shippingAddress.lastName }`,
        orderId: order._id
    }))

    return (
        <ShopLayout title={'Historial de ordenes'} pageDescription={'Historial de ordenes del cliente'}>
            <Typography variant='h1' component='h1'>Historial de ordenes</Typography>

            <Grid container>
                <Grid item xs={12} sx={{ height: 650, width:'100%'}}>
                    <DataGrid 
                        columns={ columns } 
                        rows={ rows } 
                        pageSize={ 10 }
                        rowsPerPageOptions={ [10] }
                    />

                </Grid>
            </Grid>



        </ShopLayout>
    )
}


// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time


export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    
    const session: any = await getSession({ req });

    if (!session){
        return{
            redirect:{
                destination: '/auth/login?p=/orders/history',
                permanent: false,
            }
        }
    }

    const orders = await dbOrders.getOrdersByUser( session.user._id);


    return {
        props: {
            orders: orders
        }
    }
}
export default HistoryPage