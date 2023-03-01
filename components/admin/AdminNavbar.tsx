import { useContext, useState } from 'react';
import NextLink from 'next/link';

import { UIContext } from '@/context';

import { AppBar, Box, Link, Toolbar, Typography } from '@mui/material';
import Button from '@mui/material/Button';


export const AdminNavbar = () => {

  const { toggleSideMenu } = useContext(UIContext);

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
                
                <Button onClick={ toggleSideMenu }>
                    Menú
                </Button>

            </Toolbar>
        </AppBar>

    )
}
