import { ConnectButton, useAccounts, useSwitchAccount } from "@mysten/dapp-kit";

import { Link, useLocation } from "wouter";
import logoPath from "@assets/image_1748619552209.png";

export function Navigation() {
  const { mutate: switchAccount } = useSwitchAccount();
  const accounts = useAccounts();
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  return (
    <nav className="fixed top-0 w-full bg-slate-800/80 backdrop-blur-md border-b border-gray-700/50 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center p-1">
              <img
                src={logoPath}
                alt="CoFuture Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xl font-bold text-gradient">CoFuture</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`transition-colors ${
                isActive("/")
                  ? "text-white"
                  : "text-gray-400 hover:text-cyan-400"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/send"
              className={`transition-colors ${
                isActive("/send")
                  ? "text-white"
                  : "text-gray-400 hover:text-cyan-400"
              }`}
            >
              Send Capsule
            </Link>
            <Link
              href="/capsules"
              className={`transition-colors ${
                isActive("/capsules")
                  ? "text-white"
                  : "text-gray-400 hover:text-cyan-400"
              }`}
            >
              My Capsules
            </Link>
          </div>
          <div style={{ padding: 20 }}>
            <ConnectButton />
            <ul>
              {accounts.map((account) => (
                <li key={account.address}>
                  <button
                    onClick={() => {
                      switchAccount(
                        { account },
                        {
                          onSuccess: () =>
                            console.log(`switched to ${account.address}`),
                        }
                      );
                    }}
                  >
                    Switch to {account.address}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
