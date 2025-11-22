/**
 * Stellar Helper - Blockchain Logic with Stellar Wallets Kit
 * ⚠️ DO NOT MODIFY THIS FILE! ⚠️
 */

import * as StellarSdk from '@stellar/stellar-sdk';
import { 
  StellarWalletsKit, 
  WalletNetwork, 
  allowAllModules,
  FREIGHTER_ID 
} from '@creit.tech/stellar-wallets-kit';

export class StellarHelper {
  private server: StellarSdk.Horizon.Server;
  private networkPassphrase: string;
  private kit: StellarWalletsKit;
  private network: WalletNetwork;
  private publicKey: string | null = null;

  constructor(network: 'testnet' | 'mainnet' = 'testnet') {
    this.server = new StellarSdk.Horizon.Server(
      network === 'testnet'
        ? 'https://horizon-testnet.stellar.org'
        : 'https://horizon.stellar.org'
    );
    this.networkPassphrase =
      network === 'testnet'
        ? StellarSdk.Networks.TESTNET
        : StellarSdk.Networks.PUBLIC;
    
    this.network = network === 'testnet' 
      ? WalletNetwork.TESTNET 
      : WalletNetwork.PUBLIC;

    // Stellar Wallets Kit'i initialize et
    this.kit = new StellarWalletsKit({
      network: this.network,
      selectedWalletId: FREIGHTER_ID,
      modules: allowAllModules(),
    });
  }

  isFreighterInstalled(): boolean {
    return true;
  }

  async connectWallet(): Promise<string> {
    try {
      // Wallet modal'ı aç ve wallet seçildiğinde adresi al
      await this.kit.openModal({
        onWalletSelected: async (option) => {
          console.log('Wallet selected:', option.id);
          this.kit.setWallet(option.id);
        }
      });

      // Seçilen wallet'ın adresini al
      const { address } = await this.kit.getAddress();

      if (!address) {
        throw new Error('Wallet bağlanamadı');
      }

      this.publicKey = address;
      // Save to localStorage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('stellar_wallet_address', address);
        localStorage.setItem('stellar_wallet_connected', 'true');
      }
      return address;
    } catch (error: any) {
      console.error('Wallet connection error:', error);
      throw new Error('Wallet bağlantısı başarısız: ' + error.message);
    }
  }

  async restoreConnection(): Promise<string | null> {
    try {
      if (typeof window === 'undefined') {
        return null;
      }

      const savedAddress = localStorage.getItem('stellar_wallet_address');
      const isConnected = localStorage.getItem('stellar_wallet_connected') === 'true';

      if (!savedAddress || !isConnected) {
        return null;
      }

      // Restore the address from localStorage
      // We'll verify it's still valid when actually using it (e.g., signing transactions)
      this.publicKey = savedAddress;
      
      // Optionally try to verify with kit (but don't fail if it doesn't work)
      try {
        const { address } = await this.kit.getAddress();
        if (address && address === savedAddress) {
          // Address matches, connection is valid
          return savedAddress;
        } else if (address) {
          // Address changed, update saved state
          this.publicKey = address;
          localStorage.setItem('stellar_wallet_address', address);
          return address;
        }
      } catch (error) {
        // If we can't verify, still restore from localStorage
        // The connection will be verified when actually needed
        console.log('Could not verify wallet connection, restoring from cache:', error);
      }

      return savedAddress;
    } catch (error: any) {
      console.error('Restore connection error:', error);
      this.clearSavedConnection();
      return null;
    }
  }

  getSavedAddress(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.getItem('stellar_wallet_address');
  }

  isSavedConnection(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }
    return localStorage.getItem('stellar_wallet_connected') === 'true';
  }

  clearSavedConnection(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('stellar_wallet_address');
      localStorage.removeItem('stellar_wallet_connected');
    }
    this.publicKey = null;
  }

  async getBalance(publicKey: string): Promise<{
    xlm: string;
    assets: Array<{ code: string; issuer: string; balance: string }>;
  }> {
    const account = await this.server.loadAccount(publicKey);
    
    const xlmBalance = account.balances.find(
      (b) => b.asset_type === 'native'
    );

    const assets = account.balances
      .filter((b) => b.asset_type !== 'native')
      .map((b: any) => ({
        code: b.asset_code,
        issuer: b.asset_issuer,
        balance: b.balance,
      }));

    return {
      xlm: xlmBalance && 'balance' in xlmBalance ? xlmBalance.balance : '0',
      assets,
    };
  }

  async sendPayment(params: {
    from: string;
    to: string;
    amount: string;
    memo?: string;
  }): Promise<{ hash: string; success: boolean }> {
    const account = await this.server.loadAccount(params.from);

    const transactionBuilder = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: this.networkPassphrase,
    }).addOperation(
      StellarSdk.Operation.payment({
        destination: params.to,
        asset: StellarSdk.Asset.native(),
        amount: params.amount,
      })
    );

    if (params.memo) {
      transactionBuilder.addMemo(StellarSdk.Memo.text(params.memo));
    }

    const transaction = transactionBuilder.setTimeout(180).build();

    // Wallet Kit ile imzala
    const { signedTxXdr } = await this.kit.signTransaction(transaction.toXDR(), {
      networkPassphrase: this.networkPassphrase,
    });

    const transactionToSubmit = StellarSdk.TransactionBuilder.fromXDR(
      signedTxXdr,
      this.networkPassphrase
    );

    const result = await this.server.submitTransaction(
      transactionToSubmit as StellarSdk.Transaction
    );

    return {
      hash: result.hash,
      success: result.successful,
    };
  }

  async getRecentTransactions(
    publicKey: string,
    limit: number = 10
  ): Promise<Array<{
    id: string;
    type: string;
    amount?: string;
    asset?: string;
    from?: string;
    to?: string;
    createdAt: string;
    hash: string;
  }>> {
    const payments = await this.server
      .payments()
      .forAccount(publicKey)
      .order('desc')
      .limit(limit)
      .call();

    return payments.records.map((payment: any) => ({
      id: payment.id,
      type: payment.type,
      amount: payment.amount,
      asset: payment.asset_type === 'native' ? 'XLM' : payment.asset_code,
      from: payment.from,
      to: payment.to,
      createdAt: payment.created_at,
      hash: payment.transaction_hash,
    }));
  }

  getExplorerLink(hash: string, type: 'tx' | 'account' = 'tx'): string {
    const network = this.networkPassphrase === StellarSdk.Networks.TESTNET ? 'testnet' : 'public';
    return `https://stellar.expert/explorer/${network}/${type}/${hash}`;
  }

  formatAddress(address: string, startChars: number = 4, endChars: number = 4): string {
    if (address.length <= startChars + endChars) {
      return address;
    }
    return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
  }

  disconnect() {
    this.publicKey = null;
    this.clearSavedConnection();
    return true;
  }
}

export const stellar = new StellarHelper('testnet');