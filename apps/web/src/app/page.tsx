// "use client";

// import Header from "@/components/Header";
// import Benefits from "@/components/home/Benefits";
// import Footer from "@/components/home/Footer";
// import FooterHero from "@/components/home/FooterHero";
// import Hero from "@/components/home/Hero";
// import Testimonials from "@/components/home/Testimonials";

// export default function Home() {
//   return (
//     <main>
//       <Header />
//       <Hero />
//       <Benefits />
//       <Testimonials />
//       <FooterHero />
//       <Footer />
//     </main>
//   );
// }



"use client";

import Link from "next/link";

export default function Home() {
  const handleSignInClick = () => {
    console.log("Sign In button clicked!");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-blue-400 via-pink-100 to-purple-200">
      <div className="max-w-2xl w-full text-center py-24">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          Welcome to FitPro AI
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Your AI-powered fitness companion
        </p>
        
        <div className="space-y-4">
          <Link 
            href="/sign-in"
            onClick={handleSignInClick}
            className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 text-lg"
          >
            Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}

