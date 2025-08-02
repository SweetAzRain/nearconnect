import { useState } from "react";
import { useNearWallet } from "@/hooks/use-near-wallet";
import { Button } from "@/components/ui/button";
import { Wallet, CheckCircle, Loader2, Plug, Signature, LogOut } from "lucide-react";

export function WalletConnector() {
  const {
    isConnected,
    isConnecting,
    accountId,
    walletName,
    network,
    connectWallet,
    disconnectWallet,
    signMessage,
  } = useNearWallet();

  const handleSignMessage = async () => {
    try {
      await signMessage("Hello from NEAR Connect Test App!");
    } catch (error) {
      console.error("Sign message error:", error);
    }
  };

  if (isConnecting) {
    return (
      <div className="text-center space-y-4">
        <div className="w-24 h-24 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
          <Loader2 className="text-blue-500 text-3xl animate-spin" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Connecting...</h2>
        <p className="text-slate-600">Please approve the connection in your wallet</p>
      </div>
    );
  }

  if (isConnected && accountId) {
    return (
      <div className="text-center space-y-4">
        <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="text-green-500 text-3xl" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Wallet Connected</h2>
        <div className="bg-slate-50 rounded-xl p-4 max-w-md mx-auto">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Account ID:</span>
              <span className="text-sm font-mono font-medium text-slate-900 truncate max-w-48">
                {accountId}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Wallet:</span>
              <span className="text-sm font-medium text-slate-900">{walletName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Network:</span>
              <span className="text-sm font-medium text-slate-900">{network.toUpperCase()}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={handleSignMessage}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-6 py-2"
          >
            <Signature className="mr-2" size={16} />
            Sign Message
          </Button>
          <Button
            onClick={disconnectWallet}
            variant="destructive"
            className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-2"
          >
            <LogOut className="mr-2" size={16} />
            Disconnect
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center space-y-4">
      <div className="w-24 h-24 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
        <Wallet className="text-slate-400 text-3xl" size={32} />
      </div>
      <h2 className="text-2xl font-bold text-slate-900">Connect Your NEAR Wallet</h2>
      <p className="text-slate-600 max-w-md mx-auto">
        Connect your NEAR wallet to interact with blockchain applications securely
      </p>
      <Button
        onClick={connectWallet}
        className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
      >
        <Plug className="mr-2" size={16} />
        Connect Wallet
      </Button>
    </div>
  );
}
