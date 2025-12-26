import type { Block, BlockchainInfo, Transaction } from '../types/bitcoin';

const API_BASE = import.meta.env.VITE_API_URL;

async function fetcher<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Error ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

export const getBlockchainInfo = () => fetcher<BlockchainInfo>('/block/info');

export const getLatestBlock = () => fetcher<Block>('/block/latest');

export const getBlock = (hash: string) => fetcher<Block>(`/block/${hash}`);

export const getTransaction = (txid: string) => fetcher<Transaction>(`/tx/${txid}`);

export const searchBlockchain = (query: string) =>
  fetcher<{ type: string; id: string }>(`/search/${query}`);
