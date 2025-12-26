import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import * as api from '../api';
import { SearchBar } from '../components/SearchBar';
import { TxTable } from '../components/TxTable';
import type { Block } from '../types/bitcoin';
import StatBox from '../components/StatsBox';
import formatCompact from '../utils/formatCompact';

export function Home() {
  const {
    data: block,
    isLoading,
    error,
  } = useQuery<Block>({
    queryKey: ['latestBlock'],
    queryFn: api.getLatestBlock,
    refetchInterval: 60000,
  });

  if (isLoading)
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-dark-muted animate-pulse">Syncing with blockchain...</p>
      </div>
    );

  if (error || !block)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-xl text-center max-w-md">
          <h3 className="text-xl text-red-400 font-bold mb-2">Connection Error</h3>
          <p className="text-dark-muted">
            Could not fetch the latest block. Check your backend connection.
          </p>
        </div>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-accent to-yellow-300 bg-clip-text text-transparent pb-2">
          Bitcoin Explorer
        </h1>
      </div>

      <SearchBar />

      <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 pb-6 border-b border-dark-border">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-500/20">
                Latest Block
              </span>
              <span className="text-dark-muted text-sm font-mono">
                {new Date(block.time * 1000).toLocaleString()}
              </span>
            </div>
            <h2 className="text-4xl font-bold text-white tracking-tight">
              #{block.height.toLocaleString()}
            </h2>
          </div>

          <div className="mt-4 md:mt-0 text-right">
            <div className="text-dark-muted text-sm mb-1">Block Hash</div>
            <Link
              to={`/block/${block.hash}`}
              className="font-mono text-primary hover:text-blue-400 break-all text-sm md:text-base transition-colors"
            >
              {block.hash}
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          <StatBox label="Transactions" value={block.nTx.toLocaleString()} />
          <StatBox label="Size" value={`${(block.size / 1024 / 1024).toFixed(2)} MB`} />
          <StatBox label="Difficulty" value={formatCompact(block.difficulty)} />
          <StatBox label="Confirmations" value={block.confirmations.toLocaleString()} />
        </div>
      </div>
      <div className="flex justify-end">
        <Link
          to={`/block/${block.hash}`}
          className="text-primary hover:text-white text-sm font-medium"
        >
          View Full Block details &rarr;
        </Link>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-end px-2">
          <h3 className="text-2xl font-bold text-white">Transactions</h3>
        </div>
        <TxTable data={block.tx} />
      </div>
    </div>
  );
}
