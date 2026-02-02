import { signIn } from "next-auth/react"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import { SignInButton } from "@/components/auth/sign-in-button"

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-card">
      <div className="w-full max-w-md p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-primary">
            SpeedReader
          </h1>
          <p className="text-muted-foreground">
            Read 3x Faster. Retain More.
          </p>
        </div>

        {/* Sign In Form */}
        <div className="space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            Choose how to sign in
          </div>

          <div className="space-y-3">
            <SignInButton provider="google" />
            <SignInButton provider="github" />
          </div>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-primary/20"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              or
            </span>
          </div>
        </div>

        {/* Alternative Sign In Options */}
        <div className="space-y-2 text-center text-sm text-muted-foreground">
          <p>More providers coming soon</p>
        </div>

        {/* Terms */}
        <div className="text-center text-xs text-muted-foreground pt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  )
}
