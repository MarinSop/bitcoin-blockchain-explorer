import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import * as api from '../api';
import type { Block } from '../types/bitcoin';
import { TxTable } from '../components/TxTable';
import { Breadcrumb } from '../components/Breadcrumb';
import formatBTC from '../utils/formatBTC';
import DetailBox from '../components/DetailBox';

export function BlockPage() {
  const { hash } = useParams<{ hash: string }>();
  const navigate = useNavigate();

  const {
    data: block,
    isLoading,
    error,
  } = useQuery<Block>({
    queryKey: ['block', hash],
    queryFn: () => api.getBlock(hash!),
    enabled: !!hash,
    retry: false,
  });

  if (isLoading)
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-primary text-lg animate-pulse">Loading Block Data...</p>
      </div>
    );

  if (error || !block)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="bg-red-500/10 border border-red-500/50 p-8 rounded-xl text-center max-w-md">
          <h3 className="text-xl text-red-400 font-bold mb-2">Block Not Found</h3>
          <p className="text-dark-muted mb-6">
            Could not find block with hash: {hash?.substring(0, 10)}...
          </p>
          <Link
            to="/"
            className="px-6 py-2 bg-dark-card border border-dark-border rounded-lg hover:bg-dark-border transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: `Block ${block.height}` }]} />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg text-sm font-bold uppercase tracking-wider border border-blue-500/20">
              Block
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              #{block.height.toLocaleString()}
            </h1>
          </div>

          <div className="flex gap-2">
            {block.previousblockhash && (
              <button
                onClick={() => navigate(`/block/${block.previousblockhash}`)}
                className="px-4 py-2 bg-dark-card border border-dark-border rounded-lg hover:bg-dark-border hover:text-primary text-sm font-medium transition-colors flex items-center gap-2"
              >
                ← <span className="hidden sm:inline">Prev Block</span>
              </button>
            )}
            {block.nextblockhash ? (
              <button
                onClick={() => navigate(`/block/${block.nextblockhash}`)}
                className="px-4 py-2 bg-dark-card border border-dark-border rounded-lg hover:bg-dark-border hover:text-primary text-sm font-medium transition-colors flex items-center gap-2"
              >
                <span className="hidden sm:inline">Next Block</span> →
              </button>
            ) : (
              <span className="px-4 py-2 bg-dark-card/50 border border-dark-border/50 text-dark-muted rounded-lg text-sm cursor-not-allowed">
                Latest
              </span>
            )}
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-6">
            <div className="lg:col-span-2">
              <DetailBox
                label="Block Hash"
                value={
                  <span className="font-mono text-primary text-sm md:text-base">{block.hash}</span>
                }
              />
            </div>
            <DetailBox label="Mined" value={new Date(block.time * 1000).toLocaleString()} />
            <DetailBox label="Transaction Count" value={block.nTx.toLocaleString()} />

            <DetailBox label="Size" value={`${(block.size / 1024).toFixed(2)} KB`} />
            <DetailBox label="Weight" value={`${block.weight.toLocaleString()} WU`} />
            <DetailBox label="Confirmations" value={block.confirmations.toLocaleString()} />
            <DetailBox label="Version" value={`0x${block.versionHex}`} />
          </div>

          {block.stats && (
            <div className="mt-8 pt-6 border-t border-dark-border">
              <h3 className="text-sm uppercase text-emerald-400 font-bold mb-4 tracking-wider flex items-center gap-2">
                Financial Statistics
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5">
                <DetailBox
                  label="Total Output Volume"
                  value={
                    <span>
                      {formatBTC(block.stats.totalOutput)}{' '}
                      <span className="text-emerald-500 text-sm">BTC</span>
                    </span>
                  }
                />
                <DetailBox
                  label="Total Fees Reward"
                  value={
                    <span>
                      {formatBTC(block.stats.totalFee)}{' '}
                      <span className="text-emerald-500 text-sm">BTC</span>
                    </span>
                  }
                />
                <DetailBox
                  label="Avg. Transaction Value"
                  value={
                    <span>
                      {formatBTC(block.stats.avgTransactionValue)}{' '}
                      <span className="text-dark-muted text-sm">BTC</span>
                    </span>
                  }
                />
                <DetailBox
                  label="Avg. Transaction Fee"
                  value={
                    <span>
                      {formatBTC(block.stats.avgFee)}{' '}
                      <span className="text-dark-muted text-sm">BTC</span>
                    </span>
                  }
                />
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-dark-border">
            <h3 className="text-sm uppercase text-dark-muted font-bold mb-4 tracking-wider">
              Technical Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-6">
              <DetailBox
                label="Merkle Root"
                value={
                  <span className="font-mono text-dark-muted text-xs break-all">
                    {block.merkleroot}
                  </span>
                }
              />
              <div className="grid grid-cols-2 gap-4">
                <DetailBox label="Difficulty" value={Number(block.difficulty).toExponential(2)} />
                <DetailBox label="Nonce" value={block.nonce.toLocaleString()} />
                <DetailBox label="Bits" value={block.bits} />
                <DetailBox
                  label="Chainwork"
                  value={<span title={block.chainwork}>{block.chainwork.substring(0, 12)}...</span>}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-white">Block Transactions</h3>
          <span className="bg-dark-card border border-dark-border px-3 py-1 rounded-full text-xs text-dark-muted font-mono">
            {block.nTx} Items
          </span>
        </div>
        <TxTable data={block.tx} />
      </div>
    </div>
  );
}
