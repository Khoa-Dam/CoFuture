import { motion } from "framer-motion";
import { Plus, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Dashboard() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900/20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%2300D4FF%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M20%2020c0-11.046-8.954-20-20-20s-20%208.954-20%2020%208.954%2020%2020%2020%2020-8.954%2020-20z%22/%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Send Messages to the <span className="text-gradient">Future</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Create blockchain-secured time capsules on Sui Network. Lock
              messages, tokens, and NFTs to be revealed at the perfect moment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => setLocation("/send")}
                className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-blue-500 hover:to-purple-600 text-white px-8 py-4 font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Plus className="mr-2 h-5 w-5" />
                Create Capsule
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setLocation("/capsules")}
                className="border-gray-600 hover:border-cyan-400 text-gray-300 hover:text-white px-8 py-4 font-semibold transition-all duration-300"
              >
                <Archive className="mr-2 h-5 w-5" />
                View Capsules
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="text-center">
            <div className="gradient-border">
              <div className="gradient-border-content p-8">
                <div className="text-3xl font-bold text-cyan-400 mb-2">0</div>
                <div className="text-gray-400">Total Capsules</div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="gradient-border">
              <div className="gradient-border-content p-8">
                <div className="text-3xl font-bold text-green-400 mb-2">0</div>
                <div className="text-gray-400">Unlocked Today</div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="gradient-border">
              <div className="gradient-border-content p-8">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  0.0 SUI
                </div>
                <div className="text-gray-400">Total Value Locked</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
