import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils"
import StoreProvider from "./StoreProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import { getUser } from "@/actions/user_actions";

const inter = Inter({ subsets: ["latin"] })


export const metadata: Metadata = {
  title: "ChatGPT",
  description: "Your AI companion for intelligent conversations.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser()
  // await scrapeAndCreateJobs()
  return (
    <html lang="en">
       <StoreProvider
          user={user?.user}
        >
          <GoogleOAuthProvider
            clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
          >
      <body className={cn(
          "min-h-screen bg-background font-sans antialiased dark",
          "font-[ui-sans-serif,apple-system,system-ui,'Segoe UI',Helvetica,'Apple Color Emoji',Arial,sans-serif]"
        )}>
          <Toaster />
          {children}
          </body>
        </GoogleOAuthProvider>
       </StoreProvider> 
    </html>
  );
}
