import { useContext, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import { UIContext } from '@/context';
import { CartContext } from '../../context/cart';

import { AppBar, Badge, Box, Input, InputAdornment, Link, Toolbar, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material';


export const Navbar = () => {

  const router = useRouter();

  const { toggleSideMenu } = useContext(UIContext);
  const { numberOfItems } = useContext(CartContext);

  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const onSearchTerm = () => {
    if( searchTerm.trim().length === 0 ) return;

    router.push(`/search/${ searchTerm }`);
  }


  return (
        <AppBar>
            <Toolbar>
                <NextLink href={'/'} passHref legacyBehavior>
                    <Link display='flex' alignItems={'center'}>
                        <Typography variant = "h6">Teslo |</Typography>
                        <Typography sx={{ ml: 0.5 }}>Shop</Typography>
                    </Link>
                </NextLink>

                <Box sx={{ flex: 1  }} />


                <Box sx={{ display: isSearchVisible ? 'none' : { xs: 'none', sm: 'block' } }} 
                    className="fadeIn"
                >
                    <NextLink href={'/category/men'} passHref legacyBehavior>
                        <Link>
                            <Button color={ `${router.pathname}`==="/category/men" ? "primary" : "info" }>Hombres</Button>
                        </Link>
                    </NextLink>
                    <NextLink href={'/category/women'} passHref legacyBehavior>
                        <Link>
                            <Button color={ `${router.pathname}`==="/category/women" ? "primary" : "info" }>Mujeres</Button>
                        </Link>
                    </NextLink>
                    <NextLink href={'/category/kid'} passHref legacyBehavior>
                        <Link>
                            <Button color={ `${router.pathname}`==="/category/kid" ? "primary" : "info" }>Niños</Button>
                        </Link>
                    </NextLink>                    
                </Box>

                <Box sx={{ flex: 1  }} />

                {/* Pantallas grandes */}
                {
                    isSearchVisible
                    ? (
                        <Input
                            sx={{ display: { xs: 'none', sm: 'flex' } }} 
                            className='fadeIn'
                            autoFocus
                            value={ searchTerm }
                            onChange={ (e) => setSearchTerm(e.target.value) }
                            onKeyPress= { (e) => e.key === 'Enter'? onSearchTerm() : null }
                            type='text'
                            placeholder="Buscar..."
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={ () => setIsSearchVisible(false) }
                                    >
                                    <ClearOutlined />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    )
                    : (
                        <IconButton
                            onClick={ () => setIsSearchVisible(true) }
                            className="fadeIn"
                            sx={{ display: { xs: 'none', sm: 'flex' } }} 
                        >
                            <SearchOutlined />
                        </IconButton>
                    )
                }
                    
                    
                {/* Pantallas pequeñas */}
                <IconButton
                    sx={{ display: {xs:'flex', sm: 'none'} }}
                    onClick={ toggleSideMenu }
                >
                    <SearchOutlined />
                </IconButton>

                <NextLink href={'/cart'} passHref legacyBehavior>
                    <Link>
                        <IconButton>
                            <Badge badgeContent={ numberOfItems > 9 ? '+9' : numberOfItems } color='secondary'>
                                <ShoppingCartOutlined />
                            </Badge>
                        </IconButton>
                    </Link>
                </NextLink>

                <Button onClick={ toggleSideMenu }>Menú</Button>
            </Toolbar>
        </AppBar>

    )
}
