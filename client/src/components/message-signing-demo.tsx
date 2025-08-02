import { useState } from "react";
import { useNearWallet } from "@/hooks/use-near-wallet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Signature, PenTool } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function MessageSigningDemo() {
  const { isConnected, signMessage } = useNearWallet();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignMessage = async () => {
    if (!message.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a message to sign",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await signMessage(message.trim());
      setMessage("");
      toast({
        title: "Success",
        description: "Message signed successfully!",
      });
    } catch (error) {
      console.error("Sign message error:", error);
      toast({
        title: "Signing Failed",
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
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <Signature className="text-purple-600" size={20} />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Message Signing</h3>
      </div>
      <p className="text-slate-600 mb-4">Test message signing functionality</p>
      <div className="space-y-3">
        <Textarea
          placeholder="Enter message to sign..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={!isConnected}
          className="h-20 resize-none"
        />
        <Button
          onClick={handleSignMessage}
          disabled={!isConnected || isLoading}
          className="w-full bg-purple-500 hover:bg-purple-600"
        >
          {isLoading ? (
            <>
              <Signature className="mr-2 animate-spin" size={16} />
              Signing...
            </>
          ) : (
            <>
              <PenTool className="mr-2" size={16} />
              Sign Message
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
