import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from "react";
import { WalletSelector, WalletSelectorUI } from "@/lib/near-connect";
import { ActivityLogEntry } from "@/types/near-wallet";
import { useToast } from "@/hooks/use-toast";

interface NearWalletContextType {
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;
  accountId: string | null;
  walletName: string;
  network: "mainnet" | "testnet";
  
  // Wallet operations
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  signMessage: (message: string) => Promise<void>;
  sendTransaction: (receiver: string, amount: number) => Promise<void>;
  
  // UI state
  activityLog: ActivityLogEntry[];
  setNetwork: (network: "mainnet" | "testnet") => void;
}

const NearWalletContext = createContext<NearWalletContextType | undefined>(undefined);

interface NearWalletProviderProps {
  children: ReactNode;
}

export function NearWalletProvider({ children }: NearWalletProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [walletName, setWalletName] = useState("Unknown Wallet");
  const [network, setNetwork] = useState<"mainnet" | "testnet">("mainnet");
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
  const [selector, setSelector] = useState<any>(null);
  const [modal, setModal] = useState<any>(null);
  const [currentWallet, setCurrentWallet] = useState<any>(null);
  
  const { toast } = useToast();

  const addActivityLog = useCallback((message: string, type: "info" | "success" | "error" | "warning" = "info") => {
    const timestamp = new Date().toLocaleTimeString();
    setActivityLog(prev => [{ message, type, timestamp }, ...prev.slice(0, 19)]);
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem('nearConnectSession');
    setCurrentWallet(null);
    setIsConnected(false);
    setAccountId(null);
    setWalletName("Unknown Wallet");
  }, []);

  const updateConnectedState = useCallback((accountData: any) => {
    setIsConnected(true);
    setAccountId(accountData.accountId);
    setWalletName(currentWallet?.id || 'Unknown Wallet');
  }, [currentWallet]);

  const initializeWallet = useCallback(async () => {
    try {
      addActivityLog('Initializing NEAR Connect...', 'info');
      
      if (typeof window === 'undefined') return;
      
      // Initialize WalletSelector
      const newSelector = new WalletSelector({ network });
      
      // Initialize WalletSelectorUI
      const newModal = new WalletSelectorUI(newSelector);
      
      setSelector(newSelector);
      setModal(newModal);
      
      // Set up event listeners
      newSelector.on('wallet:signIn', async (event: any) => {
        try {
          addActivityLog('Wallet sign-in successful', 'success');
          const wallet = await newSelector.wallet();
          setCurrentWallet(wallet);
          
          const accountData = event.accounts[0];
          
          // Save session to localStorage
          const sessionData = {
            accountId: accountData.accountId,
            walletId: (wallet as any)?.id || 'unknown',
            network,
            timestamp: Date.now()
          };
          localStorage.setItem('nearConnectSession', JSON.stringify(sessionData));
          
          // Update UI
          updateConnectedState(accountData);
          toast({
            title: "Success",
            description: "Wallet connected successfully!",
          });
          
        } catch (error) {
          console.error('Sign in error:', error);
          addActivityLog(`Sign-in error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
          toast({
            title: "Connection Failed",
            description: "Failed to complete wallet connection",
            variant: "destructive",
          });
        } finally {
          setIsConnecting(false);
        }
      });

      newSelector.on('wallet:signOut', async () => {
        addActivityLog('Wallet disconnected', 'info');
        clearSession();
        setIsConnecting(false);
        toast({
          title: "Disconnected",
          description: "Wallet disconnected",
        });
      });
      
      addActivityLog('NEAR Connect initialized successfully', 'success');
    } catch (error) {
      console.error('Initialization error:', error);
      addActivityLog(`Initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      toast({
        title: "Initialization Failed",
        description: "Failed to initialize NEAR Connect",
        variant: "destructive",
      });
    }
  }, [network, addActivityLog, clearSession, updateConnectedState, toast]);

  const connectWallet = useCallback(async () => {
    try {
      if (!modal) {
        toast({
          title: "Error",
          description: "Wallet selector not initialized",
          variant: "destructive",
        });
        return;
      }

      setIsConnecting(true);
      addActivityLog('Opening wallet selector...', 'info');
      
      // Show wallet selector modal
      modal.open();
      
    } catch (error) {
      console.error('Connection error:', error);
      addActivityLog(`Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      toast({
        title: "Connection Failed",
        description: "Failed to open wallet selector",
        variant: "destructive",
      });
      setIsConnecting(false);
    }
  }, [modal, addActivityLog, toast]);

  const disconnectWallet = useCallback(async () => {
    try {
      if (currentWallet && typeof currentWallet.signOut === 'function') {
        await currentWallet.signOut();
      }
      clearSession();
      addActivityLog('Wallet disconnected manually', 'info');
      toast({
        title: "Disconnected",
        description: "Wallet disconnected",
      });
    } catch (error) {
      console.error('Disconnect error:', error);
      addActivityLog(`Disconnect error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      toast({
        title: "Disconnect Failed",
        description: "Error disconnecting wallet",
        variant: "destructive",
      });
    }
  }, [currentWallet, clearSession, addActivityLog, toast]);

  const signMessage = useCallback(async (message: string) => {
    try {
      if (!currentWallet) {
        throw new Error('No wallet connected');
      }

      addActivityLog(`Signing message: "${message}"`, 'info');
      
      const signature = await currentWallet.signMessage({ 
        message,
        recipient: 'near-connect-test.near',
        nonce: Buffer.from(crypto.getRandomValues(new Uint8Array(32)))
      });
      
      addActivityLog('Message signed successfully', 'success');
      
    } catch (error) {
      console.error('Sign message error:', error);
      addActivityLog(`Sign message error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      throw error;
    }
  }, [currentWallet, addActivityLog]);

  const sendTransaction = useCallback(async (receiver: string, amount: number) => {
    try {
      if (!currentWallet) {
        throw new Error('No wallet connected');
      }

      addActivityLog(`Sending ${amount} NEAR to ${receiver}`, 'info');
      
      // For demo purposes - in a real app, you'd construct and send the actual transaction
      // This would require proper NEAR transaction construction using near-api-js
      toast({
        title: "Demo Mode",
        description: "Transaction demo - implementation would require near-api-js integration",
      });
      
      addActivityLog('Transaction demo completed', 'success');
      
    } catch (error) {
      console.error('Transaction error:', error);
      addActivityLog(`Transaction error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      throw error;
    }
  }, [currentWallet, addActivityLog, toast]);

  const handleNetworkChange = useCallback((newNetwork: "mainnet" | "testnet") => {
    if (isConnected) {
      toast({
        title: "Warning",
        description: "Please disconnect wallet before changing network",
        variant: "destructive",
      });
      return;
    }
    
    setNetwork(newNetwork);
    addActivityLog(`Network changed to ${newNetwork}`, 'info');
  }, [isConnected, addActivityLog, toast]);

  // Initialize wallet on mount and network change
  useEffect(() => {
    initializeWallet();
  }, [initializeWallet]);

  // Check for existing session on mount
  useEffect(() => {
    try {
      const sessionData = localStorage.getItem('nearConnectSession');
      if (sessionData) {
        const session = JSON.parse(sessionData);
        addActivityLog('Found existing session, attempting to restore...', 'info');
        
        // Check if session is still valid (24 hours)
        const isExpired = Date.now() - session.timestamp > 24 * 60 * 60 * 1000;
        if (isExpired) {
          localStorage.removeItem('nearConnectSession');
          addActivityLog('Session expired, cleared from storage', 'info');
          return;
        }
        
        // TODO: Implement session restoration when the library supports it
        addActivityLog('Session restoration not yet implemented', 'info');
      }
    } catch (error) {
      console.error('Session check error:', error);
      addActivityLog(`Session check error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    }
  }, [addActivityLog]);

  const value: NearWalletContextType = {
    isConnected,
    isConnecting,
    accountId,
    walletName,
    network,
    connectWallet,
    disconnectWallet,
    signMessage,
    sendTransaction,
    activityLog,
    setNetwork: handleNetworkChange,
  };

  return (
    <NearWalletContext.Provider value={value}>
      {children}
    </NearWalletContext.Provider>
  );
}

export function useNearWallet() {
  const context = useContext(NearWalletContext);
  if (context === undefined) {
    throw new Error('useNearWallet must be used within a NearWalletProvider');
  }
  return context;
}

