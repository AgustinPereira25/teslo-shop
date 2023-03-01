import { useContext, useState } from 'react';

import { GetServerSideProps } from 'next';
import { getSession, signIn } from 'next-auth/react';

import NextLink from 'next/link';
import { useRouter } from 'next/router';

import { AuthContext } from '@/context';
import { tesloApi } from '@/api';
import { AuthLayout } from "@/components/layouts"
import { useForm } from 'react-hook-form';
import { Box, Grid, Typography, TextField, Button, Link, Chip } from "@mui/material"
import { ErrorOutline } from '@mui/icons-material';
import { validations } from '@/utils';

type FormData = {
    name    : string;
    email   : string;
    password: string;

};

const RegisterPage = () => {
    
    const router = useRouter()

    const { registerUser } = useContext(AuthContext);
    
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    
    const onRegisterForm = async( {name, email, password}:FormData) => {
        
        setShowError(false);
        const resp = await registerUser(name, email, password);
        
        if ( resp.hasError ) {
            setShowError(true);
            setErrorMessage(resp.message!);
            setTimeout(() => { setShowError(false) }, 3000);
            return;
        }

        // TODO: Navegar a la pantalla que el usuario estaba
        // const destination = router.query.p?.toString() || '/';
        // router.replace(destination);

        await signIn('credentials', { email, password });

    }

  return (
    <AuthLayout title={'Registrar'}>
        <form onSubmit={ handleSubmit(onRegisterForm) } noValidate>
            <Box sx={{ width: 350, padding: '10px 20px'}}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant='h1' component='h1'>Crear cuenta</Typography>
                    </Grid>
                    <Chip 
                        label="No puede usar ese correo"
                        color="error"
                        icon= { <ErrorOutline/> }
                        className="fadeIn"
                        sx={{ display: showError ? 'flex' : 'none' }}
                    />
                    <Grid item xs={12}>
                        <TextField 
                            label = 'Nombre' 
                            variant='filled'
                            fullWidth 
                            { 
                                ...register('name',  {
                                    required: 'Este campo es requerido',
                                    minLength: { value: 2, message: 'Minimo 2 caracteres' }
                                }) 
                            }
                            error={ !!errors.name }
                            helperText={ errors.name?.message }                          
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                            type='email' //para que muestre el @ en dispositivos moviles.
                            label = 'Correo' 
                            variant='filled' 
                            fullWidth 
                            { 
                                ...register('email',  {
                                    required: 'Este campo es requerido',
                                    validate: (val) => validations.isEmail(val)
                                }) 
                            }
                            error={ !!errors.email }
                            helperText={ errors.email?.message }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                            label = 'Contraseña' 
                            type='password' 
                            variant='filled' 
                            fullWidth 
                            { 
                                ...register('password',  {
                                    required: 'Este campo es requerido',
                                    minLength: { value: 6, message: 'Minimo 6 caracteres' }
                                }) 
                            }
                            error={ !!errors.password }
                            helperText={ errors.password?.message }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button 
                            color='secondary' 
                            className='circular-btn' 
                            size='large' 
                            fullWidth
                            type='submit' //para que se dispare el onSubmit
                        >
                            Registrarse
                        </Button>
                    </Grid>

                    <Grid item xs={12} display='flex' justifyContent={'end'}>
                    <Typography variant='body1' component='p'>¿Ya tienes cuenta?&nbsp;</Typography>
                        <NextLink href={ router.query ? `/auth/login?p=${router.query.p}` : `/auth/login` } passHref legacyBehavior>
                            <Link underline='always'>
                                <Typography variant='body1' component='p'>Ingresar</Typography>
                            </Link>
                        </NextLink>
                    </Grid>
                </Grid>
            </Box>
        </form>
    </AuthLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
    
    const session = await getSession({ req });
    
    const { p = '/' } = query;

    if ( session ){
        return {
            redirect:{
                destination: p.toString(),
                permanent: false,
            }
        }

    }

    return {
        props: { }
    }
}

export default RegisterPage