export interface ActivityLogEntry {
  message: string;
  type: "info" | "success" | "error" | "warning";
  timestamp: string;
}

export interface NearWallet {
  id?: string;
  metadata?: {
    name: string;
    description?: string;
    icon?: string;
  };
  signIn(): Promise<void>;
  signOut(): Promise<void>;
  signMessage(params: {
    message: string;
    recipient: string;
    nonce: Buffer;
  }): Promise<any>;
  signAndSendTransaction?(params: any): Promise<any>;
  signAndSendTransactions?(params: any): Promise<any>;
}

export interface WalletAccount {
  accountId: string;
  publicKey?: string;
}

export interface SignInEvent {
  accounts: WalletAccount[];
  contractId?: string;
  methodNames?: string[];
}

export interface WalletSelectorConfig {
  network: "mainnet" | "testnet";
  features?: {
    signMessage?: boolean;
    signTransaction?: boolean;
    signAndSendTransaction?: boolean;
    signAndSendTransactions?: boolean;
    testnet?: boolean;
  };
}
