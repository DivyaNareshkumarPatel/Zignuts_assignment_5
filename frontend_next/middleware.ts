import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: '/admin-login', 
    },
});

export const config = { 
    matcher: [
        "/admin/:path*",       // Protects your React UI Pages
        "/api/admin/:path*"    // <-- ADD THIS: Protects your Next.js Backend APIs
    ] 
};