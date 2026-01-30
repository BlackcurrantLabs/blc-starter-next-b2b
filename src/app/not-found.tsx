import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex flex-col items-center justify-center px-4 py-12">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

      {/* Content */}
      <div className="relative z-10 max-w-2xl w-full text-center space-y-6">
        {/* 404 Number */}
        <div className="space-y-2">
          <div className="inline-block">
            <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              404
            </h1>
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Page Not Found
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
            Oops! It looks like you&apos;ve wandered into uncharted territory.
            The page you&apos;re looking for has either moved or never existed.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-200 group"
          >
            Back to Home
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 border border-border rounded-lg font-semibold text-foreground hover:bg-muted transition-colors duration-200"
          >
            Contact Support
          </Link>
        </div>

        {/* Helpful suggestions */}
        <div className="pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">
            Here are some helpful links:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
            {[{ label: "Home", href: "/" }].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 underline"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer text */}
      <div className="absolute bottom-6 text-center text-xs text-muted-foreground">
        <p>Error Code: 404 • Page Not Found</p>
      </div>
    </div>
  );
}
