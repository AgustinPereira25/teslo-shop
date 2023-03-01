import { FC } from "react"
import { Box, IconButton, Typography } from "@mui/material"
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material"


interface Props{
    currentValue: number;
    // updatedQuantity: number;
    maxValue: number;

  //Methods
  updatedQuantity: (newValue:number) => void;
}

export const ItemCounter:FC<Props> = ({ currentValue, updatedQuantity, maxValue}) => {

  const addAmount = (Value:number):number => {
    if (Value <= maxValue)
    {
      return Value + 1
    }
    else
    {
      return Value
    }
  }

  const subtractAmount = (Value:number):number => {
    
    if (Value -1 >= 1)
    {
      return Value - 1
    }
    else
    {
      return Value
    }
    
  }
  
  return (
    <Box display='flex' alignItems={'center'}>
        <IconButton
          onClick={() => updatedQuantity(subtractAmount(currentValue))}
          disabled={ currentValue === 1 }
        >
            <RemoveCircleOutline />
        </IconButton>
        
        <Typography sx={{ width: 40, textAlign:'center' }}> { currentValue } </Typography>
        
        <IconButton
          onClick={() => updatedQuantity(addAmount(currentValue))}
          disabled={ currentValue >= maxValue }
        >
            <AddCircleOutline />

        </IconButton>
    </Box>
  )
}
