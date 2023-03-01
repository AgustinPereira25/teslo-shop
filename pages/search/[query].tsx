import { NextPage, GetServerSideProps } from 'next';

import { Box, Typography } from '@mui/material';

import { ShopLayout } from '../../components/layouts';

import { ProductList } from '@/components/products';
// import { initialData } from '../../database/products'; //data de prueba estatica

import { dbProducts } from '@/database';
import { IProduct } from '@/interfaces';

interface Props{
    products: IProduct[];
    foundProducts: boolean;
    query: string
}

const SearchPage : NextPage<Props> = ({ products, foundProducts, query }) => {

  
  // console.log({data})

  return (
    <ShopLayout title={'Teslo-Shop - Search'} pageDescription={'Encuentra los mejores productos de Teslo aquí'}>
      <Typography variant='h1' component='h1'> Buscar productos </Typography>

      {

        foundProducts
        ? <Typography variant='h2' sx={{ mb:1 }} textTransform='capitalize'> Término: { query } </Typography>
        : (
            <Box display="flex">
                <Typography variant='h2' sx={{ mb:1 }}> No encontramos ningun producto</Typography>
                <Typography variant='h2' sx={{ ml:1 }} color="secondary" textTransform='capitalize'> { query }</Typography>
            </Box>
        )

      }
      
      
      <ProductList products={ products }/>
    
    </ShopLayout>

  )

}


export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const { query = '' } = params as { query: string };

    if ( query.length === 0){
        return {
            redirect: {
                destination: '/',
                permanent: true
            }
        }
    }

    let products = await dbProducts.getProductsByTerm(query);
    const foundProducts = products.length > 0;

    // TODO: retornar otros productos.
    if ( !foundProducts ) {
        products = await dbProducts.getAllProducts();
        
    }

    return {
        props: {
            products,
            foundProducts,
            query,
        }
    }
}

export default SearchPage;


//Grid xs = 6 para que en las pantallas mas chicas se muestre 