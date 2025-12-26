import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import type { Transaction } from '../types/bitcoin';
import shortenHash from '../utils/shortenHash';
import formatBTC from '../utils/formatBTC';

const columnHelper = createColumnHelper<Transaction>();

const columns = [
  columnHelper.accessor('txid', {
    header: 'TXID',
    cell: (info) => (
      <Link
        to={`/tx/${info.getValue()}`}
        className="text-primary hover:text-blue-400"
        title={info.getValue()}
      >
        {shortenHash(info.getValue())}
      </Link>
    ),
  }),

  columnHelper.accessor((row) => row.vin.length, {
    id: 'inputs',
    header: 'Inputs',
    cell: (info) => <span className="text-dark-muted">{info.getValue()}</span>,
  }),

  columnHelper.accessor((row) => row.vout.length, {
    id: 'outputs',
    header: 'Outputs',
    cell: (info) => <span className="text-dark-muted">{info.getValue()}</span>,
  }),

  columnHelper.accessor((row) => row.vout.reduce((acc, v) => acc + v.value, 0), {
    id: 'amount',
    header: 'Amount (BTC)',
    cell: (info) => (
      <span className="font-bold text-emerald-400 text-sm">{formatBTC(info.getValue())}</span>
    ),
  }),

  columnHelper.accessor('size', {
    header: 'Size (B)',
    cell: (info) => <span className="text-dark-muted text-sm">{info.getValue()}</span>,
  }),
];

interface Props {
  data: Transaction[];
}

export function TxTable({ data }: Props) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const parentRef = useRef<HTMLDivElement>(null);
  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 5,
  });

  const gridClass = 'grid grid-cols-[1.5fr_0.8fr_0.8fr_1fr_0.8fr] gap-4 px-4 items-center';

  return (
    <div className="border border-dark-border rounded-xl bg-dark-card overflow-hidden flex flex-col h-[600px] shadow-lg">
      <div
        className={`bg-dark-bg border-b border-dark-border py-3 text-dark-muted text-xs uppercase font-medium ${gridClass}`}
      >
        <div>TXID</div>
        <div>Inputs</div>
        <div>Outputs</div>
        <div>Amount</div>
        <div>Size</div>
      </div>

      <div ref={parentRef} className="overflow-auto">
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index];
            return (
              <div
                key={row.id}
                className={`absolute border-b border-dark-border hover:bg-dark-bg/50 transition-colors ${gridClass}`}
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                  width: '100%',
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <div key={cell.id} className="truncate">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
