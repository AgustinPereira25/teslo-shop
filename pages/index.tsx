import { NextPage } from 'next';

import { Typography } from '@mui/material';

import { ShopLayout } from '../components/layouts';

import { ProductList } from '@/components/products';
// import { initialData } from '../database/products'; //data de prueba estatica
import { useProducts } from '../hooks';

import { FullScreenLoading } from '@/components/ui';

const HomePage: NextPage = () => {

  const { products, isLoading } = useProducts('/products');

  
  // console.log({data})

  return (
    <ShopLayout title={'Teslo-Shop - HomePage'} pageDescription={'Encuentra los mejores productos de Teslo aquí'}>
      <Typography variant='h1' component='h1'> Tienda </Typography>
      <Typography variant='h2' sx={{ mb:1 }}> Todos los productos </Typography>

      {
        isLoading
        ? <FullScreenLoading />
        : <ProductList products={ products }/>
      }
    </ShopLayout>
  )

}

export default HomePage;


//Grid xs = 6 para que en las pantallas mas chicas se muestre 