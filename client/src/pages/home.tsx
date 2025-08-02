import { WalletConnector } from "@/components/wallet-connector";
import { ActivityLog } from "@/components/activity-log";
import { TransactionDemo } from "@/components/transaction-demo";
import { MessageSigningDemo } from "@/components/message-signing-demo";
import { ToastContainer } from "@/components/toast-container";
import { useNearWallet } from "@/hooks/use-near-wallet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wallet, Globe } from "lucide-react";

export default function Home() {
  const { network, setNetwork, isConnected } = useNearWallet();

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen font-inter">
      {/* Header */}
      <header className="w-full bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Wallet className="text-white text-lg" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">NEAR Connect</h1>
                <p className="text-sm text-slate-500">Wallet Integration Test</p>
              </div>
            </div>
            
            {/* Network Selector */}
            <div className="flex items-center space-x-4">
              <Select value={network} onValueChange={setNetwork} disabled={isConnected}>
                <SelectTrigger className="w-32">
                  <Globe className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mainnet">Mainnet</SelectItem>
                  <SelectItem value="testnet">Testnet</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Connection Status Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-8">
          <WalletConnector />
        </div>

        {/* Features Demo Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <TransactionDemo />
          <MessageSigningDemo />
        </div>

        {/* Activity Log */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
          <ActivityLog />
        </div>
      </main>

      {/* Toast Notifications Container */}
      <ToastContainer />
    </div>
  );
}
