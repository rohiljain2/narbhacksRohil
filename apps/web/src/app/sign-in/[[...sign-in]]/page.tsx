"use client";

import { SignIn } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("SignIn page loaded!");
    setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        {isLoading && <p className="text-blue-600">Loading...</p>}
        
        <div className="mt-8">
          <SignIn 
            redirectUrl="/dashboard"
            afterSignInUrl="/dashboard"
            signUpUrl="/sign-up"
            routing="path"
            path="/sign-in"
          />
        </div>
      </div>
    </div>
  );
} 