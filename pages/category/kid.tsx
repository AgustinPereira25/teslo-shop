import { NextPage } from 'next';

import { Typography } from '@mui/material';

import { ShopLayout } from '../../components/layouts';

import { ProductList } from '@/components/products';
// import { initialData } from '../database/products'; //data de prueba estatica
import { useProducts } from '../../hooks';

import { FullScreenLoading } from '@/components/ui';


const KidPage:NextPage = () => {
    
    const { products, isLoading } = useProducts('/products?gender=kid'); //utiliza el SWR

  
    // console.log({data})
  
    return (
      <ShopLayout title={'Teslo-Shop - Niños'} pageDescription={'Encuentra los mejores productos de Teslo aquí'}>
        <Typography variant='h1' component='h1'> Niños </Typography>
        <Typography variant='h2' sx={{ mb:1 }}> Productos para niños </Typography>
  
        {
          isLoading
          ? <FullScreenLoading />
          : <ProductList products={ products }/>
        }
      </ShopLayout>
    )
  
}

export default KidPage