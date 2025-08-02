import { useState } from "react";
import { useNearWallet } from "@/hooks/use-near-wallet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRightLeft, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function TransactionDemo() {
  const { isConnected, sendTransaction } = useNearWallet();
  const { toast } = useToast();
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendTransaction = async () => {
    if (!receiver.trim() || !amount) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await sendTransaction(receiver.trim(), parseFloat(amount));
      setReceiver("");
      setAmount("");
      toast({
        title: "Success",
        description: "Transaction sent successfully!",
      });
    } catch (error) {
      console.error("Transaction error:", error);
      toast({
        title: "Transaction Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <ArrowRightLeft className="text-blue-600" size={20} />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Transaction Demo</h3>
      </div>
      <p className="text-slate-600 mb-4">Test transaction signing capabilities</p>
      <div className="space-y-3">
        <Input
          type="text"
          placeholder="Receiver Account ID"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          disabled={!isConnected}
        />
        <Input
          type="number"
          placeholder="Amount (NEAR)"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={!isConnected}
        />
        <Button
          onClick={handleSendTransaction}
          disabled={!isConnected || isLoading}
          className="w-full bg-blue-500 hover:bg-blue-600"
        >
          {isLoading ? (
            <>
              <ArrowRightLeft className="mr-2 animate-spin" size={16} />
              Sending...
            </>
          ) : (
            <>
              <Send className="mr-2" size={16} />
              Send Transaction
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
