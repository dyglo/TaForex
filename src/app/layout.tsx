import "../styles/globals.css";
import { ReactNode } from "react";
import dynamic from "next/dynamic";
import { ClerkProvider } from "@clerk/nextjs";

const ClientLayout = dynamic(() => import("../components/ClientLayout"), { ssr: false });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en">
        <body className="bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
          <ClientLayout>{children}</ClientLayout>
        </body>
      </html>
    </ClerkProvider>
  );
}
