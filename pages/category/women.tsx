import { NextPage } from 'next';
import { Typography } from '@mui/material';

import { ShopLayout } from '@/components/layouts';
import { ProductList } from '@/components/products';
import { FullScreenLoading } from '@/components/ui';

import { useProducts } from '@/hooks';


const WomenPage:NextPage = () => {
    const { products, isLoading } = useProducts('/products?gender=women');

  
    // console.log({data})
  
    return (
      <ShopLayout title={'Teslo-Shop - Mujeres'} pageDescription={'Encuentra los mejores productos de Teslo aquí'}>
        <Typography variant='h1' component='h1'> Mujeres </Typography>
        <Typography variant='h2' sx={{ mb:1 }}> Productos para mujeres </Typography>
  
        {
          isLoading
          ? <FullScreenLoading />
          : <ProductList products={ products }/>
        }
      </ShopLayout>
    )
}


export default WomenPage;