import { FastifyRequest, FastifyReply } from 'fastify';

export const search = async (
  req: FastifyRequest<{ Params: { query: string } }>,
  reply: FastifyReply
) => {
  const { query } = req.params;
  const rpc = req.server.rpc;

  if (/^\d+$/.test(query)) {
    try {
      const height = Number(query);
      const hash = await rpc.getBlockHash(height);
      return { type: 'block', id: hash };
    } catch (e) {}
  }

  if (/^[0-9a-fA-F]{64}$/.test(query)) {
    try {
      await rpc.getBlockHeader(query);
      return { type: 'block', id: query };
    } catch (e) {}
    try {
      await rpc.getRawTransaction(query, true);
      return { type: 'transaction', id: query };
    } catch (e) {}
  }

  reply.status(404).send({ error: 'Nije pronađeno (nepoznat blok, transakcija ili visina)' });
};
