import { useContext } from 'react';
import { CartContext } from "@/context";
import { currency } from '@/utils';
import { Grid, Typography } from "@mui/material"


interface Props {
    orderValues?: {
        numberOfItems: number;
        subTotal     : number;
        taxRate      : number;
        total        : number;
    }
}

export const OrderSummary:React.FC<Props> = ({ orderValues }) => {
    
    const { numberOfItems, subTotal, total, taxRate } = useContext( CartContext );
    
    const summaryValues = orderValues ? orderValues : { numberOfItems, subTotal, total, taxRate };

    return (
        <Grid container>
            
            <Grid item xs={6}>
                <Typography>No. Productos</Typography>
            </Grid>

            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{ summaryValues.numberOfItems } { summaryValues.numberOfItems > 1 ? 'items' : 'item' }</Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography>Subtotal</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{ currency.format(summaryValues.subTotal) }</Typography>
            </Grid> 
            <Grid item xs={6}>
                <Typography>Impuestos ({ Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100 }%)</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{ currency.format(summaryValues.taxRate) }</Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography variant="subtitle1" sx={{ mt:2 }}>Total:</Typography>
            </Grid>
            <Grid item xs={6} sx={{ mt:2 }} display='flex' justifyContent='end'>
                <Typography variant="subtitle1">{ currency.format(summaryValues.total) }</Typography>
            </Grid>

        </Grid>
  )
}
