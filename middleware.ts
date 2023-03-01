import { getToken } from 'next-auth/jwt'
import { NextResponse, type NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {

  const session:any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  //Informacion util sobre el usuario
  // console.log({ session });

  if ( !session ){

    if (req.nextUrl.pathname.startsWith('/api/admin')) {
      return NextResponse.redirect( new URL('/api/auth/unauthorized', req.url));
    }

    const requestedPage = req.nextUrl.pathname;
    const url = req.nextUrl.clone();
    url.pathname = `/auth/login`;
    url.search = `p=${ requestedPage }`;
    
    return NextResponse.redirect( url );
  }

  const validRoles = ['admin', 'super-user', 'SEO'];
  if ( req.nextUrl.pathname.startsWith('/admin')){
    if( !validRoles.includes(session.user.role) ){
      //Si no lo incluye, lo redirijo al inicio.
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  if ( req.nextUrl.pathname.startsWith('/api/admin')){
    if( !validRoles.includes(session.user.role) ) {
      return NextResponse.redirect(new URL('/api/auth/unauthorized', req.url));
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/checkout/:path*', '/admin/:path*', '/api/admin/:path*']
};






//*********** implementacion anterior a NextAuth**************/
// import * as jose from 'jose';
 
// export async function middleware(req: NextRequest) {
//   const previousPage = req.nextUrl.pathname;
 
//   if (previousPage.startsWith('/checkout')) {
//     const token = req.cookies.get('token')?.value || '';
 
//     try {
//       await jose.jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET_SEED));
//       return NextResponse.next();
//     } catch (error) {
//       return NextResponse.redirect(
//         new URL(`/auth/login?p=${previousPage}`, req.url)
//       );
//     }
//   }
// };
 
// export const config = {
//   matcher: [
//     '/checkout/:path*'
//   ],
// };