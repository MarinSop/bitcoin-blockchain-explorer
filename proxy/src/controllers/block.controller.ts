import { FastifyRequest, FastifyReply } from 'fastify';

interface BlockStats {
  total_out?: number;
  totalfee?: number;
  avgfee?: number;
}

const SATOSHIS_PER_BITCOIN = 100_000_000;

export const getLatestBlock = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const hash = await req.server.rpc.getBestBlockHash();
    const block = await req.server.rpc.getBlock(hash, 2);

    return block;
  } catch (err) {
    req.log.error(err);
    reply.status(500).send({ error: 'Failed to fetch latest block' });
  }
};

export const getBlockByHash = async (
  req: FastifyRequest<{ Params: { hash: string } }>,
  reply: FastifyReply
) => {
  const { hash } = req.params;
  try {
    const block = await req.server.rpc.getBlock(hash, 2);
    let stats: BlockStats = {};
    try {
      stats = await req.server.rpc.getBlockStats(hash, ['total_out', 'totalfee', 'avgfee']);
    } catch (e) {
      req.log.warn(`Could not fetch stats for block ${hash}: ${e}`);
    }
    return {
      ...block,
      stats: {
        totalOutput: stats.total_out ? stats.total_out / SATOSHIS_PER_BITCOIN : 0,
        totalFee: stats.totalfee ? stats.totalfee / SATOSHIS_PER_BITCOIN : 0,
        avgFee: stats.avgfee ? stats.avgfee / SATOSHIS_PER_BITCOIN : 0,
        avgTransactionValue: stats.total_out
          ? stats.total_out / SATOSHIS_PER_BITCOIN / block.nTx
          : 0,
      },
    };
  } catch (err) {
    req.log.error(err);
    reply.status(404).send({ error: 'Block not found' });
  }
};

export const getBlockchainInfo = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    return await req.server.rpc.getBlockchainInfo();
  } catch (err) {
    reply.status(500).send({ error: 'Failed to fetch info' });
  }
};
