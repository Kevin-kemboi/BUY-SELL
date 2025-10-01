import { Link } from "react-router-dom";
import NetworkStatusIndicator from "@/components/NetworkStatusIndicator";

export default function Footer() {
  return (
    <footer className="bg-dark-6 border-t sm:px-8 border-dark-4 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="flex items-center gap-2">
            <img src="/icons/navbar.svg" className="w-11" />
              <span className="font-bold text-lg">ZIN STORE</span>
            </Link>
          </div>
          <nav className="flex flex-col space-y-2 text-zinc-400 text-sm">
            <Link to="/" className="hover:underline">
              Home
            </Link>
            <Link to="/about" className="hover:underline">
              About
            </Link>
            <Link to="/terms" className="hover:underline">
              Terms & Conditions
            </Link>
            <Link to="/shipping" className="hover:underline">
              Shipping & Return Policy
            </Link>
            <Link to="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link to="/faq" className="hover:underline">
              FAQ
            </Link>
          </nav>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>
            © 2023-2024 ZIN STORE, Inc. All rights reserved.
          </p>
        </div>
      </div>
      <NetworkStatusIndicator />
    </footer>
  );
}
