import { useWallet } from "@/hooks/use-wallet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Infinity, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import logoPath from "@assets/image_1748619552209.png";

interface NavigationProps {
  onNotificationClick: () => void;
}

export function Navigation({ onNotificationClick }: NavigationProps) {
  const { isConnected, isConnecting, address, connect, disconnect, formatAddress } = useWallet();
  const { toast } = useToast();
  const [location] = useLocation();

  const handleWalletClick = async () => {
    if (isConnected) {
      disconnect();
      toast({
        title: "Wallet Disconnected",
        description: "Sui Wallet has been disconnected",
      });
    } else {
      const success = await connect();
      if (success) {
        toast({
          title: "Wallet Connected", 
          description: "Successfully connected to Sui Wallet",
        });
      } else {
        toast({
          title: "Connection Failed",
          description: "Failed to connect to Sui Wallet",
          variant: "destructive",
        });
      }
    }
  };

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
              className={`transition-colors ${isActive("/") ? "text-white" : "text-gray-400 hover:text-cyan-400"}`}
            >
              Dashboard
            </Link>
            <Link 
              href="/send" 
              className={`transition-colors ${isActive("/send") ? "text-white" : "text-gray-400 hover:text-cyan-400"}`}
            >
              Send Capsule
            </Link>
            <Link 
              href="/capsules" 
              className={`transition-colors ${isActive("/capsules") ? "text-white" : "text-gray-400 hover:text-cyan-400"}`}
            >
              My Capsules
            </Link>
          </div>
          
          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onNotificationClick}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Bell className="h-5 w-5" />
              </Button>
              <Badge 
                variant="secondary" 
                className="absolute -top-2 -right-2 bg-cyan-400 text-slate-900 text-xs w-5 h-5 flex items-center justify-center font-medium"
              >
                3
              </Badge>
            </div>
            <Button 
              onClick={handleWalletClick}
              disabled={isConnecting}
              className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-blue-500 hover:to-purple-600 text-white px-6 py-2 font-medium transition-all duration-300 transform hover:scale-105"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : isConnected && address ? (
                formatAddress(address)
              ) : (
                "Connect Wallet"
              )}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
