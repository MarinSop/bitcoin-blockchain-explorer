export interface BlockchainInfo {
  chain: string;
  blocks: number;
  headers: number;
  bestblockhash: string;
  difficulty: number;
  mediantime: number;
  verificationprogress: number;
  initialblockdownload: boolean;
  chainwork: string;
  size_on_disk: number;
  pruned: boolean;
}

export interface Block {
  hash: string;
  confirmations: number;
  size: number;
  strippedsize: number;
  weight: number;
  height: number;
  version: number;
  versionHex: string;
  merkleroot: string;
  tx: Transaction[];
  time: number;
  mediantime: number;
  nonce: number;
  bits: string;
  difficulty: number;
  chainwork: string;
  nTx: number;
  previousblockhash: string;
  nextblockhash?: string;
  stats?: {
    totalOutput: number;
    totalFee: number;
    avgFee: number;
    avgTransactionValue: number;
  };
}

export interface Vout {
  value: number;
  n: number;
  scriptPubKey: {
    asm: string;
    hex: string;
    reqSigs?: number;
    type: string;
    addresses?: string[];
    address?: string;
  };
}

export interface Vin {
  txid: string;
  vout: number;
  scriptSig?: {
    asm: string;
    hex: string;
  };
  txinwitness?: string[];
  sequence: number;
  coinbase?: string;
}

export interface Transaction {
  txid: string;
  hash: string;
  version: number;
  size: number;
  vsize: number;
  weight: number;
  locktime: number;
  vin: Vin[];
  vout: Vout[];
  hex: string;
  blockhash?: string;
  confirmations?: number;
  time?: number;
  blocktime?: number;
}

export interface SearchResult {
  type: 'block' | 'transaction';
  id: string;
}
