// import type { Metadata } from "next";
// import { Inter, Lato, Montserrat } from "next/font/google";
// import { cn } from "@/lib/utils";
// import "./globals.css";
// import ConvexClientProvider from "./ConvexClientProvider";

// const inter = Inter({ subsets: ["latin"] });
// const montserrat = Montserrat({ subsets: ["latin"] });
// const lato = Lato({ weight: "400", subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Notes App",
//   description: "This is an app to take notes.",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body
//         className={cn(inter.className, montserrat.className, lato.className)}
//       >
//         <ConvexClientProvider>{children}</ConvexClientProvider>
//       </body>
//     </html>
//   );
// }




import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "./ConvexClientProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FitPro AI",
  description: "AI-powered fitness app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
          <ConvexClientProvider>
            {children}
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
