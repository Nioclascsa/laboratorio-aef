import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnPublications = nextUrl.pathname.startsWith('/publicaciones');
      
      // Allow access to public pages (view pages)
      // But verify if we want to restrict upload API or specific actions
      
      // For now, allow everyone to view /publicaciones
      // The restriction will happen inside the page component (hiding the upload form)
      // and inside the API route (rejecting POST if not logged in)
      
      return true; 
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;