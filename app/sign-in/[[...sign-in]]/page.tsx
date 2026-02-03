"use client"
import { SignIn } from '@clerk/nextjs'
import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'

export default function LoginPage() {
  const { isLoaded } = useUser()
  const [showPlaceholder, setShowPlaceholder] = useState(true)
  
  useEffect(() => {
    if (isLoaded) {
      setShowPlaceholder(false)
    }
  }, [isLoaded])
  
  return (
    <div className="w-full min-w-0 min-h-[100dvh] flex flex-col md:flex-row overflow-x-hidden">
      {/* Left side - Illustration (hidden on xs, stacked on sm, side-by-side on md+) */}
      <div className="w-full md:w-1/2 bg-white relative overflow-hidden flex flex-col justify-center items-center p-6 sm:p-8 md:p-12 order-2 md:order-1 min-h-[40vh] sm:min-h-[45vh] md:min-h-0">
        <div className="absolute inset-0 bg-white" />
        
        {/* Storyset Illustration */}
        <div className="relative z-10 mb-4 sm:mb-6 md:mb-8 w-full max-w-[280px] sm:max-w-sm md:max-w-md">
          <img 
            src="/signin.svg" 
            alt="Login illustration"
            className="w-full h-auto"
          />
        </div>
        
        {/* Decorative elements - hidden on small screens for cleaner look */}
        <div className="absolute top-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-xl hidden md:block" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl hidden md:block" />
        <div className="absolute top-1/3 right-8 w-16 h-16 bg-white/5 rounded-full blur-lg hidden md:block" />
      </div>
      
      {/* Right side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-12 py-6 sm:py-8 md:py-12 bg-white order-1 md:order-2 min-h-[60vh] sm:min-h-[55vh] md:min-h-screen overflow-y-auto">
        <div className="w-full max-w-sm">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">Partner Login</h2>
            <p className="text-gray-600 text-base sm:text-lg">Enter your provided credentials</p>
          </div>
          
          {/* Show placeholder while Clerk is loading */}
          {showPlaceholder && (
            <div className="space-y-4 animate-pulse">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
              <div className="h-10 bg-[#00B24B] rounded"></div>
            </div>
          )}
          
          {/* Clerk SignIn component */}
          <div className={showPlaceholder ? 'opacity-0 absolute' : 'opacity-100'}>
            <SignIn 
              appearance={{
                elements: {
                  formButtonPrimary: {
                    backgroundColor: '#00B24B',
                    ':hover': {
                      backgroundColor: '#009140',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                    },
                    fontSize: '14px',
                    textTransform: 'none',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  },
                  card: "shadow-none border-none",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  formFieldInput: "border-2 border-gray-200 focus:border-blue-500 transition-colors duration-200",
                  footerActionLink: "text-blue-600 hover:text-blue-700",
                  // Hide sign up options completely
                  footerActionText: "hidden",
                  footerAction: "hidden",
                  // Hide social login buttons if any
                  socialButtonsBlockButton: "hidden",
                  socialButtonsBlockButtonText: "hidden",
                  dividerRow: "hidden",
                  dividerText: "hidden"
                }
              }}
              signUpUrl=""
              forceRedirectUrl="/dashboard"
              fallbackRedirectUrl="/dashboard"
            />
          </div>
        </div>
      </div>
    </div>
  )
}