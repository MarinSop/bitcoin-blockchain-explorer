import { FastifyRequest, FastifyReply } from 'fastify';

export const getTransaction = async (
  req: FastifyRequest<{ Params: { txid: string } }>,
  reply: FastifyReply
) => {
  const { txid } = req.params;
  try {
    const tx = await req.server.rpc.getRawTransaction(txid, true);
    return tx;
  } catch (err) {
    req.log.error(err);
    reply.status(404).send({ error: 'Transaction not found' });
  }
};
