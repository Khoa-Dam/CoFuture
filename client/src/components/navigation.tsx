import { ConnectButton } from "@mysten/dapp-kit";

import { Link, useLocation } from "wouter";
import logoPath from "@assets/logo.png";

import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Function để kiểm tra route active
  const isActive = (path: string) => location[0] === path;

  const navItems = [
    { href: "/", label: "Dashboard" },
    { href: "/send", label: "Send Capsule" },
    { href: "/capsules", label: "My Capsules" },
  ];

  return (
    <nav className="fixed top-0 w-full bg-slate-800/80 backdrop-blur-md border-b border-gray-700/50 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center p-1">
              <img
                src={logoPath}
                alt="CoFuture Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xl font-bold text-gradient">CoFuture</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`transition-colors ${
                  isActive(item.href)
                    ? "text-white"
                    : "text-gray-400 hover:text-cyan-400"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="pl-4">
              <ConnectButton />
            </div>
          </div>

          {/* Hamburger Button (Mobile only) */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-slate-700 transition"
            onClick={() => setOpen(true)}
            aria-label="Open Menu"
          >
            <Menu className="w-6 h-6 text-cyan-400" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div
          className="fixed inset-1 z-[100] flex items-start justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative bg-slate-800 rounded-2xl shadow-2xl w-[90vw] max-w-xs mx-auto px-8 py-8 flex flex-col items-center space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-cyan-400"
              onClick={() => setOpen(false)}
              aria-label="Close Menu"
            >
              <X className="w-7 h-7" />
            </button>

            {/* Nav Items */}
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`text-lg font-semibold transition-colors ${
                  isActive(item.href)
                    ? "text-white"
                    : "text-gray-400 hover:text-cyan-400"
                }`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {/* Connect Wallet Button */}
            <div className="pt-2 w-full flex justify-center">
              <ConnectButton />
            </div>
          </motion.div>
        </div>
      )}
    </nav>
  );
}
