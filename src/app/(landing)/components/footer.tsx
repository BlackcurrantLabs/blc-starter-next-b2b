import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Logo } from "@/components/logo";

const footerLinks = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Privacy Policy",
    href: "/privacy-policy",
  },
  {
    title: "Terms of use",
    href: "/terms-of-use",
  },
];

const LandingFooter = () => {
  return (
    <footer className="border-t">
      <div className="max-w-(--breakpoint-xl) mx-auto">
        <div className="py-12 flex flex-col justify-start items-center">
          <Logo />
          <ul className="mt-6 flex items-center gap-4 flex-wrap">
            {footerLinks.map(({ title, href }) => (
              <li key={title}>
                <Link
                  href={href}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <Separator />
        <div className="py-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-6 xl:px-0">
          {/* Copyright */}
          <span className="text-muted-foreground">
            &copy; {new Date().getFullYear()}{" "}
            <Link href="/" target="_blank">
              {process.env.NEXT_PUBLIC_SITE_NAME}
            </Link>
            . All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
