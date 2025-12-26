// src/pages/TxPage.tsx
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import * as api from '../api';
import type { Transaction } from '../types/bitcoin';
import DetailBox from '../components/DetailBox';
import { Breadcrumb } from '../components/Breadcrumb';

export function TxPage() {
  const { txId } = useParams<{ txId: string }>();

  const {
    data: tx,
    isLoading,
    error,
  } = useQuery<Transaction>({
    queryKey: ['tx', txId],
    queryFn: () => api.getTransaction(txId!),
    enabled: !!txId,
    retry: false,
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen space-y-4 flex-col">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-primary text-lg">Loading Transaction Details...</p>
      </div>
    );

  if (error || !tx)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-500/10 border border-red-500/50 p-8 rounded-xl text-center">
          <h3 className="text-xl text-red-400 font-bold mb-2">Transaction Not Found</h3>
          <p className="text-dark-muted">Check the ID or try again later.</p>
          <Link to="/" className="mt-4 inline-block text-primary hover:underline">
            Return Home
          </Link>
        </div>
      </div>
    );

  const totalOutput = tx.vout.reduce((acc, v) => acc + v.value, 0);

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-8">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: `Transaction` }]} />

        <div className="flex items-center gap-3 mb-6 break-all">
          <span className="bg-primary/20 text-primary px-3 py-1 rounded-lg text-sm font-bold uppercase tracking-wider border border-primary/20 whitespace-nowrap">
            TX
          </span>
          <h1 className="text-xl md:text-3xl font-bold text-white font-mono">{tx.txid}</h1>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 md:p-8 shadow-xl">
          <h2 className="text-lg font-bold text-white border-b border-dark-border pb-4 mb-6 flex items-center gap-2">
            Summary
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-4">
            <DetailBox
              label="Total Output"
              value={
                <span className="text-emerald-400 font-bold text-xl">
                  {totalOutput.toFixed(8)} BTC
                </span>
              }
            />
            <DetailBox label="Size" value={`${tx.size.toLocaleString()} Bytes`} />
            <DetailBox label="Virtual Size" value={`${tx.vsize.toLocaleString()} vBytes`} />

            <DetailBox
              label="Status"
              value={
                tx.confirmations ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    Confirmed ({tx.confirmations})
                  </span>
                ) : (
                  <span className="text-yellow-500 font-bold flex items-center gap-1">
                    Unconfirmed (Mempool)
                  </span>
                )
              }
            />

            <DetailBox
              label="Included in Block"
              value={
                tx.blockhash ? (
                  <Link
                    to={`/block/${tx.blockhash}`}
                    className="text-primary hover:underline truncate block font-mono"
                  >
                    {tx.blockhash.substring(0, 16)}...
                  </Link>
                ) : (
                  <span className="text-dark-muted italic">Pending...</span>
                )
              }
            />

            <DetailBox label="Weight" value={`${tx.weight.toLocaleString()} WU`} />
          </div>
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 bg-dark-bg/50 border-b border-dark-border flex justify-between items-center">
          <h3 className="font-bold text-lg text-white">Flow Details</h3>
          <span className="text-xs text-dark-muted uppercase font-bold tracking-wider">
            {tx.vin.length} Inputs ➝ {tx.vout.length} Outputs
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-dark-border">
          <div className="p-6">
            <h4 className="text-xs uppercase text-dark-muted font-bold mb-4 tracking-wider">
              From (Inputs)
            </h4>
            <div className="space-y-3">
              {tx.vin.map((input, idx) => (
                <div
                  key={idx}
                  className="bg-dark-bg/30 p-3 rounded-lg border border-dark-border/30 hover:border-dark-border transition-colors"
                >
                  {input.coinbase ? (
                    <div className="flex items-center justify-center py-2 text-emerald-400 font-bold gap-2">
                      Coinbase (Newly Generated)
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center">
                        <Link
                          to={`/tx/${input.txid}`}
                          className="text-primary hover:underline font-mono text-sm truncate max-w-[220px] md:max-w-xs"
                          title={`Previous Tx: ${input.txid}`}
                        >
                          {input.txid}
                        </Link>
                        <span className="text-dark-muted text-xs bg-dark-bg px-2 py-1 rounded">
                          Out #{input.vout}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="p-6 relative">
            <h4 className="text-xs uppercase text-dark-muted font-bold mb-4 tracking-wider">
              To (Outputs)
            </h4>
            <div className="space-y-3">
              {tx.vout.map((output, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center bg-dark-bg/30 p-3 rounded-lg border border-dark-border/30 hover:border-dark-border transition-colors"
                >
                  <div className="flex flex-col overflow-hidden mr-4">
                    <span
                      className="font-mono text-blue-300 truncate text-sm hover:text-blue-200 cursor-help"
                      title={
                        output.scriptPubKey.address ||
                        output.scriptPubKey.addresses?.[0] ||
                        'Non-standard Script'
                      }
                    >
                      {output.scriptPubKey.address || output.scriptPubKey.addresses?.[0] || (
                        <span className="text-dark-muted italic">OP_RETURN / Script</span>
                      )}
                    </span>
                    <span className="text-[10px] text-dark-muted uppercase font-bold mt-1">
                      {output.scriptPubKey.type}
                    </span>
                  </div>
                  <div className="font-bold text-emerald-400 whitespace-nowrap text-sm">
                    {output.value.toFixed(8)} BTC
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
