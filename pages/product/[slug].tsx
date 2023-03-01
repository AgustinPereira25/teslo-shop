import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps, NextPage, GetStaticPaths, GetStaticProps } from 'next'
import { ShopLayout } from "@/components/layouts"
import { ProductSlideshow, SizeSelector } from "@/components/products";
import { ItemCounter } from "@/components/ui";
import { initialData } from "@/database/seed-data"
import { ICartProduct, IProduct, ISize } from "@/interfaces";
import { Box, Button, Chip, Grid, Typography } from "@mui/material";
import { dbProducts } from '@/database';
import { CartContext } from '@/context';
// import { useProducts } from "@/hooks";

// const product = initialData.products[0];

interface Props{
  product: IProduct
}

const ProductPage:NextPage<Props> = ({ product }) => {

  const router = useRouter();

  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
      _id: product._id,
      image: product.images[0],
      price: product.price,
      size: undefined,
      slug: product.slug,
      title: product.title,
      gender: product.gender,
      quantity: 1,
  });

  const selectedSize = (size: ISize) => {
    // console.log('En padre:', size);
    setTempCartProduct( currentProduct => ({
      ...currentProduct,
      size: size //Cambio solo el Size.
    }))

  }
  
  const updatedQuantity = (newValue: number) => {
    setTempCartProduct( currentProduct => ({
      ...currentProduct,
      quantity: newValue //Cambio solo quantity.
    }))
    // console.log("new value:", newValue);
  }

  
  const { addProductToCart } = useContext(CartContext);


  const onAddProduct = () => {

    if(!tempCartProduct.size) { return; }

    console.log({ tempCartProduct });
    addProductToCart(tempCartProduct);
    router.push('/cart');
  }

  return (
    <ShopLayout title={product.title} pageDescription={product.description}>
      <Grid container spacing={3}>

        <Grid item xs={12} sm={7}>
          {/* Slideshow */}
          <ProductSlideshow 
            images={ product.images } 
          />

        </Grid>

        <Grid item xs={12} sm={5}>
          <Box
            display='flex'
            flexDirection='column'
          >
            <Typography variant='h1' component='h1'>{ product.title }</Typography>
            <Typography variant='subtitle1' component='h2'>${ product.price }</Typography>

            {/* Cantidad */}
            <Box sx={{ my: 2 }}>
              <Typography variant='subtitle2'>Cantidad</Typography>
              {/* ItemCounter & SizeSelector*/}
              <ItemCounter 
                currentValue= { tempCartProduct.quantity }
                updatedQuantity= { (newValue) => updatedQuantity(newValue)}
                maxValue= { product.inStock } //product.inStock
              />
              <SizeSelector 
                sizes={ product.sizes } 
                selectedSize={ tempCartProduct.size }        
                onSelectedSize= { (size) => selectedSize(size) } //Size es el elemento que cliqueé, automaticamente se pone en negro porque
                                                                //useState re renderiza el componente cuando el estado cambia.
              />
            </Box>

            {
              (product.inStock > 0 )
              ? (
                  <Button 
                    color = "secondary" 
                    className='circular-btn'
                    onClick={ onAddProduct }

                  >
                    {
                      tempCartProduct.size
                      ? 'Agregar al carrito'
                      : 'Seleccione una talla'
                    }
                  </Button>
                )
              : (
                  <Chip label="No hay disponibles" color="error" variant='outlined' />
                )
            }


            

            {/* descripcion */}
            <Box sx={{ mt:3 }}>
              <Typography variant="subtitle2">Descripción</Typography>
              <Typography variant="body2">{product.description}</Typography>
            </Box>

          </Box>
        </Grid>

      </Grid>

    </ShopLayout>

  )
}



export const getStaticPaths: GetStaticPaths = async (ctx) => {
 
  const productSlugs = await dbProducts.getAllProductSlugs() ;

  return {
    paths: productSlugs.map( obj => ({
      params: { 
        slug: obj.slug 
      }
    })),
    fallback: "blocking"
  }
  
}


export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params as {slug: string};
  
  const product = await dbProducts.getProductBySlug( slug );
  // console.log({product})
  if(!product){ //Producto no existe
    return{
        redirect: {
            destination: '/', //home
            permanent: false
        }
    }
    
  }

  return {
    props: {
      product: product
    },
    revalidate: 86400,   //60 * 60 * 24 //Segundos
  }
}

//No usar esto... SSR
// export const getServerSideProps: GetServerSideProps = async (ctx) => {

//   const { slug } = ctx.params as {slug: string};

//   const product = await dbProducts.getProductBySlug( slug );

//   if(!product){
//     return{
//       redirect:{
//         destination:'/',
//         permanent: false
//       }
//     }
//   }

//   return {
//     props: {
//       product, //product: product
//     }
//   }
// }


export default ProductPage